
import { io } from "socket.io-client";

const SOCKET_URL =import.meta.env.VITE_API_URL;
export const socket = io(SOCKET_URL);

export const joinDoctorRoom = (doctorId) => {
  socket.emit("joinDoctorRoom", doctorId);
};

export const subscribeToQueueUpdates = (cb) => {
  socket.on("queueUpdated", cb);
};
