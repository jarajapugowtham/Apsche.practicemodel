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
  ArrowRight,
  ChevronRight,
  Home,
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
      console.error("Failed to load filters:", err);
    }
  };

  /* =========================================================
     LOAD COLLEGES
  ========================================================= */

  const loadColleges = async (customFilters = {}) => {
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

      const response = await collegeAPI.getAll(params);

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
      console.error("Failed to load colleges:", err);

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

  const hasActiveFilters = Boolean(
    search || district || branch
  );

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="colleges-page">

      {/* =====================================================
          PORTAL HEADER
      ===================================================== */}

      <header className="portal-header">
        <div className="header-inner">

          <Link to="/" className="brand">
            <div className="brand-mark">
              <GraduationCap size={25} />
            </div>

            <div>
              <strong>APSCHE</strong>
              <span>Counselling Portal</span>
            </div>
          </Link>

          <nav className="main-nav">

            <Link to="/">
              Home
            </Link>

            <Link
              to="/colleges"
              className="active-nav"
            >
              Colleges
            </Link>

            <Link to="/counselling">
              Counselling
            </Link>

            <Link to="/dashboard">
              Dashboard
            </Link>

            <Link
              to="/login"
              className="nav-register"
            >
              Login
            </Link>

          </nav>

        </div>
      </header>

      {/* =====================================================
          PAGE HERO
      ===================================================== */}

      <section className="college-hero">

        <div className="college-hero-inner">

          <div className="college-breadcrumb">

            <Link to="/">
              <Home size={14} />
              Home
            </Link>

            <ChevronRight size={14} />

            <span>
              Colleges
            </span>

          </div>

          <div className="college-hero-content">

            <div>

              <span className="section-label">
                COLLEGE DISCOVERY
              </span>

              <h1>
                Find Your
                <span> College.</span>
              </h1>

              <p>
                Explore colleges, branches, districts,
                academic information and counselling
                options through the APSCHE portal.
              </p>

            </div>

            <div className="college-hero-stat">

              <Building2 size={28} />

              <div>
                <strong>
                  {loading ? "—" : colleges.length}
                </strong>

                <span>
                  Colleges Found
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="college-directory-section">

        <div className="section-container">

          {/* =================================================
              SEARCH / FILTER CARD
          ================================================= */}

          <div className="college-filter-card">

            <div className="college-filter-top">

              <div className="filter-title">

                <div className="filter-title-icon">
                  <SlidersHorizontal size={21} />
                </div>

                <div>
                  <h2>
                    Find Your College
                  </h2>

                  <p>
                    Search by college name, district
                    or branch.
                  </p>
                </div>

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

            {/* SEARCH */}

            <form
              onSubmit={handleSearch}
              className="college-search-form"
            >

              <div className="college-search-input">

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
                    className="search-clear"
                    aria-label="Clear search"
                  >
                    <X size={17} />
                  </button>
                )}

              </div>

              <button
                type="submit"
                className="college-search-button"
                disabled={
                  loading || filterLoading
                }
              >
                <Search size={18} />
                Search
              </button>

            </form>

            {/* FILTERS */}

            <div className="college-filter-grid">

              <div className="college-filter-field">

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

              <div className="college-filter-field">

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

              <button
                type="button"
                className="refresh-directory"
                onClick={() =>
                  loadColleges()
                }
                disabled={
                  loading || filterLoading
                }
              >
                <RefreshCw
                  size={17}
                  className={
                    loading || filterLoading
                      ? "spin"
                      : ""
                  }
                />

                Refresh
              </button>

            </div>

          </div>

          {/* =================================================
              RESULT HEADER
          ================================================= */}

          {!loading && !error && (
            <div className="college-results-header">

              <div>
                <span className="section-label">
                  SEARCH RESULTS
                </span>

                <h2>
                  {colleges.length}{" "}
                  {colleges.length === 1
                    ? "College"
                    : "Colleges"}{" "}
                  Available
                </h2>
              </div>

              {hasActiveFilters && (
                <span className="filter-active-badge">
                  Filters Applied
                </span>
              )}

            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <section className="college-error">

              <div className="college-error-icon">
                <AlertCircle size={26} />
              </div>

              <div>

                <h3>
                  Unable to load colleges
                </h3>

                <p>
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    loadColleges()
                  }
                >
                  Try Again
                  <ArrowRight size={16} />
                </button>

              </div>

            </section>
          )}

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <section className="college-grid">

              {[1, 2, 3, 4, 5, 6].map(
                (item) => (
                  <article
                    key={item}
                    className="college-card skeleton-card"
                  >

                    <div className="skeleton skeleton-icon" />

                    <div className="skeleton skeleton-title" />

                    <div className="skeleton skeleton-line" />

                    <div className="skeleton skeleton-line short" />

                    <div className="skeleton skeleton-box" />

                  </article>
                )
              )}

            </section>
          )}

          {/* =================================================
              EMPTY
          ================================================= */}

          {!loading &&
            !error &&
            colleges.length === 0 && (
              <section className="college-empty">

                <div className="college-empty-icon">
                  <Building2 size={35} />
                </div>

                <span className="section-label">
                  NO RESULTS
                </span>

                <h2>
                  No colleges found
                </h2>

                <p>
                  Try changing your search or
                  filters to find available colleges.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                >
                  Clear Filters
                  <ArrowRight size={16} />
                </button>

              </section>
            )}

          {/* =================================================
              COLLEGE RESULTS
          ================================================= */}

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

                      {/* CARD TOP */}

                      <div className="college-card-top">

                        <div className="college-icon">
                          <Building2 size={23} />
                        </div>

                        <span className="college-type">
                          {getCollegeType(
                            college
                          )}
                        </span>

                      </div>

                      {/* CONTENT */}

                      <div className="college-content">

                        <h2>
                          {getCollegeName(
                            college
                          )}
                        </h2>

                        <p className="college-code">
                          College Code:{" "}
                          <strong>
                            {getCollegeCode(
                              college
                            )}
                          </strong>
                        </p>

                        <div className="college-location">

                          <MapPin size={16} />

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

                      {/* ACTIONS */}

                      <div className="college-card-actions">

                        <Link
                          to={`/colleges/${id}`}
                          className="details-button"
                        >
                          View Details
                          <ArrowRight size={16} />
                        </Link>

                        <Link
                          to={`/counselling?college=${id}`}
                          className="apply-button"
                        >
                          Add to Counselling
                          <ChevronRight size={16} />
                        </Link>

                      </div>

                    </article>
                  );
                })}

              </section>
            )}

          {/* =================================================
              FILTER LOADING
          ================================================= */}

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

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="portal-footer">

        <div className="footer-container">

          <div className="footer-brand">

            <div className="brand footer-brand-logo">

              <div className="brand-mark">
                <GraduationCap size={24} />
              </div>

              <div>
                <strong>APSCHE</strong>
                <span>Counselling Portal</span>
              </div>

            </div>

            <p>
              A student-focused college discovery
              and counselling portal for Andhra Pradesh.
            </p>

          </div>

          <div className="footer-column">

            <h4>Portal</h4>

            <Link to="/">
              Home
            </Link>

            <Link to="/colleges">
              Colleges
            </Link>

            <Link to="/counselling">
              Counselling
            </Link>

          </div>

          <div className="footer-column">

            <h4>Account</h4>

            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>

            <Link to="/dashboard">
              Dashboard
            </Link>

          </div>

          <div className="footer-column">

            <h4>Explore</h4>

            <Link to="/colleges">
              College Search
            </Link>

            <Link to="/counselling">
              Counselling
            </Link>

          </div>

        </div>

        <div className="footer-bottom">

          <span>
            © 2026 APSCHE Counselling Portal
          </span>

          <span>
            Student Admission Services
          </span>

        </div>

      </footer>

    </main>
  );
};

export default Colleges;
