import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Colleges from "./pages/Colleges.jsx";
import CollegeDetails from "./pages/CollegeDetails.jsx";
import Counselling from "./pages/Counselling.jsx";

/* =========================================================
   PORTAL HEADER
========================================================= */

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <>
      <div className="portal-topbar">
        <div className="portal-container portal-topbar-inner">
          <span>
            Government of Andhra Pradesh
          </span>

          <span className="portal-topbar-divider">
            |
          </span>

          <span>
            Andhra Pradesh State Council of Higher Education
          </span>

          <span className="portal-topbar-right">
            Student Admission Portal
          </span>
        </div>
      </div>

      <header className="portal-header">
        <div className="portal-container portal-header-inner">

          <Link
            to="/"
            className="portal-brand"
          >
            <div className="portal-brand-logo">
              <span>AP</span>
            </div>

            <div className="portal-brand-text">
              <strong>
                APSCHE
              </strong>

              <span>
                Counselling Portal
              </span>
            </div>
          </Link>

          <nav className="portal-navigation">

            <Link
              to="/"
              className={
                isActive("/")
                  ? "portal-nav-link active"
                  : "portal-nav-link"
              }
            >
              Home
            </Link>

            <Link
              to="/colleges"
              className={
                isActive("/colleges")
                  ? "portal-nav-link active"
                  : "portal-nav-link"
              }
            >
              Colleges
            </Link>

            <Link
              to="/counselling"
              className={
                isActive("/counselling")
                  ? "portal-nav-link active"
                  : "portal-nav-link"
              }
            >
              Counselling
            </Link>

            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={
                  isActive("/dashboard")
                    ? "portal-nav-link active"
                    : "portal-nav-link"
                }
              >
                Dashboard
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={
                  isActive("/admin")
                    ? "portal-nav-link active"
                    : "portal-nav-link"
                }
              >
                Admin
              </Link>
            )}

          </nav>

          <div className="portal-header-actions">

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="portal-account-button"
              >
                My Account
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="portal-login-button"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="portal-register-button"
                >
                  Register
                </Link>
              </>
            )}

          </div>

        </div>
      </header>
    </>
  );
};

/* =========================================================
   HOME PAGE
========================================================= */

const Home = () => {
  return (
    <div className="portal-page">

      <Header />

      <main>

        {/* HERO */}

        <section className="portal-hero">

          <div className="portal-container portal-hero-grid">

            <div className="portal-hero-content">

              <div className="portal-eyebrow">
                AP EAPCET • ADMISSIONS • COUNSELLING
              </div>

              <h1>
                Find your college.
                <br />
                Plan your future.
              </h1>

              <p>
                Explore colleges, courses, branches,
                admission information and counselling
                services through one student-focused portal.
              </p>

              <div className="portal-hero-actions">

                <Link
                  to="/colleges"
                  className="portal-primary-button"
                >
                  Explore Colleges
                  <span>→</span>
                </Link>

                <Link
                  to="/counselling"
                  className="portal-secondary-button"
                >
                  Counselling
                </Link>

              </div>

            </div>

            <div className="portal-hero-card">

              <div className="portal-card-label">
                STUDENT SERVICES
              </div>

              <h2>
                Everything you need
                in one place.
              </h2>

              <div className="portal-service-list">

                <Link to="/colleges">
                  <span className="portal-service-number">
                    01
                  </span>

                  <div>
                    <strong>
                      College Directory
                    </strong>

                    <small>
                      Search participating colleges
                    </small>
                  </div>

                  <span>→</span>
                </Link>

                <Link to="/colleges">
                  <span className="portal-service-number">
                    02
                  </span>

                  <div>
                    <strong>
                      Courses & Branches
                    </strong>

                    <small>
                      Explore available programmes
                    </small>
                  </div>

                  <span>→</span>
                </Link>

                <Link to="/counselling">
                  <span className="portal-service-number">
                    03
                  </span>

                  <div>
                    <strong>
                      Counselling
                    </strong>

                    <small>
                      Manage your admission journey
                    </small>
                  </div>

                  <span>→</span>
                </Link>

              </div>

            </div>

          </div>
        </section>

        {/* QUICK SERVICES */}

        <section className="portal-services">

          <div className="portal-container">

            <div className="portal-section-heading">

              <div>
                <span>
                  QUICK ACCESS
                </span>

                <h2>
                  Admission Services
                </h2>
              </div>

              <p>
                Access the most important student
                services from one place.
              </p>

            </div>

            <div className="portal-service-grid">

              <Link
                to="/colleges"
                className="portal-feature-card"
              >
                <div className="portal-feature-icon">
                  01
                </div>

                <h3>
                  College Search
                </h3>

                <p>
                  Find colleges by district,
                  branch and other available
                  information.
                </p>

                <span>
                  Explore Colleges →
                </span>
              </Link>

              <Link
                to="/colleges"
                className="portal-feature-card"
              >
                <div className="portal-feature-icon">
                  02
                </div>

                <h3>
                  Courses
                </h3>

                <p>
                  Explore engineering branches
                  and available academic options.
                </p>

                <span>
                  View Courses →
                </span>
              </Link>

              <Link
                to="/counselling"
                className="portal-feature-card"
              >
                <div className="portal-feature-icon">
                  03
                </div>

                <h3>
                  Counselling
                </h3>

                <p>
                  Prepare and manage your
                  counselling preferences.
                </p>

                <span>
                  Start Counselling →
                </span>
              </Link>

            </div>

          </div>

        </section>

        {/* INFORMATION */}

        <section className="portal-information">

          <div className="portal-container">

            <div className="portal-information-panel">

              <div>
                <span>
                  INFORMATION CENTRE
                </span>

                <h2>
                  Stay informed throughout
                  your admission journey.
                </h2>

                <p>
                  Keep important admission,
                  counselling and college
                  information accessible from
                  one portal.
                </p>
              </div>

              <div className="portal-information-links">

                <Link to="/colleges">
                  College Information
                  <span>→</span>
                </Link>

                <Link to="/counselling">
                  Counselling Services
                  <span>→</span>
                </Link>

                <Link to="/login">
                  Student Account
                  <span>→</span>
                </Link>

              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />

    </div>
  );
};

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

