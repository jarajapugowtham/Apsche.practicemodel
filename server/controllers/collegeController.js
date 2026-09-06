import College from "../models/College.js";

/* =========================================================
   GET ALL COLLEGES
   GET /api/colleges
========================================================= */

export const getColleges = async (req, res) => {
  try {
    const {
      search = "",
      district = "",
      city = "",
      type = "",
      branch = "",
      year = "2025",
      verified = "true",
      page = 1,
      limit = 20,
    } = req.query;

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const perPage = Math.min(
      Math.max(Number(limit) || 20, 1),
      100
    );

    const query = {
      active: true,
    };

    /* -------------------------------------------------------
       YEAR
    ------------------------------------------------------- */

    if (year) {
      query.dataYear = String(year);
    }

    /* -------------------------------------------------------
       VERIFIED DATA
    ------------------------------------------------------- */

    if (verified === "true") {
      query.verified = true;
    }

    /* -------------------------------------------------------
       DISTRICT
    ------------------------------------------------------- */

    if (district) {
      query.district = {
        $regex: `^${escapeRegex(district)}$`,
        $options: "i",
      };
    }

    /* -------------------------------------------------------
       CITY
    ------------------------------------------------------- */

    if (city) {
      query.city = {
        $regex: escapeRegex(city),
        $options: "i",
      };
    }

    /* -------------------------------------------------------
       COLLEGE TYPE
    ------------------------------------------------------- */

    if (type) {
      query.type = type;
    }

    /* -------------------------------------------------------
       BRANCH
    ------------------------------------------------------- */

    if (branch) {
      query["branches.code"] = String(
        branch
      ).toUpperCase();
    }

    /* -------------------------------------------------------
       SEARCH
    ------------------------------------------------------- */

    if (search.trim()) {
      query.$or = [
        {
          name: {
            $regex: escapeRegex(search),
            $options: "i",
          },
        },
        {
          shortName: {
            $regex: escapeRegex(search),
            $options: "i",
          },
        },
        {
          collegeCode: {
            $regex: escapeRegex(search),
            $options: "i",
          },
        },
        {
          district: {
            $regex: escapeRegex(search),
            $options: "i",
          },
        },
        {
          city: {
            $regex: escapeRegex(search),
            $options: "i",
          },
        },
      ];
    }

    const total =
      await College.countDocuments(query);

    const colleges =
      await College.find(query)
        .select(
          [
            "collegeCode",
            "name",
            "shortName",
            "type",
            "status",
            "district",
            "city",
            "university",
            "autonomous",
            "accreditation",
            "branches",
            "fees",
            "cutoffs",
            "website",
            "verified",
            "dataYear",
            "dataSource",
            "sourceUrl",
          ].join(" ")
        )
        .sort({
          name: 1,
        })
        .skip(
          (currentPage - 1) *
            perPage
        )
        .limit(perPage)
        .lean();

    return res.status(200).json({
      success: true,

      data: colleges,

      pagination: {
        page: currentPage,
        limit: perPage,
        total,
        totalPages: Math.ceil(
          total / perPage
        ),
        hasNextPage:
          currentPage <
          Math.ceil(
            total / perPage
          ),
        hasPreviousPage:
          currentPage > 1,
      },

      filters: {
        search,
        district,
        city,
        type,
        branch,
        year,
        verified,
      },
    });
  } catch (error) {
    console.error(
      "Get colleges error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load colleges",
    });
  }
};

/* =========================================================
   GET SINGLE COLLEGE
   GET /api/colleges/:id
========================================================= */

export const getCollegeById = async (
  req,
  res
) => {
  try {
    const college =
      await College.findOne({
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
      college,
    });
  } catch (error) {
    console.error(
      "Get college error:",
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
   GET DISTRICTS
   GET /api/colleges/districts/list
========================================================= */

export const getDistricts = async (
  req,
  res
) => {
  try {
    const districts =
      await College.distinct(
        "district",
        {
          active: true,
        }
      );

    districts.sort((a, b) =>
      a.localeCompare(b)
    );

    return res.status(200).json({
      success: true,
      districts,
      count: districts.length,
    });
  } catch (error) {
    console.error(
      "Get districts error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load districts",
    });
  }
};

/* =========================================================
   GET BRANCHES
   GET /api/colleges/branches/list
========================================================= */

export const getBranches = async (
  req,
  res
) => {
  try {
    const colleges =
      await College.find({
        active: true,
      })
        .select("branches")
        .lean();

    const branchMap = new Map();

    colleges.forEach((college) => {
      college.branches.forEach(
        (branch) => {
          if (
            branch.code &&
            branch.name &&
            branch.active !== false
          ) {
            branchMap.set(
              branch.code,
              {
                code: branch.code,
                name: branch.name,
              }
            );
          }
        }
      );
    });

    const branches =
      Array.from(
        branchMap.values()
      ).sort((a, b) =>
        a.name.localeCompare(b.name)
      );

    return res.status(200).json({
      success: true,
      branches,
      count: branches.length,
    });
  } catch (error) {
    console.error(
      "Get branches error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load branches",
    });
  }
};

/* =========================================================
   GET COLLEGE CUTOFFS
   GET /api/colleges/:id/cutoffs
========================================================= */

export const getCollegeCutoffs = async (
  req,
  res
) => {
  try {
    const {
      year = "2025",
      branch = "",
      category = "",
    } = req.query;

    const college =
      await College.findOne({
        _id: req.params.id,
        active: true,
      })
        .select(
          "collegeCode name cutoffs"
        )
        .lean();

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    let cutoffs =
      college.cutoffs || [];

    cutoffs = cutoffs.filter(
      (cutoff) =>
        cutoff.counsellingYear ===
        String(year)
    );

    if (branch) {
      cutoffs = cutoffs.filter(
        (cutoff) =>
          cutoff.branchCode ===
          String(branch).toUpperCase()
      );
    }

    if (category) {
      cutoffs = cutoffs.filter(
        (cutoff) =>
          cutoff.category ===
          String(category).toUpperCase()
      );
    }

    return res.status(200).json({
      success: true,

      college: {
        id: college._id,
        collegeCode:
          college.collegeCode,
        name: college.name,
      },

      year: String(year),

      cutoffs,
      count: cutoffs.length,
    });
  } catch (error) {
    console.error(
      "Get cutoffs error:",
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
   GET COLLEGE FEES
   GET /api/colleges/:id/fees
========================================================= */

export const getCollegeFees = async (
  req,
  res
) => {
  try {
    const {
      year = "2025",
      category = "",
    } = req.query;

    const college =
      await College.findOne({
        _id: req.params.id,
        active: true,
      })
        .select(
          "collegeCode name fees"
        )
        .lean();

    if (!college) {
      return res.status(404).json({
        success: false,
        message: "College not found",
      });
    }

    let fees = college.fees || [];

    fees = fees.filter(
      (fee) =>
        fee.academicYear ===
        String(year)
    );

    if (category) {
      fees = fees.filter(
        (fee) =>
          fee.category ===
          String(category).toUpperCase()
      );
    }

    return res.status(200).json({
      success: true,

      college: {
        id: college._id,
        collegeCode:
          college.collegeCode,
        name: college.name,
      },

      year: String(year),

      fees,
      count: fees.length,
    });
  } catch (error) {
    console.error(
      "Get fees error:",
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
