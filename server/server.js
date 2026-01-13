const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/database");

const app = express();

/* ========================= DATABASE ========================= */
connectDB();

/* ========================= MIDDLEWARE ========================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

console.log("Setting up CORS...");
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://gigflow-frontend-lcjv.onrender.com"  // Your frontend[web:23]
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

/* ========================= ROUTES ========================= */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/gigs", require("./routes/gigs"));
app.use("/api/bids", require("./routes/bids"));
app.use("/api/messages", require("./routes/messages"));

/* ========================= HEALTH CHECK ========================= */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GigFlow API running 🚀",
    timestamp: new Date().toISOString(),
  });
});

/* ========================= 404 HANDLER ========================= */
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

/* ========================= ERROR HANDLER ========================= */
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

/* ========================= SERVER START ========================= */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* ========================= SOCKET.IO (Render Optimized) ========================= */
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
    pingInterval: 25000,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-user-room", (userId) => {
    if (!userId) return;
    socket.join(`user_${userId}`);
    console.log(`Socket ${socket.id} joined user_${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

/* ========================= PROCESS HANDLERS ========================= */
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
