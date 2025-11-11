import { useSocket } from "../composables/useSocket";
import { useNotificacionStore } from "../stores/notificationStore";
import { useSocketStore } from "../stores/useSocketStore";
import { getFecha } from "../utils/general";

export const setupSocketHandlers = () => {
  const { socket } = useSocket();
  const store = useSocketStore();
  const notiStore = useNotificacionStore();

  const cleanStates = () => {
    store.presentacionEliminada = null;
    store.presentacionGuardada = null;
    store.productoStateActualizado = null;
  };

  if (!socket.hasListeners("presentacionGuardada")) {
    socket.on("presentacionGuardada", (data) => {
      cleanStates();
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

  if (!socket.hasListeners("presentacionEliminada")) {
    cleanStates();
    socket.on("presentacionEliminada", (data) => {
      const message = `Se eliminó presentacion ${data.presentacion.presentacion_tipo} para ${data.presentacion.producto_descripcion}`;
      // Store
      store.presentacionEliminada = {
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

  if (!socket.hasListeners("productoStatus")) {
    socket.on("productoStatus", (data) => {
      cleanStates();
      store.productoStateActualizado = data;
      notiStore.pushNoti({
        id: getFecha().toUnixInteger().toString(),
        texto: `Se marcaron los codigos de ${data.producto.producto_descripcion} como ${!!data.status ? 'LISTOS': 'NO LISTOS'}`,
        tipo: "INFO",
        time: getFecha().toFormat("ccc dd/LL/yy hh:mm a"),
      });
    });
  }
};
