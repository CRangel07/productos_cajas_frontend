<template>
  <form class="flex flex-wrap gap-1" @submit.prevent="savePresentacion">
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
      :config="{
        disabled: loading,
        required: true,
        colorLabel: 'white',
        id: 'reg_form_pre_tipo',
      }"
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
        color: 'white',
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
        color: 'white',
      }"
    />
    <div class="flex mt-3 gap-2">
      <button
        type="button"
        class="bg-yellow-500 text-yellow-50 p-0.5 px-2 rounded text-sm font-medium cursor-pointer active:scale-95"
        @click="emit('cancelEdit')"
      >
        Cancelar
      </button>
      <button
        class="bg-green-500 text-green-50 rounded p-0.5 px-2 text-sm font-medium cursor-pointer active:scale-95"
        type="submit"
        :disabled="loading"
      >
        Guardar
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import Entrada from "./Entrada.vue";
import Selector, { SelectOpt } from "./Selector.vue";
import ErrorMessage from "./ErrorMessage.vue";

import { useApi } from "../composables/useApi";
import { reactive } from "vue";
import { IPresentacion } from "../types/db";
import { Package2, ScanBarcode } from "lucide-vue-next";
import { ArrPresentaciones, IFormPresentacion } from "../types/forms";

const props = defineProps<{
  pre: IPresentacion | null;
  prodId: string;
}>();

const emit = defineEmits<{
  (e: "submitForm", data: IFormPresentacion): void;
  (e: "cancelEdit"): void;
}>();

const initData = (): IFormPresentacion => {
  if (props.pre && props.prodId) {
    return {
      cantidad: props.pre.presentacion_cantidad,
      codigo: props.pre.presentacion_codigo_barras,
      tipo: props.pre.presentacion_tipo,
      idProducto: props.prodId,
    };
  } else {
    return {
      cantidad: null,
      codigo: null,
      tipo: "CAJA",
      idProducto: props.prodId,
    };
  }
};

const data = reactive<IFormPresentacion>(initData());

const { apiFetch, error, loading } = useApi();

const savePresentacion = async () => {
  await apiFetch("/presentacion", { method: "POST", body: data });
  if (error.value === null) {
    Object.assign(data, initData());
  }
};
</script>
