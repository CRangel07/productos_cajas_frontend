<template>
  <div class="flex flex-col w-full max-w-[200px] mt-3">
    <button
      class="bg-green-600 gap-5 flex items-center text-green-50 font-medium py-1 px-3 mt-5 rounded-lg cursor-pointer active:scale-95 justify-center"
      title="Descargar un Excel con todos los productos"
      @click="downloadExcel"
    >
      <span> Excel Productos</span>
      <Sheet :size="18" />
    </button>
    <p v-if="loading" class="text-center text-slate-600">Generando Excel...</p>
    <p v-if="error" class="api-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { Sheet } from "lucide-vue-next";
import { useApi } from "../composables/useApi";
import { useAlert } from "../composables/useAlert";

const { confirm: confirmacion } = useAlert();

const { apiFetch, error, loading } = useApi();

const downloadExcel = async () => {
  const userResponse = await confirmacion({
    text: "¿Quieres descargar el Excel con todos los productos?",
  });

  if (!userResponse.isConfirmed) return;

  const excelBlob = await apiFetch<Blob>("/producto/excel");

  if (excelBlob instanceof Blob && error.value === null) {
    const url = window.URL.createObjectURL(excelBlob);
    const a = document.createElement("a");
    a.href = url;

    a.download = "productos.xlsx";

    a.click();

    window.URL.revokeObjectURL(url);

    a.remove();
  } else {
    console.error("La respuesta no fue un archivo", excelBlob);
  }
};
</script>
