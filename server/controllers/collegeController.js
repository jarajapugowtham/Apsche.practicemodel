import College from "../models/College.js";

/* =========================================================
   GET ALL COLLEGES
   Supports:
   ?district=Visakhapatnam
   ?city=Visakhapatnam
   ?type=Government
   ?branch=CSE
   ?search=Andhra
   ?verified=true
   ?page=1
   ?limit=12
========================================================= */

export const getColleges = async (req, res) => {
  try {
    const {
      district,
      city,
      type,
      branch,
      search,
      verified,
    } = req.query;

    const page = Math.max(
      Number.parseInt(req.query.page || "1", 10),
      1
    );

    const limit = Math.min(
      Math.max(
        Number.parseInt(req.query.limit || "12", 10),
        1
      ),
      100
    );

    const filter = {
      active: true,
    };

    if (district) {
      filter.district = new RegExp(
        `^${escapeRegex(district)}$`,
        "i"
      );
    }

    if (city) {
      filter.city = new RegExp(
        `^${escapeRegex(city)}$`,
        "i"
      );
    }

    if (type) {
      filter.type = type;
    }

    if (branch) {
      filter["branches.code"] = branch.toUpperCase();
    }

    if (verified === "true") {
      filter.verified = true;
    }

    if (search?.trim()) {
      const searchRegex = new RegExp(
        escapeRegex(search.trim()),
        "i"
      );

      filter.$or = [
        { name: searchRegex },
        { shortName: searchRegex },
        { collegeCode: searchRegex },
        { district: searchRegex },
        { city: searchRegex },
      ];
    }

    const skip = (page - 1) * limit;

    const [colleges, total] = await Promise.all([
      College.find(filter)
        .sort({
          verified: -1,
          name: 1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      College.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: colleges,
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
    console.error("Get colleges error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch colleges",
    });
  }
};

/* =========================================================
   GET SINGLE COLLEGE
========================================================= */

export const getCollegeById = async (req, res) => {
  try {
    const college = await College.findOne({
      _id: req.params.id,
      active: true,
    }).lean();

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: college,
    });
  } catch (error) {
    console.error("Get college error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch college",
    });
  }
};

/* =========================================================
   SEARCH COLLEGES
========================================================= */

export const searchColleges = async (req, res) => {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const regex = new RegExp(
      escapeRegex(query),
      "i"
    );

    const colleges = await College.find({
      active: true,
      $or: [
        { name: regex },
        { shortName: regex },
        { collegeCode: regex },
        { district: regex },
        { city: regex },
      ],
    })
      .sort({
        verified: -1,
        name: 1,
      })
      .limit(25)
      .lean();

    return res.status(200).json({
      success: true,
      count: colleges.length,
      data: colleges,
    });
  } catch (error) {
    console.error("Search colleges error:", error);

    return res.status(500).json({
      success: false,
      message: "College search failed",
    });
  }
};

/* =========================================================
   GET COLLEGE BRANCHES
========================================================= */

export const getCollegeBranches = async (req, res) => {
  try {
    const college = await College.findOne({
      _id: req.params.id,
      active: true,
    })
      .select(
        "collegeCode name branches dataYear dataSource verified"
      )
      .lean();

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        collegeCode: college.collegeCode,
        collegeName: college.name,
        branches: college.branches || [],
        dataYear: college.dataYear,
        dataSource: college.dataSource,
        verified: college.verified,
      },
    });
  } catch (error) {
    console.error("Get branches error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch branches",
    });
  }
};

/* =========================================================
   GET COLLEGE FEES
========================================================= */

export const getCollegeFees = async (req, res) => {
  try {
    const college = await College.findOne({
      _id: req.params.id,
      active: true,
    })
      .select(
        "collegeCode name fees dataYear dataSource verified"
      )
      .lean();

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        collegeCode: college.collegeCode,
        collegeName: college.name,
        fees: college.fees || [],
        dataYear: college.dataYear,
        dataSource: college.dataSource,
        verified: college.verified,
      },
    });
  } catch (error) {
    console.error("Get fees error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch fees",
    });
  }
};

/* =========================================================
   GET COLLEGE CUTOFFS
========================================================= */

export const getCollegeCutoffs = async (req, res) => {
  try {
    const college = await College.findOne({
      _id: req.params.id,
      active: true,
    })
      .select(
        "collegeCode name cutoffs dataYear dataSource verified"
      )
      .lean();

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        collegeCode: college.collegeCode,
        collegeName: college.name,
        cutoffs: college.cutoffs || [],
        dataYear: college.dataYear,
        dataSource: college.dataSource,
        verified: college.verified,
      },
    });
  } catch (error) {
    console.error("Get cutoffs error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch cutoffs",
    });
  }
};

/* =========================================================
   GET DISTRICTS
========================================================= */

export const getDistricts = async (req, res) => {
  try {
    const districts = await College.distinct("district", {
      active: true,
    });

    districts.sort((a, b) =>
      a.localeCompare(b)
    );

    return res.status(200).json({
      success: true,
      count: districts.length,
      data: districts,
    });
  } catch (error) {
    console.error("Get districts error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch districts",
    });
  }
};

/* =========================================================
   GET BRANCH CODES
========================================================= */

export const getBranchCodes = async (req, res) => {
  try {
    const colleges = await College.find({
      active: true,
    })
      .select("branches.code branches.name")
      .lean();

    const branchMap = new Map();

    for (const college of colleges) {
      for (const branch of college.branches || []) {
        if (!branchMap.has(branch.code)) {
          branchMap.set(branch.code, {
            code: branch.code,
            name: branch.name,
          });
        }
      }
    }

    const branches = [...branchMap.values()].sort(
      (a, b) => a.code.localeCompare(b.code)
    );

    return res.status(200).json({
      success: true,
      count: branches.length,
      data: branches,
    });
  } catch (error) {
    console.error("Get branch codes error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch branch list",
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
