import Application from "../models/Application.js";
import College from "../models/College.js";

/* =========================================================
   GENERATE APPLICATION NUMBER
========================================================= */

const generateApplicationNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);

  return `APSCHE-${year}-${random}`;
};

/* =========================================================
   CREATE / GET MY APPLICATION
========================================================= */

export const getMyApplication = async (req, res) => {
  try {
    let application = await Application.findOne({
      user: req.user._id,
    })
      .populate(
        "preferences.college",
        "collegeCode name shortName district city type verified"
      )
      .populate(
        "allotment.college",
        "collegeCode name shortName district city"
      );

    if (!application) {
      application = await Application.create({
        user: req.user._id,
        counsellingYear: "2025-26",
        status: "Draft",
        currentStep: 1,
        studentDetails: {
          fullName: req.user.name,
          email: req.user.email,
          phone: req.user.phone || "",
          hallTicketNumber:
            req.user.hallTicketNumber || "",
          rank: req.user.rank ?? null,
          marks: req.user.marks ?? null,
          category: req.user.category || "",
          gender: req.user.gender || "",
          localArea: req.user.localArea || "",
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("Get application error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load counselling application",
    });
  }
};

/* =========================================================
   SAVE STUDENT DETAILS
========================================================= */

export const updateStudentDetails = async (req, res) => {
  try {
    const application = await Application.findOne({
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Counselling application not found",
      });
    }

    if (isLocked(application)) {
      return res.status(400).json({
        success: false,
        message: "Application is locked and cannot be edited",
      });
    }

    const allowedFields = [
      "fullName",
      "dateOfBirth",
      "gender",
      "category",
      "localArea",
      "rank",
      "marks",
      "hallTicketNumber",
      "phone",
      "email",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        application.studentDetails[field] = req.body[field];
      }
    }

    application.currentStep = Math.max(
      application.currentStep,
      2
    );

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Student details saved",
      data: application,
    });
  } catch (error) {
    console.error("Update student details error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save student details",
    });
  }
};

/* =========================================================
   ADD COLLEGE PREFERENCE
========================================================= */

export const addPreference = async (req, res) => {
  try {
    const {
      collegeId,
      branchCode,
      priority = "Medium",
    } = req.body;

    if (!collegeId || !branchCode) {
      return res.status(400).json({
        success: false,
        message: "College and branch are required",
      });
    }

    const application = await Application.findOne({
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Counselling application not found",
      });
    }

    if (isLocked(application)) {
      return res.status(400).json({
        success: false,
        message: "Application is locked",
      });
    }

    const college = await College.findOne({
      _id: collegeId,
      active: true,
    }).lean();

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    const branch = (college.branches || []).find(
      (item) =>
        item.code?.toUpperCase() ===
        branchCode.toUpperCase()
    );

    if (!branch) {
      return res.status(400).json({
        success: false,
        message:
          "Selected branch is not available in this college",
      });
    }

    const duplicate = application.preferences.some(
      (item) =>
        String(item.college) === String(college._id) &&
        item.branchCode === branch.code
    );

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "This college and branch is already selected",
      });
    }

    if (
      application.preferences.length >=
      application.maxPreferencesAllowed
    ) {
      return res.status(400).json({
        success: false,
        message: "Maximum preference limit reached",
      });
    }

    const preferenceNo =
      application.preferences.length + 1;

    application.preferences.push({
      preferenceNo,
      college: college._id,
      branchCode: branch.code,
      branchName: branch.name,
      district: college.district || "",
      priority,
    });

    application.currentStep = Math.max(
      application.currentStep,
      3
    );

    await application.save();

    return res.status(201).json({
      success: true,
      message: "College preference added",
      data: application,
    });
  } catch (error) {
    console.error("Add preference error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to add college preference",
    });
  }
};

/* =========================================================
   REMOVE PREFERENCE
========================================================= */

export const removePreference = async (req, res) => {
  try {
    const application = await Application.findOne({
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Counselling application not found",
      });
    }

    if (isLocked(application)) {
      return res.status(400).json({
        success: false,
        message: "Application is locked",
      });
    }

    const index = application.preferences.findIndex(
      (item) =>
        String(item._id) === String(req.params.preferenceId)
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Preference not found",
      });
    }

    application.preferences.splice(index, 1);

    normalizePreferenceNumbers(application);

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Preference removed",
      data: application,
    });
  } catch (error) {
    console.error("Remove preference error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to remove preference",
    });
  }
};

