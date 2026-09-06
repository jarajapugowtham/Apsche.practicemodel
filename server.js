import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import collegeRoutes from "./routes/collegeRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================================================
   DATABASE
========================================================= */

connectDB();

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

/* =========================================================
   ROOT
========================================================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    project: "APSCHE Practice Model",
    message: "APSCHE Full Stack API is running",
    version: "1.0.0",
  });
});

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    service: "APSCHE Backend",
    database: process.env.MONGODB_URI
      ? "configured"
      : "not configured",
    environment:
      process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

/* =========================================================
   API ROUTES
========================================================= */

// Authentication
app.use("/api/auth", authRoutes);

// College discovery
app.use("/api/colleges", collegeRoutes);

// Student counselling applications
app.use(
  "/api/applications",
  applicationRoutes
);

// Admin dashboard & management
app.use(
  "/api/admin",
  adminRoutes
);

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      err.message || "Internal server error",
  });
});

/* =========================================================
   START SERVER
========================================================= */

app.listen(PORT, () => {
  console.log(
    `🚀 APSCHE Backend running on port ${PORT}`
  );

  console.log(
    `📡 API: http://localhost:${PORT}`
  );

  console.log(
    `❤️ Health: http://localhost:${PORT}/api/health`
  );
});
