<template>
  <div class="overflow-auto max-h-[60vh] w-full">
    <h3
      class="flex gap-3 items-center sticky top-0 z-10 bg-slate-700 py-2 px-4"
    >
      <PackageOpen :size="42" class="text-blue-300" />
      <span class="font-medium text-xl text-blue-300 break-words block">
        {{ prod.producto_descripcion }}
      </span>
    </h3>

    <button
      type="button"
      class="flex items-center bg-green-500 text-sm mt-3 ms-auto rounded py-0.5 px-2 font-medium text-green-50 cursor-pointer"
      @click="creando = !creando"
    >
      Añadir Presentación
      <Plus />
    </button>

    <RegistroForm
      v-if="creando"
      class="mt-3 p-4"
      @submit-form=""
      @cancel-edit="creando = false"
      :pre="null"
      :prod-id="prod.producto_ID"
    />

    <p class="text-md text-slate-100 font-medium my-3 px-3">Presentaciones</p>

    <ErrorMessage v-if="error" :message="error" />
    <p v-if="loading" class="api-loading">Eliminando producto</p>

    <div class="overflow-auto w-full px-3">
      <table class="w-full align-middle text-center border-collapse">
        <tbody>
          <tr v-for="pre in prod.presentaciones" :key="pre.presentacion_ID">
            <td class="border font-medium text-slate-100 border-slate-400 p-1">
              {{ pre.presentacion_tipo }}
            </td>
            <td
              class="border font-mono text-xl text-blue-300 border-slate-400 px-2"
            >
              {{ pre.presentacion_codigo_barras }}
            </td>
            <td class="border font-medium text-slate-100 border-slate-400 px-2">
              Cant: {{ pre.presentacion_cantidad }}
            </td>
            <td class="border border-slate-400 py-2">
              <div>
                <button
                  type="button"
                  title="Eliminar presentación"
                  :disabled="loading"
                  @click="handleDelete(prod, pre)"
                  class="bg-rose-400 text-rose-900 rounded align-sub cursor-pointer px-3 py-1 disabled:bg-slate-600"
                >
                  <Trash :size="18" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import RegistroForm from "./RegistroForm.vue";
import ErrorMessage from "./ErrorMessage.vue";

import { ref } from "vue";
import { useApi } from "../composables/useApi";
import { useAlert } from "../composables/useAlert";
import { IPresentacion } from "../types/db";
import { PackageOpen, Plus, Trash } from "lucide-vue-next";
import { IProductoConPresentaciones } from "../types/responses";

defineProps<{ prod: IProductoConPresentaciones }>();

const { confirm } = useAlert();
const creando = ref<boolean>(true);

const { apiFetch, error, loading } = useApi();

const handleDelete = async (
  prod: IProductoConPresentaciones,
  pre: IPresentacion
) => {
  const userResponse = await confirm({
    text: `Confirma la eliminación de la presentación ${pre.presentacion_tipo} de ${prod.producto_descripcion} codigo ${pre.presentacion_codigo_barras}
    `,
  });

  if (!userResponse.isConfirmed) return;

  await apiFetch("/presentacion", {
    method: "DELETE",
    body: { id: pre.presentacion_ID },
  });
};
</script>
