import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "../config/db.js";
import College from "../models/College.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(
  __dirname,
  "../data/colleges-2025.json"
);

/*
  IMPORTANT:
  This importer does not invent college information.

  Only records present in the JSON file are imported.
  Each record should contain its source and verification
  information.
*/

const validateCollege = (college) => {
  const required = [
    "collegeCode",
    "name",
    "district",
  ];

  for (const field of required) {
    if (!college[field]) {
      throw new Error(
        `Missing required field: ${field}`
      );
    }
  }

  if (
    !Array.isArray(college.branches)
  ) {
    throw new Error(
      `${college.collegeCode}: branches must be an array`
    );
  }

  return true;
};

const normalizeCollege = (college) => ({
  ...college,

  collegeCode: String(
    college.collegeCode
  )
    .trim()
    .toUpperCase(),

  name: String(college.name).trim(),

  shortName: college.shortName
    ? String(college.shortName).trim()
    : "",

  district: String(
    college.district
  ).trim(),

  city: college.city
    ? String(college.city).trim()
    : "",

  dataYear: String(
    college.dataYear || "2025"
  ),

  verified:
    college.verified === true,

  active:
    college.active !== false,

  status:
    college.status || "Active",
});

const importColleges = async () => {
  try {
    console.log(
      "🔌 Connecting to MongoDB..."
    );

    await connectDB();

    console.log(
      "📂 Reading college data..."
    );

    const rawData =
      await fs.readFile(
        DATA_FILE,
        "utf8"
      );

    const colleges =
      JSON.parse(rawData);

    if (!Array.isArray(colleges)) {
      throw new Error(
        "College data must be a JSON array"
      );
    }

    console.log(
      `📊 Found ${colleges.length} college records`
    );

    let inserted = 0;
    let updated = 0;

    for (const rawCollege of colleges) {
      validateCollege(rawCollege);

      const college =
        normalizeCollege(rawCollege);

      const existing =
        await College.findOne({
          collegeCode:
            college.collegeCode,
        });

      if (existing) {
        await College.updateOne(
          {
            collegeCode:
              college.collegeCode,
          },
          {
            $set: college,
          }
        );

        updated++;

        console.log(
          `♻️ Updated: ${college.collegeCode} - ${college.name}`
        );
      } else {
        await College.create(
          college
        );

        inserted++;

        console.log(
          `✅ Imported: ${college.collegeCode} - ${college.name}`
        );
      }
    }

    console.log("\n==============================");
    console.log("🎓 APSCHE DATA IMPORT COMPLETE");
    console.log("==============================");
    console.log(
      `📥 Inserted: ${inserted}`
    );
    console.log(
      `♻️ Updated: ${updated}`
    );
    console.log(
      `📊 Total processed: ${colleges.length}`
    );
    console.log("==============================\n");
  } catch (error) {
    console.error(
      "❌ College import failed:",
      error.message
    );

    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

importColleges();
