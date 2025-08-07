import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import useEducatorPublicData from '../../apis/hooks/student/useEducatorPublicData';
import loginStudent from '../../apis/actions/student/loginStudent';
import { pagePaths } from '../../pagePaths';
import useRefreshToken from '../../apis/hooks/useRefreshToken';


const StudentLoginPage = () => {
  const [username, setUsername] = useState(''); // Changed from studentId to username
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const navigate = useNavigate();
  const { data: educatorData, error, isLoading } = useEducatorPublicData();
  const {mutate}=useRefreshToken()
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!educatorData) return;
    
    if (!username || !password) {
      alert('Please enter both username/email and password');
      return;
    }
    
    setLoginLoading(true);
    try {
      const response = await loginStudent({ email: username, password }, educatorData?.user.username)
      mutate();
      console.log('Student login successful:', response.data);
      alert(`Successfully logged in to ${educatorData.full_name}'s ${educatorData.specialization} class!`);
      // Redirect to student dashboard or appropriate page
      // navigate(pagePaths.student.dashboard(educatorData.username)); // Assuming a student dashboard path
    } catch (err) {
      console.error('Student login failed:', err);
      alert(`Login failed: ${err.response?.data?.detail || err.message}`);
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
                  <div className="avatar-circle">
                    <img src={educatorData.profile_picture} alt="Educator Profile" className="rounded-circle" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                  </div>
                  <h1 className="section-title mb-2">
                    Welcome to
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
                  <div className="mb-4">
                    <label className="form-label">
                      Username / Email
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username or email"
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
                      />
                      <Lock className="position-absolute top-50 translate-middle-y input-icon-with-button" size={20} />
                      <button
                        type="button"
                        className="btn btn-sm position-absolute top-50 translate-middle-y eye-button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
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
                      'Login to ' + educatorData.specialization + ' Class'
                    )}
                  </button>
                </form>

                <div className="text-center">
                  <p className="profile-joined">
                    Forgot password? 
                    <button 
                      className="btn-link-custom text-accent ms-1"
                      onClick={() => alert('Password reset feature coming soon!')}
                    >
                      Click here
                    </button>
                  </p>
                  <p className="profile-joined">
                    Not registered yet?
                    <button 
                      className="btn-link-custom text-accent ms-1"
                      onClick={() => navigate(pagePaths.student.signup(educatorData.username))}
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
                  {educatorData.specialization} Class
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
                    <div className="profile-joined">Registered Students</div>
                  </div>
                  <div className="col-6">
                    <div className="section-title text-accent">
                      {educatorData.experiance}
                    </div>
                    <div className="profile-joined">Years Experience</div>
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
