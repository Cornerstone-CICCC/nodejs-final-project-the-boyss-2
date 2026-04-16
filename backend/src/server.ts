import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import authRoutes from "./routes/auth.routes";
import tweetRoutes from "./routes/tweet.routes";
import userRoutes from "./routes/user.routes";
import { setupSocketHandlers } from "./socket/tweet.socket";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// CORS - shared between Express and Socket.IO
const corsOptions = {
  origin: ["http://localhost:4321", "http://127.0.0.1:4321"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const io = new SocketIOServer(server, { cors: corsOptions });

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tweets", tweetRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "API is running" });
});

// Global error handler (preserves CORS headers)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Socket.IO
setupSocketHandlers(io);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
