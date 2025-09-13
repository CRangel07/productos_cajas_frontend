<template>
  <div class="flex flex-col group w-full relative">
    <label
      :for="props.opt.id"
      class="text-slate-600 text-xs md:text-sm mb-0.5 md:mb-1 group-focus-within:text-blue-600 block tracking-wider font-medium"
    >
      {{ props.label }}
    </label>
    <div class="flex w-full">
      <!-- ICONO -->
      <div
        class="bg-slate-200 grid items-center px-2.5 border border-slate-400 group-focus-within:border-blue-500 text-slate-600 rounded-l"
      >
        <component
          :is="props.opt.icono"
          :size="20"
          class="group-focus-within:text-blue-600"
        />
      </div>
      <!-- INPUT -->
      <input
        v-bind="props.opt"
        :value="props.modelValue"
        @input="onInput"
        class="border-y border-r border-slate-400 outline-none group-focus-within:border-blue-500 md:py-2.5 md:px-2 py-1.5 px-1.5 w-full rounded-r bg-white font-medium disabled:bg-slate-200/80 disabled:cursor-not-allowed text-gray-700 text-sm lg:text-base uppercase"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Component } from "vue";

type TipoEntrada = "text" | "email" | "number" | "date" | "time";

type EntradaOptions = Partial<{
  min: number;
  max: number;
  maxlength: number;
  placeholder: string;
  step: number;
}> & {
  type: TipoEntrada;
  required: boolean;
  disabled: boolean;
  icono: Component;
  id: string;
};

const props = defineProps<{
  modelValue: string | number | null;
  opt: EntradaOptions;
  label: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: typeof props.modelValue): void;
}>();

const onInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  emit("update:modelValue", input.value);
};
</script>

<style scoped>
/* Chrome, Safari, Edge */
input[type="date"]::-webkit-calendar-picker-indicator {
  z-index: 10;
  right: 0.25rem;
  cursor: pointer;
  font-size: 1.2rem;
  position: absolute;
}

/* Firefox */
input[type="date"]::-moz-calendar-picker-indicator {
  z-index: 10;
  right: 0.25rem;
  cursor: pointer;
  font-size: 1.2rem;
  position: absolute;
}
</style>
