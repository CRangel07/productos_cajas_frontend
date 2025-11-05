<template>
  <div class="contenedor-main">
    <SubirLineasTXT />
    <p v-if="error" class="api-error">{{ error }}</p>

    <form @submit.prevent="" class="flex items-end gap-3">
      <Selector
        :config="{
          disabled: false,
          id: 'reg_productos_select',
          required: true,
        }"
        :icono="TableOfContents"
        :opt="lineasOpt"
        label="Selecciona Linea a traer"
        v-model="linea"
      />
      <button type="submit" class="bg-red-100">Obtener</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useApi } from "../composables/useApi";
import { ILinea } from "../types/db";
import { TableOfContents } from "lucide-vue-next";
import { computed, onBeforeMount, ref } from "vue";

import Selector, { SelectOpt } from "../components/Selector.vue";
import SubirLineasTXT from "../components/SubirLineasTXT.vue";

const linea = ref<any>();

const lineas = ref<ILinea[]>([]);
const lineasOpt = computed(() =>
  lineas.value.map<SelectOpt>((l) => ({
    label: `${l.linea_compucaja_ID} | ${l.linea_descripcion}`,
    value: l.linea_compucaja_ID,
  }))
);
const { apiFetch, error, loading } = useApi();

onBeforeMount(async () => {
  const lineaResponse = await apiFetch<{ lineas: ILinea[] }>("/lineas");
  console.log(lineaResponse);
  if (error.value == null) {
    lineas.value = lineaResponse.lineas;
  } else {
    lineas.value = [];
  }
});
</script>

<style scoped></style>
