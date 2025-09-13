<template>
  <div class="flex flex-col group w-full">
    <!-- LABEL -->
    <label
      class="text-slate-600 text-xs md:text-sm mb-0.5 md:mb-1 block tracking-wider"
    >
      {{ props.label }}
    </label>

    <!-- CONTENEDOR PRINCIPAL -->
    <div class="flex w-full relative">
      <!-- ICONO -->
      <div
        class="bg-slate-200 grid items-center px-2.5 border border-slate-400 group-focus-within:border-blue-500 text-slate-600 rounded-l"
      >
        <component
          :is="opt.icono"
          :size="20"
          class="group-focus-within:text-blue-600"
        />
      </div>

      <!-- INPUT FILE (oculto) -->
      <input
        ref="fileInput"
        type="file"
        v-bind="props.opt"
        @change="onFileChange"
        class="hidden"
      />

      <!-- BOTÓN PERSONALIZADO -->
      <button
        type="button"
        @click="triggerFileDialog"
        class="border-y border-r text-xs border-slate-400 outline-none md:py-4 md:px-2 py-1.5 px-1.5 w-full rounded-r bg-white font-medium disabled:bg-slate-200/80 disabled:cursor-not-allowed cursor-pointer text-center hover:bg-slate-100"
        :class="{ 'text-slate-400': !fileData, 'text-blue-500': fileData }"
      >
        {{ fileData ? "Cambiar imagen" : "Seleccionar Archivo" }}
      </button>
    </div>

    <!-- INFO DEL ARCHIVO -->
    <div v-if="fileData" class="mt-2 flex flex-col items-center gap-3">
      <div class="flex items-center gap-4 w-full">
        <!-- Datos del archivo -->
        <div class="flex flex-col text-sm text-blue-500">
          <span class="font-semibold">{{ fileData.name }}</span>
          <span class="text-xs text-slate-500">
            {{ fileData.sizeMB.toFixed(2) }} MB
          </span>
        </div>
        <!-- Botón eliminar -->
        <button
          type="button"
          @click="removeFile"
          class="ml-auto text-red-500 hover:text-red-700 cursor-pointer"
        >
          ✖
        </button>
      </div>
      <!-- Preview si es imagen -->
      <div
        v-if="fileData.preview"
        class="w-full h-full overflow-hidden rounded-md border border-slate-400"
      >
        <img
          :src="fileData.preview"
          alt="preview"
          class="object-cover object-center w-full h-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Component, ref } from "vue";

type EntradaArchivoOptions = Partial<{
  accept: string; // ejemplo: "image/*"
  multiple: boolean;
}> & {
  required: boolean;
  disabled: boolean;
  icono: Component;
  id: string;
};

const props = defineProps<{
  modelValue: File | null;
  opt: EntradaArchivoOptions;
  label: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: File | null): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);

// Datos del archivo seleccionado
const fileData = ref<{
  name: string;
  sizeMB: number;
  preview?: string;
} | null>(null);

const triggerFileDialog = () => {
  fileInput.value?.click();
};

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] ?? null;

  if (file) {
    // Calcular tamaño en MB
    const sizeMB = file.size / (1024 * 1024);

    // Ver si es imagen
    let preview: string | undefined;
    if (file.type.startsWith("image/")) {
      preview = URL.createObjectURL(file);
    }

    fileData.value = {
      name: file.name,
      sizeMB,
      preview,
    };

    emit("update:modelValue", file);
  } else {
    removeFile();
  }
};

const removeFile = () => {
  fileData.value &&
    fileData.value.preview &&
    URL.revokeObjectURL(fileData.value.preview);
  fileData.value = null;
  emit("update:modelValue", null);

  if (fileInput.value) {
    fileInput.value.value = ""; // Limpia el input real
  }
};
</script>
