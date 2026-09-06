import React, { useEffect, useMemo, useState } from "react";
import {
Search,
MapPin,
GraduationCap,
Heart,
Plus,
ArrowUp,
ArrowDown,
Trash2,
CheckCircle2,
LogIn,
LogOut,
FileText,
ShieldCheck,
GitCompare,
LayoutDashboard,
Building2,
ClipboardCheck,
Menu,
X,
ChevronRight,
Clock3,
Users,
IndianRupee,
BarChart3,
AlertCircle,
} from "lucide-react";
import { api } from "./services/api";

const NAV_ITEMS = [
{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
{ id: "explore", label: "College Explorer", icon: Building2 },
{ id: "compare", label: "Compare", icon: GitCompare },
{ id: "options", label: "Web Options", icon: ClipboardCheck },
{ id: "apply", label: "Counselling Apply", icon: FileText },
];

const EMPTY_FORM = {
name: "",
email: "",
password: "",
};

function App() {
const [activePage, setActivePage] = useState("dashboard");
const [mobileMenu, setMobileMenu] = useState(false);

const [colleges, setColleges] = useState([]);
const [districts, setDistricts] = useState([]);

const [search, setSearch] = useState("");
const [district, setDistrict] = useState("");

const [selected, setSelected] = useState([]);

const [authenticated, setAuthenticated] = useState(
Boolean(localStorage.getItem("apsche_token"))
);

const [authMode, setAuthMode] = useState("login");
const [form, setForm] = useState(EMPTY_FORM);

const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState("success");

const [application, setApplication] = useState(null);

useEffect(() => {
loadDistricts();
loadColleges();
}, []);

useEffect(() => {
if (activePage === "explore") {
loadColleges();
}
}, [district]);

useEffect(() => {
if (!message) return;

const timer = setTimeout(() => {
  setMessage("");
}, 3500);

return () => clearTimeout(timer);

}, [message]);

async function loadDistricts() {
try {
const response = await api.get("/colleges/districts");
setDistricts(response.data || []);
} catch {
setDistricts([]);
}
}

async function loadColleges() {
setLoading(true);

try {
  const response = await api.get("/colleges", {
    params: {
      district,
      search,
    },
  });

  setColleges(response.data || []);
} catch {
  setColleges([]);
  showMessage(
    "Unable to load college data. Please check the backend connection.",
    "error"
  );
} finally {
  setLoading(false);
}

}

function showMessage(text, type = "success") {
setMessage(text);
setMessageType(type);
}

function navigate(page) {
setActivePage(page);
setMobileMenu(false);
window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateForm(field, value) {
setForm((previous) => ({
...previous,
[field]: value,
}));
}

function addPreference(college, branch) {
const exists = selected.some(
(item) =>
item.collegeCode === college.code &&
item.branchCode === branch.code
);

if (exists) {
  showMessage("This branch is already in your web options.", "error");
  return;
}

const newPreference = {
  collegeCode: college.code,
  collegeName: college.name,
  branchCode: branch.code,
  branchName: branch.name,
  order: selected.length + 1,
};

setSelected((previous) => [...previous, newPreference]);

showMessage(`${branch.name} added to Web Options.`);

}

function removePreference(index) {
setSelected((previous) => {
const updated = previous.filter((_, current) => current !== index);

  return updated.map((item, current) => ({
    ...item,
    order: current + 1,
  }));
});

showMessage("Preference removed.");

}

function movePreference(index, direction) {
setSelected((previous) => {
const updated = [...previous];
const targetIndex = index + direction;

  if (
    targetIndex < 0 ||
    targetIndex >= updated.length
  ) {
    return previous;
  }

  [updated[index], updated[targetIndex]] = [
    updated[targetIndex],
    updated[index],
  ];

  return updated.map((item, current) => ({
    ...item,
    order: current + 1,
  }));
});

}

async function authenticate() {
if (!form.email || !form.password) {
showMessage("Please enter email and password.", "error");
return;
}

if (authMode === "register" && !form.name) {
  showMessage("Please enter your full name.", "error");
  return;
}

setLoading(true);

try {
  const response = await api.post(
    `/auth/${authMode}`,
    form
  );

  localStorage.setItem(
    "apsche_token",
    response.data.token
  );

  setAuthenticated(true);

  showMessage(
    authMode === "login"
      ? "Login successful."
      : "Account created successfully."
  );

  setForm(EMPTY_FORM);
  navigate("dashboard");
} catch (error) {
  showMessage(
    error.response?.data?.message ||
      "Authentication failed.",
    "error"
  );
} finally {
  setLoading(false);
}

}

function logout() {
localStorage.removeItem("apsche_token");
setAuthenticated(false);
setApplication(null);
showMessage("You have been logged out.");
navigate("dashboard");
}

async function saveApplication(submit = false) {
if (!authenticated) {
showMessage(
"Please login before saving your counselling application.",
"error"
);
navigate("login");
return;
}

if (!selected.length) {
  showMessage(
    "Add at least one college branch to Web Options first.",
    "error"
  );
  navigate("explore");
  return;
}

setLoading(true);

try {
  let currentApplication = application;

  if (!currentApplication) {
    const response = await api.post("/applications", {
      exam: "EAPCET",
      year: 2025,
      preferences: selected,
    });

    currentApplication = response.data;
    setApplication(currentApplication);
  } else {
    const response = await api.put(
      `/applications/${currentApplication._id}`,
      {
        preferences: selected,
      }
    );

    currentApplication = response.data;
    setApplication(currentApplication);
  }

  if (submit) {
    const response = await api.post(
      `/applications/${currentApplication._id}/submit`
    );

    setApplication(response.data);

    showMessage(
      "Practice counselling application submitted successfully."
    );
  } else {
    showMessage("Counselling draft saved successfully.");
  }
} catch (error) {
  showMessage(
    error.response?.data?.message ||
      "Unable to save application.",
    "error"
  );
} finally {
  setLoading(false);
}

}

const selectedCollegeCount = useMemo(() => {
return new Set(
selected.map((item) => item.collegeCode)
).size;
}, [selected]);

const selectedBranchCount = selected.length;

function renderDashboard() {
return (
<>
<section className="dashboard-hero">
<div className="hero-copy">
<span className="eyebrow">
AP ADMISSIONS • COUNSELLING PRACTICE
</span>

        <h1>
          Your counselling journey,
          <br />
          <span>planned clearly.</span>
        </h1>

        <p>
          Discover colleges, compare branches, build your
          web-options list and practise the counselling
          workflow from one professional platform.
        </p>

        <div className="hero-actions">
          <button
            className="primary-button"
            onClick={() => navigate("explore")}
          >
            Explore Colleges
            <ChevronRight size={18} />
          </button>

          <button
            className="secondary-button"
            onClick={() => navigate("apply")}
          >
            Start Counselling
          </button>
        </div>
      </div>

      <div className="hero-card">
        <div className="hero-card-header">
          <span>2025 Counselling Plan</span>
          <span className="status-badge">
            Practice
          </span>
        </div>

        <div className="hero-stat">
          <strong>{selectedBranchCount}</strong>
          <span>Preferences selected</span>
        </div>

        <div className="progress-line">
          <span
            style={{
              width: `${Math.min(
                selectedBranchCount * 10,
                100
              )}%`,
            }}
          />
        </div>

        <div className="hero-mini-grid">
          <div>
            <Building2 size={18} />
            <strong>{selectedCollegeCount}</strong>
            <span>Colleges</span>
          </div>

          <div>
            <ClipboardCheck size={18} />
            <strong>{selectedBranchCount}</strong>
            <span>Branches</span>
          </div>
        </div>
      </div>
    </section>

    <section className="page-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">QUICK ACCESS</span>
          <h2>Everything you need</h2>
        </div>
      </div>

      <div className="quick-grid">
        <QuickCard
          icon={<Building2 />}
          title="College Explorer"
          description="Search colleges and branches district-wise."
          onClick={() => navigate("explore")}
        />

        <QuickCard
          icon={<GitCompare />}
          title="Compare"
          description="Compare your selected college options."
          onClick={() => navigate("compare")}
        />

        <QuickCard
          icon={<ClipboardCheck />}
          title="Web Options"
          description="Arrange your preferences in priority order."
          onClick={() => navigate("options")}
        />

        <QuickCard
          icon={<FileText />}
          title="Counselling Apply"
          description="Create and submit a practice application."
          onClick={() => navigate("apply")}
        />
      </div>
    </section>

    <section className="page-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">PLATFORM</span>
          <h2>Built for smarter counselling decisions</h2>
        </div>
      </div>

      <div className="info-grid">
        <InfoCard
          icon={<BarChart3 />}
          title="Historical Data"
          text="College, branch, cutoff and fee records can be organised year by year."
        />

        <InfoCard
          icon={<ShieldCheck />}
          title="Data Transparency"
          text="Each record is designed to carry its year and source information."
        />

        <InfoCard
          icon={<Users />}
          title="Student Focused"
          text="Designed around the student's actual counselling journey."
        />

        <InfoCard
          icon={<Clock3 />}
          title="Practice Workflow"
          text="Build your preference list before completing your real counselling process."
        />
      </div>
    </section>
  </>
);

}

function renderExplorer() {
return (
<section className="page-section explorer-page">
<div className="section-heading large">
<div>
<span className="eyebrow">
COLLEGE DISCOVERY
</span>

        <h1>College Explorer</h1>

        <p>
          Search colleges by name, code or district and
          add branches directly to your counselling plan.
        </p>
      </div>

      <div className="data-status">
        <ShieldCheck size={17} />
        <span>Source-aware data</span>
      </div>
    </div>

    <div className="filter-panel">
      <div className="search-field">
        <Search size={19} />

        <input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              loadColleges();
            }
          }}
          placeholder="Search college name or code..."
        />
      </div>

      <select
        value={district}
        onChange={(event) =>
          setDistrict(event.target.value)
        }
      >
        <option value="">
          All districts
        </option>

        {districts.map((item) => (
          <option value={item} key={item}>
            {item}
          </option>
        ))}
      </select>

      <button
        className="primary-button"
        onClick={loadColleges}
      >
        {loading ? "Loading..." : "Search"}
      </button>
    </div>

    <div className="data-notice">
      <ShieldCheck size={19} />

      <div>
        <strong>Data transparency</strong>

        <p>
          College records should display their academic
          year and verified source. The current V1 seed
          records are intentionally labelled as starter
          records until the official historical dataset
          is imported.
        </p>
      </div>
    </div>

    {loading ? (
      <LoadingState />
    ) : colleges.length === 0 ? (
      <EmptyState
        icon={<Building2 />}
        title="No colleges found"
        text="Try another college name, code or district."
        action="Clear filters"
        onClick={() => {
          setSearch("");
          setDistrict("");
          loadColleges();
        }}
      />
    ) : (
      <div className="college-grid">
        {colleges.map((college) => (
          <CollegeCard
            key={college.code}
            college={college}
            onAdd={addPreference}
            selected={selected}
            onMessage={showMessage}
          />
        ))}
      </div>
    )}
  </section>
);

}

