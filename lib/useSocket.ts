"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    if (!socket) {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";
      
      socket = io(socketUrl, {
        path: "/api/socketio",
        transports: ["websocket", "polling"],
      });

      socket.on("connect", () => {
        console.log("Socket connected");
        setIsConnected(true);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
      });

      socket.on("error", (error) => {
        console.error("Socket error:", error);
      });
    }

    return () => {
      // Don't disconnect on unmount to maintain connection across components
    };
  }, []);

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
