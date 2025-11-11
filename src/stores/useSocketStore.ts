import { ref } from "vue";
// src/stores/useSocketStore.ts
import { defineStore } from "pinia";
import { IPresentacion, IProductos } from "../types/db";
import { IProductoConPresentaciones } from "../types/responses";

export const useSocketStore = defineStore("regp_socket_store", () => {
  const presentacionGuardada = ref<{
    presentacion: IPresentacion;
    producto: string;
    productoData: IProductoConPresentaciones;
    message: string;
  } | null>(null);

  const presentacionEliminada = ref<{
    presentacion: IPresentacion & Pick<IProductos, "producto_descripcion">;
    message: string;
  } | null>(null);

  const productoStateActualizado = ref<{
    producto: IProductos;
    status: 1 | 0;
  } | null>(null);

  return {
    presentacionGuardada,
    presentacionEliminada,
    productoStateActualizado,
  };
});
