import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext.jsx";

/* =========================================================
   PAGES
========================================================= */

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Colleges from "./pages/Colleges.jsx";
import CollegeDetails from "./pages/CollegeDetails.jsx";
import Counselling from "./pages/Counselling.jsx";

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <main className="simple-page">
      <div className="simple-card">

        <div className="service-icon service-blue-icon">
          <span>✓</span>
        </div>

        <h1>APSCHE Admin Dashboard</h1>

        <p>
          Welcome, {user?.name || "Admin"}.
        </p>

        <p>
          Manage counselling applications,
          colleges, verification and allotments.
        </p>

        <button
          type="button"
          className="primary-button"
          onClick={logout}
        >
          Logout
        </button>

      </div>
    </main>
  );
};

/* =========================================================
   LOADING SCREEN
========================================================= */

const LoadingScreen = () => {
  return (
    <main className="loading-page">
      <div className="loader"></div>

      <p>
        Loading APSCHE Portal...
      </p>
    </main>
  );
};

/* =========================================================
   PROTECTED ROUTE
========================================================= */

const ProtectedRoute = ({ children }) => {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  if (loading) {
    return <LoadingScreen />;
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

const AdminRoute = ({ children }) => {
  const {
    isAuthenticated,
    isAdmin,
    loading,
  } = useAuth();

  if (loading) {
    return <LoadingScreen />;
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

        {/* =================================================
            PUBLIC
        ================================================= */}

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
          element={<CollegeDetails />}
        />

        {/* =================================================
            STUDENT
        ================================================= */}

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

        {/* =================================================
            ADMIN
        ================================================= */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* =================================================
            FALLBACK
        ================================================= */}

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
