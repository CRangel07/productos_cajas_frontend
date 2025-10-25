<template>
  <div class="contenedor-main">
    <p
      v-if="loadingProductos"
      class="text-center my-3 bg-yellow-200 text-yellow-700 font-semibold w-fit m-auto px-3 py-1 rounded"
    >
      Cargando lista de productos...
    </p>
    <div class="flex gap-5 flex-col lg:flex-row">
      <FormularioProductos
        @submit="(data) => insertProducto(data)"
        :cargando="loading"
        :error="error"
        :reset="resetForm"
        :producto="productoEditando"
      />
      <TablaProductos
        :productos="productos"
        :error-delete="errorDelete"
        :loading-delete="loadingDelete"
        :reset="resetEdicion"
        @editar-producto="(prod) => updateProducto(prod)"
        @eliminar-producto="(prod) => deleteProducto(prod)"
        @cancelar-edicion="
          productoEditando = null;
          resetForm = !resetForm;
        "
        @buscar-producto="(busqueda) => getProducts(busqueda)"
        @marcar-listo="(prod) => handleMarcarListo(prod)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TablaProductos from "../components/TablaProductos.vue";
import FormularioProductos from "../components/FormularioProductos.vue";

import { useApi } from "../composables/useApi";
import { useAlert } from "../composables/useAlert";
import { DataProducto } from "../types/forms";
import { onBeforeMount, ref } from "vue";
import { IProductoConPresentaciones } from "../types/responses";

const alertas = useAlert();

const productos = ref<IProductoConPresentaciones[]>([]);
const productoEditando = ref<{
  id: string;
  idPz: string;
  idCaja: string;
  data: DataProducto;
} | null>(null);
const resetForm = ref<boolean>(false);
const resetEdicion = ref<boolean>(false);

const { apiFetch, error, loading } = useApi();
const {
  apiFetch: fetchProducts,
  loading: loadingProductos,
  error: errorProducts,
} = useApi();
const {
  apiFetch: makeDelete,
  error: errorDelete,
  loading: loadingDelete,
} = useApi();

const insertProducto = async (data: DataProducto) => {
  const seEstaEditando = productoEditando.value;
  const metodo = seEstaEditando ? "PUT" : "POST";
  const payload = seEstaEditando
    ? {
        id: seEstaEditando.id,
        idPz: seEstaEditando.idPz,
        idCaja: seEstaEditando.idCaja,
        ...data,
      }
    : data;
  await apiFetch("/producto", { method: metodo, body: payload });
  if (error.value === null) {
    getProducts();
    alertas.notificacion({
      text: `Se guardó correctamente ${data.descripcion.toUpperCase()}`,
    });
    productoEditando.value = null;
    resetForm.value = !resetForm.value;
    resetEdicion.value = !resetEdicion.value;
  } else {
    alertas.alerta({ text: error.value, icon: "error" });
    resetForm.value = !resetForm.value;
  }
};

const updateProducto = (prodToEdit: IProductoConPresentaciones) => {
  const codigoPieza = prodToEdit.presentaciones.find(
    (p) => p.presentacion_tipo === "PIEZA"
  )!;
  const codigoCaja = prodToEdit.presentaciones.find(
    (p) => p.presentacion_tipo === "CAJA"
  )!;

  const dataProducto: DataProducto = {
    codigo: codigoPieza.presentacion_codigo_barras,
    codigoCaja: codigoCaja.presentacion_codigo_barras,
    descripcion: prodToEdit.producto_descripcion,
    pasillo: prodToEdit.producto_pasillo,
    piezasCaja: codigoCaja.presentacion_cantidad,
    piso: prodToEdit.producto_rack_nivel,
    listo: !!prodToEdit.producto_listo,
  };
  productoEditando.value = {
    id: prodToEdit.producto_ID,
    idCaja: codigoCaja.presentacion_ID,
    idPz: codigoPieza.presentacion_ID,
    data: dataProducto,
  };
};

const handleMarcarListo = (prod: IProductoConPresentaciones) => {
  const pEdit: IProductoConPresentaciones = {
    ...prod,
    producto_listo: !!!prod.producto_listo,
  };
  updateProducto(pEdit);
  insertProducto(productoEditando.value?.data!);
};

const deleteProducto = async (prodToDelete: IProductoConPresentaciones) => {
  const deleteResponse = await makeDelete("/producto", {
    method: "DELETE",
    body: {
      id: prodToDelete.producto_ID,
    },
  });

  if (deleteResponse && errorDelete.value == null) {
    alertas.notificacion({
      icon: "info",
      text: `Se eliminó correctamente ${prodToDelete.producto_descripcion}`,
    });

    productos.value = productos.value.filter(
      (p) => p.producto_ID !== prodToDelete.producto_ID
    );
    productoEditando.value = null;

    resetForm.value = !resetForm.value;
    resetEdicion.value = !resetEdicion.value;
  }
};

const getProducts = async (busqueda?: string) => {
  const pResponse = await fetchProducts<{
    productos: IProductoConPresentaciones[];
  }>(`/producto${busqueda ? `?busqueda=${busqueda}` : ""}`);
  if (pResponse && errorProducts.value === null) {
    productos.value = pResponse.productos;
  } else {
    alertas.notificacion({
      text: "Error al obtener productos" + "\n" + errorProducts.value,
    });
  }
};

onBeforeMount(() => {
  getProducts();
});
</script>
