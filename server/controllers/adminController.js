import Application from "../models/Application.js";
import College from "../models/College.js";

/* =========================================================
   ADMIN DASHBOARD
   GET /api/admin/dashboard
========================================================= */

export const getDashboard = async (
  req,
  res
) => {
  try {
    const [
      totalApplications,
      submittedApplications,
      draftApplications,
      lockedApplications,
      allottedApplications,
      totalColleges,
      verifiedColleges,
    ] = await Promise.all([
      Application.countDocuments(),

      Application.countDocuments({
        status: "Submitted",
      }),

      Application.countDocuments({
        status: "Draft",
      }),

      Application.countDocuments({
        status: "Options Locked",
      }),

      Application.countDocuments({
        status: "Seat Allotted",
      }),

      College.countDocuments({
        active: true,
      }),

      College.countDocuments({
        active: true,
        verified: true,
      }),
    ]);

    return res.status(200).json({
      success: true,

      dashboard: {
        applications: {
          total: totalApplications,
          submitted:
            submittedApplications,
          draft: draftApplications,
          locked: lockedApplications,
          allotted:
            allottedApplications,
        },

        colleges: {
          total: totalColleges,
          verified:
            verifiedColleges,
        },
      },
    });
  } catch (error) {
    console.error(
      "Admin dashboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load admin dashboard",
    });
  }
};

/* =========================================================
   GET APPLICATIONS
   GET /api/admin/applications
========================================================= */

export const getApplications = async (
  req,
  res
) => {
  try {
    const {
      status = "",
      year = "",
      page = 1,
      limit = 20,
      search = "",
    } = req.query;

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const perPage = Math.min(
      Math.max(Number(limit) || 20, 1),
      100
    );

    const query = {};

    if (status) {
      query.status = status;
    }

    if (year) {
      query.counsellingYear =
        String(year);
    }

    if (search.trim()) {
      query.$or = [
        {
          applicationNumber: {
            $regex: escapeRegex(search),
            $options: "i",
          },
        },
        {
          "studentDetails.fullName": {
            $regex: escapeRegex(search),
            $options: "i",
          },
        },
        {
          "studentDetails.hallTicketNumber":
            {
              $regex:
                escapeRegex(search),
              $options: "i",
            },
        },
        {
          "studentDetails.email": {
            $regex: escapeRegex(search),
            $options: "i",
          },
        },
      ];
    }

    const total =
      await Application.countDocuments(
        query
      );

    const applications =
      await Application.find(query)
        .populate(
          "user",
          "name email phone role"
        )
        .populate(
          "preferences.college",
          "collegeCode name district city"
        )
        .populate(
          "allotment.college",
          "collegeCode name district city"
        )
        .sort({
          createdAt: -1,
        })
        .skip(
          (currentPage - 1) *
            perPage
        )
        .limit(perPage)
        .lean();

    return res.status(200).json({
      success: true,

      applications,

      pagination: {
        page: currentPage,
        limit: perPage,
        total,
        totalPages: Math.ceil(
          total / perPage
        ),
      },
    });
  } catch (error) {
    console.error(
      "Admin applications error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load applications",
    });
  }
};

/* =========================================================
   GET SINGLE APPLICATION
   GET /api/admin/applications/:id
========================================================= */

export const getApplicationById = async (
  req,
  res
) => {
  try {
    const application =
      await Application.findById(
        req.params.id
      )
        .populate(
          "user",
          "name email phone role"
        )
        .populate(
          "preferences.college",
          "collegeCode name district city branches fees cutoffs verified"
        )
        .populate(
          "allotment.college",
          "collegeCode name district city branches"
        )
        .populate(
          "adminReview.reviewedBy",
          "name email"
        )
        .lean();

    if (!application) {
      return res.status(404).json({
        success: false,
        message:
          "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    console.error(
      "Admin application error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        "Invalid application ID",
    });
  }
};

/* =========================================================
   REVIEW APPLICATION
   PATCH /api/admin/applications/:id/review
========================================================= */

export const reviewApplication = async (
  req,
  res
) => {
  try {
    const {
      remarks = "",
      status,
    } = req.body;

    const application =
      await Application.findById(
        req.params.id
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message:
          "Application not found",
      });
    }

    const allowedStatuses = [
      "Submitted",
      "Under Review",
      "Rejected",
    ];

    if (
      status &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid application status",
      });
    }

    application.adminReview = {
      reviewed: true,
      reviewedBy: req.user._id,
      reviewedAt: new Date(),
      remarks: String(
        remarks
      ).trim(),
    };

    if (status) {
      application.status = status;
    } else {
      application.status =
        "Under Review";
    }

    await application.save();

    return res.status(200).json({
      success: true,
      message:
        "Application reviewed successfully",
      application,
    });
  } catch (error) {
    console.error(
      "Review application error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to review application",
    });
  }
};

/* =========================================================
   ALLOT SEAT
   PATCH /api/admin/applications/:id/allot
========================================================= */

export const allotSeat = async (
  req,
  res
) => {
  try {
    const {
      collegeId,
      branchCode,
      round = "Round 1",
    } = req.body;

    if (
      !collegeId ||
      !branchCode
    ) {
      return res.status(400).json({
        success: false,
        message:
          "collegeId and branchCode are required",
      });
    }

    const application =
      await Application.findById(
        req.params.id
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message:
          "Application not found",
      });
    }

    if (
      application.status !==
      "Submitted"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only submitted applications can receive allotment",
      });
    }

    const college =
      await College.findOne({
        _id: collegeId,
        active: true,
      });

    if (!college) {
      return res.status(404).json({
        success: false,
        message:
          "College not found",
      });
    }

    const normalizedBranch =
      String(branchCode)
        .trim()
        .toUpperCase();

    const branch =
      college.branches.find(
        (item) =>
          item.code ===
          normalizedBranch
      );

    if (!branch) {
      return res.status(400).json({
        success: false,
        message:
          "Branch not found in selected college",
      });
    }

    application.allotment = {
      allotted: true,
      college: college._id,
      branchCode:
        branch.code,
      branchName:
        branch.name,
      round: String(round),
      status: "Allotted",
      allottedAt: new Date(),
    };

    application.status =
      "Seat Allotted";

    application.currentStep = 6;

    await application.save();

    return res.status(200).json({
      success: true,
      message:
        "Seat allotment recorded successfully",
      allotment:
        application.allotment,
    });
  } catch (error) {
    console.error(
      "Seat allotment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to allot seat",
    });
  }
};

/* =========================================================
   VERIFY COLLEGE DATA
   PATCH /api/admin/colleges/:id/verify
========================================================= */

export const verifyCollege = async (
  req,
  res
) => {
  try {
    const college =
      await College.findById(
        req.params.id
      );

    if (!college) {
      return res.status(404).json({
        success: false,
        message:
          "College not found",
      });
    }

    college.verified = true;
    college.verifiedAt =
      new Date();
    college.verifiedBy =
      req.user._id;

    await college.save();

    return res.status(200).json({
      success: true,
      message:
        "College data marked as verified",
      college,
    });
  } catch (error) {
    console.error(
      "Verify college error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        "Invalid college ID",
    });
  }
};

/* =========================================================
   HELPER
========================================================= */

const escapeRegex = (value) =>
  String(value).replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
