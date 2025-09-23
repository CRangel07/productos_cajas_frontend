<template>
  <div class="w-full max-w-[300px]">
    <p
      v-if="producto"
      class="bg-yellow-400 text-center text-lg mb-2 font-medium text-yellow-900 py-0.5 rounded"
    >
      Editando {{ producto.data.descripcion }}
    </p>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
      <Entrada
        label="Código de Caja"
        v-model="dataProducto.codigoCaja"
        :opt="{
          id: 'reg_codigo_caja',
          disabled: false,
          icono: ScanBarcode,
          required: true,
          autocomplete: 'off',
          type: 'text',
        }"
      />

      <Entrada
        label="Código de Pieza"
        v-model="dataProducto.codigo"
        :opt="{
          id: 'reg_codigo',
          disabled: false,
          icono: ScanBarcode,
          autocomplete: 'off',
          required: true,
          type: 'text',
        }"
      />

      <Entrada
        label="Descripción"
        v-model="dataProducto.descripcion"
        :opt="{
          id: 'reg_descripcion',
          disabled: false,
          icono: ReceiptText,
          autocomplete: 'off',
          required: true,
          type: 'text',
        }"
      />

      <Entrada
        label="Piezas de la caja"
        v-model="dataProducto.piezasCaja"
        :opt="{
          id: 'reg_pz',
          disabled: false,
          icono: Hash,
          required: true,
          autocomplete: 'off',
          type: 'number',
          step: 1,
          max: 100,
          min: 1,
        }"
      />

      <Entrada
        label="Pasillo"
        v-model="dataProducto.pasillo"
        :opt="{
          id: 'reg_pasillo',
          disabled: false,
          icono: Hash,
          required: true,
          autocomplete: 'off',
          type: 'number',
          step: 1,
          max: 50,
          min: 1,
        }"
      />
      <Entrada
        label="Piso del Rack"
        v-model="dataProducto.piso"
        :opt="{
          id: 'reg_piso',
          disabled: false,
          autocomplete: 'off',
          icono: Hash,
          required: true,
          type: 'number',
          step: 1,
          max: 7,
          min: 1,
        }"
      />

      <p class="api-error" v-if="props.error">
        {{ props.error }}
      </p>

      <button
        type="submit"
        class="border py-0.5 px-2 rounded-md border-blue-800 bg-blue-500 text-white font-medium cursor-pointer active:scale-95 disabled:bg-slate-500"
        :disabled="cargando"
      >
        Guardar
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import Entrada from "./Entrada.vue";

import { useApi } from "../composables/useApi";
import { useAlert } from "../composables/useAlert";
import { DataProducto } from "../types/forms";
import { reactive, watch } from "vue";
import { Hash, ReceiptText, ScanBarcode } from "lucide-vue-next";
import { IProductoJovany } from "../types/db";

const alert = useAlert();
const { apiFetch } = useApi();

const props = defineProps<{
  cargando: boolean;
  error: string | null;
  producto: { id: string; data: DataProducto } | null;
  reset: 1 | 0;
}>();
const emit = defineEmits<{ (e: "submit", data: DataProducto): void }>();

// Inicialización de datos
const iniciarDatos = (): DataProducto => ({
  codigo: "",
  codigoCaja: "",
  piezasCaja: null,
  descripcion: "",
  pasillo: null,
  piso: null,
});

const dataProducto = reactive<DataProducto>(iniciarDatos());

// Función para detectar códigos repetidos
function esRepetido(codigo: string): string | null {
  for (let i = 1; i <= codigo.length / 2; i++) {
    if (codigo.length % i === 0) {
      const bloque = codigo.slice(0, i);
      const repetido = bloque.repeat(codigo.length / i);
      if (repetido === codigo) return bloque;
    }
  }
  return null;
}

// Submit del formulario
const handleSubmit = async () => {
  const userRes = await alert.confirm({
    text: "¿Seguro que deseas guardar estos datos?",
  });

  if (userRes.isConfirmed) {
    emit("submit", dataProducto);
  }
};

// Watch de reset props
watch(
  () => props.reset,
  (flag) => {
    if (flag == 1) {
      Object.assign(dataProducto, iniciarDatos());
    }
  }
);

// Watch de producto props
watch(
  () => props.producto,
  (p) => {
    if (p) Object.assign(dataProducto, p.data);
    else Object.assign(dataProducto, iniciarDatos());
  },
  { deep: true }
);

// Función para consultar la API si el código ya existe
async function checkRelatedCode(code: string) {
  if (!code) return;
  try {
    const result = await apiFetch<{ producto: IProductoJovany | null }>(
      `/producto/related?busqueda=${code}`
    );
    if (result && result.producto) {
      const userResponse = await alert.confirm({
        text: `Se encontró en la base de datos de productos este código para ${result.producto.nombre}, ¿tomar descripción?`,
        confirmButtonText: "Confirmar",
        cancelButtonText: "No tomar",
      });
      if (userResponse.isConfirmed) {
        dataProducto.descripcion = result.producto.nombre;
        dataProducto.piezasCaja = result.producto.unidad;
        dataProducto.jovanyID = result.producto.id_producto;
      }
    } else {
      alert.notificacion({ text: "No se encontró un producto con ese código" });
    }
  } catch (err) {
    console.error(err);
  }
}

// Watch combinado con debounce manual para codigo y codigoCaja
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(
  () => [dataProducto.codigo, dataProducto.codigoCaja],
  ([newCode, newCodeCaja], [oldCode, oldCodeCaja]) => {
    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
      const code = newCode || newCodeCaja;
      if (!code) return;

      // Validación local de repetidos
      const base = esRepetido(code);
      if (base && base.length !== code.length) {
        alert.alerta({
          text: `⚠️ Parece que escaneaste dos veces el mismo código`,
          icon: "warning",
        });
        if (newCode) dataProducto.codigo = base;
        else dataProducto.codigoCaja = base;
        return;
      }

      if ((oldCode === "" || oldCodeCaja === "") && !props.producto) {
        checkRelatedCode(code);
      }
    }, 400); // debounce de 400ms
  }
);
</script>
