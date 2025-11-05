<template>
  <section
    class="flex items-center gap-4"
    :class="[file ? 'justify-center ' : 'justify-start!']"
  >
    <div
      class="mx-auto mb-8 w-full max-w-md rounded-lg bg-cyan-50/50 py-4 px-8 border-2 border-dashed transition-all duration-300 ease-in-out border-blue-300 cursor-pointer"
      :class="{ 'border-dashed border-blue-400 bg-blue-50': isDragging }"
      @drag.prevent="isDragging = true"
      @dragenter.prevent="isDragging = true"
      @dragstart.prevent="isDragging = true"
      @dragover.prevent="isDragging = true"
      @dragend.prevent="isDragging = true"
      @dragexit="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <div class="flex items-center flex-wrap justify-between">
        <h2 class="mb-2 text-xl font-semibold text-cyan-600">
          {{
            isDragging
              ? "Tus archivos van aquí"
              : "Selecciona Archivo Desc Lineas"
          }}
        </h2>
        <CloudUploadIcon
          :size="42"
          :class="{
            'text-cyan-500': isDragging,
            'text-cyan-600': !isDragging,
          }"
        />
        <input
          type="file"
          ref="fileInput"
          class="hidden"
          accept=".txt"
          @change="handleFileChange"
        />
      </div>

      <div v-if="file" class="mt-6">
        <ul class="space-y-2">
          <li class="flex items-center justify-between rounded bg-gray-200 p-2">
            <span class="text-sm text-gray-800 font-medium"
              >{{ file.name }} {{ (file.size / 1024).toFixed(2) }} KB</span
            >
            <button
              class="text-red-500 hover:text-red-700 focus:outline-none"
              @click.stop="cleanAll"
            >
              <XIcon class="h-5 w-5" />
            </button>
          </li>
        </ul>
        <button
          type="button"
          class="text-white text-sm bg-cyan-500 py-1 px-2 rounded-md ms-auto block mt-2 cursor-pointer"
          @click.stop="handleSubmit"
          :disabled="loading"
        >
          Guardar
        </button>
        <p v-if="loading">Guardando espera...</p>
      </div>

      <p v-if="error" class="api-error">{{ error }}</p>
    </div>

    <!-- PREVISUALIZAR ARCHIVO TXT -->
    <div
      v-if="fileContent.length"
      class="mx-auto w-full max-w-[968px] overflow-auto whitespace-pre-wrap bg-gray-700 px-16 py-10 text-left text-sm text-slate-100 md:text-base max-h-[250px] rounded-md"
    >
      <h3 class="mb-4 text-base font-medium lg:text-2xl">
        Vista Previa del Archivo:
      </h3>
      <pre class="" v-for="(line, index) in fileContent" :key="index">
        {{ line }} 
    </pre
      >
    </div>
  </section>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue";
import { CloudUploadIcon, XIcon } from "lucide-vue-next";
import { useAlert } from "../composables/useAlert";
import { useApi } from "../composables/useApi";

const isDragging = ref(false);
const file = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const fileContent: Ref<Array<string>> = ref([]);
ref("none");
const { alerta } = useAlert();

const triggerFileInput = () => {
  fileInput.value?.click();
};

const validateFileContent = (content: string) => {
  const lines = content.split("\n", 3);
  console.log(lines);
  if (lines.length >= 3) {
    const secondLineValid = lines[0].includes("cei-0299-2.6");
    const thirdLineValid = lines[2].includes("INVENTARIO POR LINEA");

    if (secondLineValid && thirdLineValid) {
      return content.split("\n");
    } else {
      alerta({
        title: "Archivo invalido",
        icon: "error",
        text: "El archivo no es el correcto, recuerda que debe ser el 'INVENTARIO POR LINEA'",
      });
      return [];
    }
  } else {
    alerta({
      title: "Archivo invalido",
      icon: "error",
      text: "El archivo no tiene suficientes líneas.",
    });
    return [];
  }
};

const readFile = (fileToRead: File | undefined) => {
  if (!fileToRead) return;
  if (fileToRead.type != "text/plain") {
    alerta({
      title: "Archivo invalido",
      text: "Solo se permiten archivos archivos de texto .txt",
      icon: "warning",
    });
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    const content = event.target?.result;
    fileContent.value = validateFileContent(content as string);
  };
  reader.readAsText(fileToRead);
  file.value = fileToRead;
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    const file = input.files[0];
    readFile(file);
  }
};

const handleDrop = (e: DragEvent) => {
  isDragging.value = false;
  const droppedFile = e.dataTransfer?.files[0];
  readFile(droppedFile);
};

const { apiFetch, error, loading } = useApi();

const handleSubmit = async () => {
  const respuesta = await alerta({
    title: "Confirmación",
    text: "¿Estás segur@ de guardar las existencias de este archivo?",
    icon: "question",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    focusCancel: true,
  });

  if (respuesta.isConfirmed) {
    if (file.value) {
      const formData = new FormData();
      formData.append("file", file.value);
      await apiFetch("/lineas/descripcion", { method: "POST", body: formData });
      cleanAll();
    }
  }
};

const cleanAll = () => {
  file.value = null;
  fileContent.value = [];
  if (fileInput.value?.value) fileInput.value.value = "";
};
</script>
