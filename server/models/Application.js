import mongoose from "mongoose";

/* =========================================================
   PREFERENCE SCHEMA
========================================================= */

const preferenceSchema = new mongoose.Schema(
  {
    priority: {
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
  },
  {
    _id: false,
  }
);

/* =========================================================
   ALLOTMENT SCHEMA
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
        "Pending",
        "Allotted",
        "Not Allotted",
        "Accepted",
        "Rejected",
      ],
      default: "Pending",
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
   ADMIN REVIEW SCHEMA
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
   APPLICATION SCHEMA
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
      index: true,
    },

    /* -------------------------------------------------------
       APPLICATION NUMBER
    ------------------------------------------------------- */

    applicationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    /* -------------------------------------------------------
       COUNSELLING YEAR
    ------------------------------------------------------- */

    counsellingYear: {
      type: String,
      required: true,
      default: "2025",
      index: true,
    },

    /* -------------------------------------------------------
       STUDENT DETAILS
    ------------------------------------------------------- */

    studentDetails: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      hallTicketNumber: {
        type: String,
        default: "",
        trim: true,
        uppercase: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      phone: {
        type: String,
        default: "",
        trim: true,
      },

      dateOfBirth: {
        type: String,
        default: "",
      },

      gender: {
        type: String,
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
    },

    /* -------------------------------------------------------
       PREFERENCES
    ------------------------------------------------------- */

    preferences: {
      type: [preferenceSchema],
      default: [],
      validate: {
        validator: function (value) {
          return value.length <= 20;
        },
        message:
          "Maximum 20 college preferences are allowed.",
      },
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
        "Rejected",
        "Completed",
      ],
      default: "Draft",
      index: true,
    },

    /* -------------------------------------------------------
       CURRENT STEP
    ------------------------------------------------------- */

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
       ALLOTMENT
    ------------------------------------------------------- */

    allotment: {
      type: allotmentSchema,
      default: () => ({}),
    },

    /* -------------------------------------------------------
       ADMIN REVIEW
    ------------------------------------------------------- */

    adminReview: {
      type: adminReviewSchema,
      default: () => ({}),
    },

    /* -------------------------------------------------------
       PAYMENT
    ------------------------------------------------------- */

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
        ],
        default: "Not Required",
      },

      transactionId: {
        type: String,
        default: "",
        trim: true,
      },

      paidAt: {
        type: Date,
        default: null,
      },
    },

    /* -------------------------------------------------------
       ACTIVE
    ------------------------------------------------------- */

    active: {
      type: Boolean,
      default: true,
      index: true,
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
  counsellingYear: 1,
});

applicationSchema.index({
  status: 1,
  counsellingYear: 1,
});

applicationSchema.index({
  "studentDetails.rank": 1,
});

applicationSchema.index({
  "studentDetails.category": 1,
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
