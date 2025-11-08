import { useSocket } from "../composables/useSocket";
import { useSocketStore } from "../stores/useSocketStore";

export const setupSocketHandlers = () => {
  const { socket } = useSocket();
  const store = useSocketStore();

  // Solo configurar una vez
  if (socket.hasListeners("notificacion")) return;

  socket.on("notificacion", (msg: string) => {
    store.agregarNotificacion(msg);
  });
};
