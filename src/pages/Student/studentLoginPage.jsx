import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const StudentLoginPage = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Teachers Database
  const teachersDatabase = {
    'ahmed-alansari': {
      id: 1,
      name: 'Ahmed Al-Ansari',
      fullName: 'Prof. Ahmed Al-Ansari',
      subject: 'Mathematics',
      students: 127,
      avatar: '🧮',
      color: 'blue',
      description: 'High School Mathematics Teacher',
      experience: '15 years experience'
    },
    'fatma-hassan': {
      id: 2,
      name: 'Fatma Hassan',
      fullName: 'Dr. Fatma Hassan',
      subject: 'Physics',
      students: 89,
      avatar: '⚛️',
      color: 'purple',
      description: 'PhD in Theoretical Physics',
      experience: '12 years experience'
    },
    'mahmoud-ibrahim': {
      id: 3,
      name: 'Mahmoud Ibrahim',
      fullName: 'Prof. Mahmoud Ibrahim',
      subject: 'Chemistry',
      students: 156,
      avatar: '🧪',
      color: 'green',
      description: 'Organic Chemistry Specialist',
      experience: '10 years experience'
    },
    'sara-ali': {
      id: 4,
      name: 'Sara Ali',
      fullName: 'Prof. Sara Ali',
      subject: 'English Literature',
      students: 203,
      avatar: '📚',
      color: 'amber',
      description: 'Master\'s in English Literature',
      experience: '8 years experience'
    },
    'omar-mohamed': {
      id: 5,
      name: 'Omar Mohamed',
      fullName: 'Dr. Omar Mohamed',
      subject: 'Biology',
      students: 145,
      avatar: '🧬',
      color: 'success',
      description: 'Marine Biology Specialist',
      experience: '13 years experience'
    }
  };

  // Extract teacher name from URL
  useEffect(() => {
    const getTeacherFromUrl = () => {
      const currentPath = window.location.pathname;
      const teacherSlug = currentPath.split('/')[1] || 'ahmed-alansari';
      return teacherSlug;
    };

    const teacherSlug = getTeacherFromUrl();
    const teacher = teachersDatabase[teacherSlug];
    
    if (teacher) {
      setTeacherInfo(teacher);
    } else {
      setTeacherInfo(null);
    }
    
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!teacherInfo) return;
    
    if (!studentId || !password) {
      alert('Please enter both student ID and password');
      return;
    }
    
    console.log('Student login attempt:', { 
      studentId, 
      password, 
      teacherSlug: teacherInfo.name,
      teacherId: teacherInfo.id 
    });
    
    alert(`Successfully logged in to ${teacherInfo.fullName}'s ${teacherInfo.subject} class!`);
  };

  const switchTeacher = (teacherSlug) => {
    const teacher = teachersDatabase[teacherSlug];
    if (teacher) {
      setTeacherInfo(teacher);
      window.history.pushState({}, '', `/${teacherSlug}/student-login`);
    }
  };

  if (loading) {
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

  if (!teacherInfo) {
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
            onClick={() => switchTeacher('ahmed-alansari')}
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
                <span>{teacherInfo.avatar}</span>
              </div>
              <div>
                <span className="section-title mb-0">
                  {teacherInfo.fullName}'s Class
                </span>
                <p className="profile-role mb-0">
                  {teacherInfo.subject}
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
                    <span>{teacherInfo.avatar}</span>
                  </div>
                  <h1 className="section-title mb-2">
                    Welcome to
                  </h1>
                  <h2 className="profile-name text-accent mb-2">
                    {teacherInfo.fullName}'s Class
                  </h2>
                  <p className="profile-role mb-2">
                    {teacherInfo.description}
                  </p>
                  <p className="profile-joined">
                    {teacherInfo.experience} • {teacherInfo.students} registered students
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label">
                      Student ID / Phone Number
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form-control"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="Enter student ID or phone number"
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

                  <div className="form-check mb-4">
                    <input className="form-check-input" type="checkbox" id="remember" />
                    <label className="form-check-label" htmlFor="remember">
                      Remember me
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn-edit-profile w-100 mb-3"
                  >
                    Login to {teacherInfo.subject} Class
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
                      onClick={() => {
                        const teacherSlug = window.location.pathname.split('/')[1] || 'ahmed-alansari';
                        navigate(`/${teacherSlug}/student-signup`);
                      }}
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
                  {teacherInfo.subject} Class
                </h2>
                <p className="profile-name text-white mb-2">
                  with {teacherInfo.fullName}
                </p>
                <p className="text-white opacity-75">
                  {teacherInfo.description}
                </p>
              </div>
              
              <div className="position-relative mx-auto mb-4 illustration-container">
                <div className="card h-100 d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <div className="display-1 mb-3">{teacherInfo.avatar}</div>
                    <div className="progress-bar-primary"></div>
                    <div className="progress-bar-light"></div>
                    <div className="progress-bar-accent"></div>
                  </div>
                </div>
                
                <div className="floating-element">
                  {teacherInfo.students}
                </div>
                <div className="floating-pulse"></div>
              </div>
              
              <div className="card p-4 mb-4">
                <div className="row text-center">
                  <div className="col-6">
                    <div className="section-title text-accent">
                      {teacherInfo.students}
                    </div>
                    <div className="profile-joined">Registered Students</div>
                  </div>
                  <div className="col-6">
                    <div className="section-title text-accent">
                      {teacherInfo.experience.split(' ')[0]}
                    </div>
                    <div className="profile-joined">Years Experience</div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="profile-role text-white fw-bold">
                  {teacherInfo.fullName} - {teacherInfo.subject}
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
