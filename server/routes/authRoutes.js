import express from "express";

import {
  register,
  login,
  getMe,
} from "../controllers/authController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

/* =========================================================
   REGISTER
========================================================= */

// POST /api/auth/register
router.post(
  "/register",
  register
);

/* =========================================================
   LOGIN
========================================================= */

// POST /api/auth/login
router.post(
  "/login",
  login
);

/* =========================================================
   CURRENT USER
========================================================= */

// GET /api/auth/me
router.get(
  "/me",
  protect,
  getMe
);

/* =========================================================
   EXPORT
========================================================= */

export default router;