/* =========================================================
   REORDER PREFERENCES
========================================================= */

export const reorderPreferences = async (req, res) => {
  try {
    const { preferenceIds } = req.body;

    if (
      !Array.isArray(preferenceIds) ||
      preferenceIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Preference order is required",
      });
    }

    const application = await Application.findOne({
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Counselling application not found",
      });
    }

    if (isLocked(application)) {
      return res.status(400).json({
        success: false,
        message: "Application is locked",
      });
    }

    if (
      preferenceIds.length !==
      application.preferences.length
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All existing preferences must be included",
      });
    }

    const preferenceMap = new Map(
      application.preferences.map((item) => [
        String(item._id),
        item,
      ])
    );

    const reordered = [];

    for (const id of preferenceIds) {
      const item = preferenceMap.get(String(id));

      if (!item) {
        return res.status(400).json({
          success: false,
          message: "Invalid preference ID",
        });
      }

      reordered.push(item);
    }

    application.preferences = reordered;

    normalizePreferenceNumbers(application);

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Preference order updated",
      data: application,
    });
  } catch (error) {
    console.error("Reorder preferences error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reorder preferences",
    });
  }
};

/* =========================================================
   SUBMIT APPLICATION
========================================================= */

export const submitApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Counselling application not found",
      });
    }

    if (application.status !== "Draft") {
      return res.status(400).json({
        success: false,
        message:
          "This application cannot be submitted in its current state",
      });
    }

    const validationErrors =
      validateApplication(application);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Application is incomplete",
        errors: validationErrors,
      });
    }

    if (!application.applicationNumber) {
      application.applicationNumber =
        generateApplicationNumber();
    }

    application.status = "Submitted";
    application.currentStep = 6;
    application.submittedAt = new Date();

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Counselling application submitted successfully",
      data: application,
    });
  } catch (error) {
    console.error("Submit application error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit counselling application",
    });
  }
};

/* =========================================================
   LOCK PREFERENCES
========================================================= */

export const lockPreferences = async (req, res) => {
  try {
    const application = await Application.findOne({
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Counselling application not found",
      });
    }

    if (application.status !== "Draft") {
      return res.status(400).json({
        success: false,
        message: "Preferences can no longer be locked",
      });
    }

    if (application.preferences.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Add at least one college preference first",
      });
    }

    application.status = "Options Locked";
    application.lockedAt = new Date();

    await application.save();

    return res.status(200).json({
      success: true,
      message: "College preferences locked",
      data: application,
    });
  } catch (error) {
    console.error("Lock preferences error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to lock preferences",
    });
  }
};

/* =========================================================
   APPLICATION STATUS
========================================================= */

export const getApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findOne({
      user: req.user._id,
    })
      .select(
        "applicationNumber status currentStep counsellingYear counsellingPhase submittedAt lockedAt allotment adminReview"
      )
      .populate(
        "allotment.college",
        "collegeCode name district city"
      )
      .lean();

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Counselling application not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("Application status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch application status",
    });
  }
};

/* =========================================================
   VALIDATE APPLICATION
========================================================= */

const validateApplication = (application) => {
  const errors = [];

  const student = application.studentDetails;

  if (!student.fullName?.trim()) {
    errors.push("Full name is required");
  }

  if (!student.email?.trim()) {
    errors.push("Email is required");
  }

  if (!student.hallTicketNumber?.trim()) {
    errors.push("Hall ticket number is required");
  }

  if (
    student.rank === null ||
    student.rank === undefined
  ) {
    errors.push("Rank is required");
  }

  if (!student.category) {
    errors.push("Category is required");
  }

  if (!student.gender) {
    errors.push("Gender is required");
  }

  if (!student.localArea) {
    errors.push("Local area is required");
  }

  if (application.preferences.length === 0) {
    errors.push(
      "At least one college preference is required"
    );
  }

  return errors;
};

/* =========================================================
   HELPERS
========================================================= */

const isLocked = (application) => {
  return [
    "Submitted",
    "Under Review",
    "Options Locked",
    "Seat Allotted",
    "Completed",
    "Rejected",
  ].includes(application.status);
};

const normalizePreferenceNumbers = (application) => {
  application.preferences.forEach(
    (preference, index) => {
      preference.preferenceNo = index + 1;
    }
  );
};
