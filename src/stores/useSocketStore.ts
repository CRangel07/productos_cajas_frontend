// src/stores/useSocketStore.ts
import { ref } from "vue";
import { defineStore } from "pinia";

export const useSocketStore = defineStore("regp_socket_store", () => {
  const notificaciones = ref<string[]>([]);
  const productosActualizados = ref<any[]>([]);

  const agregarNotificacion = (mensaje: string) => {
    notificaciones.value.unshift(mensaje);
  };

  return {
    notificaciones,
    productosActualizados,
    agregarNotificacion,
  };
});
