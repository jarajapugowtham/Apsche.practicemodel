import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext.jsx";

/* =========================================================
   TEMPORARY PAGE COMPONENTS
   We'll replace these with the final UI pages next.
========================================================= */

const Home = () => (
  <div>
    <h1>APSCHE Counselling</h1>
    <p>Welcome to the counselling application.</p>
  </div>
);

const Login = () => (
  <div>
    <h1>Login</h1>
    <p>Login page coming next.</p>
  </div>
);

const Register = () => (
  <div>
    <h1>Create Account</h1>
    <p>Registration page coming next.</p>
  </div>
);

const Dashboard = () => (
  <div>
    <h1>Student Dashboard</h1>
    <p>Welcome to your counselling dashboard.</p>
  </div>
);

const Colleges = () => (
  <div>
    <h1>College Search</h1>
    <p>College search interface coming next.</p>
  </div>
);

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
      <div>
        Loading...
      </div>
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
      <div>
        Loading...
      </div>
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

        {/* -------------------------------------------------
            PUBLIC
        ------------------------------------------------- */}

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

        {/* -------------------------------------------------
            STUDENT
        ------------------------------------------------- */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* -------------------------------------------------
            FUTURE COUNSELLING ROUTES
        ------------------------------------------------- */}

        <Route
          path="/counselling"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* -------------------------------------------------
            FUTURE ADMIN ROUTE
        ------------------------------------------------- */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />

        {/* -------------------------------------------------
            404
        ------------------------------------------------- */}

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
