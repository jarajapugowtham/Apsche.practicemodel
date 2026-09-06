import Application from "../models/Application.js";
import College from "../models/College.js";
import User from "../models/User.js";

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalStudents,
      totalApplications,
      submittedApplications,
      pendingApplications,
      allottedApplications,
      totalColleges,
      verifiedColleges,
    ] = await Promise.all([
      User.countDocuments({ role: "student" }),

      Application.countDocuments(),

      Application.countDocuments({
        status: "Submitted",
      }),

      Application.countDocuments({
        status: {
          $in: ["Submitted", "Under Review"],
        },
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
      data: {
        students: totalStudents,
        applications: totalApplications,
        submittedApplications,
        pendingApplications,
        allottedApplications,
        colleges: totalColleges,
        verifiedColleges,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load admin dashboard",
    });
  }
};

/* =========================================================
   GET APPLICATIONS
========================================================= */

export const getApplications = async (req, res) => {
  try {
    const {
      status,
      search,
      year,
    } = req.query;

    const page = Math.max(
      parseInt(req.query.page || "1", 10),
      1
    );

    const limit = Math.min(
      Math.max(
        parseInt(req.query.limit || "20", 10),
        1
      ),
      100
    );

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (year) {
      filter.counsellingYear = year;
    }

    if (search?.trim()) {
      const regex = new RegExp(
        escapeRegex(search.trim()),
        "i"
      );

      const users = await User.find({
        $or: [
          { name: regex },
          { email: regex },
        ],
      }).select("_id");

      filter.$or = [
        {
          applicationNumber: regex,
        },
        {
          "studentDetails.fullName": regex,
        },
        {
          "studentDetails.hallTicketNumber": regex,
        },
        {
          user: {
            $in: users.map((user) => user._id),
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [applications, total] =
      await Promise.all([
        Application.find(filter)
          .populate(
            "user",
            "name email phone role"
          )
          .populate(
            "allotment.college",
            "collegeCode name district city"
          )
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit)
          .lean(),

        Application.countDocuments(filter),
      ]);

    return res.status(200).json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get applications error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load applications",
    });
  }
};

/* =========================================================
   GET SINGLE APPLICATION
========================================================= */

export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(
      req.params.id
    )
      .populate(
        "user",
        "name email phone role"
      )
      .populate(
        "preferences.college",
        "collegeCode name shortName district city type branches"
      )
      .populate(
        "allotment.college",
        "collegeCode name shortName district city"
      )
      .populate(
        "adminReview.reviewedBy",
        "name email"
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error(
      "Get application by ID error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load application",
    });
  }
};

/* =========================================================
   REVIEW APPLICATION
========================================================= */

export const reviewApplication = async (req, res) => {
  try {
    const {
      status,
      remarks = "",
    } = req.body;

    const allowedStatuses = [
      "Under Review",
      "Submitted",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review status",
      });
    }

    const application =
      await Application.findById(
        req.params.id
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    application.status = status;

    application.adminReview = {
      reviewed: true,
      reviewedBy: req.user._id,
      reviewedAt: new Date(),
      remarks: remarks.trim(),
    };

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application reviewed successfully",
      data: application,
    });
  } catch (error) {
    console.error(
      "Review application error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to review application",
    });
  }
};

/* =========================================================
   ALLOT SEAT
========================================================= */

export const allotSeat = async (req, res) => {
  try {
    const {
      collegeId,
      branchCode,
      round,
    } = req.body;

    if (
      !collegeId ||
      !branchCode ||
      !round
    ) {
      return res.status(400).json({
        success: false,
        message:
          "College, branch and counselling round are required",
      });
    }

    const application =
      await Application.findById(
        req.params.id
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    if (
      ![
        "Submitted",
        "Under Review",
        "Options Locked",
      ].includes(application.status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Application is not eligible for allotment",
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

    const branch = (
      college.branches || []
    ).find(
      (item) =>
        item.code?.toUpperCase() ===
        branchCode.toUpperCase()
    );

    if (!branch) {
      return res.status(400).json({
        success: false,
        message:
          "Branch does not exist in this college",
      });
    }

    application.allotment = {
      allotted: true,
      college: college._id,
      branchCode: branch.code,
      branchName: branch.name,
      round: round.trim(),
      allottedAt: new Date(),
      status: "Allotted",
    };

    application.status = "Seat Allotted";

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Seat allotted successfully",
      data: application,
    });
  } catch (error) {
    console.error("Seat allotment error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to allot seat",
    });
  }
};

/* =========================================================
   UPDATE COLLEGE VERIFICATION
========================================================= */

export const verifyCollege = async (req, res) => {
  try {
    const {
      verified,
    } = req.body;

    if (typeof verified !== "boolean") {
      return res.status(400).json({
        success: false,
        message:
          "verified must be true or false",
      });
    }

    const college =
      await College.findByIdAndUpdate(
        req.params.id,
        {
          verified,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: verified
        ? "College marked as verified"
        : "College verification removed",
      data: college,
    });
  } catch (error) {
    console.error(
      "Verify college error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update college verification",
    });
  }
};

/* =========================================================
   GET STUDENTS
========================================================= */

export const getStudents = async (req, res) => {
  try {
    const page = Math.max(
      parseInt(req.query.page || "1", 10),
      1
    );

    const limit = Math.min(
      Math.max(
        parseInt(req.query.limit || "20", 10),
        1
      ),
      100
    );

    const search =
      req.query.search?.trim();

    const filter = {
      role: "student",
    };

    if (search) {
      const regex = new RegExp(
        escapeRegex(search),
        "i"
      );

      filter.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { hallTicketNumber: regex },
      ];
    }

    const skip = (page - 1) * limit;

    const [
      students,
      total,
    ] = await Promise.all([
      User.find(filter)
        .select(
          "-password"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: students,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit
        ),
      },
    });
  } catch (error) {
    console.error(
      "Get students error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load students",
    });
  }
};

/* =========================================================
   HELPER
========================================================= */

const escapeRegex = (value) => {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};
