import mongoose from "mongoose";

const preferenceSchema = new mongoose.Schema(
  {
    preferenceNo: {
      type: Number,
      required: true,
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
      required: true,
      trim: true,
    },

    district: {
      type: String,
      default: "",
    },

    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
  },
  {
    _id: false,
  }
);

const applicationSchema = new mongoose.Schema(
  {
    /* =====================================================
       STUDENT
    ===================================================== */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    applicationNumber: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    /* =====================================================
       APPLICATION STATUS
    ===================================================== */

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
      min: 1,
      max: 6,
      default: 1,
    },

    /* =====================================================
       STUDENT INFORMATION SNAPSHOT
    ===================================================== */

    studentDetails: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      dateOfBirth: {
        type: Date,
        default: null,
      },

      gender: {
        type: String,
        default: "",
      },

      category: {
        type: String,
        default: "",
      },

      localArea: {
        type: String,
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

      hallTicketNumber: {
        type: String,
        default: "",
        trim: true,
      },

      phone: {
        type: String,
        default: "",
      },

      email: {
        type: String,
        default: "",
        lowercase: true,
      },
    },

    /* =====================================================
       COUNSELLING YEAR
    ===================================================== */

    counsellingYear: {
      type: String,
      default: "2025-26",
      index: true,
    },

    counsellingPhase: {
      type: String,
      default: "",
    },

    /* =====================================================
       COLLEGE / BRANCH PREFERENCES
    ===================================================== */

    preferences: {
      type: [preferenceSchema],
      default: [],
    },

    maxPreferencesAllowed: {
      type: Number,
      default: 300,
    },

    /* =====================================================
       ALLOTMENT
    ===================================================== */

    allotment: {
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
      },

      branchName: {
        type: String,
        default: "",
      },

      round: {
        type: String,
        default: "",
      },

      allottedAt: {
        type: Date,
        default: null,
      },

      status: {
        type: String,
        enum: [
          "",
          "Allotted",
          "Accepted",
          "Rejected",
          "Cancelled",
        ],
        default: "",
      },
    },

    /* =====================================================
       DOCUMENTS
    ===================================================== */

    documents: [
      {
        documentType: {
          type: String,
          required: true,
        },

        fileName: {
          type: String,
          default: "",
        },

        fileUrl: {
          type: String,
          default: "",
        },

        verified: {
          type: Boolean,
          default: false,
        },

        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    /* =====================================================
       PAYMENT
    ===================================================== */

    payment: {
      required: {
        type: Boolean,
        default: false,
      },

      status: {
        type: String,
        enum: [
          "Not Required",
          "Pending",
          "Paid",
          "Failed",
          "Refunded",
        ],
        default: "Pending",
      },

      amount: {
        type: Number,
        default: 0,
      },

      transactionId: {
        type: String,
        default: "",
      },

      paidAt: {
        type: Date,
        default: null,
      },
    },

    /* =====================================================
       SUBMISSION
    ===================================================== */

    submittedAt: {
      type: Date,
      default: null,
    },

    lockedAt: {
      type: Date,
      default: null,
    },

    /* =====================================================
       ADMIN REVIEW
    ===================================================== */

    adminReview: {
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
      },
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
  user: 1,
});

applicationSchema.index({
  applicationNumber: 1,
});

applicationSchema.index({
  counsellingYear: 1,
  status: 1,
});

applicationSchema.index({
  "studentDetails.rank": 1,
});

/* =========================================================
   MODEL
========================================================= */

const Application = mongoose.model(
  "Application",
  applicationSchema
);

export default Application;
