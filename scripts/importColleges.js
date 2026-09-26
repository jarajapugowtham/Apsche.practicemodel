import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

import College from "../models/College.js";
import connectDB from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.resolve(
  __dirname,
  "../data/colleges-2025.json"
);

const COUNSELLING_YEAR = "2025";

/* =========================================================
   HELPERS
========================================================= */

const cleanString = (value, fallback = "") => {
  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value).trim();
};

const cleanUpper = (value) => {
  return cleanString(value).toUpperCase();
};

const cleanNumber = (value, fallback = 0) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
};

const cleanBoolean = (
  value,
  fallback = false
) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized =
      value.trim().toLowerCase();

    if (
      ["true", "yes", "1"].includes(
        normalized
      )
    ) {
      return true;
    }

    if (
      ["false", "no", "0"].includes(
        normalized
      )
    ) {
      return false;
    }
  }

  return fallback;
};

/* =========================================================
   BRANCH
========================================================= */

const normalizeBranch = (branch) => {
  if (!branch || typeof branch !== "object") {
    return null;
  }

  const code = cleanUpper(
    branch.code ??
      branch.branchCode ??
      branch.codeName
  );

  const name = cleanString(
    branch.name ??
      branch.branchName ??
      branch.title
  );

  if (!code || !name) {
    return null;
  }

  return {
    code,
    name,

    intake: cleanNumber(
      branch.intake ??
        branch.seats ??
        branch.capacity,
      0
    ),

    durationYears: cleanNumber(
      branch.durationYears ??
        branch.duration ??
        4,
      4
    ),

    active: cleanBoolean(
      branch.active,
      true
    ),
  };
};

/* =========================================================
   FEES
========================================================= */

const normalizeFee = (fee) => {
  if (!fee || typeof fee !== "object") {
    return null;
  }

  return {
    academicYear: cleanString(
      fee.academicYear ??
        fee.year ??
        COUNSELLING_YEAR
    ),

    category: cleanString(
      fee.category ??
        fee.type ??
        "General"
    ),

    tuitionFee: cleanNumber(
      fee.tuitionFee ??
        fee.tuition ??
        0,
      0
    ),

    otherFee: cleanNumber(
      fee.otherFee ??
        fee.other ??
        0,
      0
    ),
  };
};

/* =========================================================
   CUTOFF
========================================================= */

const normalizeCutoff = (cutoff) => {
  if (!cutoff || typeof cutoff !== "object") {
    return null;
  }

  return {
    academicYear: cleanString(
      cutoff.academicYear ??
        cutoff.year ??
        COUNSELLING_YEAR
    ),

    category: cleanString(
      cutoff.category ??
        "General"
    ),

    gender: cleanString(
      cutoff.gender ??
        "All"
    ),

    branchCode: cleanUpper(
      cutoff.branchCode ??
        cutoff.branch ??
        ""
    ),

    lastRank: cleanNumber(
      cutoff.lastRank ??
        cutoff.rank ??
        0,
      0
    ),
  };
};

/* =========================================================
   COLLEGE
========================================================= */

const normalizeCollege = (
  raw,
  index
) => {
  if (
    !raw ||
    typeof raw !== "object"
  ) {
    throw new Error(
      `Record ${index + 1} is not a valid object.`
    );
  }

  const collegeCode = cleanUpper(
    raw.collegeCode ??
      raw.code ??
      raw.college_code
  );

  const name = cleanString(
    raw.name ??
      raw.collegeName ??
      raw.college_name
  );

  if (!collegeCode) {
    throw new Error(
      `Record ${index + 1}: collegeCode is required.`
    );
  }

  if (!name) {
    throw new Error(
      `Record ${index + 1}: college name is required.`
    );
  }

  const branches =
    Array.isArray(raw.branches)
      ? raw.branches
          .map(normalizeBranch)
          .filter(Boolean)
      : [];

  const fees =
    Array.isArray(raw.fees)
      ? raw.fees
          .map(normalizeFee)
          .filter(Boolean)
      : [];

  const cutoffs =
    Array.isArray(raw.cutoffs)
      ? raw.cutoffs
          .map(normalizeCutoff)
          .filter(Boolean)
      : [];

  return {
    collegeCode,

    name,

    shortName: cleanString(
      raw.shortName ??
        raw.short_name ??
        ""
    ),

    type: cleanString(
      raw.type ??
        "Engineering College"
    ),

    district: cleanString(
      raw.district
    ),

    city: cleanString(
      raw.city
    ),

    university: cleanString(
      raw.university
    ),

    address: cleanString(
      raw.address
    ),

    website: cleanString(
      raw.website
    ),

    branches,

    fees,

    cutoffs,

    verified: cleanBoolean(
      raw.verified,
      false
    ),

    active: cleanBoolean(
      raw.active,
      true
    ),

    counsellingYear:
      cleanString(
        raw.counsellingYear ??
          raw.year ??
          COUNSELLING_YEAR
      ),
  };
};

