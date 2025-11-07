<template>
  <form class="grid grid-cols-8 gap-2" @submit.prevent="savePresentacion">
    <ErrorMessage
      v-if="error"
      :message="error"
      @close="error = null"
      class="col-span-full"
    />
    <Selector
      label="Tipo Presentación"
      :icono="Package2"
      :opt="ArrPresentaciones.map<SelectOpt>((p) => ({ label: p, value: p }))"
      :config="{ disabled: loading, id: 'reg_form_pre_tipo', required: true }"
      v-model="data.tipo"
      class="col-span-2"
    />
    <Entrada
      label="Código"
      v-model="data.codigo"
      class="col-span-4"
      :opt="{
        disabled: loading,
        icono: ScanBarcode,
        id: 'reg_form_pre_codigo',
        required: true,
        type: 'text',
      }"
    />
    <Entrada
      label="Cantidad"
      v-model="data.cantidad"
      class="col-span-2"
      :opt="{
        disabled: loading,
        icono: ScanBarcode,
        id: 'reg_form_pre_codigo',
        required: true,
        type: 'number',
        min: 1,
        max: 200,
      }"
    />
    <button
      type="button"
      class="bg-yellow-500 text-yellow-50 rounded text-sm font-medium cursor-pointer active:scale-95"
      @click="emit('cancelEdit')"
    >
      Cancelar
    </button>
    <button
      class="bg-green-500 text-green-50 rounded text-sm font-medium cursor-pointer active:scale-95"
      type="submit"
      :disabled="loading"
    >
      Guardar
    </button>
  </form>
</template>

<script setup lang="ts">
import Entrada from "./Entrada.vue";
import Selector, { SelectOpt } from "./Selector.vue";

import { reactive } from "vue";
import { Package2, ScanBarcode } from "lucide-vue-next";
import { ArrPresentaciones, IFormPresentacion } from "../types/forms";
import { useApi } from "../composables/useApi";
import ErrorMessage from "./ErrorMessage.vue";
import { IProductoConPresentaciones } from "../types/responses";

const props = defineProps<{ prod: IProductoConPresentaciones }>();

const emit = defineEmits<{
  (e: "submitForm", data: IFormPresentacion): void;
  (e: "cancelEdit"): void;
}>();

const initData = (): IFormPresentacion => ({
  cantidad: null,
  codigo: null,
  tipo: "CAJA",
  idProducto: props.prod.producto_ID,
});

const data = reactive<IFormPresentacion>(initData());

const { apiFetch, error, loading } = useApi();

const savePresentacion = async () => {
  await apiFetch("/presentacion", { method: "POST", body: data });
  if (error == null) initData();
};
</script>
