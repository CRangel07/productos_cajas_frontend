<template>
  <button
    type="button"
    class="font-medium rounded px-3 py-2.5 select-none border"
    :class="{
      'bg-slate-200 text-slate-700 border-slate-300 cursor-pointer active:scale-[99%]':
        !estado && !disabled,
      'bg-sky-200 border-sky-300 text-sky-800 cursor-pointer active:scale-95 ':
        estado,
      'bg-slate-200 cursor-not-allowed line-through decoration-2 decoration-slate-500 border-slate-300':
        disabled,
    }"
    :disabled="disabled"
    @click="estado = !estado"
  >
    {{ texto }}
  </button>
</template>

<script setup lang="ts">
defineProps<{ texto: string; disabled?: boolean }>();

const estado = defineModel<boolean | null>({ default: false, required: true });
</script>
