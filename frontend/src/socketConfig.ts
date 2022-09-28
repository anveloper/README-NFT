import { createContext } from "react";
import io from "socket.io-client";
const socketURL =
  process.env.NODE_ENV !== "production"
    ? process.env.REACT_APP_SOCKET_DEVELOP_URL
    : process.env.REACT_APP_SOCKET_URL;
export const socket = io(socketURL);
export const SocketContext = createContext(socket);
export const SocketProvider = createContext(socket).Provider;
