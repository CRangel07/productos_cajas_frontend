<template>
  <div
    class="max-w-3xl m-auto overflow-x-auto rounded-lg shadow-lg bg-white mt-5"
  >
    <table class="w-full border-collapse text-sm text-left">
      <thead class="bg-gray-800 sticky top-0 z-10">
        <tr>
          <th
            class="px-4 py-2 font-semibold text-gray-50 border-b border-gray-600"
          >
            Tipo
          </th>
          <th
            class="px-4 py-2 font-semibold text-gray-50 border-b border-gray-600"
          >
            Código
          </th>
          <th
            class="px-4 py-2 font-semibold text-gray-50 border-b border-gray-600"
          >
            Cantidad
          </th>
        </tr>
      </thead>
      <tbody>
        <template
          v-if="productos.length"
          v-for="(prod, i) in productos"
          :key="prod.producto_ID"
        >
          <!-- Fila de encabezado del producto -->
          <tr
            :class="[
              'font-semibold text-gray-900 text-base',
              i % 2 === 0 ? 'bg-lime-100/70' : 'bg-indigo-100/70',
            ]"
          >
            <td colspan="3" class="px-4 py-2 border-y border-gray-300">
              <div class="flex justify-between">
                <div class="flex flex-col">
                  <span class="text-xl font-mono">
                    {{ prod.producto_descripcion }}
                  </span>
                  <span class="font-normal text-xs">
                    Linea:
                    {{ prod.linea_compucaja_ID }} |
                    {{ prod.linea_descripcion }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <p
                    v-if="!!prod.producto_listo"
                    class="text-wrap w-max break-words text-sm bg-lime-400 text-lime-900 rounded-md py-1 px-2"
                  >
                    Códigos Listos en Compucaja
                  </p>
                  <button
                    @click="handleToggleState(prod)"
                    title="Alternar estado de listo"
                    class="bg-green-400 p-1 rounded-md text-green-800 cursor-pointer disabled:bg-slate-700 disabled:text-slate-100"
                    :disabled="loading"
                  >
                    <Check :size="18" :stroke-width="2.5" />
                  </button>
                  <button
                    @click="handleModal(prod)"
                    title="Abrir menú de producto"
                    class="bg-yellow-400 p-1 rounded-md text-yellow-800 cursor-pointer"
                  >
                    <Menu :size="18" :stroke-width="2.5" />
                  </button>
                </div>
              </div>
            </td>
          </tr>

          <!-- Filas de presentaciones -->

          <tr
            v-if="prod.presentaciones.length"
            v-for="pre in prod.presentaciones"
            :key="pre.presentacion_ID"
            class="transition-colors duration-200 hover:bg-gray-50"
          >
            <td
              class="px-4 py-2 border-b border-gray-200 text-gray-700 align-middle"
            >
              <div class="flex flex-col">
                <span class="text-base font-mono text-slate-600 font-semibold">
                  {{ pre.presentacion_tipo }}
                </span>
                <span class="text-xs text-slate-400">
                  {{ formatDate(pre.presentacion_fecha, "dd/LL/yy hh:mm a") }}
                </span>
              </div>
            </td>
            <td
              class="px-4 py-2 border-b border-gray-200 font-mono text-gray-600 text-xl"
            >
              {{ pre.presentacion_codigo_barras }}
            </td>
            <td
              class="px-4 py-2 border-b border-gray-200 text-gray-700 text-center text-xl font-mono"
            >
              {{ pre.presentacion_cantidad }}
            </td>
          </tr>
          <tr v-else class="text-center text-slate-600">
            <td colspan="3" class="text-sm font-medium py-2">
              Sin presentaciones
            </td>
          </tr>
        </template>
        <tr v-else>
          <td colspan="3">
            <p class="text-slate-400 font-medium text-center py-5 text-md">
              Sin productos, Selecciona productos a obtener y presiona obtener
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import RegistroProducto from "./RegistroProducto.vue";

import { useApi } from "../composables/useApi";
import { formatDate } from "../utils/general";
import { Check, Menu } from "lucide-vue-next";
import { useModalStore } from "../stores/modalStore";
import { IProductoConPresentaciones } from "../types/responses";

defineProps<{ productos: IProductoConPresentaciones[] }>();

const modalStore = useModalStore();

const handleModal = (prod: IProductoConPresentaciones) => {
  modalStore.openModal(RegistroProducto, {
    title: "Gestión de producto",
    width: "lg",
    props: {
      prod: prod,
    },
  });
};

const { apiFetch, loading } = useApi();

const handleToggleState = async (prod: IProductoConPresentaciones) => {
  await apiFetch("/producto/estatus", {
    method: "PUT",
    body: { id: prod.producto_ID },
  });
};
</script>
