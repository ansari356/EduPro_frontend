import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, Mail, UserPlus } from 'lucide-react';
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
                  Educator Signup
                </span>
                <p className="profile-role mb-0">
                  Create your educator account
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row align-items-center min-vh-100">
          {/* Signup Form */}
          <div className="col-lg-6 col-xl-5 mx-auto">
            <div className="card">
              <div className="card-body">
                <div className="text-center mb-4">
                  <div className="avatar-circle">
                    <span>🎓</span>
                  </div>
                  <h1 className="section-title mb-2">
                    Join as Educator
                  </h1>
                  <p className="profile-role mb-2">
                    Fill in your details to create your educator account.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Full Name */}
                  <div className="mb-3">
                    <label className="form-label">
                      Full Name *
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        name="fullName"
                        className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        disabled={loading}
                      />
                      <User className="position-absolute top-50 translate-middle-y input-icon" size={20} />
                      {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                    </div>
                  </div>

                  {/* Username */}
                  <div className="mb-3">
                    <label className="form-label">
                      Username *
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        name="username"
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Choose a username"
                        disabled={loading}
                      />
                      <User className="position-absolute top-50 translate-middle-y input-icon" size={20} />
                      {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">
                      Email Address *
                    </label>
                    <div className="position-relative">
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        disabled={loading}
                      />
                      <Mail className="position-absolute top-50 translate-middle-y input-icon" size={20} />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="mb-3">
                    <label className="form-label">
                      Phone Number *
                    </label>
                    <div className="position-relative">
                      <input
                        type="tel"
                        name="phone"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        disabled={loading}
                      />
                      <User className="position-absolute top-50 translate-middle-y input-icon" size={20} />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="mb-3">
                    <label className="form-label">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
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
                    <label className="form-label">
                      Password *
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        value={formData.password}
                        onChange={handleInputChange}
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
                      {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label className="form-label">
                      Confirm Password *
                    </label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        disabled={loading}
                      />
                      <Lock className="position-absolute top-50 translate-middle-y input-icon-with-button" size={20} />
                      <button
                        type="button"
                        className="btn btn-sm position-absolute top-50 translate-middle-y eye-button"
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
                    <label className="form-check-label" htmlFor="terms">
                      I agree to the terms and conditions and privacy policy
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn-edit-profile w-100 mb-3 d-flex align-items-center justify-content-center"
                    disabled={loading}
                  >
                    {loading && (
                      <div className="loading-spinner me-2" style={{width: '1rem', height: '1rem', display: 'inline-block'}}></div>
                    )}
                    <UserPlus size={20} className="me-2" />
                    Register as Educator
                  </button>
                </form>

                <div className="text-center">
                  <p className="profile-joined">
                    Already have an account?
                    <button
                      className="btn-link-custom text-accent ms-1"
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
            <div className="illustration-card">
              <div className="text-center mb-4">
                <h2 className="section-title text-white mb-2">
                  Register as Educator
                </h2>
                <p className="profile-name text-white mb-2">
                  Join EduPro Platform
                </p>
                <p className="text-white opacity-75">
                  Empower your teaching journey and connect with students.
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

                <div className="floating-element">
                  <UserPlus size={24} />
                </div>
                <div className="floating-pulse"></div>
              </div>

              <div className="card p-4 mb-4">
                <div className="row text-center">
                  <div className="col-6">
                    <div className="section-title text-accent">
                      500+
                    </div>
                    <div className="profile-joined">Educators</div>
                  </div>
                  <div className="col-6">
                    <div className="section-title text-accent">
                      10000+
                    </div>
                    <div className="profile-joined">Students</div>
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
