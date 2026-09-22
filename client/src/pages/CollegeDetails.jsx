import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  MapPin,
  GraduationCap,
  IndianRupee,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
} from "lucide-react";

import { collegeAPI } from "../services/api.js";

const CollegeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [college, setCollege] = useState(null);
  const [fees, setFees] = useState([]);
  const [cutoffs, setCutoffs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD COLLEGE DETAILS
  ========================================================= */

  useEffect(() => {
    const loadCollegeDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          collegeResponse,
          feesResponse,
          cutoffsResponse,
        ] = await Promise.all([
          collegeAPI.getById(id),
          collegeAPI.getFees(id),
          collegeAPI.getCutoffs(id),
        ]);

        const collegeData =
          collegeResponse.data?.college ||
          collegeResponse.data?.data ||
          collegeResponse.data;

        const feesData =
          feesResponse.data?.fees ||
          feesResponse.data?.data ||
          [];

        const cutoffsData =
          cutoffsResponse.data?.cutoffs ||
          cutoffsResponse.data?.data ||
          [];

        setCollege(collegeData);
        setFees(
          Array.isArray(feesData)
            ? feesData
            : []
        );
        setCutoffs(
          Array.isArray(cutoffsData)
            ? cutoffsData
            : []
        );
      } catch (err) {
        console.error(
          "Failed to load college:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load college details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCollegeDetails();
    }
  }, [id]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="college-details-page">
        <div className="details-loading">
          <Loader2
            size={40}
            className="spin"
          />

          <h2>
            Loading college details...
          </h2>

          <p>
            Please wait while we fetch the
            latest available information.
          </p>
        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !college) {
    return (
      <main className="college-details-page">
        <section className="details-error">
          <AlertCircle size={42} />

          <h1>
            College Not Found
          </h1>

          <p>
            {error ||
              "The requested college could not be found."}
          </p>

          <Link
            to="/colleges"
            className="details-back-button"
          >
            <ArrowLeft size={18} />
            Back to Colleges
          </Link>
        </section>
      </main>
    );
  }

  /* =========================================================
     HELPERS
  ========================================================= */

  const collegeName =
    college.name ||
    college.collegeName ||
    "College";

  const collegeCode =
    college.collegeCode ||
    college.code ||
    "N/A";

  const district =
    college.district ||
    college.location?.district ||
    "Not available";

  const city =
    college.city ||
    college.location?.city ||
    "";

  const type =
    college.type ||
    "College";

  const branches = Array.isArray(
    college.branches
  )
    ? college.branches
    : [];

  const isVerified =
    college.verified === true;

  /* =========================================================
     COUNSELLING
  ========================================================= */

  const handleCounselling = (
    branch
  ) => {
    const branchCode =
      branch.code || "";

    navigate(
      `/counselling?college=${college._id}&branch=${encodeURIComponent(
        branchCode
      )}`
    );
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="college-details-page">

      {/* =====================================================
          BACK
      ===================================================== */}

      <Link
        to="/colleges"
        className="details-back-link"
      >
        <ArrowLeft size={18} />
        Back to College Search
      </Link>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="college-hero">

        <div className="college-hero-icon">
          <Building2 size={42} />
        </div>

        <div className="college-hero-content">

          <div className="college-badges">
            <span className="college-type-badge">
              {type}
            </span>

            {isVerified ? (
              <span className="verified-badge">
                <CheckCircle2 size={15} />
                Verified
              </span>
            ) : (
              <span className="unverified-badge">
                Verification Pending
              </span>
            )}
          </div>

          <h1>
            {collegeName}
          </h1>

          <p className="college-code-large">
            College Code:{" "}
            <strong>
              {collegeCode}
            </strong>
          </p>

          <div className="hero-location">
            <MapPin size={18} />

            <span>
              {district}
              {city &&
                ` • ${city}`}
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK INFORMATION
      ===================================================== */}

      <section className="college-info-grid">

        <div className="info-card">
          <Building2 size={22} />

          <div>
            <span>
              College Type
            </span>

            <strong>
              {type}
            </strong>
          </div>
        </div>

        <div className="info-card">
          <GraduationCap size={22} />

          <div>
            <span>
              Available Branches
            </span>

            <strong>
              {branches.length}
            </strong>
          </div>
        </div>

        <div className="info-card">
          <BarChart3 size={22} />

          <div>
            <span>
              Cutoff Records
            </span>

            <strong>
              {cutoffs.length}
            </strong>
          </div>
        </div>

        <div className="info-card">
          <IndianRupee size={22} />

          <div>
            <span>
              Fee Records
            </span>

            <strong>
              {fees.length}
            </strong>
          </div>
        </div>

      </section>

      {/* =====================================================
          LOCATION / BASIC INFORMATION
      ===================================================== */}

      <section className="details-section">

        <div className="section-heading">
          <div>
            <h2>
              College Information
            </h2>

            <p>
              Basic information about this
              institution.
            </p>
          </div>
        </div>

        <div className="basic-info-grid">

          <div>
            <span>
              College Code
            </span>

            <strong>
              {collegeCode}
            </strong>
          </div>

          <div>
            <span>
              District
            </span>

            <strong>
              {district}
            </strong>
          </div>

          <div>
            <span>
              City
            </span>

            <strong>
              {city || "Not available"}
            </strong>
          </div>

          <div>
            <span>
              University
            </span>

            <strong>
              {college.university ||
                "Not available"}
            </strong>
          </div>

          <div>
            <span>
              Affiliation
            </span>

            <strong>
              {college.affiliation ||
                "Not available"}
            </strong>
          </div>

          <div>
            <span>
              Data Year
            </span>

            <strong>
              {college.dataYear ||
                "2025"}
            </strong>
          </div>

        </div>

      </section>

      {/* =====================================================
          BRANCHES
      ===================================================== */}

      <section className="details-section">

        <div className="section-heading">
          <div>
            <h2>
              Available Branches
            </h2>

            <p>
              Select a branch to continue
              with counselling.
            </p>
          </div>
        </div>

        {branches.length === 0 ? (
          <div className="empty-details">
            <GraduationCap size={30} />

            <p>
              No branch information is
              currently available.
            </p>
          </div>
        ) : (
          <div className="branch-list">

            {branches.map(
              (branch, index) => (
                <article
                  key={
                    branch.code ||
                    `${branch.name}-${index}`
                  }
                  className="branch-card"
                >
                  <div className="branch-main">

                    <div className="branch-icon">
                      <GraduationCap
                        size={22}
                      />
                    </div>

                    <div>
                      <h3>
                        {branch.name ||
                          "Branch"}
                      </h3>

                      <p>
                        Code:{" "}
                        <strong>
                          {branch.code ||
                            "N/A"}
                        </strong>
                      </p>
                    </div>

                  </div>

                  <div className="branch-meta">

                    <span>
                      Intake:{" "}
                      <strong>
                        {branch.intake ??
                          "N/A"}
                      </strong>
                    </span>

                    <span>
                      Duration:{" "}
                      <strong>
                        {branch.durationYears
                          ? `${branch.durationYears} Years`
                          : "N/A"}
                      </strong>
                    </span>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleCounselling(
                        branch
                      )
                    }
                    className="branch-select-button"
                  >
                    <Plus size={17} />
                    Add to Counselling
                  </button>
                </article>
              )
            )}

          </div>
        )}

      </section>

      {/* =====================================================
          FEES
      ===================================================== */}

      <section className="details-section">

        <div className="section-heading">
          <div>
            <h2>
              Fee Information
            </h2>

            <p>
              Available fee records for
              this college.
            </p>
          </div>
        </div>

        {fees.length === 0 ? (
          <div className="empty-details">
            <IndianRupee size={30} />

            <p>
              No fee information is
              currently available.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">

            <table>
              <thead>
                <tr>
                  <th>
                    Academic Year
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Tuition Fee
                  </th>

                  <th>
                    Other Fee
                  </th>

                  <th>
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {fees.map(
                  (fee, index) => (
                    <tr
                      key={
                        fee._id ||
                        `${fee.academicYear}-${fee.category}-${index}`
                      }
                    >
                      <td>
                        {fee.academicYear ||
                          "N/A"}
                      </td>

                      <td>
                        {fee.category ||
                          "General"}
                      </td>

                      <td>
                        ₹
                        {Number(
                          fee.tuitionFee || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td>
                        ₹
                        {Number(
                          fee.otherFee || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td>
                        <strong>
                          ₹
                          {Number(
                            fee.totalFee ||
                              Number(
                                fee.tuitionFee ||
                                  0
                              ) +
                                Number(
                                  fee.otherFee ||
                                    0
                                )
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

          </div>
        )}

      </section>

      {/* =====================================================
          CUTOFFS
      ===================================================== */}

      <section className="details-section">

        <div className="section-heading">
          <div>
            <h2>
              Previous Cutoff Records
            </h2>

            <p>
              Available counselling cutoff
              information.
            </p>
          </div>
        </div>

        {cutoffs.length === 0 ? (
          <div className="empty-details">
            <BarChart3 size={30} />

            <p>
              No cutoff information is
              currently available.
            </p>
          </div>
        ) : (
          <div className="table-wrapper">

            <table>
              <thead>
                <tr>
                  <th>
                    Year
                  </th>

                  <th>
                    Phase
                  </th>

                  <th>
                    Branch
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Opening Rank
                  </th>

                  <th>
                    Closing Rank
                  </th>
                </tr>
              </thead>

              <tbody>
                {cutoffs.map(
                  (cutoff, index) => (
                    <tr
                      key={
                        cutoff._id ||
                        `${cutoff.counsellingYear}-${cutoff.branchCode}-${index}`
                      }
                    >
                      <td>
                        {cutoff.counsellingYear ||
                          "N/A"}
                      </td>

                      <td>
                        {cutoff.phase ||
                          "N/A"}
                      </td>

                      <td>
                        {cutoff.branchCode ||
                          cutoff.branchName ||
                          "N/A"}
                      </td>

                      <td>
                        {cutoff.category ||
                          "N/A"}
                      </td>

                      <td>
                        {cutoff.openingRank ??
                          "N/A"}
                      </td>

                      <td>
                        <strong>
                          {cutoff.closingRank ??
                            "N/A"}
                        </strong>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

          </div>
        )}

      </section>

      {/* =====================================================
          BOTTOM ACTION
      ===================================================== */}

      <section className="counselling-callout">

        <div>
          <h2>
            Ready to choose your college?
          </h2>

          <p>
            Select a branch above or start
            building your counselling
            preferences.
          </p>
        </div>

        <Link
          to={`/counselling?college=${college._id}`}
          className="start-counselling-button"
        >
          Start Counselling
        </Link>

      </section>

    </main>
  );
};

export default CollegeDetails;
