import express from "express";

import {
  getMyApplication,
  updateStudentDetails,
  addPreference,
  removePreference,
  reorderPreferences,
  submitApplication,
  lockPreferences,
  getApplicationStatus,
} from "../controllers/applicationController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

/* =========================================================
   ALL COUNSELLING ROUTES REQUIRE LOGIN
========================================================= */

router.use(protect);

/* =========================================================
   APPLICATION
========================================================= */

// Get or create student's counselling application
// GET /api/applications/me
router.get("/me", getMyApplication);

// Get application status
// GET /api/applications/status
router.get("/status", getApplicationStatus);

/* =========================================================
   STUDENT DETAILS
========================================================= */

// Save/update student details
// PUT /api/applications/student
router.put("/student", updateStudentDetails);

/* =========================================================
   COLLEGE PREFERENCES
========================================================= */

// Add college + branch preference
// POST /api/applications/preferences
router.post("/preferences", addPreference);

// Remove a preference
// DELETE /api/applications/preferences/:preferenceId
router.delete(
  "/preferences/:preferenceId",
  removePreference
);

// Change preference order
// PUT /api/applications/preferences/reorder
router.put(
  "/preferences/reorder",
  reorderPreferences
);

/* =========================================================
   COUNSELLING ACTIONS
========================================================= */

// Lock selected preferences
// POST /api/applications/lock
router.post("/lock", lockPreferences);

// Final application submission
// POST /api/applications/submit
router.post("/submit", submitApplication);

export default router;
