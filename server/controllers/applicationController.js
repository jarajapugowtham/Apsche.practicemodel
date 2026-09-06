import Application from "../models/Application.js";
import College from "../models/College.js";

/* =========================================================
   CREATE APPLICATION
   POST /api/applications
========================================================= */

export const createApplication = async (
  req,
  res
) => {
  try {
    const {
      counsellingYear = "2025",
      studentDetails = {},
    } = req.body;

    const existingApplication =
      await Application.findOne({
        user: req.user._id,
        counsellingYear: String(
          counsellingYear
        ),
        active: true,
      });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message:
          "You already have an application for this counselling year.",
        application:
          existingApplication,
      });
    }

    const applicationNumber =
      await generateApplicationNumber();

    const application =
      await Application.create({
        user: req.user._id,

        applicationNumber,

        counsellingYear:
          String(counsellingYear),

        studentDetails: {
          fullName:
            studentDetails.fullName ||
            req.user.name,

          hallTicketNumber:
            studentDetails.hallTicketNumber ||
            "",

          email:
            studentDetails.email ||
            req.user.email,

          phone:
            studentDetails.phone ||
            req.user.phone ||
            "",

          dateOfBirth:
            studentDetails.dateOfBirth ||
            "",

          gender:
            studentDetails.gender ||
            "",

          category:
            studentDetails.category ||
            "",

          localArea:
            studentDetails.localArea ||
            "",

          rank:
            studentDetails.rank ?? null,
        },

        status: "Draft",

        currentStep: 1,
      });

    return res.status(201).json({
      success: true,
      message:
        "Counselling application created successfully.",
      application,
    });
  } catch (error) {
    console.error(
      "Create application error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create application.",
    });
  }
};

/* =========================================================
   GET MY APPLICATION
   GET /api/applications/me
========================================================= */

export const getMyApplication = async (
  req,
  res
) => {
  try {
    const {
      year = "2025",
    } = req.query;

    const application =
      await Application.findOne({
        user: req.user._id,
        counsellingYear: String(year),
        active: true,
      })
        .populate(
          "preferences.college",
          "collegeCode name shortName type district city university branches fees cutoffs verified"
        )
        .populate(
          "allotment.college",
          "collegeCode name shortName district city branches"
        )
        .lean();

    if (!application) {
      return res.status(404).json({
        success: false,
        message:
          "No counselling application found.",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error(
      "Get application error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load application.",
    });
  }
};

/* =========================================================
   UPDATE STUDENT DETAILS
   PATCH /api/applications/:id/details
========================================================= */

export const updateStudentDetails =
  async (req, res) => {
    try {
      const application =
        await Application.findOne({
          _id: req.params.id,
          user: req.user._id,
          active: true,
        });

      if (!application) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found.",
        });
      }

      if (
        application.status !== "Draft"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Student details cannot be changed after submission.",
        });
      }

      const allowedFields = [
        "fullName",
        "hallTicketNumber",
        "phone",
        "dateOfBirth",
        "gender",
        "category",
        "localArea",
        "rank",
      ];

      allowedFields.forEach(
        (field) => {
          if (
            req.body[field] !==
            undefined
          ) {
            application.studentDetails[
              field
            ] = req.body[field];
          }
        }
      );

      application.currentStep =
        Math.max(
          application.currentStep,
          2
        );

      await application.save();

      return res.status(200).json({
        success: true,
        message:
          "Student details updated successfully.",
        application,
      });
    } catch (error) {
      console.error(
        "Update details error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update student details.",
      });
    }
  };

/* =========================================================
   SAVE PREFERENCES
   PATCH /api/applications/:id/preferences
========================================================= */

