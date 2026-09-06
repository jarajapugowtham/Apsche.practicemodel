import express from "express";

import {
  createApplication,
  getMyApplication,
  updateStudentDetails,
  savePreferences,
  lockPreferences,
  submitApplication,
} from "../controllers/applicationController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

/* =========================================================
   ALL APPLICATION ROUTES REQUIRE LOGIN
========================================================= */

router.use(protect);

/* =========================================================
   CREATE APPLICATION
========================================================= */

// POST /api/applications
router.post(
  "/",
  createApplication
);

/* =========================================================
   GET MY APPLICATION
========================================================= */

// GET /api/applications/me
router.get(
  "/me",
  getMyApplication
);

/* =========================================================
   UPDATE STUDENT DETAILS
========================================================= */

// PATCH /api/applications/:id/details
router.patch(
  "/:id/details",
  updateStudentDetails
);

/* =========================================================
   SAVE COLLEGE PREFERENCES
========================================================= */

// PATCH /api/applications/:id/preferences
router.patch(
  "/:id/preferences",
  savePreferences
);

/* =========================================================
   LOCK PREFERENCES
========================================================= */

// PATCH /api/applications/:id/lock
router.patch(
  "/:id/lock",
  lockPreferences
);

/* =========================================================
   SUBMIT APPLICATION
========================================================= */

// PATCH /api/applications/:id/submit
router.patch(
  "/:id/submit",
  submitApplication
);

/* =========================================================
   EXPORT
========================================================= */

export default router;
