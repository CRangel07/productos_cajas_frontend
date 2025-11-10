import { useSocket } from "../composables/useSocket";
import { useSocketStore } from "../stores/useSocketStore";

export const setupSocketHandlers = () => {
  const { socket } = useSocket();
  const store = useSocketStore();

  if (!socket.hasListeners("presentacionGuardada")) {
    socket.on("presentacionGuardada", (data) => {
      store.presentacionGuardada = data;
    });
  }
};