const AdminDashboard = () => {
  const {
    user,
    logout,
  } = useAuth();

  return (
    <div className="portal-page">

      <Header />

      <main className="portal-dashboard-page">

        <div className="portal-container">

          <div className="portal-dashboard-header">

            <span>
              ADMINISTRATION
            </span>

            <h1>
              APSCHE Admin Dashboard
            </h1>

            <p>
              Welcome,{" "}
              {user?.name || "Admin"}.
            </p>

          </div>

          <div className="portal-admin-grid">

            <div className="portal-admin-card">
              <strong>
                College Management
              </strong>

              <span>
                Manage college records and
                verification.
              </span>
            </div>

            <div className="portal-admin-card">
              <strong>
                Counselling Applications
              </strong>

              <span>
                Review student applications.
              </span>
            </div>

            <div className="portal-admin-card">
              <strong>
                Admissions
              </strong>

              <span>
                Manage admission-related
                information.
              </span>
            </div>

          </div>

          <button
            type="button"
            className="portal-danger-button"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </main>

      <Footer />

    </div>
  );
};

/* =========================================================
   FOOTER
========================================================= */

const Footer = () => {
  return (
    <footer className="portal-footer">

      <div className="portal-container portal-footer-grid">

        <div>

          <div className="portal-footer-brand">
            <div className="portal-brand-logo">
              <span>AP</span>
            </div>

            <div>
              <strong>
                APSCHE
              </strong>

              <small>
                Counselling Portal
              </small>
            </div>
          </div>

          <p>
            A student-focused platform for
            college discovery and counselling
            services.
          </p>

        </div>

        <div className="portal-footer-column">

          <h3>
            Portal
          </h3>

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

        <div className="portal-footer-column">

          <h3>
            Account
          </h3>

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

      </div>

      <div className="portal-footer-bottom">

        <div className="portal-container">

          <span>
            © 2025 APSCHE Counselling Portal
          </span>

          <span>
            Student Admission Services
          </span>

        </div>

      </div>

    </footer>
  );
};

/* =========================================================
   PROTECTED ROUTE
========================================================= */

const ProtectedRoute = ({
  children,
}) => {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <main className="portal-loading">
        <div>
          <span />
          <p>
            Loading...
          </p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
};

/* =========================================================
   ADMIN ROUTE
========================================================= */

const AdminRoute = ({
  children,
}) => {
  const {
    isAuthenticated,
    isAdmin,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <main className="portal-loading">
        <div>
          <span />
          <p>
            Loading...
          </p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (!isAdmin) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
};

/* =========================================================
   APPLICATION
========================================================= */

const App = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* PUBLIC */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/colleges"
          element={<Colleges />}
        />

        <Route
          path="/colleges/:id"
          element={
            <CollegeDetails />
          }
        />

        {/* STUDENT */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/counselling"
          element={
            <ProtectedRoute>
              <Counselling />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* FALLBACK */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
};

export default App;

⚠️ Don't commit yet

This "App.jsx" introduces the new class names, but your current "index.css" doesn't have those styles yet.

So if you paste this now, the page will look unstyled until we replace the CSS.

Next exact file:

client/src/index.css

I'll make that CSS handle the phone → tablet → laptop → desktop edges properly, including preventing horizontal overflow.
