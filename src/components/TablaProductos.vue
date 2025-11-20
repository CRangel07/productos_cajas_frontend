<template>
  <div class="grow h-[80vh] relative">
    <form
      @submit.prevent="emit('buscarProducto', busqueda)"
      class="mb-3 flex flex-wrap max-w-[500px] gap-2"
    >
      <input
        type="text"
        class="border lg:py-1.5 lg:px-4 py-0.5 px-2 rounded-lg border-slate-500 grow focus:border-blue-500 outline-none tracking-wider placeholder:font-normal text-slate-700"
        placeholder="Buscar por nombre o código"
        v-model="busqueda"
      />
      <button
        type="submit"
        class="bg-blue-500 rounded text-blue-50 font-medium cursor-pointer px-2"
      >
        Buscar
      </button>
    </form>
    <div class="overflow-auto h-full">
      <table
        class="w-full border text-xs md:text-sm lg:text-base border-slate-300 shadow-lg rounded-lg overflow-hidden"
      >
        <thead class="sticky top-0 z-10">
          <tr>
            <th
              colspan="3"
              class="bg-gradient-to-r from-slate-800 to-slate-600 text-slate-50 py-3 px-4 font-bold text-center tracking-wide text-sm lg:text-base uppercase"
            >
              Tabla de productos
            </th>
          </tr>
          <tr
            class="bg-gradient-to-r from-slate-800 to-slate-600 text-slate-50 uppercase"
          >
            <th class="py-2 px-3 text-xs md:text-sm lg:text-base">Unidad</th>
            <th class="py-2 px-3 text-xs md:text-sm lg:text-base">Código</th>
            <th class="py-2 px-3 text-xs md:text-sm lg:text-base">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(p, i) in productos" :key="p.producto_ID">
            <!-- Fila de título del producto -->
            <tr :class="i % 2 === 0 ? 'bg-indigo-200' : 'bg-pink-200'">
              <td
                colspan="3"
                class="py-3 px-3 uppercase font-semibold text-lg relative text-slate-800"
              >
                <div class="flex justify-between items-center">
                  <p class="flex flex-col">
                    <span class="text-sm lg:text-lg">
                      {{ p.producto_descripcion }}
                    </span>
                    <span
                      v-if="!!p.producto_listo"
                      class="bg-orange-400 select-none text-white w-[100px] text-center px-5 py-1 rounded-md my-2"
                    >
                      LISTO
                    </span>
                  </p>

                  <div class="flex flex-col items-center">
                    <!-- Botones -->
                    <div class="flex gap-1 mb-1.5">
                      <button
                        v-if="editando !== p.producto_ID"
                        title="Editar producto"
                        type="button"
                        class="border py-0.5 lg:px-3 px-1 rounded-lg bg-yellow-400 border-yellow-500 cursor-pointer active:scale-95"
                        @click="handleClick(true, p)"
                      >
                        <Pencil
                          :size="18"
                          :stroke-width="3"
                          class="text-yellow-900"
                        />
                      </button>
                      <button
                        v-if="editando === p.producto_ID"
                        title="Cancelar Edición"
                        type="button"
                        class="border py-0.5 lg:px-3 px-1 rounded-lg bg-orange-400 border-orange-500 cursor-pointer active:scale-95"
                        @click="handleClick(false, p)"
                      >
                        <XCircle
                          :size="18"
                          :stroke-width="3"
                          class="text-yellow-900"
                        />
                      </button>
                      <button
                        v-if="p.producto_ID"
                        title="Eliminar Producto"
                        type="button"
                        class="border py-0.5 lg:px-3 px-1 rounded-lg bg-red-400 border-red-500 cursor-pointer active:scale-95"
                        @click="handleDelete(p)"
                      >
                        <Trash
                          :size="18"
                          :stroke-width="3"
                          class="text-yellow-900"
                        />
                      </button>
                      <button
                        v-if="p.producto_ID"
                        title="Marcar como listo"
                        type="button"
                        class="border py-0.5 lg:px-3 px-1 rounded-lg bg-lime-400 border-lime-500 cursor-pointer active:scale-95"
                        @click="emit('marcarListo', p)"
                      >
                        <Check
                          :size="18"
                          :stroke-width="3"
                          class="text-lime-800"
                        />
                      </button>
                    </div>
                    <p
                      v-if="loadingDelete && eliminando === p.producto_ID"
                      class="text-xs text-slate-600 font-medium"
                    >
                      Eliminando producto...
                    </p>
                    <p
                      v-if="errorDelete && eliminando === p.producto_ID"
                      class="api-error text-xs! w-[500px]!"
                    >
                      {{ errorDelete }}
                    </p>
                    <span class="text-xs lg:text-sm text-slate-500">
                      Pasillo: {{ p.producto_pasillo }} · Piso:
                      {{ p.producto_rack_nivel }}
                    </span>
                  </div>
                </div>
              </td>
            </tr>

            <!-- Filas de presentaciones -->
            <tr
              :key="pre.presentacion_ID"
              v-for="pre in p.presentaciones"
              :class="i % 2 === 0 ? 'bg-indigo-50/70' : 'bg-pink-100/50'"
              class="hover:bg-slate-50 transition-colors"
            >
              <td
                class="py-2 px-3 border-t border-r border-slate-200 text-center text-xs md:text-sm lg:text-base font-medium text-slate-800"
              >
                {{ pre.presentacion_tipo }}
              </td>
              <td
                class="py-2 px-3 border-t border-r text-lg lg:text-xl font-extralight text-center border-slate-200 text-slate-800 font-['Consolas']"
              >
                {{ pre.presentacion_codigo_barras }}
              </td>
              <td
                class="py-2 px-3 border-t text-xs md:text-sm lg:text-base border-slate-200 text-center font-medium text-slate-800"
              >
                {{ pre.presentacion_cantidad }} pz
              </td>
            </tr>
          </template>
          <!-- Empty State -->
          <tr v-if="!productos.length">
            <td
              colspan="3"
              class="text-center font-medium text-orange-500 py-5"
            >
              No se encontraron productos
              {{ busqueda ? "para " + busqueda : "" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAlert } from "../composables/useAlert";
import { ref, watch } from "vue";
import { formatDate } from "../utils/general";
import { Check, Pencil, Trash, XCircle } from "lucide-vue-next";
import { IProductoConPresentaciones } from "../types/responses";

const alertas = useAlert();
const busqueda = ref<string>("");
const editando = ref<string>("");
const eliminando = ref<string>("");

const props = defineProps<{
  productos: IProductoConPresentaciones[];
  loadingDelete: boolean;
  errorDelete: string | null;
  reset: boolean;
}>();

const emit = defineEmits<{
  (e: "editarProducto", prod: IProductoConPresentaciones): void;
  (e: "marcarListo", prod: IProductoConPresentaciones): void;
  (e: "eliminarProducto", prod: IProductoConPresentaciones): void;
  (e: "buscarProducto", busqueda: string): void;
  (e: "cancelarEdicion"): void;
}>();

const handleClick = (flag: boolean, p?: IProductoConPresentaciones) => {
  editando.value = flag ? p!.producto_ID : "";
  if (editando.value) {
    emit("editarProducto", p!);
  } else {
    emit("cancelarEdicion");
  }
};

const handleDelete = async (p: IProductoConPresentaciones) => {
  const userRes = await alertas.confirm({
    text: `¿Estás seguro que deseas eliminar ${p.producto_descripcion} definitivamente?`,
  });

  editando.value = "";
  eliminando.value = p.producto_ID;

  if (userRes.isConfirmed) {
    emit("eliminarProducto", p);
  }
};

watch(
  () => props.reset,
  () => {
    eliminando.value = "";
    editando.value = "";
  }
);
</script>