export const savePreferences =
  async (req, res) => {
    try {
      const {
        preferences,
      } = req.body;

      if (
        !Array.isArray(
          preferences
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Preferences must be an array.",
        });
      }

      if (
        preferences.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Add at least one college preference.",
        });
      }

      if (
        preferences.length > 20
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Maximum 20 preferences are allowed.",
        });
      }

      const application =
        await Application.findOne({
          _id: req.params.id,
          user: req.user._id,
          active: true,
        });

      if (!application) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found.",
        });
      }

      if (
        application.status !== "Draft"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Preferences are locked and cannot be changed.",
        });
      }

      const cleanedPreferences =
        preferences.map(
          (item, index) => ({
            priority: index + 1,

            college: item.college,

            branchCode:
              String(
                item.branchCode || ""
              )
                .trim()
                .toUpperCase(),

            branchName:
              item.branchName || "",
          })
        );

      /* -----------------------------------------------------
         VERIFY COLLEGES + BRANCHES
      ----------------------------------------------------- */

      for (
        const preference of cleanedPreferences
      ) {
        const college =
          await College.findOne({
            _id:
              preference.college,
            active: true,
          });

        if (!college) {
          return res.status(400).json({
            success: false,
            message:
              "One of the selected colleges is invalid.",
          });
        }

        if (
          !college.verified
        ) {
          return res.status(400).json({
            success: false,
            message:
              `College ${college.name} is not verified yet.`,
          });
        }

        const branch =
          college.branches.find(
            (item) =>
              item.code ===
              preference.branchCode
          );

        if (!branch) {
          return res.status(400).json({
            success: false,
            message:
              `Branch ${preference.branchCode} is not available at ${college.name}.`,
          });
        }

        preference.branchName =
          branch.name;
      }

      /* -----------------------------------------------------
         DUPLICATE CHECK
      ----------------------------------------------------- */

      const uniquePreferences =
        new Set(
          cleanedPreferences.map(
            (item) =>
              `${item.college}-${item.branchCode}`
          )
        );

      if (
        uniquePreferences.size !==
        cleanedPreferences.length
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Duplicate college and branch preferences are not allowed.",
        });
      }

      application.preferences =
        cleanedPreferences;

      application.currentStep =
        Math.max(
          application.currentStep,
          4
        );

      await application.save();

      return res.status(200).json({
        success: true,
        message:
          "Preferences saved successfully.",
        preferences:
          application.preferences,
      });
    } catch (error) {
      console.error(
        "Save preferences error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to save preferences.",
      });
    }
  };

/* =========================================================
   LOCK PREFERENCES
   PATCH /api/applications/:id/lock
========================================================= */

export const lockPreferences =
  async (req, res) => {
    try {
      const application =
        await Application.findOne({
          _id: req.params.id,
          user: req.user._id,
          active: true,
        });

      if (!application) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found.",
        });
      }

      if (
        application.status !== "Draft"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Application is already locked or submitted.",
        });
      }

      if (
        !application.preferences ||
        application.preferences.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Add preferences before locking.",
        });
      }

      application.status =
        "Options Locked";

      application.lockedAt =
        new Date();

      application.currentStep =
        5;

      await application.save();

      return res.status(200).json({
        success: true,
        message:
          "College preferences locked successfully.",
        application,
      });
    } catch (error) {
      console.error(
        "Lock preferences error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to lock preferences.",
      });
    }
  };

/* =========================================================
   SUBMIT APPLICATION
   PATCH /api/applications/:id/submit
========================================================= */

export const submitApplication =
  async (req, res) => {
    try {
      const application =
        await Application.findOne({
          _id: req.params.id,
          user: req.user._id,
          active: true,
        });

      if (!application) {
        return res.status(404).json({
          success: false,
          message:
            "Application not found.",
        });
      }

      if (
        application.status !==
        "Options Locked"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Lock your preferences before submitting.",
        });
      }

      if (
        !application.studentDetails
          .fullName
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Student name is required.",
        });
      }

      if (
        application.studentDetails
          .rank === null ||
        application.studentDetails
          .rank === undefined
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Rank is required before submission.",
        });
      }

      application.status =
        "Submitted";

      application.submittedAt =
        new Date();

      application.currentStep =
        6;

      await application.save();

      return res.status(200).json({
        success: true,
        message:
          "Counselling application submitted successfully.",
        application,
      });
    } catch (error) {
      console.error(
        "Submit application error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to submit application.",
      });
    }
  };

/* =========================================================
   HELPER
========================================================= */

const generateApplicationNumber =
  async () => {
    const year =
      new Date().getFullYear();

    let applicationNumber;

    let exists = true;

    while (exists) {
      const random =
        Math.floor(
          100000 +
            Math.random() *
              900000
        );

      applicationNumber =
        `APSCHE-${year}-${random}`;

      exists =
        await Application.exists({
          applicationNumber,
        });
    }

    return applicationNumber;
  };
