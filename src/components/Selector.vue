<template>
  <div class="flex flex-col group w-full">
    <label
      :for="props.config.id"
      :class="{
        'text-slate-600':
          (props.config.colorLabel && props.config.colorLabel == 'dark') ||
          !props.config.colorLabel,
        'text-slate-100':
          props.config.colorLabel && props.config.colorLabel == 'white',
      }"
      class="text-xs md:text-sm mb-0.5 md:mb-1 group-focus-within:text-blue-600 block tracking-wider"
    >
      {{ props.label }}
    </label>
    <div class="flex w-full">
      <!-- ICONO -->
      <div
        class="bg-slate-200 grid items-center px-2.5 border border-slate-400 group-focus-within:border-blue-500 text-slate-600 rounded-l"
      >
        <component
          :is="props.icono"
          :size="20"
          class="group-focus-within:text-blue-600"
        />
      </div>
      <!-- INPUT -->
      <select
        v-bind="props.config"
        :value="props.modelValue"
        @input="onInput"
        class="border-y border-r bg-white border-slate-400 outline-none group-focus-within:border-blue-500 md:py-2.5 md:px-2 py-1.5 px-1.5 w-full disabled:bg-slate-200/80 disabled:cursor-not-allowed cursor-pointer text-gray-700 font-medium text-sm lg:text-base rounded-r"
      >
        <option v-for="opt in props.opt" :key="opt.label" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Component } from "vue";

type SelectConfig = {
  id: string;
  required: boolean;
  disabled: boolean;
  colorLabel?: "white" | "dark";
};

export type SelectOpt = {
  label: string;
  value: string | number | null;
};

const props = defineProps<{
  modelValue: string | number | null;
  label: string;
  config: SelectConfig;
  opt: SelectOpt[];
  icono: Component;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: typeof props.modelValue): void;
}>();

const onInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  emit("update:modelValue", input.value);
};
</script>
