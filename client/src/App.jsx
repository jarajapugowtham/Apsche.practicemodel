import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext.jsx";

import Login from "./pages/Login.jsx";

/* =========================================================
   HOME PAGE
========================================================= */

const Home = () => {
  return (
    <main>
      <h1>APSCHE Counselling</h1>

      <p>
        Welcome to the APSCHE Counselling
        Portal.
      </p>

      <div>
        <a href="/login">
          Login
        </a>

        {" | "}

        <a href="/register">
          Register
        </a>

        {" | "}

        <a href="/colleges">
          Colleges
        </a>
      </div>
    </main>
  );
};

/* =========================================================
   REGISTER PAGE
   Temporary until Register.jsx is created
========================================================= */

const Register = () => {
  return (
    <main>
      <h1>Create Account</h1>

      <p>
        Registration page will be
        available soon.
      </p>

      <a href="/login">
        Already have an account? Login
      </a>
    </main>
  );
};

/* =========================================================
   STUDENT DASHBOARD
========================================================= */

const Dashboard = () => {
  const {
    user,
    logout,
  } = useAuth();

  return (
    <main>
      <h1>
        Student Dashboard
      </h1>

      <p>
        Welcome,{" "}
        {user?.name || "Student"}!
      </p>

      <p>
        Email:{" "}
        {user?.email || "Not available"}
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
   COLLEGE SEARCH
========================================================= */

const Colleges = () => {
  return (
    <main>
      <h1>
        College Search
      </h1>

      <p>
        Search APSCHE colleges,
        branches, fees and cutoffs.
      </p>

      <a href="/">
        ← Back to Home
      </a>
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
      <h1>
        Admin Dashboard
      </h1>

      <p>
        Welcome,{" "}
        {user?.name || "Admin"}.
      </p>

      <p>
        Admin management tools will
        appear here.
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
        <p>
          Loading...
        </p>
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
        <p>
          Loading...
        </p>
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

        <Route
          path="/colleges"
          element={<Colleges />}
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
