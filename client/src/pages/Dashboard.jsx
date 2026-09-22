import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <main>
      <header>
        <h1>APSCHE Student Dashboard</h1>

        <button
          type="button"
          onClick={logout}
        >
          Logout
        </button>
      </header>

      <section>
        <h2>
          Welcome, {user?.name || "Student"} 👋
        </h2>

        <p>
          Manage your APSCHE counselling
          application from here.
        </p>
      </section>

      <section>
        <h2>Quick Actions</h2>

        <nav>
          <Link to="/colleges">
            🔎 Find Colleges
          </Link>

          <br />

          <Link to="/counselling">
            📝 Start Counselling
          </Link>

          <br />

          <Link to="/profile">
            👤 My Profile
          </Link>
        </nav>
      </section>

      <section>
        <h2>Account Information</h2>

        <p>
          <strong>Name:</strong>{" "}
          {user?.name || "Not available"}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {user?.email || "Not available"}
        </p>

        <p>
          <strong>Role:</strong>{" "}
          {user?.role || "student"}
        </p>
      </section>

      <section>
        <h2>Counselling Status</h2>

        <p>
          No counselling application
          submitted yet.
        </p>

        <Link to="/counselling">
          Start Application →
        </Link>
      </section>
    </main>
  );
};

export default Dashboard;
