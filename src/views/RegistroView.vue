<template>
  <div class="contenedor-main">
    <div class="flex gap-5 flex-col lg:flex-row">
      <FormularioProductos
        @submit="(data) => insertProducto(data)"
        :cargando="loading"
        :error="error"
        :reset="resetForm"
      />
      <TablaProductos :productos="productos" />
    </div>
  </div>
</template>

<script setup lang="ts">
import TablaProductos from "../components/TablaProductos.vue";
import FormularioProductos from "../components/FormularioProductos.vue";
import { useApi } from "../composables/useApi";
import { DataProducto } from "../types/forms";
import { onBeforeMount, ref } from "vue";
import { IProductoConPresentaciones } from "../types/responses";
import { useAlert } from "../composables/useAlert";

const alertas = useAlert();

const productos = ref<IProductoConPresentaciones[]>([]);
const resetForm = ref<1 | 0>(0);

const { apiFetch, error, loading } = useApi();
const { apiFetch: fetchProducts, error: errorProducts } = useApi();

const insertProducto = async (data: DataProducto) => {
  await apiFetch("/producto", { method: "POST", body: data });
  if (error.value === null) {
    getProducts();
    resetForm.value = 1;
    alert(`Se guardó correctamente ${data.descripcion}`);
  } else {
    alertas.alerta({ text: error.value, icon: "error" });
    resetForm.value = 0;
  }
};

const getProducts = async () => {
  const pResponse = await fetchProducts<{
    productos: IProductoConPresentaciones[];
  }>("/producto");
  if (pResponse && errorProducts.value === null) {
    productos.value = pResponse.productos;
  } else {
    alert("Error al obtener lista: " + errorProducts.value);
  }
};

onBeforeMount(() => {
  getProducts();
});
</script>
