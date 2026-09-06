import express from "express";

import {
  getDashboardStats,
  getApplications,
  getApplicationById,
  reviewApplication,
  allotSeat,
  verifyCollege,
  getStudents,
} from "../controllers/adminController.js";

import {
  protect,
  adminOnly,
} from "../middleware/auth.js";

const router = express.Router();

/* =========================================================
   ADMIN SECURITY
========================================================= */

router.use(protect);
router.use(adminOnly);

/* =========================================================
   DASHBOARD
========================================================= */

// GET /api/admin/dashboard
router.get(
  "/dashboard",
  getDashboardStats
);

/* =========================================================
   APPLICATION MANAGEMENT
========================================================= */

// GET /api/admin/applications
router.get(
  "/applications",
  getApplications
);

// GET /api/admin/applications/:id
router.get(
  "/applications/:id",
  getApplicationById
);

// PATCH /api/admin/applications/:id/review
router.patch(
  "/applications/:id/review",
  reviewApplication
);

// PATCH /api/admin/applications/:id/allot
router.patch(
  "/applications/:id/allot",
  allotSeat
);

/* =========================================================
   STUDENT MANAGEMENT
========================================================= */

// GET /api/admin/students
router.get(
  "/students",
  getStudents
);

/* =========================================================
   COLLEGE DATA
========================================================= */

// PATCH /api/admin/colleges/:id/verify
router.patch(
  "/colleges/:id/verify",
  verifyCollege
);

export default router;
