<template>
  <div class="contenedor-main">
    <SubirLineasTXT />
    <SubirLineasDesc />
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
      <p class="api-loading" v-if="loadingProductos">{{ loadingProductos }}</p>
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
      <ListarLineas :productos="productos" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApi } from "../composables/useApi";
import { ILinea } from "../types/db";
import { Search, TableOfContents } from "lucide-vue-next";
import { IProductoConPresentaciones } from "../types/responses";
import { computed, onBeforeMount, reactive, ref, watch } from "vue";

import Entrada from "../components/Entrada.vue";
import Selector, { SelectOpt } from "../components/Selector.vue";
import ListarLineas from "../components/ListarLineas.vue";
import SubirLineasTXT from "../components/SubirLineasTXT.vue";
import SubirLineasDesc from "../components/SubirLineasDesc.vue";

const filtroBusqueda = reactive<{
  linea: number | null;
  busqueda: string | null;
}>({
  busqueda: null,
  linea: null,
});

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
  }
);
</script>
