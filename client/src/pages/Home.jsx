import React from "react";
import { Link } from "react-router-dom";

/* =========================================================
   APSCHE PREMIUM HOME PAGE
   Professional • Colourful • Responsive
========================================================= */

const categories = [
  {
    icon: "🎓",
    title: "Engineering",
    text: "Explore B.Tech colleges, branches, fees and counselling information.",
    link: "/colleges?category=engineering",
  },
  {
    icon: "💊",
    title: "Pharmacy",
    text: "Find pharmacy colleges, courses and admission information.",
    link: "/colleges?category=pharmacy",
  },
  {
    icon: "🌾",
    title: "Agriculture",
    text: "Discover agriculture and allied education opportunities.",
    link: "/colleges?category=agriculture",
  },
  {
    icon: "💼",
    title: "MBA / MCA",
    text: "Explore postgraduate colleges and professional programs.",
    link: "/colleges?category=management",
  },
];

const features = [
  {
    icon: "🔎",
    title: "College Search",
    text: "Search colleges by name, district, branch and other available filters.",
  },
  {
    icon: "📊",
    title: "Cutoff Information",
    text: "View available counselling-year cutoff information for colleges and branches.",
  },
  {
    icon: "💰",
    title: "Fee Information",
    text: "Compare available tuition and other fee information.",
  },
  {
    icon: "📝",
    title: "Counselling",
    text: "Create and manage your counselling preferences through your account.",
  },
  {
    icon: "🏛️",
    title: "College Profiles",
    text: "View college location, university, branches and available information.",
  },
  {
    icon: "✅",
    title: "Verified Information",
    text: "Identify information that has been marked as verified in the portal.",
  },
];

const stats = [
  {
    number: "2025",
    label: "Data Focus",
  },
  {
    number: "26+",
    label: "Districts",
  },
  {
    number: "100+",
    label: "Institutions",
  },
  {
    number: "24/7",
    label: "Portal Access",
  },
];

