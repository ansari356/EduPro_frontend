import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Sun, Moon } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function EducatorLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const customStyles = {
    darkMode: {
      backgroundColor: '#111827',
      color: '#ffffff'
    },
    darkCard: {
      backgroundColor: '#1f2937',
      color: '#ffffff'
    },
    darkHeader: {
      backgroundColor: '#374151',
      color: '#ffffff'
    },
    lightGray: {
      backgroundColor: '#f9fafb'
    },
    avatarCircle: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      margin: '0 auto 1rem'
    },
    headerAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      marginRight: '0.5rem'
    },
    spinner: {
      width: '3rem',
      height: '3rem'
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Welcome, ${email}!`);
      // navigate('/educator-dashboard'); // Uncomment when dashboard exists
    }, 1000);
  };

  return (
    <div
      className="min-vh-100"
      style={isDarkMode ? customStyles.darkMode : customStyles.lightGray}
    >
      {/* Header */}
      <div
        className="border-bottom shadow-sm"
        style={isDarkMode ? customStyles.darkHeader : { backgroundColor: '#ffffff' }}
      >
        <div className="container py-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div
                className="bg-primary text-white"
                style={customStyles.headerAvatar}
              >
                <span>🎓</span>
              </div>
              <div>
                <span className={`h5 fw-bold mb-0 ${isDarkMode ? 'text-white' : 'text-dark'}`}>
                  Educator Portal
                </span>
                <p className={`small mb-0 ${isDarkMode ? 'text-light' : 'text-muted'}`}>
                  Login to your educator account
                </p>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`btn btn-sm ms-4 ${isDarkMode ? 'btn-outline-warning' : 'btn-outline-secondary'}`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row align-items-center min-vh-100">
          <div className="col-lg-6 col-xl-5 mx-auto">
            <div
              className="card shadow-lg border-0"
              style={isDarkMode ? customStyles.darkCard : {}}
            >
              <div className="card-body p-5">
                <div className="text-center mb-5">
                  <div
                    className="bg-primary bg-opacity-10"
                    style={customStyles.avatarCircle}
                  >
                    <span>🎓</span>
                  </div>
                  <h1 className={`h4 fw-bold mb-2 ${isDarkMode ? 'text-white' : 'text-dark'}`}>
                    Welcome Educator
                  </h1>
                  <p className={`small mb-2 ${isDarkMode ? 'text-light' : 'text-muted'}`}>
                    Please login to access your dashboard.
                  </p>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>
                      Email
                    </label>
                    <div className="position-relative">
                      <input
                        type="email"
                        className={`form-control form-control-lg ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        disabled={loading}
                      />
                      <User className="position-absolute top-50 translate-middle-y text-muted" style={{ right: '12px' }} size={20} />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>
                      Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control form-control-lg ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={loading}
                      />
                      <Lock className="position-absolute top-50 translate-middle-y text-muted" style={{ right: '48px' }} size={20} />
                      <button
                        type="button"
                        className="btn btn-sm position-absolute top-50 translate-middle-y"
                        style={{ right: '12px' }}
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : null}
                    Login
                  </button>
                </form>
                <div className="text-center">
                  <p className={`small ${isDarkMode ? 'text-light' : 'text-muted'}`}>
                    Forgot password?
                    <button
                      className="btn btn-link btn-sm text-primary p-0 ms-1"
                      onClick={() => alert('Password reset feature coming soon!')}
                      disabled={loading}
                    >
                      Click here
                    </button>
                  </p>
                  <p className={`small ${isDarkMode ? 'text-light' : 'text-muted'}`}>
                    Not registered yet?
                    <button
                      className="btn btn-link btn-sm text-primary p-0 ms-1"
                      onClick={() => navigate('/educator-signup')}
                      disabled={loading}
                    >
                      Create an Account
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Illustration */}
          <div className="col-lg-6 d-none d-lg-block">
            <div className="card p-5 shadow" style={{ borderRadius: '1.5rem', background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' }}>
              <div className="text-center mb-4">
                <h2 className="h3 fw-bold text-dark mb-2">
                  Educator Portal
                </h2>
                <p className="h5 text-dark mb-2">
                  Manage your classes and students
                </p>
                <p className="text-muted">
                  Access your dashboard, manage students, and more.
                </p>
              </div>
              <div className="display-1 mb-3 text-center">🎓</div>
              <div className="bg-primary rounded-pill mb-2" style={{ width: '128px', height: '8px', margin: '0 auto' }}></div>
              <div className="bg-primary rounded-pill mb-2 opacity-75" style={{ width: '96px', height: '8px', margin: '0 auto' }}></div>
              <div className="bg-primary rounded-pill opacity-50" style={{ width: '64px', height: '8px', margin: '0 auto' }}></div>
              <div className="text-center mt-4">
                <p className="small text-muted fw-bold">
                  EduPro Platform - For Educators
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bootstrap 5 CSS */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />
      {/* Bootstrap 5 JS */}
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"
      ></script>
      {/* Custom CSS for animations */}
      <style jsx>{`
        .min-vh-100 {
          min-height: 100vh;
        }
        .btn-link {
          text-decoration: none;
        }
        .btn-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}