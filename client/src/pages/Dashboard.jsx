import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import {
  GraduationCap,
  LayoutDashboard,
  Building2,
  ClipboardCheck,
  User,
  Settings,
  LogOut,
  Search,
  FileText,
  CheckCircle2,
  Clock3,
  ArrowRight,
  BookOpen,
  MapPin,
  ShieldCheck,
} from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const studentName = user?.name || "Student";
  const studentEmail = user?.email || "Not available";
  const studentRole = user?.role || "student";

  return (
    <main className="student-dashboard-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="portal-header dashboard-header">
        <div className="header-inner">

          <Link to="/" className="brand">

            <div className="brand-mark">
              <GraduationCap size={24} />
            </div>

            <div>
              <strong>APSCHE</strong>
              <span>Counselling Portal</span>
            </div>

          </Link>

          <nav className="main-nav dashboard-nav">

            <Link to="/">
              Home
            </Link>

            <Link to="/colleges">
              Colleges
            </Link>

            <Link to="/counselling">
              Counselling
            </Link>

            <Link
              to="/dashboard"
              className="dashboard-active"
            >
              Dashboard
            </Link>

          </nav>

          <button
            type="button"
            className="dashboard-logout"
            onClick={logout}
          >
            <LogOut size={16} />
            Logout
          </button>

        </div>
      </header>

      {/* =====================================================
          DASHBOARD BODY
      ===================================================== */}

      <div className="dashboard-layout">

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside className="dashboard-sidebar">

          <div className="student-profile-mini">

            <div className="student-avatar">
              <User size={25} />
            </div>

            <div>
              <strong>{studentName}</strong>
              <span>Student Account</span>
            </div>

          </div>

          <nav className="dashboard-sidebar-nav">

            <Link
              to="/dashboard"
              className="sidebar-active"
            >
              <LayoutDashboard size={18} />
              Overview
            </Link>

            <Link to="/colleges">
              <Building2 size={18} />
              Find Colleges
            </Link>

            <Link to="/counselling">
              <ClipboardCheck size={18} />
              Counselling
            </Link>

            <Link to="/profile">
              <User size={18} />
              My Profile
            </Link>

            <Link to="/settings">
              <Settings size={18} />
              Settings
            </Link>

          </nav>

          <div className="sidebar-help-card">

            <div className="sidebar-help-icon">
              <ShieldCheck size={20} />
            </div>

            <strong>Need Help?</strong>

            <p>
              Explore colleges or start your
              counselling application.
            </p>

            <Link to="/colleges">
              Explore Now
              <ArrowRight size={14} />
            </Link>

          </div>

        </aside>

        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <section className="dashboard-main">

          {/* TOP INTRO */}

          <div className="dashboard-intro">

            <div>

              <span className="section-label">
                STUDENT DASHBOARD
              </span>

              <h1>
                Welcome, {studentName} 👋
              </h1>

              <p>
                Manage your college discovery and
                APSCHE counselling journey from one place.
              </p>

            </div>

            <Link
              to="/counselling"
              className="primary-button"
            >
              Start Counselling
              <ArrowRight size={17} />
            </Link>

          </div>

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <div className="dashboard-stats">

            <div className="dashboard-stat-card stat-blue">

              <div className="dashboard-stat-icon">
                <Building2 size={22} />
              </div>

              <div>
                <span>College Discovery</span>
                <strong>Explore</strong>
                <small>Find your college</small>
              </div>

            </div>

            <div className="dashboard-stat-card stat-purple">

              <div className="dashboard-stat-icon">
                <BookOpen size={22} />
              </div>

              <div>
                <span>Courses & Branches</span>
                <strong>Explore</strong>
                <small>View academic options</small>
              </div>

            </div>

            <div className="dashboard-stat-card stat-green">

              <div className="dashboard-stat-icon">
                <ClipboardCheck size={22} />
              </div>

              <div>
                <span>Counselling</span>
                <strong>Not Started</strong>
                <small>Application status</small>
              </div>

            </div>

          </div>

          {/* =================================================
              MAIN GRID
          ================================================= */}

          <div className="dashboard-content-grid">

            {/* LEFT */}

            <div className="dashboard-left-column">

              {/* ACCOUNT CARD */}

              <div className="dashboard-panel">

                <div className="dashboard-panel-header">

                  <div>
                    <span className="section-label">
                      ACCOUNT
                    </span>

                    <h2>Account Information</h2>
                  </div>

                  <div className="panel-header-icon">
                    <User size={20} />
                  </div>

                </div>

                <div className="account-information">

                  <div className="account-row">

                    <div className="account-row-icon">
                      <User size={17} />
                    </div>

                    <div>
                      <span>Full Name</span>
                      <strong>{studentName}</strong>
                    </div>

                  </div>

                  <div className="account-row">

                    <div className="account-row-icon">
                      <FileText size={17} />
                    </div>

                    <div>
                      <span>Email Address</span>
                      <strong>{studentEmail}</strong>
                    </div>

                  </div>

                  <div className="account-row">

                    <div className="account-row-icon">
                      <ShieldCheck size={17} />
                    </div>

                    <div>
                      <span>Account Role</span>
                      <strong>
                        {studentRole}
                      </strong>
                    </div>

                  </div>

                </div>

              </div>

              {/* RECENT ACTIVITY */}

              <div className="dashboard-panel">

                <div className="dashboard-panel-header">

                  <div>
                    <span className="section-label">
                      ACTIVITY
                    </span>

                    <h2>Recent Updates</h2>
                  </div>

                  <Clock3
                    size={20}
                    className="panel-title-icon"
                  />

                </div>

                <div className="activity-list">

                  <div className="activity-item">

                    <div className="activity-icon activity-green">
                      <CheckCircle2 size={17} />
                    </div>

                    <div>
                      <strong>
                        Account created successfully
                      </strong>

                      <span>
                        Your student account is ready.
                      </span>
                    </div>

                  </div>

                  <div className="activity-item">

                    <div className="activity-icon activity-blue">
                      <Search size={17} />
                    </div>

                    <div>
                      <strong>
                        College discovery available
                      </strong>

                      <span>
                        Explore colleges and branches.
                      </span>
                    </div>

                  </div>

                  <div className="activity-item">

                    <div className="activity-icon activity-orange">
                      <ClipboardCheck size={17} />
                    </div>

                    <div>
                      <strong>
                        Counselling application pending
                      </strong>

                      <span>
                        Start your counselling journey.
                      </span>
                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* RIGHT */}

            <div className="dashboard-right-column">

              {/* COUNSELLING STATUS */}

              <div className="counselling-status-card">

                <div className="status-card-top">

                  <div>

                    <span className="section-label">
                      COUNSELLING
                    </span>

                    <h2>
                      Your application
                    </h2>

                  </div>

                  <div className="status-badge">
                    Not Started
                  </div>

                </div>

                <div className="status-illustration">

                  <div className="status-circle">
                    <ClipboardCheck size={35} />
                  </div>

                </div>

                <p>
                  You have not submitted a counselling
                  application yet. Start by exploring
                  colleges and preparing your preferences.
                </p>

                <Link
                  to="/counselling"
                  className="primary-button status-button"
                >
                  Start Application
                  <ArrowRight size={17} />
                </Link>

              </div>

              {/* QUICK ACTIONS */}

              <div className="dashboard-panel quick-actions-panel">

                <div className="dashboard-panel-header">

                  <div>
                    <span className="section-label">
                      QUICK ACCESS
                    </span>

                    <h2>Student Services</h2>
                  </div>

                </div>

                <div className="dashboard-action-grid">

                  <Link
                    to="/colleges"
                    className="dashboard-action-card action-blue"
                  >

                    <div>
                      <Building2 size={21} />
                    </div>

                    <span>
                      Find Colleges
                    </span>

                    <ArrowRight size={15} />

                  </Link>

                  <Link
                    to="/counselling"
                    className="dashboard-action-card action-orange"
                  >

                    <div>
                      <ClipboardCheck size={21} />
                    </div>

                    <span>
                      Counselling
                    </span>

                    <ArrowRight size={15} />

                  </Link>

                  <Link
                    to="/profile"
                    className="dashboard-action-card action-purple"
                  >

                    <div>
                      <User size={21} />
                    </div>

                    <span>
                      My Profile
                    </span>

                    <ArrowRight size={15} />

                  </Link>

                  <Link
                    to="/"
                    className="dashboard-action-card action-green"
                  >

                    <div>
                      <GraduationCap size={21} />
                    </div>

                    <span>
                      Portal Home
                    </span>

                    <ArrowRight size={15} />

                  </Link>

                </div>

              </div>

            </div>

          </div>

        </section>

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="portal-footer dashboard-footer">

        <div className="footer-container">

          <div className="footer-brand">

            <div className="brand footer-brand-logo">

              <div className="brand-mark">
                <GraduationCap size={23} />
              </div>

              <div>
                <strong>APSCHE</strong>
                <span>Counselling Portal</span>
              </div>

            </div>

            <p>
              A student-focused college discovery and
              counselling portal for Andhra Pradesh.
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

            <Link to="/dashboard">
              Dashboard
            </Link>

            <Link to="/profile">
              Profile
            </Link>

            <button
              type="button"
              onClick={logout}
            >
              Logout
            </button>

          </div>

          <div className="footer-column">

            <h4>Explore</h4>

            <Link to="/colleges">
              College Search
            </Link>

            <Link to="/counselling">
              Start Counselling
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

export default Dashboard;
