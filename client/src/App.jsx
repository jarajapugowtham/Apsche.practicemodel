import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Colleges from "./pages/Colleges.jsx";
import CollegeDetails from "./pages/CollegeDetails.jsx";

/* =========================================================
   HOME
========================================================= */

const Home = () => {
  return (
    <main>
      <h1>APSCHE Counselling</h1>

      <p>
        Welcome to the APSCHE Counselling
        Portal.
      </p>

      <nav>
        <a href="/login">Login</a>
        {" | "}
        <a href="/register">Register</a>
        {" | "}
        <a href="/colleges">Colleges</a>
      </nav>
    </main>
  );
};

/* =========================================================
   COUNSELLING
========================================================= */

const Counselling = () => {
  return (
    <main>
      <h1>
        Counselling Application
      </h1>

      <p>
        Your counselling application
        will appear here.
      </p>

      <a href="/dashboard">
        ← Dashboard
      </a>
    </main>
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
    <main>
      <h1>Admin Dashboard</h1>

      <p>
        Welcome,{" "}
        {user?.name || "Admin"}.
      </p>

      <p>
        Manage applications, colleges
        and counselling data.
      </p>

      <button
        type="button"
        onClick={logout}
      >
        Logout
      </button>
    </main>
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
      <main>
        <p>Loading...</p>
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
      <main>
        <p>Loading...</p>
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
   APP
========================================================= */

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================================
            PUBLIC ROUTES
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

        {/* =================================================
            COLLEGE ROUTES
        ================================================= */}

        <Route
          path="/colleges"
          element={<Colleges />}
        />

        <Route
          path="/colleges/:id"
          element={<CollegeDetails />}
        />

        {/* =================================================
            STUDENT ROUTES
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
            ADMIN ROUTES
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
            404
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