function renderCompare() {
return (
<section className="page-section">
<div className="section-heading large">
<div>
<span className="eyebrow">DECISION SUPPORT</span>
<h1>Compare Options</h1>
<p>
Review the branches you selected for your
counselling plan.
</p>
</div>
</div>

    {selected.length === 0 ? (
      <EmptyState
        icon={<GitCompare />}
        title="Nothing to compare yet"
        text="Add branches from College Explorer to compare them here."
        action="Explore Colleges"
        onClick={() => navigate("explore")}
      />
    ) : (
      <div className="compare-grid">
        {selected.slice(0, 4).map((item) => (
          <div
            className="compare-card"
            key={`${item.collegeCode}-${item.branchCode}`}
          >
            <span className="college-code">
              {item.collegeCode}
            </span>

            <h3>{item.collegeName}</h3>

            <p className="branch-name">
              {item.branchName}
            </p>

            <div className="compare-row">
              <span>
                <BarChart3 size={16} />
                2025 Cutoff
              </span>

              <strong>
                Awaiting verified import
              </strong>
            </div>

            <div className="compare-row">
              <span>
                <IndianRupee size={16} />
                Fees
              </span>

              <strong>
                Awaiting verified import
              </strong>
            </div>

            <div className="compare-row">
              <span>
                <Users size={16} />
                Intake
              </span>

              <strong>
                Awaiting verified import
              </strong>
            </div>

            <div className="source-label">
              Official-source data layer planned
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
);

}

function renderOptions() {
return (
<section className="page-section">
<div className="section-heading large">
<div>
<span className="eyebrow">
COUNSELLING PREFERENCES
</span>

        <h1>My Web Options</h1>

        <p>
          Arrange your preferences in the order you want
          to practise.
        </p>
      </div>

      <button
        className="primary-button"
        onClick={() => saveApplication(false)}
      >
        Save Draft
      </button>
    </div>

    {selected.length === 0 ? (
      <EmptyState
        icon={<ClipboardCheck />}
        title="Your web-options list is empty"
        text="Add college branches from College Explorer."
        action="Add College Options"
        onClick={() => navigate("explore")}
      />
    ) : (
      <>
        <div className="options-summary">
          <div>
            <strong>{selected.length}</strong>
            <span>Total preferences</span>
          </div>

          <div>
            <strong>{selectedCollegeCount}</strong>
            <span>Unique colleges</span>
          </div>

          <div>
            <strong>2025</strong>
            <span>Counselling year</span>
          </div>
        </div>

        <div className="options-list">
          {selected.map((item, index) => (
            <div
              className="option-item"
              key={`${item.collegeCode}-${item.branchCode}`}
            >
              <div className="option-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="option-main">
                <span className="college-code">
                  {item.collegeCode}
                </span>

                <h3>{item.collegeName}</h3>

                <p>{item.branchName}</p>
              </div>

              <div className="option-actions">
                <button
                  title="Move up"
                  onClick={() =>
                    movePreference(index, -1)
                  }
                >
                  <ArrowUp size={17} />
                </button>

                <button
                  title="Move down"
                  onClick={() =>
                    movePreference(index, 1)
                  }
                >
                  <ArrowDown size={17} />
                </button>

                <button
                  className="danger-button"
                  title="Remove"
                  onClick={() =>
                    removePreference(index)
                  }
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    )}
  </section>
);

}

function renderApply() {
const submitted =
application?.status === "SUBMITTED";

return (
  <section className="page-section">
    <div className="section-heading large">
      <div>
        <span className="eyebrow">
          PRACTICE COUNSELLING
        </span>

        <h1>Counselling Apply</h1>

        <p>
          Follow the counselling journey step by step.
        </p>
      </div>
    </div>

    <div className="counselling-steps">
      <Step number="01" label="Profile" done />
      <Step number="02" label="Exam" done />
      <Step
        number="03"
        label="Web Options"
        done={selected.length > 0}
      />
      <Step
        number="04"
        label="Review"
        done={submitted}
      />
      <Step
        number="05"
        label="Submit"
        done={submitted}
      />
    </div>

    <div className="application-layout">
      <div className="application-main">
        <div className="application-card">
          <div className="card-icon">
            <FileText />
          </div>

          <div>
            <span className="eyebrow">
              APPLICATION
            </span>

            <h2>AP EAPCET Counselling</h2>

            <p>
              Academic / counselling year:{" "}
              <strong>2025</strong>
            </p>
          </div>
        </div>

        <div className="application-card">
          <div className="card-icon">
            <ClipboardCheck />
          </div>

          <div className="application-content">
            <span className="eyebrow">
              WEB OPTIONS
            </span>

            <h2>Your preference list</h2>

            <p>
              You currently have{" "}
              <strong>{selected.length}</strong>{" "}
              preferences.
            </p>

            {selected.length > 0 && (
              <div className="mini-preferences">
                {selected.slice(0, 5).map(
                  (item, index) => (
                    <div
                      key={`${item.collegeCode}-${item.branchCode}`}
                    >
                      <span>
                        {index + 1}
                      </span>

                      <div>
                        <strong>
                          {item.collegeName}
                        </strong>

                        <small>
                          {item.branchName}
                        </small>
                      </div>
                    </div>
                  )
                )}

                {selected.length > 5 && (
                  <small>
                    + {selected.length - 5} more
                    preferences
                  </small>
                )}
              </div>
            )}

            <button
              className="secondary-button"
              onClick={() => navigate("options")}
            >
              Edit Web Options
            </button>
          </div>
        </div>

        <div className="practice-warning">
          <AlertCircle size={20} />

          <div>
            <strong>Practice application</strong>

            <p>
              This module is for practising the
              counselling workflow. It does not submit
              an official APSCHE application.
            </p>
          </div>
        </div>
      </div>

      <aside className="application-side">
        <div className="summary-card">
          <span className="eyebrow">
            APPLICATION SUMMARY
          </span>

          <div className="summary-row">
            <span>Exam</span>
            <strong>AP EAPCET</strong>
          </div>

          <div className="summary-row">
            <span>Year</span>
            <strong>2025</strong>
          </div>

          <div className="summary-row">
            <span>Preferences</span>
            <strong>{selected.length}</strong>
          </div>

          <div className="summary-row">
            <span>Status</span>

            <strong
              className={
                submitted
                  ? "status-green"
                  : "status-blue"
              }
            >
              {application?.status || "DRAFT"}
            </strong>
          </div>

          <button
            className="primary-button full-button"
            disabled={loading || submitted}
            onClick={() => saveApplication(true)}
          >
            {loading
              ? "Processing..."
              : submitted
              ? "Application Submitted"
              : "Review & Submit"}
          </button>

          {!authenticated && (
            <button
              className="secondary-button full-button"
              onClick={() => navigate("login")}
            >
              Login to Continue
            </button>
          )}
        </div>
      </aside>
    </div>
  </section>
);

}

function renderAuth() {
const isLogin = authMode === "login";

return (
  <section className="auth-page">
    <div className="auth-card">
      <div className="auth-logo">
        <GraduationCap size={31} />
      </div>

      <span className="eyebrow">
        APSCHE COUNSELLING PRO
      </span>

      <h1>
        {isLogin
          ? "Welcome back"
          : "Create your account"}
      </h1>

      <p>
        {isLogin
          ? "Login to manage your counselling preferences."
          : "Create an account to save your counselling plan."}
      </p>

      {!isLogin && (
        <input
          value={form.name}
          onChange={(event) =>
            updateForm("name", event.target.value)
          }
          placeholder="Full name"
        />
      )}

      <input
        type="email"
        value={form.email}
        onChange={(event) =>
          updateForm("email", event.target.value)
        }
        placeholder="Email address"
      />

      <input
        type="password"
        value={form.password}
        onChange={(event) =>
          updateForm(
            "password",
            event.target.value
          )
        }
        placeholder="Password"
      />

      <button
        className="primary-button full-button"
        onClick={authenticate}
        disabled={loading}
      >
        {loading
          ? "Please wait..."
          : isLogin
          ? "Login"
          : "Create Account"}
      </button>

      <button
        className="text-button"
        onClick={() =>
          setAuthMode(
            isLogin ? "register" : "login"
          )
        }
      >
        {isLogin
          ? "Create a new account"
          : "Already have an account? Login"}
      </button>
    </div>
  </section>
);

}

function renderPage() {
switch (activePage) {
case "dashboard":
return renderDashboard();

  case "explore":
    return renderExplorer();

  case "compare":
    return renderCompare();

  case "options":
    return renderOptions();

  case "apply":
    return renderApply();

  case "login":
    return renderAuth();

  default:
    return renderDashboard();
}

}

return (
<div className="app-shell">
<header className="topbar">
<button
className="mobile-menu-button"
onClick={() =>
setMobileMenu((previous) => !previous)
}
>
{mobileMenu ? (
<X size={21} />
) : (
<Menu size={21} />
)}
</button>

    <button
      className="brand"
      onClick={() => navigate("dashboard")}
    >
      <span className="brand-mark">
        <GraduationCap size={23} />
      </span>

      <span>
        <strong>APSCHE</strong>
        <small>COUNSELLING PRO</small>
      </span>
    </button>

    <div className="topbar-right">
      {selected.length > 0 && (
        <button
          className="options-indicator"
          onClick={() => navigate("options")}
        >
          <ClipboardCheck size={17} />
          <span>{selected.length}</span>
        </button>
      )}

      {authenticated ? (
        <button
          className="account-button"
          onClick={logout}
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      ) : (
        <button
          className="account-button"
          onClick={() => navigate("login")}
        >
          <LogIn size={17} />
          <span>Login</span>
        </button>
      )}
    </div>
  </header>

  <div className="app-layout">
    <aside
      className={`sidebar ${
        mobileMenu ? "sidebar-open" : ""
      }`}
    >
      <div className="sidebar-label">
        MAIN MENU
      </div>

      <nav>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className={
                activePage === item.id
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() => navigate(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>

              {item.id === "options" &&
                selected.length > 0 && (
                  <b>{selected.length}</b>
                )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-help">
          <ShieldCheck size={19} />

          <div>
            <strong>Data-first platform</strong>

            <p>
              Records are designed to include source
              and year information.
            </p>
          </div>
        </div>
      </div>
    </aside>

    <main className="main-content">
      {renderPage()}
    </main>
  </div>

  {message && (
    <div
      className={`toast ${
        messageType === "error"
          ? "toast-error"
          : ""
      }`}
    >
      {messageType === "error" ? (
        <AlertCircle size={18} />
      ) : (
        <CheckCircle2 size={18} />
      )}

      <span>{message}</span>

      <button
        onClick={() => setMessage("")}
      >
        ×
      </button>
    </div>
  )}

  <footer className="site-footer">
    <div>
      <strong>APSCHE Counselling Pro</strong>
      <span>
        Professional counselling practice platform
      </span>
    </div>

    <span>
      Data records should always be verified against
      their stated source and year.
    </span>
  </footer>
</div>

);
}

function QuickCard({
icon,
title,
description,
onClick,
}) {
return (
<button className="quick-card" onClick={onClick}>
<div className="quick-icon">{icon}</div>

  <div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>

  <ChevronRight size={19} />
</button>

);
}

function InfoCard({ icon, title, text }) {
return (
<div className="info-card">
<div className="info-icon">{icon}</div>

  <h3>{title}</h3>

  <p>{text}</p>
</div>

);
}

function CollegeCard({
college,
onAdd,
selected,
onMessage,
}) {
const branchCount = college.branches?.length || 0;

return (
<article className="college-card">
<div className="college-card-top">
<span className="college-code">
{college.code}
</span>

    <button
      className="heart-button"
      onClick={() =>
        onMessage(
          "Shortlist feature will be connected to the student account."
        )
      }
      title="Shortlist"
    >
      <Heart size={18} />
    </button>
  </div>

  <h2>{college.name}</h2>

  <div className="college-meta">
    <span>
      <MapPin size={15} />
      {college.district}
    </span>

    <span>
      <GraduationCap size={15} />
      {college.university || "University"}
    </span>
  </div>

  <div className="college-type">
    {college.type || "Institution"}
  </div>

  <div className="branch-heading">
    <strong>Available branches</strong>
    <span>{branchCount}</span>
  </div>

  <div className="branch-list">
    {(college.branches || []).map((branch) => {
      const isSelected = selected.some(
        (item) =>
          item.collegeCode === college.code &&
          item.branchCode === branch.code
      );

      return (
        <div
          className="branch-row"
          key={branch.code}
        >
          <div>
            <strong>{branch.name}</strong>

            <small>
              {branch.code} · 2025 record
            </small>
          </div>

          <button
            className={
              isSelected
                ? "added-button"
                : "add-button"
            }
            disabled={isSelected}
            onClick={() =>
              onAdd(college, branch)
            }
          >
            {isSelected ? (
              <>
                <CheckCircle2 size={15} />
                Added
              </>
            ) : (
              <>
                <Plus size={15} />
                Add
              </>
            )}
          </button>
        </div>
      );
    })}
  </div>

  <div className="college-source">
    <ShieldCheck size={14} />
    <span>
      {college.dataSource ||
        "Source information available with record"}
    </span>
  </div>
</article>

);
}

function Step({ number, label, done }) {
return (
<div
className={"counselling-step ${ done ? "step-done" : "" }"}
>
<span>{number}</span>

  <strong>{label}</strong>
</div>

);
}

function LoadingState() {
return (
<div className="loading-state">
<div className="loading-spinner" />
<strong>Loading college records...</strong>
<span>Please wait.</span>
</div>
);
}

function EmptyState({
icon,
title,
text,
action,
onClick,
}) {
return (
<div className="empty-state">
<div className="empty-icon">{icon}</div>

  <h2>{title}</h2>

  <p>{text}</p>

  {action && (
    <button
      className="primary-button"
      onClick={onClick}
    >
      {action}
    </button>
  )}
</div>

);
}

export default App;
