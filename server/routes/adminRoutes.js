import express from "express";

import {
  getDashboard,
  getApplications,
  getApplicationById,
  reviewApplication,
  allotSeat,
  verifyCollege,
} from "../controllers/adminController.js";

import {
  protect,
  adminOnly,
} from "../middleware/auth.js";

const router = express.Router();

/* =========================================================
   ALL ADMIN ROUTES
========================================================= */

router.use(protect);
router.use(adminOnly);

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

// GET /api/admin/dashboard
router.get(
  "/dashboard",
  getDashboard
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

/* =========================================================
   SEAT ALLOTMENT
========================================================= */

// PATCH /api/admin/applications/:id/allot
router.patch(
  "/applications/:id/allot",
  allotSeat
);

/* =========================================================
   COLLEGE DATA VERIFICATION
========================================================= */

// PATCH /api/admin/colleges/:id/verify
router.patch(
  "/colleges/:id/verify",
  verifyCollege
);

/* =========================================================
   EXPORT
========================================================= */

export default router;
