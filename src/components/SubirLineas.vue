<template>
  <section class="flex flex-col items-center gap-6 p-3 relative">
    <!-- Contenedor principal -->
    <div
      class="w-full max-w-md border-2 border-dashed border-cyan-400 rounded-xl bg-cyan-50/60 py-2 px-5 cursor-pointer transition-all duration-300 hover:border-cyan-500 hover:bg-cyan-100"
      :class="{ 'border-cyan-500 bg-cyan-100': isDragging }"
      @drag.prevent="isDragging = true"
      @dragenter.prevent="isDragging = true"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @dragend.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <div class="flex items-center gap-3 text-center">
        <CloudUploadIcon :size="30" class="text-cyan-600" />
        <div class="flex flex-col justify-start items-start">
          <h2 class="text-lg sm:text-xl font-semibold text-cyan-700">
            {{ isDragging ? "Suelta tu archivo aquí" : titulo }}
          </h2>
          <p class="text-xs text-gray-500">
            Arrastra un archivo .txt o haz clic para seleccionarlo
          </p>
          <input
            ref="fileInput"
            type="file"
            accept=".txt"
            class="hidden"
            @change="handleFileChange"
          />
        </div>
      </div>

      <!-- Archivo seleccionado -->
      <div v-if="file" class="mt-5 space-y-3 flex items-center gap-1 flex-wrap">
        <div
          class="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-2 shadow-sm"
        >
          <span class="text-sm text-gray-700 truncate">
            {{ file.name }} ({{ (file.size / 1024).toFixed(2) }} KB)
          </span>
          <button
            class="text-red-500 hover:text-red-700 transition"
            @click.stop="cleanAll"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>

        <div class="flex gap-2">
          <button
            type="button"
            class="w-fit bg-slate-500 text-white py-0.5 rounded-md font-medium hover:bg-slate-600 transition px-2 text-xs disabled:opacity-60"
            @click.stop="showPreview = !showPreview"
            :disabled="loading"
          >
            Preview
          </button>
          <button
            type="button"
            class="w-fit bg-cyan-500 text-white py-0.5 rounded-md text-xs font-medium hover:bg-cyan-600 transition px-2 disabled:opacity-60"
            @click.stop="handleSubmit"
            :disabled="loading"
          >
            {{ loading ? "Guardando..." : "Guardar" }}
          </button>
        </div>

        <p v-if="error" class="text-red-500 text-sm text-center mt-2">
          {{ error }}
        </p>
      </div>
    </div>

    <!-- Vista previa -->
    <div
      v-if="fileContent.length && showPreview"
      class="w-full max-w-xl bg-gray-800 text-gray-100 rounded-lg p-4 overflow-auto text-xs sm:text-sm max-h-[200px] absolute bottom-0"
    >
      <h3 class="text-base font-medium mb-3 text-cyan-300">
        Vista previa del archivo:
      </h3>
      <button
        type="button"
        @click.stop="showPreview = false"
        class="text-rose-400"
      >
        <X />
      </button>
      <pre
        v-for="(line, index) in fileContent"
        :key="index"
        class="whitespace-pre border-b text-xs border-gray-700 py-1 last:border-none"
      >
        {{ line }}
      </pre>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
import { CloudUploadIcon, X, XIcon } from "lucide-vue-next";
import { useAlert } from "../composables/useAlert";
import { useApi } from "../composables/useApi";

// Props
const props = defineProps<{
  titulo: string;
  endpoint: string;
  validaciones: {
    linea1: string;
    linea2: string;
    mensajeError: string;
  };
}>();

const isDragging = ref(false);
const file = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const fileContent: Ref<string[]> = ref([]);
const showPreview = ref<boolean>(false);
const { alerta } = useAlert();
const { apiFetch, error, loading } = useApi();

const triggerFileInput = () => fileInput.value?.click();

const validateFileContent = (content: string): string[] => {
  const lines = content.split("\n", 3);
  if (lines.length >= 3) {
    const firstValid = lines[0].includes(props.validaciones.linea1);
    const secondValid =
      lines[1].includes(props.validaciones.linea2) ||
      lines[2].includes(props.validaciones.linea2);
    if (firstValid && secondValid) return content.split("\n");
  }

  alerta({
    title: "Archivo inválido",
    icon: "error",
    text: props.validaciones.mensajeError,
  });
  cleanAll();
  return [];
};

const readFile = (fileToRead?: File) => {
  if (!fileToRead) return;
  if (fileToRead.type !== "text/plain") {
    alerta({
      title: "Archivo inválido",
      text: "Solo se permiten archivos .txt",
      icon: "warning",
    });
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target?.result as string;
    fileContent.value = validateFileContent(content);
  };
  reader.readAsText(fileToRead);
  file.value = fileToRead;
};

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files?.[0]) readFile(input.files[0]);
};

const handleDrop = (e: DragEvent) => {
  isDragging.value = false;
  const droppedFile = e.dataTransfer?.files[0];
  readFile(droppedFile);
};

const handleSubmit = async () => {
  const res = await alerta({
    title: "Confirmación",
    text: "¿Deseas guardar este archivo?",
    icon: "question",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    focusCancel: true,
  });

  if (res.isConfirmed && file.value) {
    const formData = new FormData();
    formData.append("file", file.value);
    await apiFetch(props.endpoint, { method: "POST", body: formData });
    cleanAll();
  }
};

const cleanAll = () => {
  file.value = null;
  fileContent.value = [];
  if (fileInput.value) fileInput.value.value = "";
};
</script>
