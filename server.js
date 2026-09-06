import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import collegeRoutes from "./routes/collegeRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

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
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.use(express.json());

/* =========================================================
   ROOT
========================================================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    project: "APSCHE Practice Model",
    message:
      "APSCHE Full Stack API is running",
    version: "1.0.0",
  });
});

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "APSCHE Backend",
    database: process.env.MONGODB_URI
      ? "configured"
      : "not configured",
    timestamp:
      new Date().toISOString(),
  });
});

/* =========================================================
   API ROUTES
========================================================= */

// Authentication
app.use(
  "/api/auth",
  authRoutes
);

// Colleges
app.use(
  "/api/colleges",
  collegeRoutes
);

// Counselling applications
app.use(
  "/api/applications",
  applicationRoutes
);

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message:
      `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use(
  (err, req, res, next) => {
    console.error(
      "Server error:",
      err
    );

    res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
);

/* =========================================================
   START SERVER
========================================================= */

app.listen(PORT, () => {
  console.log(
    `🚀 APSCHE Backend running on port ${PORT}`
  );
});
