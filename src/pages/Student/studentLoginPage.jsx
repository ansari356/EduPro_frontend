import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useNavigate, useParams } from "react-router-dom";
import useEducatorPublicData from '../../apis/hooks/student/useEducatorPublicData';
import loginStudent from '../../apis/actions/student/loginStudent';
import { pagePaths } from '../../pagePaths';
import useStudentRefreshToken from '../../apis/hooks/student/useStudentRefreshToken';
import { useTranslation } from 'react-i18next';


const StudentLoginPage = () => {
  const [username, setUsername] = useState(''); // Changed from studentId to username
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { educatorUsername } = useParams();
  const { data: educatorData, error, isLoading } = useEducatorPublicData(educatorUsername);
  const { mutate } = useStudentRefreshToken()
  const { t } = useTranslation();

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = t('auth.usernameOrEmailRequired');
    } else if (username.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
      newErrors.username = t('profile.invalidEmail');
    }

    if (!password) {
      newErrors.password = t('profile.passwordRequired');
    } else if (password.length < 1) {
      newErrors.password = t('profile.passwordRequired');
    }

    return newErrors;
  };

  const handleInputChange = (field, value) => {
    if (field === 'username') {
      setUsername(value);
    } else if (field === 'password') {
      setPassword(value);
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Clear general error when user starts typing
    if (generalError) {
      setGeneralError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!educatorData) return;

    // Clear previous errors
    setErrors({});
    setGeneralError('');

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoginLoading(true);
    try {
      const response = await loginStudent({ email: username, password }, educatorData?.user.username)
      mutate();
      console.log('Student login successful:', response.data);

      // Show success message
      setSuccessMessage(t('auth.loginSuccess') + ` ${educatorData.full_name}'s ${educatorData.specialization} class!`);
      setShowSuccess(true);

      // Redirect to student dashboard or appropriate page after 2 seconds
      setTimeout(() => {
        // navigate(pagePaths.student.dashboard(educatorData.username)); // Assuming a student dashboard path
      }, 2000);

    } catch (err) {
      console.error('Student login failed:', err);

      // Handle different types of errors
      if (err.response?.status === 401) {
        setGeneralError(t('auth.invalidCredentials'));
      } else if (err.response?.status === 400) {
        setGeneralError(t('auth.checkInput'));
      } else if (err.response?.status === 500) {
        setGeneralError(t('student.serverError'));
      } else if (err.message === 'Network Error') {
        setGeneralError(t('student.connectionError'));
      } else {
        setGeneralError(err.response?.data?.detail || err.message || t('student.loginFailed'));
      }
    } finally {
      setLoginLoading(false);
    }
  };



  return (
    <div className="profile-root">
      {/* Header */}
      <div className="card border-0 shadow-sm">
        <div className="container py-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="header-avatar">
                <img src={educatorData.profile_picture} alt={t('student.educatorProfile')} className="rounded-circle" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row align-items-center min-vh-100">

          {/* Login Form */}
          <div className="col-lg-6 col-xl-5 mx-auto">
            <div className="card">
              <div className="card-body">
                <div className="text-center mb-5">
                  <div className="avatar-rectangle">
                    <img src={educatorData.profile_picture} alt={t('student.educatorProfile')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h1 className="section-title mb-2">
                    {t('student.welcomeTo')}
                  </h1>
                  <h2 className="profile-name text-accent mb-2">
                    {educatorData.full_name}'s {t('student.class')}
                  </h2>
                  <p className="profile-joined">
                    {educatorData.experiance} {t('student.yearsExperience')} • {educatorData.number_of_students} {t('student.registeredStudents')}
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
                  {generalError && (
                    <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {generalError}
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setGeneralError('')}
                      ></button>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="form-label">
                      {t('profile.username')} / {t('auth.email')}
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                        value={username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        placeholder={t('auth.enterUsernameOrEmail')}
                      />
                      <User className="position-absolute top-50 translate-middle-y input-icon" size={20} />
                      {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">
                      {t('auth.password')}
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        value={password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
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

                  <button
                    type="submit"
                    className="btn-edit-profile w-100 mt-5 mb-3"
                    disabled={loginLoading}
                  >
                    {loginLoading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : (
                      <span>{t('auth.loginToClass', { specialization: educatorData.specialization }) || `تسجيل الدخول إلى ${educatorData.specialization} فصل`}</span>
                    )}
                  </button>
                </form>

                <div className="text-center">
                  <p className="profile-joined">
                    {t('auth.forgotPassword') || 'نسيت كلمة المرور؟'}?
                    <button
                      className="btn-link-custom text-accent ms-1"
                      onClick={() => navigate("/forget-password")}
                    >
                      {t('common.clickHere') || 'انقر هنا'}
                    </button>
                  </p>
                  <p className="profile-joined">
                    {t('auth.notRegisteredYet') || 'غير مسجل بعد'}?
                    <button
                      className="btn-link-custom text-accent ms-1"
                      onClick={() => navigate(pagePaths.student.signup(educatorUsername))}
                    >
                      {t('auth.createAccount') || 'إنشاء حساب'}
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
                  {educatorData.specialization} {t('student.class')}
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
                      src={educatorData.logo}
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
                  {educatorData.number_of_students}
                </div>
                <div className="floating-pulse"></div>
              </div>


              <div className="card p-4 mb-4">
                <div className="row text-center">
                  <div className="col-6">
                    <div className="section-title text-accent">
                      {educatorData.number_of_students}
                    </div>
                    <div className="profile-joined">{t('student.registeredStudents')}</div>
                  </div>
                  <div className="col-6">
                    <div className="section-title text-accent">
                      {educatorData.experiance}
                    </div>
                    <div className="profile-joined">{t('student.yearsExperience')}</div>
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

export default StudentLoginPage;
