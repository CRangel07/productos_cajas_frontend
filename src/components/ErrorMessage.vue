<template>
  <p class="api-error relative pr-10">
    {{ message }}
    <button
      title="Cerrar error"
      class="bg-rose-300 p-1 -top-[15%] absolute right-1 rounded-full cursor-pointer hover:bg-rose-600 hover:text-white"
      @click="$emit('close')"
    >
      <X :size="20" />
    </button>
  </p>
</template>

<script setup lang="ts">
import { X } from "lucide-vue-next";

defineProps<{ message: string }>();
defineEmits<{ close: [] }>();
</script>
