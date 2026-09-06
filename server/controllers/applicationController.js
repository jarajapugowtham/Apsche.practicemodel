import Application from "../models/Application.js";
import College from "../models/College.js";

/* =========================================================
   HELPERS
========================================================= */

const generateApplicationNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(
    100000 + Math.random() * 900000
  );

  return `APSCHE-${year}-${random}`;
};

const getUserId = (req) => {
  return req.user?._id || req.user?.id;
};

/* =========================================================
   CREATE APPLICATION
========================================================= */

export const createApplication = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    let application = await Application.findOne({
      user: userId,
    });

    if (application) {
      return res.status(200).json({
        success: true,
        message: "Application already exists",
        application,
      });
    }

    application = await Application.create({
      user: userId,
      applicationNumber:
        generateApplicationNumber(),
      counsellingYear:
        req.body.counsellingYear || "2025-26",
      counsellingPhase:
        req.body.counsellingPhase || "Phase 1",
      studentDetails: {
        fullName:
          req.body.fullName ||
          req.user?.name ||
          "",
        email:
          req.body.email ||
          req.user?.email ||
          "",
        phone:
          req.body.phone ||
          req.user?.phone ||
          "",
      },
      status: "Draft",
      currentStep: 1,
    });

    return res.status(201).json({
      success: true,
      message: "Counselling application created",
      application,
    });
  } catch (error) {
    console.error(
      "Create application error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to create application",
    });
  }
};

/* =========================================================
   GET MY APPLICATION
========================================================= */

export const getMyApplication = async (req, res) => {
  try {
    const userId = getUserId(req);

    const application =
      await Application.findOne({
        user: userId,
      })
        .populate(
          "preferences.college",
          "collegeCode name district city type branches fees cutoffs verified"
        )
        .populate(
          "allotment.college",
          "collegeCode name district city branches"
        );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Counselling application not found",
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
      message: "Unable to load application",
    });
  }
};

/* =========================================================
   UPDATE APPLICATION
========================================================= */

export const updateApplication = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    const application =
      await Application.findOne({
        user: userId,
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (
      [
        "Submitted",
        "Options Locked",
        "Completed",
      ].includes(application.status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Application can no longer be edited",
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

    allowedFields.forEach((field) => {
      if (
        req.body[field] !== undefined
      ) {
        application.studentDetails[field] =
          req.body[field];
      }
    });

    if (req.body.currentStep) {
      application.currentStep =
        Math.min(
          Math.max(
            Number(req.body.currentStep),
            1
          ),
          6
        );
    }

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application updated",
      application,
    });
  } catch (error) {
    console.error(
      "Update application error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update application",
    });
  }
};

/* =========================================================
   ADD PREFERENCE
========================================================= */

export const addPreference = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    const application =
      await Application.findOne({
        user: userId,
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (
      [
        "Submitted",
        "Options Locked",
        "Completed",
      ].includes(application.status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Preferences are locked",
      });
    }

    const {
      collegeId,
      branchCode,
      preferenceNo,
      priority,
    } = req.body;

    if (!collegeId || !branchCode) {
      return res.status(400).json({
        success: false,
        message:
          "collegeId and branchCode are required",
      });
    }

    const college =
      await College.findById(collegeId);

    if (!college || !college.active) {
      return res.status(404).json({
        success: false,
        message: "College not found or inactive",
      });
    }

    const branch =
      college.branches.find(
        (item) =>
          item.code ===
          String(branchCode).toUpperCase()
      );

    if (!branch) {
      return res.status(400).json({
        success: false,
        message:
          "Selected branch is not available in this college",
      });
    }

    const duplicate =
      application.preferences.some(
        (item) =>
          String(item.college) ===
            String(collegeId) &&
          item.branchCode ===
            String(branchCode).toUpperCase()
      );

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message:
          "This college and branch is already selected",
      });
    }

    if (
      application.preferences.length >=
      application.maxPreferencesAllowed
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Maximum preference limit reached",
      });
    }

    let nextPreferenceNo =
      Number(preferenceNo);

    if (
      !Number.isInteger(nextPreferenceNo) ||
      nextPreferenceNo < 1
    ) {
      const numbers =
        application.preferences.map(
          (item) =>
            Number(item.preferenceNo)
        );

      nextPreferenceNo =
        numbers.length
          ? Math.max(...numbers) + 1
          : 1;
    }

    const used =
      application.preferences.some(
        (item) =>
          Number(item.preferenceNo) ===
          nextPreferenceNo
      );

    if (used) {
      nextPreferenceNo =
        application.preferences.length + 1;
    }

    application.preferences.push({
      preferenceNo: nextPreferenceNo,
      college: college._id,
      branchCode: branch.code,
      branchName: branch.name,
      district: college.district,
      priority: priority || "Medium",
    });

    application.preferences.sort(
      (a, b) =>
        a.preferenceNo -
        b.preferenceNo
    );

    application.currentStep = Math.max(
      application.currentStep,
      2
    );

    await application.save();

    return res.status(201).json({
      success: true,
      message: "Preference added",
      preferences:
        application.preferences,
    });
  } catch (error) {
    console.error(
      "Add preference error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to add preference",
    });
  }
};

