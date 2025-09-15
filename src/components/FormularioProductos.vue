<template>
  <div class="w-full max-w-[300px]">
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-5">
      <Entrada
        label="Código de Caja"
        v-model="dataProducto.codigoCaja"
        :opt="{
          id: 'reg_codigo_caja',
          disabled: false,
          icono: ScanBarcode,
          required: true,
          type: 'text',
        }"
      />

      <Entrada
        label="Código de Pieza"
        v-model="dataProducto.codigo"
        :opt="{
          id: 'reg_codigo',
          disabled: false,
          icono: ScanBarcode,
          required: true,
          type: 'text',
        }"
      />

      <Entrada
        label="Descripción"
        v-model="dataProducto.descripcion"
        :opt="{
          id: 'reg_descripcion',
          disabled: false,
          icono: ReceiptText,
          required: true,
          type: 'text',
        }"
      />

      <Entrada
        label="Piezas de la caja"
        v-model="dataProducto.piezasCaja"
        :opt="{
          id: 'reg_pz',
          disabled: false,
          icono: Hash,
          required: true,
          type: 'number',
          step: 1,
          max: 100,
          min: 1,
        }"
      />

      <Entrada
        label="Pasillo"
        v-model="dataProducto.pasillo"
        :opt="{
          id: 'reg_pasillo',
          disabled: false,
          icono: Hash,
          required: true,
          type: 'number',
          step: 1,
          max: 50,
          min: 1,
        }"
      />
      <Entrada
        label="Piso del Rack"
        v-model="dataProducto.piso"
        :opt="{
          id: 'reg_piso',
          disabled: false,
          icono: Hash,
          required: true,
          type: 'number',
          step: 1,
          max: 7,
          min: 1,
        }"
      />

      <p class="api-error" v-if="props.error">
        {{ props.error }}
      </p>

      <button
        type="submit"
        class="border py-0.5 px-2 rounded-md border-blue-800 bg-blue-500 text-white font-medium cursor-pointer active:scale-95 disabled:bg-slate-500"
        :disabled="cargando"
      >
        Guardar
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import Entrada from "./Entrada.vue";

import { DataProducto } from "../types/forms";
import { reactive, watch } from "vue";
import { Hash, ReceiptText, ScanBarcode } from "lucide-vue-next";
import { useAlert } from "../composables/useAlert";

const alert = useAlert();

const props = defineProps<{
  cargando: boolean;
  error: string | null;
  reset: 1 | 0;
}>();
const emit = defineEmits<{ (e: "submit", data: DataProducto): void }>();

const iniciarDatos = (): DataProducto => ({
  codigo: "",
  codigoCaja: "",
  piezasCaja: null,
  descripcion: "",
  pasillo: null,
  piso: null,
});

const dataProducto = reactive<DataProducto>(iniciarDatos());

function esRepetido(codigo: string): string | null {
  for (let i = 1; i <= codigo.length / 2; i++) {
    if (codigo.length % i === 0) {
      const bloque = codigo.slice(0, i);
      const repetido = bloque.repeat(codigo.length / i);
      if (repetido === codigo) {
        return bloque;
      }
    }
  }
  return null;
}

const handleSubmit = async () => {
  const userRes = await alert.confirm({
    text: "¿Seguro que deseas guardar estos datos?",
  });

  if (userRes.isConfirmed) {
    emit("submit", dataProducto);
  }
};

function useDebouncedRepetido<T extends object, K extends keyof T>(
  obj: T,
  key: K,
  delay = 500
) {
  let timer: ReturnType<typeof setTimeout> | null = null;

  watch(
    () => obj[key],
    (nuevo) => {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        const valor = String(nuevo || "");
        const base = esRepetido(valor);

        if (base && base.length !== valor.length) {
          alert.alerta({
            text: `⚠️ Parece que escaneaste dos veces el mismo código en "${String(key)}"`,
            icon: "warning",
          });

          obj[key] = base as T[K];
        }
      }, delay);
    }
  );
}

watch(
  () => props.reset,
  (flag) => {
    if (flag == 1) Object.assign(dataProducto, iniciarDatos());
  }
);

useDebouncedRepetido(dataProducto, "codigo", 200);
useDebouncedRepetido(dataProducto, "codigoCaja", 200);
</script>
