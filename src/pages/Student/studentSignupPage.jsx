import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, Phone, Mail, BookOpen, ArrowRight, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useEducatorPublicData from '../../apis/hooks/student/useEducatorPublicData';
import { pagePaths } from '../../pagePaths';
import registerStudent from '../../apis/actions/student/registerStudent';

const StudentSignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '', // Mapping studentId to username
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    parentPhone: '',
    avatar: null,
    avatarPreview: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [registerLoading, setRegisterLoading] = useState(false);
  const navigate = useNavigate();
  const { data: educatorData, error, isLoading } = useEducatorPublicData();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatar: file,
        avatarPreview: URL.createObjectURL(file)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        avatar: null,
        avatarPreview: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username (Student ID) is required';
    }
        
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^01[0125][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
        
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
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
    
    if (!formData.parentPhone.trim()) {
      newErrors.parentPhone = 'Parent phone number is required';
    } else if (!/^01[0125][0-9]{8}$/.test(formData.parentPhone)) {
      newErrors.parentPhone = 'Please enter a valid parent phone number';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!educatorData) return;
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    const registrationData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      username: formData.username,
      phone: formData.phone,
      parent_phone: formData.parentPhone,
      password1: formData.password,
      password2: formData.confirmPassword,
      avatar: formData.avatar // Use the selected avatar file
    };

    setRegisterLoading(true);
    try {
      const response = await registerStudent(registrationData,educatorData?.user.username);
      console.log('Student registration successful:', response.data);
      alert(`Registration successful! Welcome to ${educatorData.full_name}'s ${educatorData.specialization} class!`);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        username: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        parentPhone: '',
        avatar: null,
        avatarPreview: null
      });
      setErrors({});
      navigate(pagePaths.student.login(educatorData?.user.username)); // Redirect to login page
    } catch (err) {
      console.error('Student registration failed:', err);
      alert(`Registration failed: ${err.response?.data?.detail || err.message}`);
      setErrors(err.response?.data || {}); // Set errors from API response
    } finally {
      setRegisterLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-root min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="loading-spinner mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="profile-joined">Loading teacher's page...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-root min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <p className="profile-joined text-danger">Error loading teacher data: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!educatorData) {
    return (
      <div className="profile-root min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="display-1 mb-4">❌</div>
          <h1 className="main-title mb-4">Teacher Not Found</h1>
          <p className="profile-joined mb-4">
            Sorry, we couldn't find this teacher's page. 
            Please check the link or contact platform administration.
          </p>
          <button 
            className="btn-edit-profile"
            onClick={() => navigate('/')} // Navigate to a default homepage or error page
          >
            Back to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-root">
      {/* Header */}
      <div className="card border-0 shadow-sm">
        <div className="container py-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="header-avatar">
                <img src={educatorData.profile_picture} alt="Educator Profile" className="rounded-circle" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
              </div>
              <div>
                <span className="section-title mb-0">
                  {educatorData.full_name}'s Class
                </span>
                <p className="profile-role mb-0">
                  {educatorData.specialization}
                </p>
              </div>
            </div>
            
            <div className="d-flex align-items-center gap-2">
              <button 
                className="btn-edit-profile d-flex align-items-center"
                onClick={() => navigate(pagePaths.student.login(educatorData.username))}
              >
                <ArrowRight size={16} className="me-2" />
                Student Login
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
            <div className="card">
              <div className="card-body">
                <div className="text-center mb-4">
                  <div className="avatar-circle">
                    <img src={educatorData.profile_picture} alt="Educator Profile" className="rounded-circle" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                  </div>
                  <h1 className="section-title mb-2">
                    Join
                  </h1>
                  <h2 className="profile-name text-accent mb-2">
                    {educatorData.full_name}'s Class
                  </h2>
                  <p className="profile-role mb-2">
                    {educatorData.bio}
                  </p>
                  <p className="profile-joined">
                    {educatorData.experiance} years experience • {educatorData.number_of_students} registered students
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Avatar */}
                  <div className="mb-4 text-center">
                    <label htmlFor="avatar-upload" className="d-block mb-2 form-label">
                      Profile Picture
                    </label>
                    <div className="avatar-upload-container mx-auto position-relative">
                      <img 
                        src={formData.avatarPreview || "https://placehold.co/120x120?text=Studnet"} 
                        alt="Avatar Preview" 
                        className="rounded-circle avatar-preview" 
                        style={{ width: '100px', height: '100px', objectFit: 'cover', border: '2px solid var(--color-border)' }}
                      />
                      <input
                        type="file"
                        id="avatar-upload"
                        name="avatar"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="d-none"
                      />
                      <label htmlFor="avatar-upload" className="avatar-upload-button">
                        <UserPlus size={20} />
                      </label>
                    </div>
                  </div>

                  {/* First Name */}
                  <div className="mb-3">
                    <label className="form-label">
                      First Name *
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        name="firstName"
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                      />
                      <User className="position-absolute top-50 translate-middle-y input-icon" size={20} />
                      {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="mb-3">
                    <label className="form-label">
                      Last Name *
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        name="lastName"
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter your last name"
                      />
                      <User className="position-absolute top-50 translate-middle-y input-icon" size={20} />
                      {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                    </div>
                  </div>

                  {/* Username (Student ID) */}
                  <div className="mb-3">
                    <label className="form-label">
                      Username (Student ID) *
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        name="username"
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Enter your student ID or desired username"
                      />
                      <BookOpen className="position-absolute top-50 translate-middle-y input-icon" size={20} />
                      {errors.username && <div className="invalid-feedback">{errors.username}</div>}
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
                      />
                      <Phone className="position-absolute top-50 translate-middle-y input-icon" size={20} />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
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
                      />
                      <Mail className="position-absolute top-50 translate-middle-y input-icon" size={20} />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                  </div>

                  {/* Parent Phone */}
                  <div className="mb-3">
                    <label className="form-label">
                      Parent Phone Number *
                    </label>
                    <div className="position-relative">
                      <input
                        type="tel"
                        name="parentPhone"
                        className={`form-control ${errors.parentPhone ? 'is-invalid' : ''}`}
                        value={formData.parentPhone}
                        onChange={handleInputChange}
                        placeholder="Enter parent's phone number"
                      />
                      <Phone className="position-absolute top-50 translate-middle-y input-icon" size={20} />
                      {errors.parentPhone && <div className="invalid-feedback">{errors.parentPhone}</div>}
                    </div>
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
                      />
                      <Lock className="position-absolute top-50 translate-middle-y input-icon-with-button" size={20} />
                      <button
                        type="button"
                        className="btn btn-sm position-absolute top-50 translate-middle-y eye-button"
                        onClick={() => setShowPassword(!showPassword)}
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
                      />
                      <Lock className="position-absolute top-50 translate-middle-y input-icon-with-button" size={20} />
                      <button
                        type="button"
                        className="btn btn-sm position-absolute top-50 translate-middle-y eye-button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                      {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                    </div>
                  </div>

                  <div className="form-check mb-4">
                    <input className="form-check-input" type="checkbox" id="terms" required />
                    <label className="form-check-label" htmlFor="terms">
                      I agree to the terms and conditions and privacy policy
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn-edit-profile w-100 mb-3 d-flex align-items-center justify-content-center"
                    disabled={registerLoading}
                  >
                    {registerLoading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : (
                      <UserPlus size={20} className="me-2" />
                    )}
                    {registerLoading ? 'Registering...' : `Register for ${educatorData.specialization} Class`}
                  </button>
                </form>

                <div className="text-center">
                  <p className="profile-joined">
                    Already have an account? 
                    <button 
                      className="btn-link-custom text-accent ms-1"
                      onClick={() => navigate(pagePaths.student.login(educatorData.username))}
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
                  Register for {educatorData.specialization}
                </h2>
                <p className="profile-name text-white mb-2">
                  with {educatorData.full_name}
                </p>
                <p className="text-white opacity-75">
                  {educatorData.bio}
                </p>
              </div>
              
              <div className="position-relative mx-auto mb-4 illustration-container">
                <div className="card h-100 d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <img src={educatorData.logo} alt="Educator Logo" className="img-fluid" style={{ maxHeight: '150px' }} />
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
                      {educatorData.number_of_students}
                    </div>
                    <div className="profile-joined">Current Students</div>
                  </div>
                  <div className="col-6">
                    <div className="section-title text-accent">
                      {educatorData.number_of_courses}
                    </div>
                    <div className="profile-joined">Available Courses</div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="profile-role text-white fw-bold">
                  {educatorData.full_name} - {educatorData.specialization}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSignupPage;
