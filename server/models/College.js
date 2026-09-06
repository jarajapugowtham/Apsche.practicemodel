import mongoose from "mongoose";

/* =========================================================
   BRANCH SCHEMA
========================================================= */

const branchSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    intake: {
      type: Number,
      default: null,
      min: 0,
    },

    durationYears: {
      type: Number,
      default: 4,
      min: 1,
    },

    degree: {
      type: String,
      default: "B.Tech",
      trim: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   FEE SCHEMA
========================================================= */

const feeSchema = new mongoose.Schema(
  {
    academicYear: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "GENERAL",
      trim: true,
      uppercase: true,
    },

    tuitionFee: {
      type: Number,
      default: null,
      min: 0,
    },

    otherFee: {
      type: Number,
      default: null,
      min: 0,
    },

    totalFee: {
      type: Number,
      default: null,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      trim: true,
    },

    source: {
      type: String,
      default: "",
      trim: true,
    },

    sourceUrl: {
      type: String,
      default: "",
      trim: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   CUTOFF SCHEMA
========================================================= */

const cutoffSchema = new mongoose.Schema(
  {
    counsellingYear: {
      type: String,
      required: true,
      trim: true,
    },

    phase: {
      type: String,
      default: "",
      trim: true,
    },

    branchCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    gender: {
      type: String,
      default: "OPEN",
      trim: true,
      uppercase: true,
    },

    localArea: {
      type: String,
      default: "OPEN",
      trim: true,
      uppercase: true,
    },

    openingRank: {
      type: Number,
      default: null,
      min: 0,
    },

    closingRank: {
      type: Number,
      default: null,
      min: 0,
    },

    source: {
      type: String,
      default: "",
      trim: true,
    },

    sourceUrl: {
      type: String,
      default: "",
      trim: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   ACCREDITATION SCHEMA
========================================================= */

const accreditationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    grade: {
      type: String,
      default: "",
      trim: true,
    },

    validUntil: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   DATA SOURCE SCHEMA
========================================================= */

const sourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      default: "",
      trim: true,
    },

    year: {
      type: String,
      default: "",
      trim: true,
    },

    lastChecked: {
      type: Date,
      default: null,
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   COLLEGE SCHEMA
========================================================= */

const collegeSchema = new mongoose.Schema(
  {
    /* =======================================================
       BASIC COLLEGE INFORMATION
    ======================================================= */

    collegeCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    shortName: {
      type: String,
      default: "",
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "Government",
        "Private",
        "University",
        "Autonomous",
        "Other",
      ],
      default: "Private",
      index: true,
    },

    status: {
      type: String,
      enum: [
        "Active",
        "Inactive",
        "Closed",
      ],
      default: "Active",
      index: true,
    },

    /* =======================================================
       LOCATION
    ======================================================= */

    district: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    mandal: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    pincode: {
      type: String,
      default: "",
      trim: true,
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    /* =======================================================
       UNIVERSITY / ACADEMIC INFORMATION
    ======================================================= */

    university: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },

    affiliation: {
      type: String,
      default: "",
      trim: true,
    },

    autonomous: {
      type: Boolean,
      default: false,
    },

    accreditation: {
      type: [accreditationSchema],
      default: [],
    },

    branches: {
      type: [branchSchema],
      default: [],
    },

    /* =======================================================
       FEES
    ======================================================= */

    fees: {
      type: [feeSchema],
      default: [],
    },

    /* =======================================================
       CUTOFFS
    ======================================================= */

    cutoffs: {
      type: [cutoffSchema],
      default: [],
    },

    /* =======================================================
       CONTACT INFORMATION
    ======================================================= */

    website: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    /* =======================================================
       VERIFIED DATA INFORMATION
    ======================================================= */

    dataYear: {
      type: String,
      default: "2025",
      trim: true,
      index: true,
    },

    dataSource: {
      type: String,
      default: "",
      trim: true,
    },

    sourceUrl: {
      type: String,
      default: "",
      trim: true,
    },

    sources: {
      type: [sourceSchema],
      default: [],
    },

    verified: {
      type: Boolean,
      default: false,
      index: true,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /* =======================================================
       SYSTEM STATUS
    ======================================================= */

    active: {
      type: Boolean,
      default: true,
      index: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

/* =========================================================
   SEARCH INDEXES
========================================================= */

collegeSchema.index({
  name: "text",
  shortName: "text",
  collegeCode: "text",
  district: "text",
  city: "text",
});

/* =========================================================
   FILTER INDEXES
========================================================= */

collegeSchema.index({
  district: 1,
  active: 1,
});

collegeSchema.index({
  district: 1,
  verified: 1,
  active: 1,
});

collegeSchema.index({
  type: 1,
  active: 1,
});

collegeSchema.index({
  university: 1,
  active: 1,
});

collegeSchema.index({
  "branches.code": 1,
});

collegeSchema.index({
  "cutoffs.counsellingYear": 1,
  "cutoffs.branchCode": 1,
  "cutoffs.category": 1,
});

collegeSchema.index({
  "fees.academicYear": 1,
});

/* =========================================================
   MODEL
========================================================= */

const College =
  mongoose.models.College ||
  mongoose.model("College", collegeSchema);

export default College;
