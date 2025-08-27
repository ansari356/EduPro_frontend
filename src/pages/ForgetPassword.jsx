import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, CheckCircle, XCircle, Key } from 'lucide-react';
import { pagePaths } from '../pagePaths';

const ForgetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState('request'); // 'request', 'verify-otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/password-reset/request/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: t('forgetPassword.resetEmailSent', { email })
        });
        setStep('verify-otp');
      } else {
        if (data.email) {
          setErrors({ email: data.email[0] });
        } else if (data.detail) {
          setMessage({ type: 'error', text: data.detail });
        } else {
          setMessage({ type: 'error', text: t('forgetPassword.requestFailed') });
        }
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      setMessage({ type: 'error', text: t('forgetPassword.networkError') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setMessage({ type: '', text: '' });

    if (!otp.trim()) {
      setErrors({ otp: t('forgetPassword.otpRequired') });
      setIsLoading(false);
      return;
    }

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: t('forgetPassword.passwordsMismatch') });
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setErrors({ newPassword: t('forgetPassword.passwordTooShort') });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/password-reset/confirm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
          new_password: newPassword,
        }),
      });

      const data = response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: t('forgetPassword.passwordResetSuccess')
        });
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        if (data.otp) {
          setErrors({ otp: data.otp[0] });
        } else if (data.email) {
          setErrors({ email: data.email[0] });
        } else if (data.password) {
          setErrors({ newPassword: data.password[0] });
        } else if (data.detail) {
          setMessage({ type: 'error', text: data.detail });
        } else {
          setMessage({ type: 'error', text: t('forgetPassword.resetFailed') });
        }
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setMessage({ type: 'error', text: t('forgetPassword.networkError') });
    } finally {
      setIsLoading(false);
    }
  };



  const goBack = () => {
    if (step === 'verify-otp') {
      setStep('request');
      setMessage({ type: '', text: '' });
    } else {
      navigate(-1);
    }
  };

  const renderRequestStep = () => (
    <div className="text-center">
      <div className="mb-4">
        <Mail size={64} className="text-main mb-3" />
        <h2 className="main-title mb-2">{t('forgetPassword.forgotPassword')}</h2>
        <p className="section-title text-muted">
          {t('forgetPassword.enterEmailToReset')}
        </p>
      </div>

      <form onSubmit={handleRequestReset} className="text-start">
        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-medium">
            {t('forgetPassword.emailAddress')}
          </label>
          <div className="position-relative">
            <Mail
              size={16}
              className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted"
            />
            <input
              type="email"
              id="email"
              className={`form-control ps-5 ${errors.email ? 'is-invalid' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('forgetPassword.enterEmail')}
              required
            />
          </div>

          {errors.email && (
            <div className="invalid-feedback d-block">{errors.email}</div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 py-2"
          disabled={isLoading || !email.trim()}
        >
          {isLoading ? (
            <>
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">{t('common.loading')}</span>
              </div>
              {t('forgetPassword.sending')}
            </>
          ) : (
            t('forgetPassword.sendResetLink')
          )}
        </button>
      </form>
    </div>
  );

  const renderVerifyOTPStep = () => (
    <div className="text-center">
      <div className="mb-4">
        <Key size={64} className="text-main mb-3" />
        <h2 className="main-title mb-2">{t('forgetPassword.resetYourPassword')}</h2>
        <p className="section-title text-muted">
          {t('forgetPassword.otpSentToEmail', { email })}
        </p>
        <p className="text-muted">
          {t('forgetPassword.enterOTPAndNewPassword')}
        </p>
      </div>

      <form onSubmit={handleVerifyOTP} className="text-start">
        <div className="mb-3">
          <label htmlFor="otp" className="form-label fw-medium">
            {t('forgetPassword.otpCode')}
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <Key size={16} />
            </span>
            <input
              type="text"
              id="otp"
              className={`form-control ${errors.otp ? 'is-invalid' : ''}`}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder={t('forgetPassword.enterOTPCode')}
              maxLength={6}
              required
            />
          </div>
          {errors.otp && (
            <div className="invalid-feedback d-block">{errors.otp}</div>
          )}
        </div>

        <div className="mb-3">
  <label htmlFor="newPassword" className="form-label fw-medium">
    {t('forgetPassword.newPassword')}
  </label>
  <div className="position-relative">
    {/* Lock icon inside input */}
    <Lock
      size={16}
      className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted"
    />
    <input
      type={showPassword ? 'text' : 'password'}
      id="newPassword"
      className={`form-control ps-5 pe-5 ${errors.newPassword ? 'is-invalid' : ''}`}
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      placeholder={t('forgetPassword.enterNewPassword')}
      required
    />
    {/* Toggle button inside input (right side) */}
    <button
      type="button"
      className="btn position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0 bg-transparent"
      onClick={() => setShowPassword(!showPassword)}
      tabIndex={-1}
    >
      {showPassword ? <EyeOff size={18} className="text-muted" /> : <Eye size={18} className="text-muted" />}
    </button>
  </div>
  {errors.newPassword && (
    <div className="invalid-feedback d-block">{errors.newPassword}</div>
  )}
</div>

<div className="mb-3">
  <label htmlFor="confirmPassword" className="form-label fw-medium">
    {t('forgetPassword.confirmPassword')}
  </label>
  <div className="position-relative">
    {/* Lock icon inside input */}
    <Lock
      size={16}
      className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted"
    />
    <input
      type={showConfirmPassword ? 'text' : 'password'}
      id="confirmPassword"
      className={`form-control ps-5 pe-5 ${errors.confirmPassword ? 'is-invalid' : ''}`}
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      placeholder={t('forgetPassword.confirmNewPassword')}
      required
    />
    {/* Toggle button inside input (right side) */}
    <button
      type="button"
      className="btn position-absolute top-50 end-0 translate-middle-y me-2 p-0 border-0 bg-transparent"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      tabIndex={-1}
    >
      {showConfirmPassword ? <EyeOff size={18} className="text-muted" /> : <Eye size={18} className="text-muted" />}
    </button>
  </div>
  {errors.confirmPassword && (
    <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
  )}
</div>

        <button
          type="submit"
          className="btn btn-primary w-100 py-2"
          disabled={isLoading || !otp.trim() || !newPassword || !confirmPassword}
        >
          {isLoading ? (
            <>
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">{t('common.loading')}</span>
              </div>
              {t('forgetPassword.resetting')}
            </>
          ) : (
            t('forgetPassword.resetPassword')
          )}
        </button>
      </form>
    </div>
  );



  return (
    <div className="profile-root bg-dark p-4">
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  {/* Back Button */}
                  <button
                    onClick={goBack}
                    className="btn btn-link text-decoration-none p-0 mb-3"
                  >
                    <ArrowLeft size={20} className="me-2" />
                    {t('common.back')}
                  </button>

                  {/* Message Display */}
                  {message.text && (
                    <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} mb-3`}>
                      <div className="d-flex align-items-center">
                        {message.type === 'success' ? (
                          <CheckCircle size={20} className="me-2" />
                        ) : (
                          <XCircle size={20} className="me-2" />
                        )}
                        {message.text}
                      </div>
                    </div>
                  )}

                  {/* Step Content */}
                  {step === 'request' && renderRequestStep()}
                  {step === 'verify-otp' && renderVerifyOTPStep()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