/* =========================================================
   REMOVE PREFERENCE
========================================================= */

export const removePreference = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    const application =
      await Application.findOne({
        user: userId,
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (
      [
        "Submitted",
        "Options Locked",
        "Completed",
      ].includes(application.status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Preferences are locked",
      });
    }

    const number =
      Number(req.params.preferenceNo);

    const originalLength =
      application.preferences.length;

    application.preferences =
      application.preferences.filter(
        (item) =>
          Number(item.preferenceNo) !==
          number
      );

    if (
      application.preferences.length ===
      originalLength
    ) {
      return res.status(404).json({
        success: false,
        message: "Preference not found",
      });
    }

    application.preferences.forEach(
      (item, index) => {
        item.preferenceNo = index + 1;
      }
    );

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Preference removed",
      preferences:
        application.preferences,
    });
  } catch (error) {
    console.error(
      "Remove preference error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to remove preference",
    });
  }
};

/* =========================================================
   REORDER PREFERENCES
========================================================= */

export const reorderPreferences = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    const application =
      await Application.findOne({
        user: userId,
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (
      [
        "Submitted",
        "Options Locked",
        "Completed",
      ].includes(application.status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Preferences are locked",
      });
    }

    const { preferenceNos } = req.body;

    if (
      !Array.isArray(preferenceNos) ||
      preferenceNos.length !==
        application.preferences.length
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Send all preference numbers in the new order",
      });
    }

    const uniqueNumbers =
      new Set(
        preferenceNos.map(Number)
      );

    if (
      uniqueNumbers.size !==
      application.preferences.length
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Duplicate preference numbers are not allowed",
      });
    }

    const preferenceMap =
      new Map(
        application.preferences.map(
          (item) => [
            Number(item.preferenceNo),
            item,
          ]
        )
      );

    const reordered =
      preferenceNos.map(
        (number, index) => {
          const item =
            preferenceMap.get(
              Number(number)
            );

          if (!item) {
            throw new Error(
              "Invalid preference number"
            );
          }

          item.preferenceNo =
            index + 1;

          return item;
        }
      );

    application.preferences =
      reordered;

    await application.save();

    return res.status(200).json({
      success: true,
      message:
        "Preferences reordered",
      preferences:
        application.preferences,
    });
  } catch (error) {
    console.error(
      "Reorder preference error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Unable to reorder preferences",
    });
  }
};

/* =========================================================
   LOCK PREFERENCES
========================================================= */

export const lockPreferences = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    const application =
      await Application.findOne({
        user: userId,
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (
      application.status ===
      "Options Locked"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Preferences are already locked",
      });
    }

    if (
      application.status ===
      "Submitted"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Application has already been submitted",
      });
    }

    if (
      application.preferences.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Add at least one college preference before locking",
      });
    }

    application.preferences.sort(
      (a, b) =>
        a.preferenceNo -
        b.preferenceNo
    );

    application.preferences.forEach(
      (item, index) => {
        item.preferenceNo =
          index + 1;
      }
    );

    application.status =
      "Options Locked";

    application.lockedAt =
      new Date();

    application.currentStep = 4;

    await application.save();

    return res.status(200).json({
      success: true,
      message:
        "College preferences locked successfully",
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
        "Unable to lock preferences",
    });
  }
};

/* =========================================================
   SUBMIT APPLICATION
========================================================= */

export const submitApplication = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    const application =
      await Application.findOne({
        user: userId,
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (
      application.status ===
      "Submitted"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Application has already been submitted",
      });
    }

    if (
      application.status !==
      "Options Locked"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Lock your college preferences before submitting",
      });
    }

    if (
      !application.studentDetails
        .fullName
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Student name is required",
      });
    }

    if (
      !application.studentDetails
        .hallTicketNumber
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Hall ticket number is required",
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
          "EAPCET rank is required",
      });
    }

    if (
      application.preferences.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "At least one preference is required",
      });
    }

    application.status =
      "Submitted";

    application.submittedAt =
      new Date();

    application.currentStep = 5;

    await application.save();

    return res.status(200).json({
      success: true,
      message:
        "Counselling application submitted successfully",
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
        "Unable to submit application",
    });
  }
};

/* =========================================================
   GET ALLOTMENT
========================================================= */

export const getAllotment = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);

    const application =
      await Application.findOne({
        user: userId,
      }).populate(
        "allotment.college",
        "collegeCode name district city branches"
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      allotment:
        application.allotment,
      applicationStatus:
        application.status,
    });
  } catch (error) {
    console.error(
      "Get allotment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load allotment",
    });
  }
};
