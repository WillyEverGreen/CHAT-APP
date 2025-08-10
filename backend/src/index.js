import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { initializeSocket } from "./lib/socket.js";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize socket.io
const io = initializeSocket(server);

const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log environment info
console.log(
  "Environment variables loaded:",
  Object.keys(process.env).filter((key) =>
    ["NODE_ENV", "PORT", "MONGODB_URI", "JWT_SECRET", "FRONTEND_URL"].includes(
      key
    )
  )
);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    credentials: true,
  })
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// SPA fallback for React Router - use a more specific pattern
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || "Not set"}`);

  // Connect to database without blocking server startup
  connectDB().catch((err) => {
    console.error("Database connection failed:", err.message);
    console.log(
      "Server will continue running but database features may not work"
    );
  });
});

// Add error handling for the server
server.on("error", (error) => {
  console.error("Server error:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});
