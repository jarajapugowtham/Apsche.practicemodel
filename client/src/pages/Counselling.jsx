import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lock,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  Trash2,
  UserRound,
  GraduationCap,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

import {
  applicationAPI,
  collegeAPI,
} from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const Counselling = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const selectedCollegeFromUrl =
    searchParams.get("college");

  const selectedBranchFromUrl =
    searchParams.get("branch");

  const [application, setApplication] =
    useState(null);

  const [colleges, setColleges] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [collegeLoading, setCollegeLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [collegeSearch, setCollegeSearch] =
    useState("");

  const [selectedCollege, setSelectedCollege] =
    useState(selectedCollegeFromUrl || "");

  const [selectedBranch, setSelectedBranch] =
    useState(selectedBranchFromUrl || "");

  const [studentDetails, setStudentDetails] =
    useState({
      fullName: "",
      hallTicketNumber: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      category: "",
      localArea: "",
      rank: "",
    });

  const [preferences, setPreferences] =
    useState([]);

  const [openPreference, setOpenPreference] =
    useState(null);

  /* =======================================================
     LOAD APPLICATION
  ======================================================= */

  const loadApplication = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      let response;

      try {
        response =
          await applicationAPI.getMine({
            year: "2025",
          });
      } catch (requestError) {
        if (
          requestError.response?.status !==
          404
        ) {
          throw requestError;
        }

        const createResponse =
          await applicationAPI.create({
            counsellingYear: "2025",
          });

        response = createResponse;
      }

      const app =
        response.data?.application;

      if (!app) {
        throw new Error(
          "Application data was not returned by the server."
        );
      }

      setApplication(app);

      const details =
        app.studentDetails || {};

      setStudentDetails({
        fullName:
          details.fullName ||
          user?.name ||
          "",
        hallTicketNumber:
          details.hallTicketNumber || "",
        email:
          details.email ||
          user?.email ||
          "",
        phone:
          details.phone ||
          user?.phone ||
          "",
        dateOfBirth:
          details.dateOfBirth || "",
        gender:
          details.gender || "",
        category:
          details.category || "",
        localArea:
          details.localArea || "",
        rank:
          details.rank === null ||
          details.rank === undefined
            ? ""
            : String(details.rank),
      });

      setPreferences(
        Array.isArray(app.preferences)
          ? app.preferences.map(
              (item, index) => ({
                priority: index + 1,
                college:
                  item.college?._id ||
                  item.college ||
                  "",
                collegeName:
                  item.college?.name ||
                  "",
                branchCode:
                  item.branchCode || "",
                branchName:
                  item.branchName || "",
              })
            )
          : []
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load counselling application."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     LOAD COLLEGES
  ======================================================= */

  const loadColleges = async () => {
    try {
      setCollegeLoading(true);

      const response =
        await collegeAPI.getAll({
          search: collegeSearch,
          limit: 100,
          year: "2025",
        });

      const data =
        response.data?.colleges ||
        response.data?.data ||
        [];

      setColleges(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load colleges."
      );
    } finally {
      setCollegeLoading(false);
    }
  };

  useEffect(() => {
    loadApplication();
  }, []);

  useEffect(() => {
    if (!application) return;

    const timer = setTimeout(() => {
      loadColleges();
    }, 350);

    return () => clearTimeout(timer);
  }, [collegeSearch, application]);

  /* =======================================================
     FORM HANDLERS
  ======================================================= */

  const handleStudentChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setStudentDetails(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  /* =======================================================
     SAVE STUDENT DETAILS
  ======================================================= */

  const saveStudentDetails = async () => {
    if (!application?._id) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        fullName:
          studentDetails.fullName.trim(),

        hallTicketNumber:
          studentDetails.hallTicketNumber.trim(),

        phone:
          studentDetails.phone.trim(),

        dateOfBirth:
          studentDetails.dateOfBirth,

        gender:
          studentDetails.gender,

        category:
          studentDetails.category,

        localArea:
          studentDetails.localArea,

        rank:
          studentDetails.rank === ""
            ? null
            : Number(studentDetails.rank),
      };

      const response =
        await applicationAPI.updateDetails(
          application._id,
          payload
        );

      if (response.data?.application) {
        setApplication(
          response.data.application
        );
      }

      setSuccess(
        response.data?.message ||
          "Student details saved successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save student details."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     SELECT COLLEGE
  ======================================================= */

  const selectedCollegeObject =
    useMemo(
      () =>
        colleges.find(
          (college) =>
            college._id ===
            selectedCollege
        ),
      [
        colleges,
        selectedCollege,
      ]
    );

  const availableBranches =
    selectedCollegeObject?.branches ||
    [];

  /* =======================================================
     ADD PREFERENCE
  ======================================================= */

  const addPreference = () => {
    setError("");
    setSuccess("");

    if (!selectedCollege) {
      setError(
        "Please select a college."
      );
      return;
    }

    if (!selectedBranch) {
      setError(
        "Please select a branch."
      );
      return;
    }

    if (preferences.length >= 20) {
      setError(
        "Maximum 20 preferences are allowed."
      );
      return;
    }

    const alreadyExists =
      preferences.some(
        (item) =>
          item.college ===
            selectedCollege &&
          item.branchCode ===
            selectedBranch
      );

    if (alreadyExists) {
      setError(
        "This college and branch is already added."
      );
      return;
    }

    const branch =
      availableBranches.find(
        (item) =>
          item.code ===
          selectedBranch
      );

    const college =
      selectedCollegeObject;

    setPreferences(
      (previous) => [
        ...previous,
        {
          priority:
            previous.length + 1,
          college:
            college._id,
          collegeName:
            college.name,
          branchCode:
            selectedBranch,
          branchName:
            branch?.name ||
            selectedBranch,
        },
      ]
    );

    setSelectedCollege("");
    setSelectedBranch("");

    setSuccess(
      "Preference added. Save your preferences when finished."
    );
  };

  /* =======================================================
     REMOVE PREFERENCE
  ======================================================= */

  const removePreference = (index) => {
    setPreferences(
      (previous) =>
        previous
          .filter(
            (_, itemIndex) =>
              itemIndex !== index
          )
          .map(
            (item, itemIndex) => ({
              ...item,
              priority:
                itemIndex + 1,
            })
          )
    );
  };

  /* =======================================================
     MOVE PREFERENCE
  ======================================================= */

  const movePreference = (
    index,
    direction
  ) => {
    const newIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      newIndex < 0 ||
      newIndex >=
        preferences.length
    ) {
      return;
    }

    const updated = [
      ...preferences,
    ];

    [
      updated[index],
      updated[newIndex],
    ] = [
      updated[newIndex],
      updated[index],
    ];

    setPreferences(
      updated.map(
        (item, itemIndex) => ({
          ...item,
          priority:
            itemIndex + 1,
        })
      )
    );
  };

  /* =======================================================
     SAVE PREFERENCES
  ======================================================= */

  const savePreferences = async () => {
    if (!application?._id) return;

    if (preferences.length === 0) {
      setError(
        "Add at least one college preference."
      );
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload =
        preferences.map(
          (item) => ({
            college:
              item.college,
            branchCode:
              item.branchCode,
            branchName:
              item.branchName,
          })
        );

      const response =
        await applicationAPI.savePreferences(
          application._id,
          payload
        );

      setSuccess(
        response.data?.message ||
          "Preferences saved successfully."
      );

      await loadApplication();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save preferences."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     LOCK PREFERENCES
  ======================================================= */

  const lockPreferences = async () => {
    if (!application?._id) return;

    if (preferences.length === 0) {
      setError(
        "Add at least one preference before locking."
      );
      return;
    }

    const confirmed =
      window.confirm(
        "Lock your college preferences? You will not be able to change them afterwards."
      );

    if (!confirmed) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response =
        await applicationAPI.lockPreferences(
          application._id
        );

      if (response.data?.application) {
        setApplication(
          response.data.application
        );
      }

      setSuccess(
        response.data?.message ||
          "College preferences locked successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to lock preferences."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     SUBMIT APPLICATION
  ======================================================= */

  const submitApplication = async () => {
    if (!application?._id) return;

    const confirmed =
      window.confirm(
        "Submit your APSCHE counselling application? Make sure all details and preferences are correct."
      );

    if (!confirmed) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response =
        await applicationAPI.submit(
          application._id
        );

      if (response.data?.application) {
        setApplication(
          response.data.application
        );
      }

      setSuccess(
        response.data?.message ||
          "Counselling application submitted successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to submit application."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     STATUS HELPERS
  ======================================================= */

  const isDraft =
    application?.status ===
    "Draft";

  const isLocked =
    application?.status ===
    "Options Locked";

  const isSubmitted =
    application?.status ===
    "Submitted";

  const currentStep =
    application?.currentStep || 1;

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main className="counselling-page">
        <section className="counselling-loading">
          <RefreshCw
            size={32}
            className="spin"
          />

          <h2>
            Loading Counselling
          </h2>

          <p>
            Preparing your application...
          </p>
        </section>
      </main>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="counselling-page">
      <div className="counselling-container">

        {/* HEADER */}

        <header className="counselling-header">
          <div>
            <p className="eyebrow">
              APSCHE 2025
            </p>

            <h1>
              Counselling Application
            </h1>

            <p>
              Complete your student details,
              choose college preferences,
              lock them and submit your
              application.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="back-link"
          >
            ← Dashboard
          </Link>
        </header>

        {/* APPLICATION INFO */}

        <section className="application-banner">
          <div>
            <span>
              Application Number
            </span>

            <strong>
              {application?.applicationNumber ||
                "Generating..."}
            </strong>
          </div>

          <div>
            <span>
              Counselling Year
            </span>

            <strong>
              {application?.counsellingYear ||
                "2025"}
            </strong>
          </div>

          <div>
            <span>
              Status
            </span>

            <strong>
              {application?.status ||
                "Draft"}
            </strong>
          </div>
        </section>

        {/* MESSAGES */}

        {error && (
          <div
            className="counselling-alert error"
            role="alert"
          >
            <AlertCircle size={19} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div
            className="counselling-alert success"
            role="status"
          >
            <CheckCircle2 size={19} />
            <span>{success}</span>
          </div>
        )}

        {/* STEPS */}

        <section className="steps">
          {[
            {
              number: 1,
              title: "Application",
            },
            {
              number: 2,
              title: "Student Details",
            },
            {
              number: 3,
              title: "College Selection",
            },
            {
              number: 4,
              title: "Preferences",
            },
            {
              number: 5,
              title: "Lock",
            },
            {
              number: 6,
              title: "Submit",
            },
          ].map((step) => (
            <div
              key={step.number}
              className={`step ${
                currentStep >=
                step.number
                  ? "active"
                  : ""
              }`}
            >
              <div className="step-number">
                {currentStep >
                step.number ? (
                  <CheckCircle2
                    size={18}
                  />
                ) : (
                  step.number
                )}
              </div>

              <span>
                {step.title}
              </span>
            </div>
          ))}
        </section>

        {/* STUDENT DETAILS */}

        <section className="counselling-card">
          <div className="card-heading">
            <div className="heading-icon">
              <UserRound size={21} />
            </div>

            <div>
              <h2>
                Student Details
              </h2>

              <p>
                Enter your counselling
                information carefully.
              </p>
            </div>
          </div>

          <div className="form-grid">

            <label>
              Full Name *
              <input
                name="fullName"
                value={
                  studentDetails.fullName
                }
                onChange={
                  handleStudentChange
                }
                disabled={!isDraft}
                placeholder="Enter full name"
              />
            </label>

            <label>
              Hall Ticket Number
              <input
                name="hallTicketNumber"
                value={
                  studentDetails.hallTicketNumber
                }
                onChange={
                  handleStudentChange
                }
                disabled={!isDraft}
                placeholder="Enter hall ticket number"
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={
                  studentDetails.email
                }
                disabled
              />
            </label>

            <label>
              Phone Number
              <input
                name="phone"
                value={
                  studentDetails.phone
                }
                onChange={
                  handleStudentChange
                }
                disabled={!isDraft}
                placeholder="Enter phone number"
              />
            </label>

            <label>
              Date of Birth
              <input
                type="date"
                name="dateOfBirth"
                value={
                  studentDetails.dateOfBirth
                }
                onChange={
                  handleStudentChange
                }
                disabled={!isDraft}
              />
            </label>

            <label>
              Gender
              <select
                name="gender"
                value={
                  studentDetails.gender
                }
                onChange={
                  handleStudentChange
                }
                disabled={!isDraft}
              >
                <option value="">
                  Select gender
                </option>
                <option value="Male">
                  Male
                </option>
                <option value="Female">
                  Female
                </option>
                <option value="Other">
                  Other
                </option>
              </select>
            </label>

            <label>
              Category
              <select
                name="category"
                value={
                  studentDetails.category
                }
                onChange={
                  handleStudentChange
                }
                disabled={!isDraft}
              >
                <option value="">
                  Select category
                </option>
                <option value="OC">
                  OC
                </option>
                <option value="BC-A">
                  BC-A
                </option>
                <option value="BC-B">
                  BC-B
                </option>
                <option value="BC-C">
                  BC-C
                </option>
                <option value="BC-D">
                  BC-D
                </option>
                <option value="BC-E">
                  BC-E
                </option>
                <option value="SC">
                  SC
                </option>
                <option value="ST">
                  ST
                </option>
                <option value="EWS">
                  EWS
                </option>
              </select>
            </label>

            <label>
              Local Area
              <select
                name="localArea"
                value={
                  studentDetails.localArea
                }
                onChange={
                  handleStudentChange
                }
                disabled={!isDraft}
              >
                <option value="">
                  Select local area
                </option>
                <option value="AU">
                  AU
                </option>
                <option value="SVU">
                  SVU
                </option>
                <option value="NL">
                  NL
                </option>
              </select>
            </label>

            <label>
              Rank *
              <input
                type="number"
                name="rank"
                min="1"
                value={
                  studentDetails.rank
                }
                onChange={
                  handleStudentChange
                }
                disabled={!isDraft}
                placeholder="Enter rank"
              />
            </label>

          </div>

          {isDraft && (
            <div className="card-actions">
              <button
                type="button"
                className="primary-button"
                onClick={
                  saveStudentDetails
                }
                disabled={saving}
              >
                <Save size={18} />

                {saving
                  ? "Saving..."
                  : "Save Student Details"}
              </button>
            </div>
          )}
        </section>

        {/* COLLEGE SELECTION */}

        {isDraft && (
          <section className="counselling-card">

            <div className="card-heading">
              <div className="heading-icon">
                <GraduationCap
                  size={21}
                />
              </div>

              <div>
                <h2>
                  Select College & Branch
                </h2>

                <p>
                  Search verified colleges
                  and add your preferred
                  branches.
                </p>
              </div>
            </div>

            <div className="search-box">
              <Search size={19} />

              <input
                value={collegeSearch}
                onChange={(event) =>
                  setCollegeSearch(
                    event.target.value
                  )
                }
                placeholder="Search college by name, code or city..."
              />

              {collegeLoading && (
                <RefreshCw
                  size={18}
                  className="spin"
                />
              )}
            </div>

            <div className="selection-grid">

              <label>
                College

                <select
                  value={
                    selectedCollege
                  }
                  onChange={(event) => {
                    setSelectedCollege(
                      event.target.value
                    );
                    setSelectedBranch("");
                  }}
                >
                  <option value="">
                    Select a college
                  </option>

                  {colleges.map(
                    (college) => (
                      <option
                        key={college._id}
                        value={college._id}
                      >
                        {college.name}
                        {college.shortName
                          ? ` (${college.shortName})`
                          : ""}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label>
                Branch

                <select
                  value={
                    selectedBranch
                  }
                  onChange={(event) =>
                    setSelectedBranch(
                      event.target.value
                    )
                  }
                  disabled={
                    !selectedCollege
                  }
                >
                  <option value="">
                    Select a branch
                  </option>

                  {availableBranches.map(
                    (branch) => (
                      <option
                        key={branch.code}
                        value={branch.code}
                      >
                        {branch.code} —{" "}
                        {branch.name}
                      </option>
                    )
                  )}
                </select>
              </label>

              <button
                type="button"
                className="add-button"
                onClick={
                  addPreference
                }
              >
                <Plus size={18} />
                Add Preference
              </button>

            </div>
          </section>
        )}

        {/* PREFERENCES */}

        <section className="counselling-card">

          <div className="card-heading">
            <div className="heading-icon">
              <ShieldCheck
                size={21}
              />
            </div>

            <div>
              <h2>
                College Preferences
              </h2>

              <p>
                Arrange your choices in
                your preferred order.
              </p>
            </div>
          </div>

          {preferences.length ===
          0 ? (
            <div className="empty-preferences">
              <GraduationCap
                size={40}
              />

              <h3>
                No preferences added
              </h3>

              <p>
                Select a college and
                branch above to create
                your preference list.
              </p>
            </div>
          ) : (
            <div className="preference-list">
              {preferences.map(
                (item, index) => (
                  <div
                    key={`${item.college}-${item.branchCode}-${index}`}
                    className="preference-item"
                  >
                    <div className="priority">
                      {index + 1}
                    </div>

                    <div className="preference-info">
                      <strong>
                        {item.collegeName ||
                          "College"}
                      </strong>

                      <span>
                        {item.branchCode}
                        {" — "}
                        {item.branchName}
                      </span>
                    </div>

                    {isDraft && (
                      <div className="preference-actions">

                        <button
                          type="button"
                          title="Move up"
                          onClick={() =>
                            movePreference(
                              index,
                              "up"
                            )
                          }
                          disabled={
                            index === 0
                          }
                        >
                          <ChevronUp
                            size={18}
                          />
                        </button>

                        <button
                          type="button"
                          title="Move down"
                          onClick={() =>
                            movePreference(
                              index,
                              "down"
                            )
                          }
                          disabled={
                            index ===
                            preferences.length -
                              1
                          }
                        >
                          <ChevronDown
                            size={18}
                          />
                        </button>

                        <button
                          type="button"
                          title="Remove"
                          onClick={() =>
                            removePreference(
                              index
                            )
                          }
                        >
                          <Trash2
                            size={18}
                          />
                        </button>

                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}

          {isDraft &&
            preferences.length >
              0 && (
              <div className="card-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={
                    savePreferences
                  }
                  disabled={saving}
                >
                  <Save size={18} />

                  {saving
                    ? "Saving..."
                    : "Save Preferences"}
                </button>
              </div>
            )}
        </section>

        {/* LOCK */}

        {isDraft && (
          <section className="action-card">

            <div>
              <div className="action-icon">
                <Lock size={22} />
              </div>

              <div>
                <h2>
                  Lock Your Preferences
                </h2>

                <p>
                  Once locked, your college
                  preferences cannot be
                  changed.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="warning-button"
              onClick={
                lockPreferences
              }
              disabled={
                saving ||
                preferences.length ===
                  0
              }
            >
              <Lock size={18} />

              Lock Preferences
            </button>

          </section>
        )}

        {/* SUBMIT */}

        {isLocked && (
          <section className="action-card submit-card">

            <div>
              <div className="action-icon">
                <Send size={22} />
              </div>

              <div>
                <h2>
                  Submit Application
                </h2>

                <p>
                  Your preferences are
                  locked. Submit your
                  completed counselling
                  application.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="primary-button"
              onClick={
                submitApplication
              }
              disabled={saving}
            >
              <Send size={18} />

              {saving
                ? "Submitting..."
                : "Submit Application"}
            </button>

          </section>
        )}

        {/* COMPLETED */}

        {isSubmitted && (
          <section className="completed-card">

            <CheckCircle2
              size={52}
            />

            <h2>
              Application Submitted
            </h2>

            <p>
              Your APSCHE counselling
              application has been
              successfully submitted.
            </p>

            <div>
              <span>
                Application Number
              </span>

              <strong>
                {
                  application.applicationNumber
                }
              </strong>
            </div>

            <Link
              to="/dashboard"
              className="primary-button"
            >
              Go to Dashboard
            </Link>

          </section>
        )}

      </div>
    </main>
  );
};

export default Counselling;
