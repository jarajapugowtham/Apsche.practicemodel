import mongoose from "mongoose";

/* =========================================================
   STUDENT DETAILS
========================================================= */

const studentDetailsSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: String,
      default: "",
      trim: true,
    },

    gender: {
      type: String,
      enum: [
        "",
        "Male",
        "Female",
        "Other",
      ],
      default: "",
    },

    category: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },

    localArea: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },

    rank: {
      type: Number,
      default: null,
      min: 0,
    },

    marks: {
      type: Number,
      default: null,
      min: 0,
    },

    hallTicketNumber: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
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
  },
  {
    _id: false,
  }
);

/* =========================================================
   COLLEGE PREFERENCE
========================================================= */

const preferenceSchema = new mongoose.Schema(
  {
    preferenceNo: {
      type: Number,
      required: true,
      min: 1,
    },

    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },

    branchCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    branchName: {
      type: String,
      default: "",
      trim: true,
    },

    district: {
      type: String,
      default: "",
      trim: true,
    },

    priority: {
      type: String,
      enum: [
        "High",
        "Medium",
        "Low",
      ],
      default: "Medium",
    },
  },
  {
    timestamps: true,
  }
);

/* =========================================================
   ALLOTMENT
========================================================= */

const allotmentSchema = new mongoose.Schema(
  {
    allotted: {
      type: Boolean,
      default: false,
    },

    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      default: null,
    },

    branchCode: {
      type: String,
      default: "",
      trim: true,
      uppercase: true,
    },

    branchName: {
      type: String,
      default: "",
      trim: true,
    },

    round: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "",
        "Allotted",
        "Not Allotted",
        "Accepted",
        "Rejected",
      ],
      default: "",
    },

    allottedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   ADMIN REVIEW
========================================================= */

const adminReviewSchema = new mongoose.Schema(
  {
    reviewed: {
      type: Boolean,
      default: false,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    remarks: {
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
   APPLICATION
========================================================= */

const applicationSchema = new mongoose.Schema(
  {
    /* -------------------------------------------------------
       USER
    ------------------------------------------------------- */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    /* -------------------------------------------------------
       APPLICATION NUMBER
    ------------------------------------------------------- */

    applicationNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      index: true,
    },

    /* -------------------------------------------------------
       COUNSELLING YEAR
    ------------------------------------------------------- */

    counsellingYear: {
      type: String,
      default: "2025-26",
      trim: true,
      index: true,
    },

    counsellingPhase: {
      type: String,
      default: "Phase 1",
      trim: true,
    },

    /* -------------------------------------------------------
       STUDENT DETAILS
    ------------------------------------------------------- */

    studentDetails: {
      type: studentDetailsSchema,
      required: true,
    },

    /* -------------------------------------------------------
       COLLEGE PREFERENCES
    ------------------------------------------------------- */

    preferences: {
      type: [preferenceSchema],
      default: [],
    },

    maxPreferencesAllowed: {
      type: Number,
      default: 300,
      min: 1,
    },

    /* -------------------------------------------------------
       APPLICATION STATUS
    ------------------------------------------------------- */

    status: {
      type: String,
      enum: [
        "Draft",
        "Submitted",
        "Under Review",
        "Options Locked",
        "Seat Allotted",
        "Completed",
        "Rejected",
      ],
      default: "Draft",
      index: true,
    },

    currentStep: {
      type: Number,
      default: 1,
      min: 1,
      max: 6,
    },

    /* -------------------------------------------------------
       SUBMISSION
    ------------------------------------------------------- */

    submittedAt: {
      type: Date,
      default: null,
    },

    lockedAt: {
      type: Date,
      default: null,
    },

    /* -------------------------------------------------------
       ADMIN REVIEW
    ------------------------------------------------------- */

    adminReview: {
      type: adminReviewSchema,
      default: () => ({}),
    },

    /* -------------------------------------------------------
       ALLOTMENT
    ------------------------------------------------------- */

    allotment: {
      type: allotmentSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

/* =========================================================
   INDEXES
========================================================= */

applicationSchema.index({
  status: 1,
  counsellingYear: 1,
});

applicationSchema.index({
  "studentDetails.hallTicketNumber": 1,
});

applicationSchema.index({
  "studentDetails.rank": 1,
});

applicationSchema.index({
  "studentDetails.category": 1,
});

applicationSchema.index({
  "studentDetails.localArea": 1,
});

applicationSchema.index({
  createdAt: -1,
});

applicationSchema.index({
  "preferences.college": 1,
});

applicationSchema.index({
  "allotment.college": 1,
});

/* =========================================================
   MODEL
========================================================= */

const Application =
  mongoose.models.Application ||
  mongoose.model(
    "Application",
    applicationSchema
  );

export default Application;
