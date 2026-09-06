import express from "express";

import {
  getColleges,
  getCollegeById,
  getDistricts,
  getBranches,
  getCollegeCutoffs,
  getCollegeFees,
} from "../controllers/collegeController.js";

const router = express.Router();

/* =========================================================
   APSCHE COLLEGE ROUTES
========================================================= */

/*
  IMPORTANT:
  Specific routes MUST come before /:id
  so Express doesn't treat "districts" or "branches"
  as a college ID.
*/

/* =========================================================
   DISTRICTS
========================================================= */

// GET /api/colleges/districts/list
router.get(
  "/districts/list",
  getDistricts
);

/* =========================================================
   BRANCHES
========================================================= */

// GET /api/colleges/branches/list
router.get(
  "/branches/list",
  getBranches
);

/* =========================================================
   COLLEGE SEARCH / FILTER
========================================================= */

// GET /api/colleges
//
// Supported query parameters:
//
// ?search=
// ?district=
// ?city=
// ?type=
// ?branch=
// ?year=2025
// ?verified=true
// ?page=1
// ?limit=20
//
// Examples:
//
// /api/colleges
//
// /api/colleges?district=Visakhapatnam
//
// /api/colleges?branch=CSE
//
// /api/colleges?search=Andhra
//
// /api/colleges?year=2025
//
// /api/colleges?district=Visakhapatnam&branch=CSE

router.get(
  "/",
  getColleges
);

/* =========================================================
   SINGLE COLLEGE
========================================================= */

// GET /api/colleges/:id
//
// Returns complete college information including:
// - College details
// - Location
// - University
// - Branches
// - Fees
// - Cutoffs
// - Accreditation
// - Verification
// - Official source

router.get(
  "/:id",
  getCollegeById
);

/* =========================================================
   COLLEGE CUTOFFS
========================================================= */

// GET /api/colleges/:id/cutoffs
//
// Examples:
//
// /api/colleges/123/cutoffs
//
// /api/colleges/123/cutoffs?year=2025
//
// /api/colleges/123/cutoffs?year=2025&branch=CSE
//
// /api/colleges/123/cutoffs?year=2025&category=OC

router.get(
  "/:id/cutoffs",
  getCollegeCutoffs
);

/* =========================================================
   COLLEGE FEES
========================================================= */

// GET /api/colleges/:id/fees
//
// Examples:
//
// /api/colleges/123/fees
//
// /api/colleges/123/fees?year=2025
//
// /api/colleges/123/fees?year=2025&category=OC

router.get(
  "/:id/fees",
  getCollegeFees
);

/* =========================================================
   EXPORT
========================================================= */

export default router;
