import { Server } from "socket.io";

let io;
// Move userSocketMap outside the function so it can be accessed by getReceiverSocketId
const userSocketMap = {};

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    console.log("Received userId:", userId);

    if (userId) {
      userSocketMap[userId] = socket.id;

      // Emit immediately
      io.emit("getOnlineUsers", Object.keys(userSocketMap));

      // Emit again after 500ms to avoid race condition
      setTimeout(() => {
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      }, 500);
    }

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });

  return io;
}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export { io };
