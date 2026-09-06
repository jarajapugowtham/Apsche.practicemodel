import express from "express";

import {
  getColleges,
  getCollegeById,
  searchColleges,
  getCollegeBranches,
  getCollegeFees,
  getCollegeCutoffs,
  getDistricts,
  getBranchCodes,
} from "../controllers/collegeController.js";

const router = express.Router();

/* =========================================================
   COLLEGE DISCOVERY
========================================================= */

// GET /api/colleges
router.get("/", getColleges);

// GET /api/colleges/search?q=cse
router.get("/search", searchColleges);

// GET /api/colleges/districts
router.get("/districts", getDistricts);

// GET /api/colleges/branches
router.get("/branches", getBranchCodes);

/* =========================================================
   SINGLE COLLEGE
========================================================= */

// GET /api/colleges/:id
router.get("/:id", getCollegeById);

// GET /api/colleges/:id/branches
router.get("/:id/branches", getCollegeBranches);

// GET /api/colleges/:id/fees
router.get("/:id/fees", getCollegeFees);

// GET /api/colleges/:id/cutoffs
router.get("/:id/cutoffs", getCollegeCutoffs);

export default router;
