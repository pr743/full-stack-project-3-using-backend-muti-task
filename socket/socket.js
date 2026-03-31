import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);


    socket.on("join", (taskId) => {
      socket.join(taskId);
      console.log("User joined room:", taskId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};