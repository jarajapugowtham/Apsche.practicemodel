import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  GraduationCap,
  Building2,
  RefreshCw,
  AlertCircle,
  X,
  SlidersHorizontal,
} from "lucide-react";

import { collegeAPI } from "../services/api.js";

const Colleges = () => {
  const [colleges, setColleges] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [branches, setBranches] = useState([]);

  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [branch, setBranch] = useState("");

  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD FILTER OPTIONS
  ========================================================= */

  const loadFilters = async () => {
    try {
      const [districtResponse, branchResponse] =
        await Promise.all([
          collegeAPI.getDistricts(),
          collegeAPI.getBranches(),
        ]);

      const districtData =
        districtResponse.data?.districts ||
        districtResponse.data?.data ||
        [];

      const branchData =
        branchResponse.data?.branches ||
        branchResponse.data?.data ||
        [];

      setDistricts(
        Array.isArray(districtData)
          ? districtData
          : []
      );

      setBranches(
        Array.isArray(branchData)
          ? branchData
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load filters:",
        err
      );
    }
  };

  /* =========================================================
     LOAD COLLEGES
  ========================================================= */

  const loadColleges = async (
    customFilters = {}
  ) => {
    try {
      setError("");

      if (colleges.length === 0) {
        setLoading(true);
      } else {
        setFilterLoading(true);
      }

      const params = {
        search:
          customFilters.search !== undefined
            ? customFilters.search
            : search,

        district:
          customFilters.district !== undefined
            ? customFilters.district
            : district,

        branch:
          customFilters.branch !== undefined
            ? customFilters.branch
            : branch,

        year: 2025,
      };

      Object.keys(params).forEach((key) => {
        if (
          params[key] === "" ||
          params[key] === null ||
          params[key] === undefined
        ) {
          delete params[key];
        }
      });

      const response =
        await collegeAPI.getAll(params);

      const data =
        response.data?.colleges ||
        response.data?.data ||
        [];

      setColleges(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load colleges:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load colleges. Please check your backend connection."
      );

      setColleges([]);
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadFilters();
    loadColleges();
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearch = (e) => {
    e.preventDefault();

    loadColleges({
      search,
      district,
      branch,
    });
  };

  /* =========================================================
     FILTER CHANGE
  ========================================================= */

  const handleDistrictChange = (e) => {
    const value = e.target.value;

    setDistrict(value);

    loadColleges({
      search,
      district: value,
      branch,
    });
  };

  const handleBranchChange = (e) => {
    const value = e.target.value;

    setBranch(value);

    loadColleges({
      search,
      district,
      branch: value,
    });
  };

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  const clearFilters = () => {
    setSearch("");
    setDistrict("");
    setBranch("");

    loadColleges({
      search: "",
      district: "",
      branch: "",
    });
  };

  /* =========================================================
     HELPERS
  ========================================================= */

  const getCollegeName = (college) =>
    college.name ||
    college.collegeName ||
    "College Name";

  const getCollegeCode = (college) =>
    college.collegeCode ||
    college.code ||
    "N/A";

  const getDistrict = (college) =>
    college.district ||
    college.location?.district ||
    "District not available";

  const getCity = (college) =>
    college.city ||
    college.location?.city ||
    "";

  const getCollegeType = (college) =>
    college.type ||
    "College";

  const getBranchesCount = (college) =>
    Array.isArray(college.branches)
      ? college.branches.length
      : 0;

  const hasActiveFilters =
    Boolean(search || district || branch);

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="colleges-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="colleges-header">
        <div>
          <Link
            to="/dashboard"
            className="back-link"
          >
            ← Back to Dashboard
          </Link>

          <h1>
            APSCHE College Search
          </h1>

          <p>
            Explore colleges, branches,
            fees and counselling information
            for 2025.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadColleges()}
          disabled={
            loading || filterLoading
          }
          className="refresh-button"
        >
          <RefreshCw
            size={18}
            className={
              loading || filterLoading
                ? "spin"
                : ""
            }
          />

          Refresh
        </button>
      </section>

      {/* =====================================================
          SEARCH + FILTERS
      ===================================================== */}

      <section className="college-filters">
        <div className="filter-heading">
          <div>
            <SlidersHorizontal size={20} />
            <strong>
              Find Your College
            </strong>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="clear-button"
            >
              <X size={16} />
              Clear Filters
            </button>
          )}
        </div>

        <form
          onSubmit={handleSearch}
          className="search-form"
        >
          <div className="search-box">
            <Search size={20} />

            <input
              type="search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search college name or code..."
              aria-label="Search colleges"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  loadColleges({
                    search: "",
                    district,
                    branch,
                  });
                }}
                className="input-clear"
                aria-label="Clear search"
              >
                <X size={17} />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="search-button"
            disabled={
              loading || filterLoading
            }
          >
            <Search size={18} />
            Search
          </button>
        </form>

        <div className="filter-grid">
          <div className="filter-field">
            <label htmlFor="district">
              District
            </label>

            <select
              id="district"
              value={district}
              onChange={
                handleDistrictChange
              }
            >
              <option value="">
                All Districts
              </option>

              {districts.map(
                (item, index) => {
                  const value =
                    typeof item === "string"
                      ? item
                      : item.value ||
                        item.name ||
                        item.district;

                  const label =
                    typeof item === "string"
                      ? item
                      : item.name ||
                        item.district ||
                        item.value;

                  return (
                    <option
                      key={`${value}-${index}`}
                      value={value}
                    >
                      {label}
                    </option>
                  );
                }
              )}
            </select>
          </div>

          <div className="filter-field">
            <label htmlFor="branch">
              Branch
            </label>

            <select
              id="branch"
              value={branch}
              onChange={
                handleBranchChange
              }
            >
              <option value="">
                All Branches
              </option>

              {branches.map(
                (item, index) => {
                  const value =
                    typeof item === "string"
                      ? item
                      : item.code ||
                        item.value ||
                        item.name;

                  const label =
                    typeof item === "string"
                      ? item
                      : item.name
                        ? `${item.code ? `${item.code} — ` : ""}${item.name}`
                        : item.code ||
                          item.value;

                  return (
                    <option
                      key={`${value}-${index}`}
                      value={value}
                    >
                      {label}
                    </option>
                  );
                }
              )}
            </select>
          </div>
        </div>
      </section>

      {/* =====================================================
          RESULT SUMMARY
      ===================================================== */}

      {!loading && !error && (
        <section className="results-summary">
          <div>
            <strong>
              {colleges.length}
            </strong>

            <span>
              {" "}
              {colleges.length === 1
                ? "college"
                : "colleges"}{" "}
              found
            </span>
          </div>

          {hasActiveFilters && (
            <div className="active-filter-text">
              Filters applied
            </div>
          )}
        </section>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <section className="error-box">
          <AlertCircle size={22} />

          <div>
            <strong>
              Unable to load colleges
            </strong>

            <p>{error}</p>

            <button
              type="button"
              onClick={() =>
                loadColleges()
              }
            >
              Try Again
            </button>
          </div>
        </section>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <section className="college-grid">
          {[1, 2, 3, 4, 5, 6].map(
            (item) => (
              <article
                key={item}
                className="college-card skeleton-card"
              >
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line short" />
                <div className="skeleton skeleton-box" />
              </article>
            )
          )}
        </section>
      )}

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {!loading &&
        !error &&
        colleges.length === 0 && (
          <section className="empty-state">
            <div className="empty-icon">
              <Building2 size={34} />
            </div>

            <h2>
              No colleges found
            </h2>

            <p>
              Try changing your search or
              filters to find colleges.
            </p>

            <button
              type="button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </section>
        )}

      {/* =====================================================
          COLLEGE RESULTS
      ===================================================== */}

      {!loading &&
        !error &&
        colleges.length > 0 && (
          <section className="college-grid">
            {colleges.map((college) => {
              const id =
                college._id ||
                college.id;

              const branchesCount =
                getBranchesCount(
                  college
                );

              return (
                <article
                  key={id}
                  className="college-card"
                >
                  <div className="college-card-top">
                    <div className="college-icon">
                      <Building2 size={24} />
                    </div>

                    <span className="college-type">
                      {getCollegeType(
                        college
                      )}
                    </span>
                  </div>

                  <div className="college-content">
                    <h2>
                      {getCollegeName(
                        college
                      )}
                    </h2>

                    <p className="college-code">
                      Code:{" "}
                      <strong>
                        {getCollegeCode(
                          college
                        )}
                      </strong>
                    </p>

                    <div className="college-location">
                      <MapPin size={17} />

                      <span>
                        {getDistrict(
                          college
                        )}

                        {getCity(
                          college
                        ) &&
                          ` • ${getCity(
                            college
                          )}`}
                      </span>
                    </div>

                    <div className="college-stats">
                      <div>
                        <GraduationCap
                          size={17}
                        />

                        <span>
                          {branchesCount}{" "}
                          {branchesCount === 1
                            ? "Branch"
                            : "Branches"}
                        </span>
                      </div>

                      <div>
                        <span>
                          {college.dataYear ||
                            2025}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="college-card-actions">
                    <Link
                      to={`/colleges/${id}`}
                      className="details-button"
                    >
                      View Details
                    </Link>

                    <Link
                      to={`/counselling?college=${id}`}
                      className="apply-button"
                    >
                      Add to Counselling
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}

      {/* =====================================================
          INLINE FILTER LOADING
      ===================================================== */}

      {!loading &&
        filterLoading && (
          <div className="filter-loading">
            <RefreshCw
              size={16}
              className="spin"
            />

            Updating results...
          </div>
        )}
    </main>
  );
};

export default Colleges;
