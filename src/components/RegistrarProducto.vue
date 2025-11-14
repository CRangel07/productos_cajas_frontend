<template>
  <form @submit.prevent="saveProducto" class="flex flex-col gap-3">
    <ErrorMessage
      v-if="error"
      :message="'Error al buscar en DB Jov ' + error"
      @close="error = null"
    />
    <ErrorMessage
      v-if="errorProducto"
      :message="errorProducto"
      @close="errorProducto = null"
    />

    <Entrada
      label="Código"
      :opt="{
        disabled: false,
        icono: ScanBarcode,
        id: 'regp_codigo_producto',
        required: true,
        type: 'text',
        placeholder: 'Escanea el código',
      }"
      v-model="dataProducto.codigo"
    />
    <p v-if="loading">Buscando...</p>
    <Entrada
      label="Descripción"
      :opt="{
        disabled: false,
        icono: ScanBarcode,
        id: 'regp_codigo_producto',
        required: true,
        type: 'text',
        placeholder: 'Ingresa descripción',
      }"
      v-model="dataProducto.descripcion"
    />
    <Selector
      :config="{
        disabled: false,
        id: 'reg_producto_select',
        required: true,
      }"
      :opt="lineas"
      :icono="TableOfContents"
      label="Selecciona Linea a la que pertenece"
      v-model="dataProducto.linea"
    />

    <button
      type="submit"
      class="bg-blue-500 text-blue-50 w-fit block ms-auto p-1 rounded-md"
    >
      Guardar
    </button>
  </form>
</template>

<script setup lang="ts">
import Entrada from "./Entrada.vue";
import Selector, { SelectOpt } from "./Selector.vue";
import ErrorMessage from "./ErrorMessage.vue";

import { useApi } from "../composables/useApi";
import { useAlert } from "../composables/useAlert";
import { IFormProducto } from "../types/forms";
import { IProductoJovany } from "../types/db";
import { reactive, watch } from "vue";
import { ScanBarcode, TableOfContents } from "lucide-vue-next";

const props = defineProps<{ lineas: SelectOpt[] }>();

const { confirm, notificacion, alerta } = useAlert();

const dataProducto = reactive<IFormProducto>({
  codigo: null,
  descripcion: null,
  linea: null,
});

const esRepetido = (codigo: string): string | null => {
  for (let i = 1; i <= codigo.length / 2; i++) {
    if (codigo.length % i === 0) {
      const bloque = codigo.slice(0, i);
      const repetido = bloque.repeat(codigo.length / i);
      if (repetido === codigo) return bloque;
    }
  }
  return null;
};

const { apiFetch, error, loading } = useApi();

// Función para consultar la API si el código ya existe
const checkRelatedCode = async (code: string | null) => {
  if (!code) return;
  try {
    const result = await apiFetch<{ producto: IProductoJovany | null }>(
      `/producto/related?busqueda=${code}`
    );
    if (result && result.producto) {
      const userResponse = await confirm({
        text: `Se encontró en la base de datos de Productos de Jovany este código para ${result.producto.nombre}, ¿tomar descripción?`,
        confirmButtonText: "Confirmar",
        cancelButtonText: "No tomar",
      });
      if (userResponse.isConfirmed) {
        dataProducto.descripcion = result.producto.nombre;

        const lineaExistente = props.lineas.find((l) =>
          l.label.split("|")[0].includes(result.producto?.linea_codigo!)
        );

        if (lineaExistente) {
          dataProducto.linea = lineaExistente.value;
        }
      }
    } else {
      notificacion({ text: "No se encontró un producto con ese código" });
    }
  } catch (err) {
    alert(String(err));
    console.error(err);
  }
};

const {
  apiFetch: postProducto,
  error: errorProducto,
  // loading: loadingProducto,
} = useApi();

const saveProducto = async () => {
  await postProducto("/producto", {
    method: "POST",
    body: {
      descripcion: dataProducto.descripcion,
      linea: Number(dataProducto.linea),
    },
  });

  if (errorProducto.value === null) {
  }
};

// Watch combinado con debounce manual para codigo y codigoCaja
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(
  () => dataProducto.codigo,
  (newCode, oldCode) => {
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      const code = newCode;
      if (!code) return;

      // Validación local de repetidos
      const base = esRepetido(code);
      if (base && base.length !== code.length) {
        alerta({
          text: `⚠️ Parece que escaneaste dos veces el mismo código`,
          icon: "warning",
        });
        if (newCode) dataProducto.codigo = base;
        else dataProducto.codigo = base;
        return;
      }

      if (oldCode !== "") {
        checkRelatedCode(code);
      }
    }, 600); // debounce de 400ms
  }
);
</script>
