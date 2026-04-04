import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },


    transports: ["websocket", "polling"],


    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    console.log(" User connected:", socket.id);


    socket.on("joinTask", (taskId) => {
      socket.join(taskId);
    });


    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};


export const getIO = () => io;