import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, Sun, Moon, ArrowRight } from 'lucide-react';
  import { useNavigate } from "react-router-dom";


const StudentLoginPage = () => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  // Extract teacher name from URL - this would work with React Router
  useEffect(() => {
    const getTeacherFromUrl = () => {
      // In a real React Router setup, you'd use useParams()
      // For demo purposes, we'll simulate different teachers
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
    
    // Simulate loading delay
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

  const getBootstrapColorClass = (color) => {
    const colors = {
      blue: 'primary',
      purple: 'secondary',
      green: 'success',
      amber: 'warning',
      success: 'success'
    };
    return colors[color] || 'primary';
  };

  // Custom styles for Bootstrap customization
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

  // Demo function to switch between teachers
  const switchTeacher = (teacherSlug) => {
    const teacher = teachersDatabase[teacherSlug];
    if (teacher) {
      setTeacherInfo(teacher);
      // In a real app, you'd navigate to the new URL
      window.history.pushState({}, '', `/${teacherSlug}/student-login`);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={customStyles.spinner} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading teacher's page...</p>
        </div>
      </div>
    );
  }

  if (!teacherInfo) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="display-1 mb-4">❌</div>
          <h1 className="h2 fw-bold text-dark mb-4">Teacher Not Found</h1>
          <p className="text-muted mb-4">
            Sorry, we couldn't find this teacher's page. 
            Please check the link or contact platform administration.
          </p>
          <button 
            className="btn btn-primary btn-lg"
            onClick={() => switchTeacher('ahmed-alansari')}
          >
            Back to Homepage
          </button>
        </div>
      </div>
    );
  }

  const bootstrapColor = getBootstrapColorClass(teacherInfo.color);

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
                  className={`bg-${bootstrapColor} text-white`}
                  style={customStyles.headerAvatar}
                >
                  <span>{teacherInfo.avatar}</span>
                </div>
                <div>
                  <span className={`h5 fw-bold mb-0 ${isDarkMode ? 'text-white' : 'text-dark'}`}>
                    {teacherInfo.fullName}'s Class
                  </span>
                  <p className={`small mb-0 ${isDarkMode ? 'text-light' : 'text-muted'}`}>
                    {teacherInfo.subject}
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
              {/* Teacher Login button removed */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row align-items-center min-vh-100">
          
          {/* Login Form */}
          <div className="col-lg-6 col-xl-5 mx-auto">
            <div 
              className="card shadow-lg border-0"
              style={isDarkMode ? customStyles.darkCard : {}}
            >
              <div className="card-body p-5">
                <div className="text-center mb-5">
                  <div 
                    className={`bg-${bootstrapColor} bg-opacity-10`}
                    style={customStyles.avatarCircle}
                  >
                    <span>{teacherInfo.avatar}</span>
                  </div>
                  <h1 className={`h4 fw-bold mb-2 ${isDarkMode ? 'text-white' : 'text-dark'}`}>
                    Welcome to
                  </h1>
                  <h2 className={`h5 fw-bold text-${bootstrapColor} mb-2`}>
                    {teacherInfo.fullName}'s Class
                  </h2>
                  <p className={`small mb-2 ${isDarkMode ? 'text-light' : 'text-muted'}`}>
                    {teacherInfo.description}
                  </p>
                  <p className={`small ${isDarkMode ? 'text-muted' : 'text-secondary'}`}>
                    {teacherInfo.experience} • {teacherInfo.students} registered students
                  </p>
                </div>

                <div>
                  <div className="mb-4">
                    <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>
                      Student ID / Phone Number
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className={`form-control form-control-lg ${isDarkMode ? 'bg-dark text-white border-secondary' : ''}`}
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="Enter student ID or phone number"
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                      />
                      <User className="position-absolute top-50 translate-middle-y text-muted" style={{right: '12px'}} size={20} />
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
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                      />
                      <Lock className="position-absolute top-50 translate-middle-y text-muted" style={{right: '48px'}} size={20} />
                      <button
                        type="button"
                        className="btn btn-sm position-absolute top-50 translate-middle-y"
                        style={{right: '12px'}}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-check mb-4">
                    <input className="form-check-input" type="checkbox" id="remember" />
                    <label className={`form-check-label ${isDarkMode ? 'text-light' : 'text-dark'}`} htmlFor="remember">
                      Remember me
                    </label>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className={`btn btn-${bootstrapColor} btn-lg w-100 mb-3`}
                  >
                    Login to {teacherInfo.subject} Class
                  </button>
                </div>

                <div className="text-center">
                  <p className={`small ${isDarkMode ? 'text-light' : 'text-muted'}`}>
                    Forgot password? 
                    <button 
                      className={`btn btn-link btn-sm text-${bootstrapColor} p-0 ms-1`}
                      onClick={() => alert('Password reset feature coming soon!')}
                    >
                      Click here
                    </button>
                  </p>
                  <p className={`small ${isDarkMode ? 'text-light' : 'text-muted'}`}>
                    Not registered yet?
                    <button 
                      className={`btn btn-link btn-sm text-${bootstrapColor} p-0 ms-1`}
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
            <div style={customStyles.illustrationCard}>
              <div className="text-center mb-4">
                <h2 className="h3 fw-bold text-dark mb-2">
                  {teacherInfo.subject} Class
                </h2>
                <p className="h5 text-dark mb-2">
                  with {teacherInfo.fullName}
                </p>
                <p className="text-muted">
                  {teacherInfo.description}
                </p>
              </div>
              
              <div className="position-relative mx-auto mb-4" style={{width: '300px', height: '200px'}}>
                <div className="card h-100 d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <div className="display-1 mb-3">{teacherInfo.avatar}</div>
                    <div className={`bg-${bootstrapColor} rounded-pill mb-2`} style={{width: '128px', height: '8px', margin: '0 auto'}}></div>
                    <div className={`bg-${bootstrapColor} rounded-pill mb-2 opacity-75`} style={{width: '96px', height: '8px', margin: '0 auto'}}></div>
                    <div className={`bg-${bootstrapColor} rounded-pill opacity-50`} style={{width: '64px', height: '8px', margin: '0 auto'}}></div>
                  </div>
                </div>
                
                <div 
                  className={`bg-${bootstrapColor} text-white`}
                  style={customStyles.floatingElement}
                >
                  {teacherInfo.students}
                </div>
                <div 
                  className="bg-warning position-absolute rounded-circle"
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
                    <div className={`h4 fw-bold text-${bootstrapColor}`}>
                      {teacherInfo.students}
                    </div>
                    <div className="small text-muted">Registered Students</div>
                  </div>
                  <div className="col-6">
                    <div className={`h4 fw-bold text-${bootstrapColor}`}>
                      {teacherInfo.experience.split(' ')[0]}
                    </div>
                    <div className="small text-muted">Years Experience</div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="small text-muted fw-bold">
                  {teacherInfo.fullName} - {teacherInfo.subject}
                </p>
                {/* Remove this block from the illustration card section */}
                {/* <p className="small text-muted">
                  BASTHALAK EDUCATIONAL PLATFORM © 2024
                </p> */}
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
        
        .dropdown-menu {
          min-width: 200px;
        }
        
        .dropdown-item {
          padding: 0.5rem 1rem;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }
        
        .dropdown-item:hover {
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
};

export default StudentLoginPage;