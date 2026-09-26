import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Search,
  ArrowRight,
  GraduationCap,
  Building2,
  BookOpen,
  ClipboardCheck,
  MapPin,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  Users,
  CheckCircle2,
  Award,
  Landmark,
  FileText,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const value = search.trim();

    if (value) {
      navigate(
        `/colleges?search=${encodeURIComponent(value)}`
      );
    } else {
      navigate("/colleges");
    }
  };

  return (
    <div className="portal">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="portal-header">

        <div className="header-inner">

          <Link
            to="/"
            className="brand"
            onClick={() => setMenuOpen(false)}
          >
            <div className="brand-mark">
              <GraduationCap size={25} />
            </div>

            <div className="brand-text">
              <strong>APSCHE</strong>
              <span>Counselling Portal</span>
            </div>
          </Link>

          <nav
            className={`main-nav ${
              menuOpen ? "mobile-open" : ""
            }`}
          >
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              to="/colleges"
              onClick={() => setMenuOpen(false)}
            >
              Colleges
            </Link>

            <Link
              to="/counselling"
              onClick={() => setMenuOpen(false)}
            >
              Counselling
            </Link>

            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>

            <Link
              to="/register"
              className="nav-register"
              onClick={() => setMenuOpen(false)}
            >
              Register
            </Link>
          </nav>

          <button
            type="button"
            className="mobile-menu"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

        </div>

      </header>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero-section">

        <div className="hero-container">

          <div className="hero-content">

            <div className="official-badge">
              <ShieldCheck size={16} />
              Student Admission Services
            </div>

            <h1>
              Find Your College.
              <br />
              <span>Plan Your Future.</span>
            </h1>

            <p className="hero-description">
              Explore colleges, courses, branches, fees,
              cutoffs and counselling information through
              one student-focused portal.
            </p>

            <div className="hero-actions">

              <button
                type="button"
                className="primary-button"
                onClick={() => goTo("/colleges")}
              >
                Explore Colleges
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() => goTo("/counselling")}
              >
                Start Counselling
              </button>

            </div>

            <div className="hero-trust">

              <div>
                <CheckCircle2 size={17} />
                College discovery
              </div>

              <div>
                <CheckCircle2 size={17} />
                Branch information
              </div>

              <div>
                <CheckCircle2 size={17} />
                Counselling support
              </div>

            </div>

          </div>

          <div className="hero-visual">

            <div className="hero-image-card">

              <img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=85"
                alt="Students celebrating graduation"
              />

              <div className="image-overlay"></div>

              <div className="hero-floating-card top-card">

                <Building2 size={20} />

                <div>
                  <strong>College Discovery</strong>
                  <span>Explore institutions</span>
                </div>

              </div>

              <div className="hero-floating-card bottom-card">

                <GraduationCap size={20} />

                <div>
                  <strong>Your Future</strong>
                  <span>Starts with the right choice</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          QUICK ACCESS
      ===================================================== */}

      <section className="services-section">

        <div className="section-container">

          <div className="section-heading">

            <div>
              <span className="section-label">
                QUICK ACCESS
              </span>

              <h2>
                Everything you need in one place
              </h2>
            </div>

            <p>
              Discover colleges, understand courses and
              prepare for your counselling journey.
            </p>

          </div>

          <div className="service-grid">

            <button
              type="button"
              className="service-card service-blue"
              onClick={() => goTo("/colleges")}
            >
              <div className="service-icon">
                <Building2 size={25} />
              </div>

              <h3>College Directory</h3>

              <p>
                Search colleges by district, branch,
                university and other details.
              </p>

              <span>
                Explore colleges
                <ChevronRight size={17} />
              </span>
            </button>

            <button
              type="button"
              className="service-card service-green"
              onClick={() => goTo("/colleges")}
            >
              <div className="service-icon">
                <BookOpen size={25} />
              </div>

              <h3>Courses & Branches</h3>

              <p>
                Explore available courses, branches,
                intake and academic information.
              </p>

              <span>
                Explore courses
                <ChevronRight size={17} />
              </span>
            </button>

            <button
              type="button"
              className="service-card service-orange"
              onClick={() => goTo("/counselling")}
            >
              <div className="service-icon">
                <ClipboardCheck size={25} />
              </div>

              <h3>Counselling</h3>

              <p>
                Manage your counselling journey and
                application preferences.
              </p>

              <span>
                Start counselling
                <ChevronRight size={17} />
              </span>
            </button>

          </div>

        </div>

      </section>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="stats-section">

        <div className="section-container">

          <div className="stats-grid">

            <div className="stat-card">

              <div className="stat-icon">
                <Building2 size={24} />
              </div>

              <div>
                <strong>College</strong>
                <span>Discovery</span>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                <BookOpen size={24} />
              </div>

              <div>
                <strong>Courses</strong>
                <span>& Branches</span>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                <Users size={24} />
              </div>

              <div>
                <strong>Student</strong>
                <span>Portal</span>
              </div>

            </div>

            <div className="stat-card">

              <div className="stat-icon">
                <Award size={24} />
              </div>

              <div>
                <strong>Admission</strong>
                <span>Support</span>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          COLLEGE SEARCH
      ===================================================== */}

      <section className="search-section">

        <div className="section-container">

          <div className="search-layout">

            <div className="search-information">

              <span className="section-label">
                COLLEGE SEARCH
              </span>

              <h2>
                Find the right college
                <span> for your future.</span>
              </h2>

              <p>
                Search the college directory and explore
                institutions, branches, districts, fees
                and counselling information.
              </p>

              <div className="search-highlights">

                <div>
                  <Building2 size={18} />
                  <span>College Directory</span>
                </div>

                <div>
                  <MapPin size={18} />
                  <span>District-wise Search</span>
                </div>

                <div>
                  <BookOpen size={18} />
                  <span>Branch Information</span>
                </div>

              </div>

            </div>

            <div className="search-box">

              <div className="search-box-heading">

                <div className="search-box-icon">
                  <Search size={22} />
                </div>

                <div>
                  <h3>Search Colleges</h3>

                  <p>
                    Search by college name, code or keyword
                  </p>
                </div>

              </div>

              <form onSubmit={handleSearch}>

                <div className="search-input-wrapper">

                  <Search size={19} />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Enter college name..."
                    aria-label="Search college"
                  />

                </div>

                <button
                  type="submit"
                  className="search-button"
                >
                  Search Colleges
                  <ArrowRight size={18} />
                </button>

              </form>

              <button
                type="button"
                className="browse-all"
                onClick={() => goTo("/colleges")}
              >
                Browse complete college directory
                <ArrowRight size={16} />
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CAMPUS DISCOVERY
      ===================================================== */}

      <section className="campus-section">

        <div className="section-container">

          <div className="campus-grid">

            <div className="campus-image">

              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=85"
                alt="University campus"
                loading="lazy"
              />

              <div className="campus-caption">

                <Building2 size={19} />

                <span>
                  Explore institutions across Andhra Pradesh
                </span>

              </div>

            </div>

            <div className="campus-content">

              <span className="section-label">
                COLLEGE DISCOVERY
              </span>

              <h2>
                More than a college list.
                <span> A smarter way to explore.</span>
              </h2>

              <p>
                Explore academic information, discover
                branches and understand the options available
                before beginning your counselling journey.
              </p>

              <div className="campus-features">

                <div>

                  <div className="feature-number">
                    01
                  </div>

                  <div>
                    <strong>Discover</strong>

                    <p>
                      Find colleges using practical filters.
                    </p>
                  </div>

                </div>

                <div>

                  <div className="feature-number">
                    02
                  </div>

                  <div>
                    <strong>Explore</strong>

                    <p>
                      Review branches and college information.
                    </p>
                  </div>

                </div>

                <div>

                  <div className="feature-number">
                    03
                  </div>

                  <div>
                    <strong>Prepare</strong>

                    <p>
                      Use the information for your counselling
                      decisions.
                    </p>
                  </div>

                </div>

              </div>

              <button
                type="button"
                className="outline-button"
                onClick={() => goTo("/colleges")}
              >
                Explore College Directory
                <ArrowRight size={18} />
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FEATURE IMAGE STRIP
      ===================================================== */}

      <section className="image-strip-section">

        <div className="section-container">

          <div className="image-strip-grid">

            <div className="image-strip-card">

              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85"
                alt="Students studying together"
                loading="lazy"
              />

              <div className="image-strip-overlay">
                <Users size={20} />
                <span>Student Community</span>
              </div>

            </div>

            <div className="image-strip-card">

              <img
                src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=900&q=85"
                alt="College library"
                loading="lazy"
              />

              <div className="image-strip-overlay">
                <BookOpen size={20} />
                <span>Academic Environment</span>
              </div>

            </div>

            <div className="image-strip-card">

              <img
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=85"
                alt="University building"
                loading="lazy"
              />

              <div className="image-strip-overlay">
                <Landmark size={20} />
                <span>College Campus</span>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          COUNSELLING PROCESS
      ===================================================== */}

      <section className="process-section">

        <div className="section-container">

          <div className="section-heading centered">

            <span className="section-label">
              COUNSELLING JOURNEY
            </span>

            <h2>
              Your admission journey,
              <span> simplified.</span>
            </h2>

            <p>
              Follow the key stages of your counselling
              journey from registration to admission.
            </p>

          </div>

          <div className="process-grid">

            <div className="process-card">

              <div className="process-icon">
                <Users size={24} />
              </div>

              <span>01</span>

              <h3>Register</h3>

              <p>
                Create your student account and
                maintain your profile.
              </p>

              <button
                type="button"
                onClick={() => goTo("/register")}
              >
                Register
                <ArrowRight size={15} />
              </button>

            </div>

            <div className="process-line"></div>

            <div className="process-card">

              <div className="process-icon">
                <BookOpen size={24} />
              </div>

              <span>02</span>

              <h3>Explore</h3>

              <p>
                Review colleges, branches, fees and
                available information.
              </p>

              <button
                type="button"
                onClick={() => goTo("/colleges")}
              >
                Explore
                <ArrowRight size={15} />
              </button>

            </div>

            <div className="process-line"></div>

            <div className="process-card">

              <div className="process-icon">
                <ClipboardCheck size={24} />
              </div>

              <span>03</span>

              <h3>Apply</h3>

              <p>
                Submit your counselling preferences
                through your account.
              </p>

              <button
                type="button"
                onClick={() => goTo("/counselling")}
              >
                Apply
                <ArrowRight size={15} />
              </button>

            </div>

            <div className="process-line"></div>

            <div className="process-card">

              <div className="process-icon">
                <GraduationCap size={24} />
              </div>

              <span>04</span>

              <h3>Continue</h3>

              <p>
                Track your application and complete
                the next admission steps.
              </p>

              <button
                type="button"
                onClick={() => goTo("/dashboard")}
              >
                Dashboard
                <ArrowRight size={15} />
              </button>

            </div>

          </div>

          <div className="process-action">

            <button
              type="button"
              className="primary-button"
              onClick={() => goTo("/counselling")}
            >
              Open Counselling
              <ArrowRight size={18} />
            </button>

          </div>

        </div>

      </section>

      {/* =====================================================
          STUDENT CTA
      ===================================================== */}

      <section className="student-cta">

        <div className="section-container">

          <div className="cta-card">

            <div className="cta-content">

              <span className="section-label">
                FOR STUDENTS
              </span>

              <h2>
                Ready to explore
                <br />
                your options?
              </h2>

              <p>
                Create your account, explore colleges and
                prepare for your counselling journey.
              </p>

              <div className="cta-actions">

                <button
                  type="button"
                  className="white-button"
                  onClick={() => goTo("/register")}
                >
                  Create Account
                  <ArrowRight size={17} />
                </button>

                <button
                  type="button"
                  className="transparent-button"
                  onClick={() => goTo("/login")}
                >
                  Already registered? Login
                </button>

              </div>

            </div>

            <div className="cta-visual">

              <div className="cta-circle circle-one"></div>
              <div className="cta-circle circle-two"></div>

              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=85"
                alt="Students studying together"
                loading="lazy"
              />

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="portal-footer">

        <div className="footer-container">

          <div className="footer-brand">

            <div className="brand footer-brand-logo">

              <div className="brand-mark">
                <GraduationCap size={24} />
              </div>

              <div className="brand-text">
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

            <Link to="/">Home</Link>
            <Link to="/colleges">Colleges</Link>
            <Link to="/counselling">Counselling</Link>

          </div>

          <div className="footer-column">

            <h4>Account</h4>

            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/dashboard">Dashboard</Link>

          </div>

          <div className="footer-column">

            <h4>Explore</h4>

            <button
              type="button"
              onClick={() => goTo("/colleges")}
            >
              <Search size={15} />
              College Search
            </button>

            <button
              type="button"
              onClick={() => goTo("/counselling")}
            >
              <ClipboardCheck size={15} />
              Counselling
            </button>

            <button
              type="button"
              onClick={() => goTo("/register")}
            >
              <FileText size={15} />
              Student Registration
            </button>

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

    </div>
  );
};

export default Home;
