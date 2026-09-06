import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* =========================================================
   BASIC ROUTES
========================================================= */

app.get("/", (req, res) => {
  res.json({
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
  res.json({
    success: true,
    status: "healthy",
    service: "APSCHE Backend",
    timestamp: new Date().toISOString(),
  });
});

/* =========================================================
   TEMPORARY API ROUTES
   These will be connected to MongoDB/controllers next.
========================================================= */

app.get("/api/colleges", (req, res) => {
  res.json({
    success: true,
    count: 0,
    data: [],
    message: "College database will be connected next.",
  });
});

app.get("/api/branches", (req, res) => {
  res.json({
    success: true,
    count: 0,
    data: [],
  });
});

app.get("/api/cutoffs", (req, res) => {
  res.json({
    success: true,
    count: 0,
    data: [],
  });
});

app.get("/api/fees", (req, res) => {
  res.json({
    success: true,
    count: 0,
    data: [],
  });
});

app.get("/api/counselling", (req, res) => {
  res.json({
    success: true,
    data: {
      status: "Upcoming",
      message: "Official counselling information will be connected here.",
    },
  });
});

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
   ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

/* =========================================================
   START SERVER
========================================================= */

app.listen(PORT, () => {
  console.log(`APSCHE API running on port ${PORT}`);
});
