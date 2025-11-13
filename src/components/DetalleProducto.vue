<template>
  <div
    class="bg-slate-700 border-2 rounded-md overflow-auto w-full border-slate-500 h-full flex items-center justify-center"
  >
    <p v-if="!prod" class="text-lg text-center text-slate-300 font-medium px-8">
      Haz click en un producto de la lista para ver su detalle
    </p>
    <div v-else class="relative w-full">
      <button
        type="button"
        class="absolute right-5 -top-5 cursor-pointer z-20"
        @click="emit('limpiarProducto')"
      >
        <X class="text-red-400" />
      </button>
      <RegistroProducto :prod="prod" />
    </div>
  </div>
</template>

<script setup lang="ts">
import RegistroProducto from "./RegistroProducto.vue";

import { X } from "lucide-vue-next";
import { IProductoConPresentaciones } from "../types/responses";

defineProps<{ prod: IProductoConPresentaciones | null }>();
const emit = defineEmits<{ (e: "limpiarProducto"): void }>();
</script>