/* =========================================================
   LOAD DATA
========================================================= */

const loadCollegeData =
  async () => {
    let fileContents;

    try {
      fileContents =
        await fs.readFile(
          DATA_FILE,
          "utf8"
        );
    } catch (error) {
      throw new Error(
        `Unable to read colleges-2025.json: ${error.message}`
      );
    }

    let parsed;

    try {
      parsed =
        JSON.parse(
          fileContents
        );
    } catch (error) {
      throw new Error(
        `Invalid JSON in colleges-2025.json: ${error.message}`
      );
    }

    if (!Array.isArray(parsed)) {
      throw new Error(
        "colleges-2025.json must contain a JSON array."
      );
    }

    return parsed;
  };

/* =========================================================
   DUPLICATE CHECK
========================================================= */

const validateDuplicates = (
  colleges
) => {
  const codes = new Set();

  for (
    let index = 0;
    index < colleges.length;
    index += 1
  ) {
    const code =
      colleges[index]
        .collegeCode;

    if (codes.has(code)) {
      throw new Error(
        `Duplicate collegeCode found: ${code}`
      );
    }

    codes.add(code);
  }
};

/* =========================================================
   IMPORT
========================================================= */

const importColleges =
  async () => {
    console.log(
      "========================================"
    );

    console.log(
      " APSCHE COLLEGE DATA IMPORTER"
    );

    console.log(
      "========================================"
    );

    console.log(
      `Data file: ${DATA_FILE}`
    );

    const rawColleges =
      await loadCollegeData();

    console.log(
      `Records found: ${rawColleges.length}`
    );

    /*
     * Safety:
     * Never wipe the database when
     * the JSON file is empty.
     */

    if (
      rawColleges.length === 0
    ) {
      console.log("");

      console.log(
        "No college records found."
      );

      console.log(
        "Import cancelled."
      );

      console.log(
        "Database was NOT changed."
      );

      console.log(
        "Add verified data to:"
      );

      console.log(
        "server/data/colleges-2025.json"
      );

      return;
    }

    const colleges =
      rawColleges.map(
        normalizeCollege
      );

    validateDuplicates(
      colleges
    );

    console.log(
      `Validated records: ${colleges.length}`
    );

    await connectDB();

    console.log(
      "MongoDB connected."
    );

    let inserted = 0;
    let updated = 0;

    for (
      const college of colleges
    ) {
      const existing =
        await College.findOne({
          collegeCode:
            college.collegeCode,
        });

      if (existing) {
        await College.updateOne(
          {
            _id: existing._id,
          },
          {
            $set: college,
          }
        );

        updated += 1;
      } else {
        await College.create(
          college
        );

        inserted += 1;
      }
    }

    console.log("");

    console.log(
      "========================================"
    );

    console.log(
      " IMPORT COMPLETED"
    );

    console.log(
      "========================================"
    );

    console.log(
      `Inserted : ${inserted}`
    );

    console.log(
      `Updated  : ${updated}`
    );

    console.log(
      `Total    : ${colleges.length}`
    );

    console.log(
      `Year     : ${COUNSELLING_YEAR}`
    );

    console.log(
      "========================================"
    );
  };

/* =========================================================
   MAIN
========================================================= */

const main = async () => {
  try {
    await importColleges();

    await mongoose.connection.close();

    console.log(
      "MongoDB connection closed."
    );

    process.exit(0);
  } catch (error) {
    console.error("");

    console.error(
      "College import failed:"
    );

    console.error(
      error.message
    );

    try {
      await mongoose.connection.close();
    } catch {
      // Ignore close errors.
    }

    process.exit(1);
  }
};

main();
