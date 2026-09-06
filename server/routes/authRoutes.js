import express from "express";

import {
  register,
  login,
  getMe,
  updateProfile,
} from "../controllers/authController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

/* =========================================================
   PUBLIC AUTH ROUTES
========================================================= */

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

/* =========================================================
   PROTECTED USER ROUTES
========================================================= */

// GET /api/auth/me
router.get("/me", protect, getMe);

// PUT /api/auth/profile
router.put("/profile", protect, updateProfile);

export default router;
