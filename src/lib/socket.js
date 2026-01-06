import { io } from "socket.io-client";

// If in dev, connect to localhost:3000
const SOCKET_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://halal-grocery-shop.vercel.app";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
