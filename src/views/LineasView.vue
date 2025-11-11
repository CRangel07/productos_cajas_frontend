<template>
  <div class="contenedor-main">
    <div class="flex justify-start flex-wrap">
      <SubirLineas
        titulo="Subir Productos"
        endpoint="/lineas"
        :validaciones="{
          linea1: 'cei-029s-2.6',
          linea2: 'EXISTENCIA ACTUAL DE ARTICULOS',
          mensajeError:
            'Debe ser el archivo TXT de la Existencia actual de articulos incluyendo importes',
        }"
      />
      <SubirLineas
        titulo="Subir Lineas TXT"
        endpoint="/lineas/descripcion"
        :validaciones="{
          linea1: 'cei-0299-2.6',
          linea2: 'INVENTARIO POR LINEA',
          mensajeError: 'Debe ser el archivo TXT de la INVENTARIO POR LINEA',
        }"
      />
    </div>
    <p v-if="errorLineas" class="api-error">{{ errorLineas }}</p>
    <div>
      <p v-if="loadingLineas" class="api-loading">Cargando lineas...</p>
      <form @submit.prevent="getProductos" class="flex items-end gap-3">
        <Selector
          :config="{
            disabled: loadingLineas,
            id: 'reg_productos_select',
            required: true,
          }"
          :icono="TableOfContents"
          :opt="lineasOpt"
          label="Selecciona Linea a traer"
          v-model="filtroBusqueda.linea"
        />
        <Entrada
          label="Busca por código o descripción"
          :opt="{
            disabled: false,
            icono: Search,
            id: 'regp_busqueda',
            type: 'text',
            required: false,
          }"
          v-model="filtroBusqueda.busqueda"
        />
        <button
          type="submit"
          class="bg-sky-500 p-1 rounded text-white text-xs uppercase cursor-pointer"
        >
          Obtener
        </button>
      </form>
    </div>

    <div>
      <p class="api-loading" v-if="loadingProductos">Cargando productos...</p>
      <p class="api-error" v-if="errorProductos">{{ errorProductos }}</p>
      <p
        v-if="productos.length && filtroBusqueda.linea"
        class="uppercase font-medium my-2"
      >
        Listando Linea de
        {{
          lineas.find((l) => l.linea_ID == filtroBusqueda.linea)
            ?.linea_descripcion
        }}, cantidad de items {{ productos.length }}
      </p>
      <!-- <pre>{{ productos }}</pre> -->
      <ListarLineas :productos="productos" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApi } from "../composables/useApi";
import { ILinea } from "../types/db";
import { useAlert } from "../composables/useAlert";
import { useSocketStore } from "../stores/useSocketStore";
import { Search, TableOfContents } from "lucide-vue-next";
import { IProductoConPresentaciones } from "../types/responses";
import { computed, onBeforeMount, reactive, ref, watch } from "vue";

import Entrada from "../components/Entrada.vue";
import Selector, { SelectOpt } from "../components/Selector.vue";
import ListarLineas from "../components/ListarLineas.vue";
import SubirLineas from "../components/SubirLineas.vue";

const { notificacion } = useAlert();

const filtroBusqueda = reactive<{
  linea: number | null;
  busqueda: string | null;
}>({
  busqueda: null,
  linea: null,
});

const socketStore = useSocketStore();
const lineas = ref<ILinea[]>([]);
const productos = ref<IProductoConPresentaciones[]>([]);

const lineasOpt = computed(() => {
  const mappedLines = lineas.value.map<SelectOpt>((l) => ({
    label: `${l.linea_compucaja_ID} | ${l.linea_descripcion}`,
    value: l.linea_ID,
  }));
  mappedLines.unshift({ label: "Cualquier Linea", value: 999 });
  return mappedLines;
});

const {
  apiFetch: fetchLineas,
  error: errorLineas,
  loading: loadingLineas,
} = useApi();

const {
  apiFetch: fetchProductos,
  error: errorProductos,
  loading: loadingProductos,
} = useApi();

const getProductos = async () => {
  const params = new URLSearchParams({
    linea: String(filtroBusqueda.linea),
    busqueda: String(filtroBusqueda.busqueda),
  });
  const response = await fetchProductos<{
    productos: IProductoConPresentaciones[];
  }>(`/producto?${params.toString()}`);

  if (errorProductos.value === null) {
    productos.value = response.productos;
  } else {
    productos.value = [];
  }
};

onBeforeMount(async () => {
  const lineaResponse = await fetchLineas<{ lineas: ILinea[] }>("/lineas");
  if (errorLineas.value == null) {
    lineas.value = lineaResponse.lineas;
  } else {
    lineas.value = [];
  }
});

watch(
  () => filtroBusqueda.linea,
  () => {
    productos.value = [];
    filtroBusqueda.busqueda = null;
  }
);

watch(
  () => socketStore.presentacionGuardada,
  (data) => {
    if (!data) return;
    const index = productos.value.findIndex(
      (p) => p.producto_ID === data.producto
    );
    notificacion({ text: data.message, timer: 3500 });
    if (index !== -1) {
      productos.value[index].presentaciones.push(data.presentacion);
    }
  }
);

watch(
  () => socketStore.presentacionEliminada,
  (data) => {
    if (!data) return;
    const index = productos.value.findIndex(
      (p) => p.producto_ID === data.presentacion.presentacion_producto
    );
    if (index !== -1) {
      const producto = productos.value[index];
      producto.presentaciones = producto.presentaciones.filter(
        (pres) => pres.presentacion_ID !== data.presentacion.presentacion_ID
      );
    }
  }
);

watch(
  () => socketStore.productoStateActualizado,
  (data) => {
    if (!data) return;
    const index = productos.value.findIndex(
      (p) => p.producto_ID === data.producto.producto_ID
    );
    if (index !== -1) {
      const producto = productos.value[index];
      producto.producto_listo = data.status;
    }
  }
);
</script>
