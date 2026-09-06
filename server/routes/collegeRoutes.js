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
   FILTER / LIST ROUTES
========================================================= */

// GET /api/colleges/districts/list
router.get(
  "/districts/list",
  getDistricts
);

// GET /api/colleges/branches/list
router.get(
  "/branches/list",
  getBranches
);

/* =========================================================
   COLLEGE SEARCH
========================================================= */

// GET /api/colleges
//
// Examples:
// /api/colleges
// /api/colleges?district=Visakhapatnam
// /api/colleges?branch=CSE
// /api/colleges?search=Andhra
// /api/colleges?year=2025
router.get(
  "/",
  getColleges
);

/* =========================================================
   SINGLE COLLEGE DATA
========================================================= */

// GET /api/colleges/:id
router.get(
  "/:id",
  getCollegeById
);

// GET /api/colleges/:id/cutoffs
router.get(
  "/:id/cutoffs",
  getCollegeCutoffs
);

// GET /api/colleges/:id/fees
router.get(
  "/:id/fees",
  getCollegeFees
);

export default router;
