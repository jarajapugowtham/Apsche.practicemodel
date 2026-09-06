import express from "express";

import {
  createApplication,
  getMyApplication,
  updateApplication,
  addPreference,
  removePreference,
  reorderPreferences,
  lockPreferences,
  submitApplication,
  getAllotment,
} from "../controllers/applicationController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

/* =========================================================
   ALL APPLICATION ROUTES REQUIRE LOGIN
========================================================= */

router.use(protect);

/* =========================================================
   APPLICATION
========================================================= */

// Create / start counselling application
router.post(
  "/",
  createApplication
);

// Get logged-in student's application
router.get(
  "/me",
  getMyApplication
);

// Update student/application details
router.put(
  "/me",
  updateApplication
);

/* =========================================================
   COLLEGE PREFERENCES
========================================================= */

// Add college + branch preference
router.post(
  "/me/preferences",
  addPreference
);

// Remove a preference
router.delete(
  "/me/preferences/:preferenceNo",
  removePreference
);

// Reorder preferences
router.patch(
  "/me/preferences/reorder",
  reorderPreferences
);

// Lock selected college/branch options
router.patch(
  "/me/preferences/lock",
  lockPreferences
);

/* =========================================================
   SUBMIT COUNSELLING APPLICATION
========================================================= */

// Final application submission
router.post(
  "/me/submit",
  submitApplication
);

/* =========================================================
   SEAT ALLOTMENT
========================================================= */

// View student's allotment
router.get(
  "/me/allotment",
  getAllotment
);

export default router;
