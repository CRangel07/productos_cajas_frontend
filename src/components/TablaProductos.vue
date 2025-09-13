<template>
  <div class="grow h-[80vh] relative">
    <div class="mb-3 w-full max-w-[300px]">
      <input
        type="text"
        class="border py-1.5 px-4 rounded-lg border-slate-500 w-full focus:border-blue-500 outline-none"
        placeholder="Buscar por nombre"
      />
    </div>
    <div class="overflow-auto h-full">
      <table
        class="w-full border border-slate-300 shadow-lg rounded-lg overflow-hidden"
      >
        <thead class="sticky top-0 z-10">
          <tr>
            <th
              colspan="3"
              class="bg-gradient-to-r from-slate-800 to-slate-600 text-slate-50 py-3 px-4 text-lg font-bold text-center tracking-wide"
            >
              Tabla de productos
            </th>
          </tr>
          <tr
            class="bg-gradient-to-r from-slate-800 to-slate-600 text-slate-50 uppercase text-sm"
          >
            <th class="py-2 px-3">Unidad</th>
            <th class="py-2 px-3">Código</th>
            <th class="py-2 px-3">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(p, i) in productos" :key="p.producto_ID">
            <!-- Fila de título del producto -->
            <tr :class="i % 2 === 0 ? 'bg-indigo-100' : 'bg-teal-100'">
              <td
                colspan="3"
                class="py-3 px-3 uppercase font-semibold text-lg relative text-slate-800"
              >
                {{ p.producto_descripcion }}
                <span
                  class="font-medium text-xs absolute bottom-1 right-4 text-slate-800"
                >
                  Pasillo: {{ p.producto_pasillo }} · Piso:
                  {{ p.producto_rack_nivel }}
                </span>
              </td>
            </tr>

            <!-- Filas de presentaciones -->
            <tr
              :key="pre.presentacion_ID"
              v-for="pre in p.presentaciones"
              :class="i % 2 === 0 ? 'bg-indigo-50/70' : 'bg-teal-50/50'"
              class="hover:bg-slate-50 transition-colors"
            >
              <td
                class="py-2 px-3 border-t border-r border-slate-200 text-center font-medium text-slate-800"
              >
                {{ pre.presentacion_tipo }}
              </td>
              <td
                class="py-2 px-3 border-t border-r text-xl font-extralight text-center border-slate-200 text-slate-800 font-['Consolas']"
              >
                {{ pre.presentacion_codigo_barras }}
              </td>
              <td
                class="py-2 px-3 border-t border-slate-200 text-center font-medium text-slate-800"
              >
                {{ pre.presentacion_cantidad }} pz
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IProductoConPresentaciones } from "../types/responses";

defineProps<{ productos: IProductoConPresentaciones[] }>();
</script>
