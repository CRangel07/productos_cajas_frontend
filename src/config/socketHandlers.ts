import { useSocket } from "../composables/useSocket";
import { useNotificacionStore } from "../stores/notificationStore";
import { useSocketStore } from "../stores/useSocketStore";
import { getFecha } from "../utils/general";

export const setupSocketHandlers = () => {
  const { socket } = useSocket();
  const store = useSocketStore();
  const notiStore = useNotificacionStore();
  if (!socket.hasListeners("presentacionGuardada")) {
    socket.on("presentacionGuardada", (data) => {
      const message = `Se guardó presentacion ${data.presentacion.presentacion_tipo} para ${data.productoData.producto_descripcion} en linea ${data.productoData.linea_descripcion}`;
      // Store
      store.presentacionGuardada = {
        ...data,
        message,
      };
      // Notificacion Store
      notiStore.pushNoti({
        id: getFecha().toUnixInteger().toString(),
        texto: message,
        tipo: "INFO",
        time: getFecha().toFormat("ccc dd/LL/yy hh:mm a"),
      });
    });
  }
};
