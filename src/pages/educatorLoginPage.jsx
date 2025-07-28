import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function EducatorLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
      navigate('/educator-profile');
    }, 1000);
  };

  return (
    <div className="profile-root">
      {/* Header */}
      <div className="card border-0 shadow-sm">
        <div className="container py-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="header-avatar">
                <span>🎓</span>
              </div>
              <div>
                <span className="section-title mb-0">
                  Educator Portal
                </span>
                <p className="profile-role mb-0">
                  Login to your educator account
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row align-items-center min-vh-100">
          <div className="col-lg-6 col-xl-5 mx-auto">
            <div className="card">
              <div className="card-body">
                <div className="text-center mb-5">
                  <div className="avatar-circle">
                    <span>🎓</span>
                  </div>
                  <h1 className="section-title mb-2">
                    Welcome Educator
                  </h1>
                  <p className="profile-role mb-2">
                    Please login to access your dashboard.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label">
                      Email
                    </label>
                    <div className="position-relative">
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        disabled={loading}
                      />
                      <User className="position-absolute top-50 translate-middle-y input-icon" size={20} />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">
                      Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        disabled={loading}
                      />
                      <Lock className="position-absolute top-50 translate-middle-y input-icon-with-button" size={20} />
                      <button
                        type="button"
                        className="btn btn-sm position-absolute top-50 translate-middle-y eye-button"
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
                    className="btn-edit-profile w-100 mb-3"
                    disabled={loading}
                  >
                    {loading && (
                      <div className="loading-spinner me-2" style={{width: '1rem', height: '1rem', display: 'inline-block'}}></div>
                    )}
                    Login
                  </button>
                </form>

                <div className="text-center">
                  <p className="profile-joined">
                    Forgot password?
                    <button
                      className="btn-link-custom text-accent ms-1"
                      onClick={() => alert('Password reset feature coming soon!')}
                      disabled={loading}
                    >
                      Click here
                    </button>
                  </p>
                  <p className="profile-joined">
                    Not registered yet?
                    <button
                      className="btn-link-custom text-accent ms-1"
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
            <div className="illustration-card">
              <div className="text-center mb-4">
                <h2 className="section-title text-white mb-2">
                  Educator Portal
                </h2>
                <p className="profile-name text-white mb-2">
                  Manage your classes and students
                </p>
                <p className="text-white opacity-75">
                  Access your dashboard, manage students, and more.
                </p>
              </div>

              <div className="position-relative mx-auto mb-4 illustration-container">
                <div className="card h-100 d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <div className="display-1 mb-3">🎓</div>
                    <div className="progress-bar-primary"></div>
                    <div className="progress-bar-light"></div>
                    <div className="progress-bar-accent"></div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="profile-role text-white fw-bold">
                  EduPro Platform - For Educators
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
