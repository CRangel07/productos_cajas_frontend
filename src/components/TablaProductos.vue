<template>
  <div class="grow h-[80vh] relative">
    <form
      @submit.prevent="emit('buscarProducto', busqueda)"
      class="mb-3 flex flex-wrap max-w-[500px] gap-2"
    >
      <input
        type="text"
        class="border py-1.5 px-4 rounded-lg border-slate-500 grow focus:border-blue-500 outline-none tracking-wider placeholder:font-normal text-slate-700"
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
                <div class="flex justify-between items-center">
                  <p class="flex flex-col">
                    <span>
                      {{ p.producto_descripcion }}
                    </span>
                    <span class="text-xs text-slate-500">
                      {{ formatDate(p.producto_registro) }}
                    </span>
                  </p>

                  <div class="flex flex-col items-center">
                    <!-- Botones -->
                    <div class="flex gap-1 mb-1.5">
                      <button
                        v-if="editando !== p.producto_ID"
                        title="Editar producto"
                        type="button"
                        class="border py-0.5 px-3 rounded-lg bg-yellow-400 border-yellow-500 cursor-pointer active:scale-95"
                        @click="handleClick(true, p)"
                      >
                        <Pencil
                          :size="20"
                          :stroke-width="3"
                          class="text-yellow-900"
                        />
                      </button>
                      <button
                        v-if="editando === p.producto_ID"
                        title="Cancelar Edición"
                        type="button"
                        class="border py-0.5 px-3 rounded-lg bg-orange-400 border-orange-500 cursor-pointer active:scale-95"
                        @click="handleClick(false, p)"
                      >
                        <XCircle
                          :size="20"
                          :stroke-width="3"
                          class="text-yellow-900"
                        />
                      </button>
                      <button
                        v-if="p.producto_ID"
                        title="Eliminar Producto"
                        type="button"
                        class="border py-0.5 px-3 rounded-lg bg-red-400 border-red-500 cursor-pointer active:scale-95"
                        @click="handleDelete(p)"
                      >
                        <Trash
                          :size="20"
                          :stroke-width="3"
                          class="text-yellow-900"
                        />
                      </button>
                    </div>
                    <p
                      v-if="loadingDelete && eliminando === p.producto_ID"
                      class="text-sm text-slate-600 font-medium"
                    >
                      Eliminando producto...
                    </p>
                    <p
                      v-if="errorDelete && eliminando === p.producto_ID"
                      class="api-error text-xs! w-[500px]!"
                    >
                      {{ errorDelete }}
                    </p>
                    <span class="text-sm text-slate-500">
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
import { useAlert } from "../composables/useAlert";
import { ref, watch } from "vue";
import { formatDate } from "../utils/general";
import { Pencil, Trash, XCircle } from "lucide-vue-next";
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
