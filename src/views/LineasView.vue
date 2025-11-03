<template>
  <div class="contenedor-main">
    <SubirLineasTXT />
    <p v-if="error" class="api-error">{{ error }}</p>
    <pre>{{ lineas }}</pre>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useApi } from "../composables/useApi";
import { ILinea } from "../types/db";
import SubirLineasTXT from "../components/SubirLineasTXT.vue";

const lineas = ref<ILinea[]>([]);

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
