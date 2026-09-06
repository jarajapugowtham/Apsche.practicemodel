import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    /* =====================================================
       BASIC ACCOUNT DETAILS
    ===================================================== */

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    /* =====================================================
       STUDENT DETAILS
    ===================================================== */

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
      index: true,
    },

    hallTicketNumber: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
    },

    rank: {
      type: Number,
      default: null,
    },

    marks: {
      type: Number,
      default: null,
    },

    category: {
      type: String,
      enum: [
        "",
        "OC",
        "EWS",
        "BC_A",
        "BC_B",
        "BC_C",
        "BC_D",
        "BC_E",
        "SC",
        "ST",
      ],
      default: "",
    },

    gender: {
      type: String,
      enum: ["", "Male", "Female", "Other"],
      default: "",
    },

    localArea: {
      type: String,
      enum: ["", "AU", "SVU", "NL"],
      default: "",
    },

    /* =====================================================
       EDUCATION
    ===================================================== */

    qualifyingExam: {
      type: String,
      default: "",
    },

    qualifyingYear: {
      type: Number,
      default: null,
    },

    intermediateCollege: {
      type: String,
      default: "",
      trim: true,
    },

    /* =====================================================
       PROFILE
    ===================================================== */

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    /* =====================================================
       ACCOUNT STATUS
    ===================================================== */

    isActive: {
      type: Boolean,
      default: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    /* =====================================================
       COUNSELLING
    ===================================================== */

    counsellingProfile: {
      registered: {
        type: Boolean,
        default: false,
      },

      applicationNumber: {
        type: String,
        default: "",
      },

      currentStep: {
        type: Number,
        default: 1,
      },

      applicationStatus: {
        type: String,
        enum: [
          "Not Started",
          "Draft",
          "Submitted",
          "Under Review",
          "Completed",
        ],
        default: "Not Started",
      },

      submittedAt: {
        type: Date,
        default: null,
      },
    },

    /* =====================================================
       PREFERENCES
    ===================================================== */

    preferredDistricts: {
      type: [String],
      default: [],
    },

    preferredBranches: {
      type: [String],
      default: [],
    },

    /* =====================================================
       FAVORITES
    ===================================================== */

    favoriteColleges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "College",
      },
    ],
  },
  {
    timestamps: true,
  }
);

/* =========================================================
   INDEXES
========================================================= */

userSchema.index({
  email: 1,
});

userSchema.index({
  hallTicketNumber: 1,
});

userSchema.index({
  role: 1,
  isActive: 1,
});

/* =========================================================
   MODEL
========================================================= */

const User = mongoose.model("User", userSchema);

export default User;
