import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const navigate = useNavigate();

  const {
    login,
  } = useAuth();

  const [form, setForm] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !form.email ||
      !form.password
    ) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const result =
        await login(form);

      const loggedUser =
        result?.user;

      if (
        loggedUser?.role === "admin"
      ) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section>
        <div>
          <h1>
            APSCHE Counselling
          </h1>

          <p>
            Student Counselling Portal
          </p>

          <h2>
            Welcome Back
          </h2>

          <p>
            Login to continue your
            counselling application.
          </p>

          {error && (
            <div role="alert">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
          >
            <div>
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={
                  handleChange
                }
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={
                  handleChange
                }
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>
          </form>

          <p>
            Don't have an account?{" "}
            <Link to="/register">
              Create Account
            </Link>
          </p>

          <Link to="/">
            ← Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Login;