const Home = () => {
  return (
    <div className="home-page">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="navbar">
        <div className="container navbar-inner">

          <Link to="/" className="logo">
            <div className="logo-mark">
              AP
            </div>

            <div className="logo-text">
              <span className="logo-title">
                APSCHE
              </span>

              <span className="logo-subtitle">
                Practice Counselling Portal
              </span>
            </div>
          </Link>

          <nav className="nav-links">
            <Link
              to="/"
              className="active"
            >
              Home
            </Link>

            <Link to="/colleges">
              Colleges
            </Link>

            <Link to="/counselling">
              Counselling
            </Link>

            <Link to="/dashboard">
              Dashboard
            </Link>
          </nav>

          <div className="hero-actions">
            <Link
              to="/login"
              className="btn btn-outline"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="btn btn-primary"
            >
              Register
            </Link>
          </div>

        </div>
      </header>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero">

        <div className="container hero-content">

          <div className="hero-grid">

            <div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 12px",
                  marginBottom: "18px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.12)",
                  color: "#fef3c7",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                🎓 ANDHRA PRADESH EDUCATION PORTAL
              </div>

              <h1>
                Find Your
                <span> College.</span>
                <br />
                Plan Your Future.
              </h1>

              <p>
                Explore colleges, branches, fees and counselling
                information through one simple education portal
                designed for students.
              </p>

              <div className="hero-actions">

                <Link
                  to="/colleges"
                  className="btn btn-gold"
                >
                  🔎 Explore Colleges
                </Link>

                <Link
                  to="/counselling"
                  className="btn"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: "white",
                    borderColor: "rgba(255,255,255,0.25)",
                  }}
                >
                  📝 Start Counselling
                </Link>

              </div>

            </div>


            {/* =================================================
                HERO IMAGE
            ================================================= */}

            <div className="hero-image">

              <img
                src="https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1200&q=85"
                alt="University campus"
                loading="eager"
              />

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          QUICK STATS
      ===================================================== */}

      <section
        style={{
          marginTop: "-35px",
          position: "relative",
          zIndex: 5,
        }}
      >

        <div className="container">

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))",
              gap: "12px",
              padding: "18px",
              background: "white",
              borderRadius: "18px",
              boxShadow:
                "0 15px 40px rgba(15,23,42,0.10)",
              border:
                "1px solid #e2e8f0",
            }}
          >

            {stats.map((stat) => (
              <div
                key={stat.label}
                style={{
                  textAlign: "center",
                  padding: "8px",
                }}
              >

                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 800,
                    color: "#164e63",
                  }}
                >
                  {stat.number}
                </div>

                <div
                  style={{
                    color: "#64748b",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {stat.label}
                </div>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <section className="section">

        <div className="container">

          <div className="section-header">

            <h2>
              Explore Education
            </h2>

            <p>
              Choose an education category and discover
              available colleges and programs.
            </p>

          </div>

          <div className="category-grid">

            {categories.map((category) => (
              <Link
                key={category.title}
                to={category.link}
                className="category-card"
              >

                <div
                  className="category-icon"
                  aria-hidden="true"
                >
                  {category.icon}
                </div>

                <div>

                  <h3>
                    {category.title}
                  </h3>

                  <p>
                    {category.text}
                  </p>

                </div>

                <div
                  style={{
                    marginTop: "18px",
                    color: "#2563eb",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  Explore →
                </div>

              </Link>
            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          COLLEGE DISCOVERY
      ===================================================== */}

      <section
        className="section"
        style={{
          background: "#eef6f7",
        }}
      >

        <div className="container">

          <div className="section-header">

            <h2>
              Your College Search Starts Here
            </h2>

            <p>
              Search and compare available college information
              before building your counselling preferences.
            </p>

          </div>


          <div className="college-grid">

            {/* Card 1 */}

            <article className="college-card">

              <div className="college-image">

                <img
                  src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=85"
                  alt="College campus building"
                  loading="lazy"
                />

                <span className="college-badge">
                  🎓 Campus
                </span>

              </div>

              <div className="college-body">

                <h3>
                  Explore Engineering Colleges
                </h3>

                <p className="college-location">
                  🏛️ Andhra Pradesh
                </p>

                <div className="college-meta">

                  <span className="meta-pill">
                    B.Tech
                  </span>

                  <span className="meta-pill">
                    Branches
                  </span>

                  <span className="meta-pill">
                    Fees
                  </span>

                </div>

                <div className="college-actions">

                  <Link
                    to="/colleges"
                    className="btn btn-primary"
                  >
                    View Colleges
                  </Link>

                </div>

              </div>

            </article>


            {/* Card 2 */}

            <article className="college-card">

              <div className="college-image">

                <img
                  src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=85"
                  alt="Science and pharmacy laboratory"
                  loading="lazy"
                />

                <span className="college-badge">
                  🔬 Programs
                </span>

              </div>

              <div className="college-body">

                <h3>
                  Discover Pharmacy Programs
                </h3>

                <p className="college-location">
                  💊 Pharmacy Education
                </p>

                <div className="college-meta">

                  <span className="meta-pill">
                    Pharmacy
                  </span>

                  <span className="meta-pill">
                    Colleges
                  </span>

                  <span className="meta-pill">
                    Courses
                  </span>

                </div>

                <div className="college-actions">

                  <Link
                    to="/colleges"
                    className="btn btn-primary"
                  >
                    Explore
                  </Link>

                </div>

              </div>

            </article>


            {/* Card 3 */}

            <article className="college-card">

              <div className="college-image">

                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=85"
                  alt="University students"
                  loading="lazy"
                />

                <span className="college-badge">
                  📝 Admission
                </span>

              </div>

              <div className="college-body">

                <h3>
                  Plan Your Counselling
                </h3>

                <p className="college-location">
                  📋 Student Preference Planning
                </p>

                <div className="college-meta">

                  <span className="meta-pill">
                    Preferences
                  </span>

                  <span className="meta-pill">
                    Applications
                  </span>

                  <span className="meta-pill">
                    Dashboard
                  </span>

                </div>

                <div className="college-actions">

                  <Link
                    to="/counselling"
                    className="btn btn-primary"
                  >
                    Start Now
                  </Link>

                </div>

              </div>

            </article>

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section className="section">

        <div className="container">

          <div className="section-header">

            <h2>
              Everything You Need
            </h2>

            <p>
              Useful tools for exploring colleges and
              preparing your counselling preferences.
            </p>

          </div>


          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, minmax(0, 1fr))",
              gap: "18px",
            }}
          >

            {features.map((feature) => (
              <div
                key={feature.title}
                className="category-card"
                style={{
                  minHeight: "150px",
                }}
              >

                <div
                  className="category-icon"
                  aria-hidden="true"
                >
                  {feature.icon}
                </div>

                <div>

                  <h3>
                    {feature.title}
                  </h3>

                  <p>
                    {feature.text}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          COUNSELLING CTA
      ===================================================== */}

      <section
        className="section"
        style={{
          paddingTop: "25px",
        }}
      >

        <div className="container">

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1.3fr) minmax(280px, 0.7fr)",
              alignItems: "center",
              gap: "30px",
              padding: "45px",
              borderRadius: "26px",
              background:
                "linear-gradient(135deg,#164e63,#0f766e)",
              overflow: "hidden",
            }}
          >

            <div>

              <div
                style={{
                  color: "#fbbf24",
                  fontSize: "12px",
                  fontWeight: 800,
                  marginBottom: "10px",
                  letterSpacing: "1px",
                }}
              >
                COUNSELLING PORTAL
              </div>

              <h2
                style={{
                  color: "white",
                  fontFamily:
                    '"Plus Jakarta Sans", sans-serif',
                  fontSize:
                    "clamp(28px,4vw,42px)",
                  lineHeight: 1.15,
                  marginBottom: "12px",
                }}
              >
                Ready to build your
                college preferences?
              </h2>

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.82)",
                  maxWidth: "600px",
                  marginBottom: "22px",
                }}
              >
                Sign in to your student account and
                start organising your counselling
                preferences.
              </p>

              <div className="hero-actions">

                <Link
                  to="/register"
                  className="btn btn-gold"
                >
                  Create Student Account
                </Link>

                <Link
                  to="/login"
                  className="btn"
                  style={{
                    background:
                      "rgba(255,255,255,0.12)",
                    color: "white",
                    borderColor:
                      "rgba(255,255,255,0.25)",
                  }}
                >
                  Login
                </Link>

              </div>

            </div>


            <div
              style={{
                display: "flex",
                justifyContent: "center",
                fontSize: "110px",
              }}
              aria-hidden="true"
            >
              🎓
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">

        <div className="container footer-inner">

          <div>

            <h3>
              APSCHE Practice Model
            </h3>

            <p>
              A student-focused practice portal for
              exploring college and counselling
              information.
            </p>

          </div>


          <div>

            <h3>
              Explore
            </h3>

            <div className="footer-links">

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

          </div>


          <div>

            <h3>
              Account
            </h3>

            <div className="footer-links">

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


          <div>

            <h3>
              Information
            </h3>

            <div className="footer-links">

              <span>
                Andhra Pradesh
              </span>

              <span>
                Student Portal
              </span>

              <span>
                Counselling
              </span>

            </div>

          </div>

        </div>


        <div className="container footer-bottom">

          © 2026 APSCHE Practice Model.
          Built for educational practice and
          counselling exploration.

        </div>

      </footer>

    </div>
  );
};

export default Home;
