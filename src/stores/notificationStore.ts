import { ref } from "vue";
import { defineStore } from "pinia";
import { INotificacion } from "../types/components";

export const useNotificacionStore = defineStore(
  "regp_store_notifications",
  () => {
    const notificaciones = ref<INotificacion[]>([]);

    const pushNoti = (noti: INotificacion) => {
      if (notificaciones.value.length > 100) {
        notificaciones.value.pop();
      }
      notificaciones.value.unshift(noti);
    };

    const cleanAll = () => {
      notificaciones.value = [];
    };

    return { notificaciones, pushNoti, cleanAll };
  },
  { persist: true }
);
