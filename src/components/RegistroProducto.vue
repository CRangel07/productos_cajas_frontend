<template>
  <div>
    <h3 class="flex gap-3 items-center">
      <PackageOpen :size="42" class="text-blue-500" />
      <span class="font-medium text-md text-blue-500">
        {{ prod.producto_descripcion }}
      </span>
    </h3>

    <button
      type="button"
      class="flex items-center bg-green-500 text-sm ms-auto rounded py-0.5 px-2 font-medium text-green-50 cursor-pointer"
      @click="creando = !creando"
    >
      Añadir Presentación
      <Plus />
    </button>

    <RegistroForm
      v-if="creando"
      class="mt-3"
      @submit-form="(data) => savePresentacion(data)"
      @cancel-edit="creando = false"
      :prod="prod"
    />

    <p class="text-md text-slate-600 my-3">Presentaciones</p>

    <div class="overflow-auto">
      <table class="w-full align-middle text-center border-collapse">
        <tbody>
          <tr v-for="pre in prod.presentaciones" :key="pre.presentacion_ID">
            <td
              v-if="editando === pre.presentacion_ID && creando === false"
              colspan="4"
              class="border border-slate-400 px-3 py-1.5"
            >
              <RegistroForm @cancel-edit="editando = null" :prod="prod" />
            </td>

            <template v-else>
              <td
                class="border font-medium font-semibold text-slate-700 border-slate-400"
              >
                {{ pre.presentacion_tipo }}
              </td>
              <td
                class="border font-mono text-xl text-blue-700 border-slate-400 font-medium"
              >
                {{ pre.presentacion_codigo_barras }}
              </td>
              <td class="border font-medium text-slate-700 border-slate-400">
                Cantidad:{{ pre.presentacion_cantidad }}
              </td>
              <td class="border border-slate-400 py-2">
                <div>
                  <button
                    type="button"
                    @click="creando ? '' : (editando = pre.presentacion_ID)"
                    class="bg-yellow-400 text-yellow-900 rounded p-0.5 align-sub"
                  >
                    <Pencil />
                  </button>
                </div>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import RegistroForm from "./RegistroForm.vue";

import { ref } from "vue";
import { IFormPresentacion } from "../types/forms";
import { IProductoConPresentaciones } from "../types/responses";
import { PackageOpen, Pencil, Plus } from "lucide-vue-next";

const creando = ref<boolean>(false);
const editando = ref<string | number | null>(null);

defineProps<{ prod: IProductoConPresentaciones }>();

const savePresentacion = (data: IFormPresentacion) => {};
</script>

<style scoped></style>
