import { ref } from "vue";
// src/stores/useSocketStore.ts
import { defineStore } from "pinia";
import { IPresentacion } from "../types/db";
import { IProductoConPresentaciones } from "../types/responses";

export const useSocketStore = defineStore("regp_socket_store", () => {
  const presentacionGuardada = ref<{
    presentacion: IPresentacion;
    producto: string;
    productoData: IProductoConPresentaciones;
    message: string;
  } | null>(null);

  return { presentacionGuardada };
});
