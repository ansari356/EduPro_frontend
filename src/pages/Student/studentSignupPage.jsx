import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, Phone, Mail, BookOpen, ArrowRight, UserPlus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useEducatorPublicData from '../../apis/hooks/student/useEducatorPublicData';
import { pagePaths } from '../../pagePaths';
import registerStudent from '../../apis/actions/student/registerStudent';

const StudentSignupPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    parentPhone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [registerLoading, setRegisterLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { educatorUsername } = useParams();
  const { data: educatorData, error, isLoading } = useEducatorPublicData(educatorUsername);

  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('student.firstNameRequired');
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = t('student.firstNameMinLength');
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName.trim())) {
      newErrors.firstName = t('student.firstNameLettersOnly');
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('student.lastNameRequired');
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = t('student.lastNameMinLength');
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName.trim())) {
      newErrors.lastName = t('student.lastNameLettersOnly');
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = t('student.usernameRequired');
    } else if (formData.username.trim().length < 3) {
      newErrors.username = t('student.usernameMinLength');
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username.trim())) {
      newErrors.username = t('student.usernameFormat');
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = t('student.phoneRequired');
    } else if (!/^01[0125][0-9]{8}$/.test(formData.phone.trim())) {
      newErrors.phone = t('student.phoneInvalid');
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t('student.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = t('student.emailInvalid');
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t('student.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('student.passwordMinLength');
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = t('student.passwordLowercase');
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = t('student.passwordUppercase');
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = t('student.passwordNumber');
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('student.confirmPasswordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('profile.passwordsMismatch');
    }

    // Parent Phone validation
    if (!formData.parentPhone.trim()) {
      newErrors.parentPhone = t('student.parentPhoneRequired');
    } else if (!/^01[0125][0-9]{8}$/.test(formData.parentPhone.trim())) {
      newErrors.parentPhone = t('student.parentPhoneInvalid');
    }

    return newErrors;
  };

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

    // Check password strength in real-time
    if (name === 'password') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const checkPasswordStrength = (password) => {
    if (!password) return '';

    let score = 0;
    if (password.length >= 8) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[!@#$%^&*])/.test(password)) score++;

    if (score <= 2) return 'weak';
    if (score <= 3) return 'medium';
    return 'strong';
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!educatorData) return;

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
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
      password2: formData.confirmPassword
    };

    setRegisterLoading(true);
    try {
      const response = await registerStudent(registrationData, educatorUsername);
      console.log('Student registration successful:', response.data);

      // Show success message
      setSuccessMessage(t('student.registrationSuccessful', { name: educatorData.full_name, specialization: educatorData.specialization }));
      setShowSuccess(true);

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        username: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        parentPhone: ''
      });
      setErrors({});

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate(pagePaths.student.login(educatorUsername));
      }, 3000);

    } catch (err) {
      console.error('Student registration failed:', err);

      // Handle different types of errors
      if (err.response?.status === 400) {
        // Handle validation errors from API
        const apiErrors = err.response.data;
        const newErrors = {};

        // Map API error fields to form fields
        if (apiErrors.username) {
          newErrors.username = Array.isArray(apiErrors.username) ? apiErrors.username[0] : apiErrors.username;
        }
        if (apiErrors.email) {
          newErrors.email = Array.isArray(apiErrors.email) ? apiErrors.email[0] : apiErrors.email;
        }
        if (apiErrors.phone) {
          newErrors.phone = Array.isArray(apiErrors.phone) ? apiErrors.phone[0] : apiErrors.phone;
        }
        if (apiErrors.password1) {
          newErrors.password = Array.isArray(apiErrors.password1) ? apiErrors.password1[0] : apiErrors.password1;
        }
        if (apiErrors.non_field_errors) {
          newErrors.general = Array.isArray(apiErrors.non_field_errors) ? apiErrors.non_field_errors[0] : apiErrors.non_field_errors;
        }

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
        } else {
          setErrors({ general: err.response?.data?.detail || err.message || t('student.registrationFailed') });
        }
      } else if (err.response?.status === 500) {
        setErrors({ general: t('student.serverError') });
      } else if (err.message === 'Network Error') {
        setErrors({ general: t('student.connectionError') });
      } else {
        setErrors({ general: err.response?.data?.detail || err.message || t('student.registrationFailed') });
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="profile-root min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="loading-spinner mb-3" role="status">
            <span className="visually-hidden">{t('common.loading')}</span>
          </div>
          <p className="profile-joined">{t('student.loadingTeachersPage')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-root min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <p className="profile-joined text-danger">{t('student.errorLoadingTeacherData', { error: error.message })}</p>
        </div>
      </div>
    );
  }

  if (!educatorData) {
    return (
      <div className="profile-root min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="display-1 mb-4">❌</div>
          <h1 className="main-title mb-4">{t('student.teacherNotFound')}</h1>
          <p className="profile-joined mb-4">
            {t('student.teacherNotFoundMessage')}
          </p>
          <button
            className="btn-edit-profile"
            onClick={() => navigate('/')} // Navigate to a default homepage or error page
          >
            {t('student.backToHomepage')}
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
                <img src={educatorData.profile_picture || 'https://placehold.co/50x50?text=Profile'} alt={t('student.educatorProfile')} style={{ borderRadius: '10px', width: '50px', height: '50px', objectFit: 'cover' }} />
              </div>
              <div>
                <span className="section-title mb-0">
                  {educatorData.full_name}'s {t('student.class')}
                </span>
                <p className="profile-role mb-0">
                  {educatorData.specialization}
                </p>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                className="btn-edit-profile d-flex align-items-center"
                onClick={() => navigate(pagePaths.student.login(educatorUsername))}
              >
                <ArrowRight size={16} className="me-2" />
                {t('student.studentLogin')}
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
                  <div className="avatar-rectangle">
                    <img src={educatorData.profile_picture || 'https://placehold.co/400x300?text=Profile'} alt={t('student.educatorProfile')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h1 className="section-title mb-2">
                    {t('student.join')}
                  </h1>
                  <h2 className="profile-name text-accent mb-2">
                    {educatorData.full_name}'s {t('student.class')}
                  </h2>
                  <p className="profile-joined">
                    {educatorData.experiance || 0} {t('student.yearsExperience')} • {educatorData.number_of_students || 0} {t('student.registeredStudents')}
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Success Message Display */}
                  {showSuccess && (
                    <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
                      <i className="fas fa-check-circle me-2"></i>
                      {successMessage}
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowSuccess(false)}
                      ></button>
                    </div>
                  )}

                  {/* General Error Display */}
                  {errors.general && (
                    <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {errors.general}
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setErrors(prev => ({ ...prev, general: '' }))}
                      ></button>
                    </div>
                  )}
                  {/* First Name */}
                  <div className="mb-3">
                    <label className="form-label">
                      {t('profile.firstName')} *
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        name="firstName"
                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder={t('student.enterFirstName')}
                      />
                      <User className="position-absolute top-50 translate-middle-y input-icon" size={20} />
                      {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="mb-3">
                    <label className="form-label">
                      {t('profile.lastName')} *
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        name="lastName"
                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder={t('student.enterLastName')}
                      />
                      <User className="position-absolute top-50 translate-middle-y input-icon" size={20} />
                      {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                    </div>
                  </div>

                  {/* Username (Student ID) */}
                  <div className="mb-3">
                    <label className="form-label">
                      {t('profile.username')} ({t('student.studentId')}) *
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        name="username"
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder={t('student.enterStudentId')}
                      />
                      <BookOpen className="position-absolute top-50 translate-middle-y input-icon" size={20} />
                      {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="mb-3">
                    <label className="form-label">
                      {t('profile.phone')} *
                    </label>
                    <div className="position-relative">
                      <input
                        type="tel"
                        name="phone"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={t('student.enterPhoneNumber')}
                      />
                      <Phone className="position-absolute top-50 translate-middle-y input-icon" size={20} />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">
                      {t('profile.email')} *
                    </label>
                    <div className="position-relative">
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t('student.enterEmailAddress')}
                      />
                      <Mail className="position-absolute top-50 translate-middle-y input-icon" size={20} />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                  </div>

                  {/* Parent Phone */}
                  <div className="mb-3">
                    <label className="form-label">
                      {t('student.parentPhone')} *
                    </label>
                    <div className="position-relative">
                      <input
                        type="tel"
                        name="parentPhone"
                        className={`form-control ${errors.parentPhone ? 'is-invalid' : ''}`}
                        value={formData.parentPhone}
                        onChange={handleInputChange}
                        placeholder={t('student.enterParentPhone')}
                      />
                      <Phone className="position-absolute top-50 translate-middle-y input-icon" size={20} />
                      {errors.parentPhone && <div className="invalid-feedback">{errors.parentPhone}</div>}
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label">
                      {t('auth.password')} *
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
                      {passwordStrength && (
                        <div className={`password-strength ${passwordStrength} mt-2`}>
                          <small>
                            {t('student.passwordStrength')} <strong className="text-capitalize">{passwordStrength}</strong>
                            {passwordStrength === 'weak' && t('student.passwordStrengthWeak')}
                            {passwordStrength === 'medium' && t('student.passwordStrengthMedium')}
                            {passwordStrength === 'strong' && t('student.passwordStrengthStrong')}
                          </small>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label className="form-label">
                      {t('auth.confirmPassword')} *
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
                      {t('student.agreeTerms')}
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
                    {registerLoading ? t('student.registering') : t('student.registerForClass', { specialization: educatorData.specialization })}
                  </button>
                </form>

                <div className="text-center">
                  <p className="profile-joined">
                    {t('student.alreadyHaveAccount')}
                    <button
                      className="btn-link-custom text-accent ms-1"
                      onClick={() => navigate(pagePaths.student.login(educatorUsername))}
                    >
                      {t('student.loginHere')}
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
                  {t('student.registerFor')} {educatorData.specialization}
                </h2>
                <p className="profile-name text-white mb-2">
                  {t('common.with')} {educatorData.full_name}
                </p>
                <p className="text-white opacity-75">
                  {educatorData.bio}
                </p>
              </div>

              <div className="position-relative mb-4 illustration-container">
                <div className="card h-100 d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <img
                      src={educatorData.logo || 'https://placehold.co/200x100?text=Logo'}
                      alt={t('student.educatorLogo')}
                      className="img-fluid"
                      style={{ maxHeight: '150px' }}
                    />
                    <div className="progress-bar-primary"></div>
                    <div className="progress-bar-light"></div>
                    <div className="progress-bar-accent"></div>
                  </div>
                </div>

                {/* Floating Elements */}
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
                    <div className="profile-joined">{t('student.currentStudents')}</div>
                  </div>
                  <div className="col-6">
                    <div className="section-title text-accent">
                      {educatorData.number_of_courses}
                    </div>
                    <div className="profile-joined">{t('student.availableCourses')}</div>
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
