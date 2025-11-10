import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../types/responses";

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

// Función para inicializar
export const useSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3000", {
      autoConnect: true, // no conectar hasta llamar
      transports: ["websocket"], // fuerza WebSocket evitar polling
      path: "/api/productos/socket.io",
    });

    socket.on("connect", () => {
      console.log("✅ Conectado al servidor Socket.IO", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("⚠️ Desconectado del servidor Socket.IO");
    });
  }

  return { socket };
};
