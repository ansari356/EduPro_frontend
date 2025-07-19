import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Mail, Sun, Moon, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export default function EducatorSignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    subject: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English Literature',
    'Arabic',
    'Computer Science',
    'History',
    'Geography'
  ];

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
    illustrationCard: {
      borderRadius: '1.5rem',
      padding: '3rem',
      background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
    },
    floatingElement: {
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      animation: 'bounce 2s infinite'
    },
    spinner: {
      width: '3rem',
      height: '3rem'
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^01[0125][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.subject) newErrors.subject = 'Please select your subject';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Registration successful! Welcome, ${formData.fullName}!`);
      setFormData({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        subject: '',
        phone: ''
      });
      setErrors({});
      // navigate('/educator-dashboard'); // Uncomment when dashboard exists
    }, 1200);
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
              <div className="d-flex align-items-center">
                <div
                  className="bg-primary text-white"
                  style={customStyles.headerAvatar}
                >
                  <span>🎓</span>
                </div>
                <div>
                  <span className={`h5 fw-bold mb-0 ${isDarkMode ? 'text-white' : 'text-dark'}`}>
                    Educator Signup
                  </span>
                  <p className={`small mb-0 ${isDarkMode ? 'text-light' : 'text-muted'}`}>
                    Create your educator account
                  </p>
                </div>
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
          {/* Signup Form */}
          <div className="col-lg-6 col-xl-5 mx-auto">
            <div
              className="card shadow-lg border-0"
              style={isDarkMode ? customStyles.darkCard : {}}
            >
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div
                    className="bg-primary bg-opacity-10"
                    style={customStyles.avatarCircle}
                  >
                    <span>🎓</span>
                  </div>
                  <h1 className={`h4 fw-bold mb-2 ${isDarkMode ? 'text-white' : 'text-dark'}`}>
                    Join as Educator
                  </h1>
                  <p className={`small mb-2 ${isDarkMode ? 'text-light' : 'text-muted'}`}>
                    Fill in your details to create your educator account.
                  </p>
                </div>
                <form onSubmit={handleSubmit}>
                  {/* Full Name */}
                  <div className="mb-3">
                    <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>
                      Full Name *
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        name="fullName"
                        className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''} ${errors.fullName ? 'is-invalid' : ''}`}
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        disabled={loading}
                      />
                      <User className="position-absolute top-50 translate-middle-y text-muted" style={{ right: '12px' }} size={20} />
                      {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                    </div>
                  </div>
                  {/* Username */}
                  <div className="mb-3">
                    <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>
                      Username *
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        name="username"
                        className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''} ${errors.username ? 'is-invalid' : ''}`}
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Choose a username"
                        disabled={loading}
                      />
                      <User className="position-absolute top-50 translate-middle-y text-muted" style={{ right: '12px' }} size={20} />
                      {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                    </div>
                  </div>
                  {/* Email */}
                  <div className="mb-3">
                    <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>
                      Email Address *
                    </label>
                    <div className="position-relative">
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''} ${errors.email ? 'is-invalid' : ''}`}
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        disabled={loading}
                      />
                      <Mail className="position-absolute top-50 translate-middle-y text-muted" style={{ right: '12px' }} size={20} />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                  </div>
                  {/* Phone */}
                  <div className="mb-3">
                    <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>
                      Phone Number *
                    </label>
                    <div className="position-relative">
                      <input
                        type="tel"
                        name="phone"
                        className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''} ${errors.phone ? 'is-invalid' : ''}`}
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        disabled={loading}
                      />
                      <User className="position-absolute top-50 translate-middle-y text-muted" style={{ right: '12px' }} size={20} />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>
                  </div>
                  {/* Subject */}
                  <div className="mb-3">
                    <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>
                      Subject *
                    </label>
                    <select
                      name="subject"
                      className={`form-select ${isDarkMode ? 'bg-dark text-white border-secondary' : ''} ${errors.subject ? 'is-invalid' : ''}`}
                      value={formData.subject}
                      onChange={handleInputChange}
                      disabled={loading}
                    >
                      <option value="">Select your subject</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                    {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                  </div>
                  {/* Password */}
                  <div className="mb-3">
                    <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>
                      Password *
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''} ${errors.password ? 'is-invalid' : ''}`}
                        value={formData.password}
                        onChange={handleInputChange}
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
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                  </div>
                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>
                      Confirm Password *
                    </label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''} ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        disabled={loading}
                      />
                      <Lock className="position-absolute top-50 translate-middle-y text-muted" style={{ right: '48px' }} size={20} />
                      <button
                        type="button"
                        className="btn btn-sm position-absolute top-50 translate-middle-y"
                        style={{ right: '12px' }}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex={-1}
                        disabled={loading}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                      {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                    </div>
                  </div>
                  <div className="form-check mb-4">
                    <input className="form-check-input" type="checkbox" id="terms" required disabled={loading} />
                    <label className={`form-check-label ${isDarkMode ? 'text-light' : 'text-dark'}`} htmlFor="terms">
                      I agree to the terms and conditions and privacy policy
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 mb-3"
                    disabled={loading}
                  >
                    <UserPlus size={20} className="me-2" />
                    Register as Educator
                  </button>
                </form>
                <div className="text-center">
                  <p className={`small ${isDarkMode ? 'text-light' : 'text-muted'}`}>
                    Already have an account?
                    <button
                      className="btn btn-link btn-sm text-primary p-0 ms-1"
                      onClick={() => navigate('/educator-login')}
                      disabled={loading}
                    >
                      Login here
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Illustration */}
          <div className="col-lg-6 d-none d-lg-block">
            <div style={customStyles.illustrationCard}>
              <div className="text-center mb-4">
                <h2 className="h3 fw-bold text-dark mb-2">
                  Register as Educator
                </h2>
                <p className="h5 text-dark mb-2">
                  Join EduPro Platform
                </p>
                <p className="text-muted">
                  Empower your teaching journey and connect with students.
                </p>
              </div>
              <div className="position-relative mx-auto mb-4" style={{ width: '300px', height: '200px' }}>
                <div className="card h-100 d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <div className="display-1 mb-3">🎓</div>
                    <div className="bg-primary rounded-pill mb-2" style={{ width: '128px', height: '8px', margin: '0 auto' }}></div>
                    <div className="bg-primary rounded-pill mb-2 opacity-75" style={{ width: '96px', height: '8px', margin: '0 auto' }}></div>
                    <div className="bg-primary rounded-pill opacity-50" style={{ width: '64px', height: '8px', margin: '0 auto' }}></div>
                  </div>
                </div>
                <div
                  className="bg-primary text-white"
                  style={customStyles.floatingElement}
                >
                  <UserPlus size={24} />
                </div>
                <div
                  className="bg-success position-absolute rounded-circle"
                  style={{
                    bottom: '-8px',
                    left: '-8px',
                    width: '32px',
                    height: '32px',
                    animation: 'pulse 2s infinite'
                  }}
                ></div>
              </div>
              <div className="card p-4 mb-4">
                <div className="row text-center">
                  <div className="col-6">
                    <div className="h4 fw-bold text-primary">
                      500+
                    </div>
                    <div className="small text-muted">Educators</div>
                  </div>
                  <div className="col-6">
                    <div className="h4 fw-bold text-primary">
                      10000+
                    </div>
                    <div className="small text-muted">Students</div>
                  </div>
                </div>
              </div>
              <div className="text-center">
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
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0,-30px,0);
          }
          70% {
            transform: translate3d(0,-15px,0);
          }
          90% {
            transform: translate3d(0,-4px,0);
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        .min-vh-100 {
          min-height: 100vh;
        }
        .btn-link {
          text-decoration: none;
        }
        .btn-link:hover {
          text-decoration: underline;
        }
        .is-invalid {
          border-color: #dc3545;
        }
        .invalid-feedback {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
}