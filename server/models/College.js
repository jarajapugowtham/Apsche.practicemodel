import mongoose from "mongoose";

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

    degree: {
      type: String,
      default: "B.Tech",
      trim: true,
    },

    duration: {
      type: Number,
      default: 4,
    },

    sanctionedIntake: {
      type: Number,
      default: null,
    },
  },
  {
    _id: false,
  }
);

const feeSchema = new mongoose.Schema(
  {
    tuitionFee: {
      type: Number,
      default: null,
    },

    universityFee: {
      type: Number,
      default: null,
    },

    otherFee: {
      type: Number,
      default: null,
    },

    totalFee: {
      type: Number,
      default: null,
    },

    academicYear: {
      type: String,
      default: "2025-26",
    },

    source: {
      type: String,
      default: "",
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

const cutoffSchema = new mongoose.Schema(
  {
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
      default: "AU",
      trim: true,
      uppercase: true,
    },

    rank: {
      type: Number,
      default: null,
    },

    marks: {
      type: Number,
      default: null,
    },

    round: {
      type: String,
      default: "",
    },

    academicYear: {
      type: String,
      default: "2025-26",
    },

    source: {
      type: String,
      default: "",
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

const collegeSchema = new mongoose.Schema(
  {
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

    district: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      default: "Andhra Pradesh",
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
    },

    affiliation: {
      type: String,
      default: "",
      trim: true,
    },

    university: {
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

    website: {
      type: String,
      default: "",
      trim: true,
    },

    phone: {
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

    branches: {
      type: [branchSchema],
      default: [],
    },

    fees: {
      type: [feeSchema],
      default: [],
    },

    cutoffs: {
      type: [cutoffSchema],
      default: [],
    },

    counsellingEligible: {
      type: Boolean,
      default: true,
    },

    dataYear: {
      type: String,
      default: "2025-26",
    },

    dataSource: {
      type: String,
      default: "",
      trim: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    lastVerifiedAt: {
      type: Date,
      default: null,
    },

    active: {
      type: Boolean,
      default: true,
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

collegeSchema.index({
  district: 1,
  active: 1,
});

collegeSchema.index({
  counsellingEligible: 1,
  active: 1,
});

/* =========================================================
   MODEL
========================================================= */

const College = mongoose.model("College", collegeSchema);

export default College;
