<template>
  <div>
    <p class="text-center text-yellow-500 font-medium">
      No existe un producto con esa descripción o código
    </p>
    <button
      class="bg-blue-500 text-blue-50 cursor-pointer active:scale-95 w-fit block m-auto px-2 py-1 rounded-md"
      @click="showRegistro = !showRegistro"
    >
      ¿Registrar Nuevo Producto?
    </button>
    <RegistrarProducto v-if="showRegistro" :lineas="lineas" />
  </div>
</template>

<script setup lang="ts">
import RegistrarProducto from "./RegistrarProducto.vue";

defineProps<{ lineas: SelectOpt[] }>();

import { ref } from "vue";
import { SelectOpt } from "./Selector.vue";

const showRegistro = ref<boolean>(false);
</script>
