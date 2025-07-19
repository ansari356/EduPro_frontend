import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, Phone, Mail, BookOpen, Sun, Moon, ArrowRight, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Add this import

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
    experience: '15 years experience',
    grades: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']
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
    experience: '12 years experience',
    grades: ['Grade 10', 'Grade 11', 'Grade 12']
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
    experience: '10 years experience',
    grades: ['Grade 10', 'Grade 11', 'Grade 12']
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
    experience: '8 years experience',
    grades: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']
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
    experience: '13 years experience',
    grades: ['Grade 10', 'Grade 11', 'Grade 12']
  }
};

const StudentSignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    grade: '',
    parentPhone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Add this line

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
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
    
    if (!formData.grade) {
      newErrors.grade = 'Please select your grade';
    }
    
    if (!formData.parentPhone.trim()) {
      newErrors.parentPhone = 'Parent phone number is required';
    } else if (!/^01[0125][0-9]{8}$/.test(formData.phone)) {
      newErrors.parentPhone = 'Please enter a valid parent phone number';
    }
    
    return newErrors;
  };

const handleSubmit = (e) => {
    e.preventDefault();
    if (!teacherInfo) return;
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    console.log('Student registration:', {
      ...formData,
      teacherSlug: teacherInfo.name,
      teacherId: teacherInfo.id,
      subject: teacherInfo.subject
    });
    
    alert(`Registration successful! Welcome to ${teacherInfo.fullName}'s ${teacherInfo.subject} class!`);
    
    // Reset form
    setFormData({
      fullName: '',
      studentId: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      grade: '',
      parentPhone: ''
    });
    setErrors({});
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

  const switchTeacher = (teacherSlug) => {
    const teacher = teachersDatabase[teacherSlug];
    if (teacher) {
      setTeacherInfo(teacher);
      window.history.pushState({}, '', `/${teacherSlug}/student-signup`);
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
              
              <button 
                className={`btn btn-sm ${isDarkMode ? 'btn-outline-light' : 'btn-outline-secondary'}`}
                onClick={() => navigate(`/${Object.keys(teachersDatabase).find(slug => teachersDatabase[slug].id === teacherInfo.id)}/student-login`)}
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
            <div 
              className="card shadow-lg border-0"
              style={isDarkMode ? customStyles.darkCard : {}}
            >
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div 
                    className={`bg-${bootstrapColor} bg-opacity-10`}
                    style={customStyles.avatarCircle}
                  >
                    <span>{teacherInfo.avatar}</span>
                  </div>
                  <h1 className={`h4 fw-bold mb-2 ${isDarkMode ? 'text-white' : 'text-dark'}`}>
                    Join
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
                      />
                      <User className="position-absolute top-50 translate-middle-y text-muted" style={{right: '12px'}} size={20} />
                      {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                    </div>
                  </div>

                  {/* Student ID */}
                  <div className="mb-3">
                    <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>
                      Student ID *
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        name="studentId"
                        className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''} ${errors.studentId ? 'is-invalid' : ''}`}
                        value={formData.studentId}
                        onChange={handleInputChange}
                        placeholder="Enter your student ID"
                      />
                      <BookOpen className="position-absolute top-50 translate-middle-y text-muted" style={{right: '12px'}} size={20} />
                      {errors.studentId && <div className="invalid-feedback">{errors.studentId}</div>}
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
                      />
                      <Phone className="position-absolute top-50 translate-middle-y text-muted" style={{right: '12px'}} size={20} />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
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
                      />
                      <Mail className="position-absolute top-50 translate-middle-y text-muted" style={{right: '12px'}} size={20} />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                  </div>

                  {/* Grade */}
                  <div className="mb-3">
                    <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>
                      Grade *
                    </label>
                    <select
                      name="grade"
                      className={`form-select ${isDarkMode ? 'bg-dark text-white border-secondary' : ''} ${errors.grade ? 'is-invalid' : ''}`}
                      value={formData.grade}
                      onChange={handleInputChange}
                    >
                      <option value="">Select your grade</option>
                      {teacherInfo.grades.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                    {errors.grade && <div className="invalid-feedback">{errors.grade}</div>}
                  </div>

                  {/* Parent Phone */}
                  <div className="mb-3">
                    <label className={`form-label ${isDarkMode ? 'text-light' : 'text-dark'}`}>
                      Parent Phone Number *
                    </label>
                    <div className="position-relative">
                      <input
                        type="tel"
                        name="parentPhone"
                        className={`form-control ${isDarkMode ? 'bg-dark text-white border-secondary' : ''} ${errors.parentPhone ? 'is-invalid' : ''}`}
                        value={formData.parentPhone}
                        onChange={handleInputChange}
                        placeholder="Enter parent's phone number"
                      />
                      <Phone className="position-absolute top-50 translate-middle-y text-muted" style={{right: '12px'}} size={20} />
                      {errors.parentPhone && <div className="invalid-feedback">{errors.parentPhone}</div>}
                    </div>
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
                      />
                      <Lock className="position-absolute top-50 translate-middle-y text-muted" style={{right: '48px'}} size={20} />
                      <button
                        type="button"
                        className="btn btn-sm position-absolute top-50 translate-middle-y"
                        style={{right: '12px'}}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                      {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                    </div>
                  </div>

                  <div className="form-check mb-4">
                    <input className="form-check-input" type="checkbox" id="terms" required />
                    <label className={`form-check-label ${isDarkMode ? 'text-light' : 'text-dark'}`} htmlFor="terms">
                      I agree to the terms and conditions and privacy policy
                    </label>
                  </div>

                  <button
                    type="submit"
                    className={`btn btn-${bootstrapColor} btn-lg w-100 mb-3`}
                  >
                    <UserPlus size={20} className="me-2" />
                    Register for {teacherInfo.subject} Class
                  </button>
                  </form>
                </div>

                <div className="text-center">
                  <p className={`small ${isDarkMode ? 'text-light' : 'text-muted'}`}>
                    Already have an account? 
                    <button 
                      className={`btn btn-link btn-sm text-${bootstrapColor} p-0 ms-1`}
                      onClick={() => navigate(`/${Object.keys(teachersDatabase).find(slug => teachersDatabase[slug].id === teacherInfo.id)}/student-login`)}
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
                  Register for {teacherInfo.subject}
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
                    <div className={`h4 fw-bold text-${bootstrapColor}`}>
                      {teacherInfo.students}
                    </div>
                    <div className="small text-muted">Current Students</div>
                  </div>
                  <div className="col-6">
                    <div className={`h4 fw-bold text-${bootstrapColor}`}>
                      {teacherInfo.grades.length}
                    </div>
                    <div className="small text-muted">Available Grades</div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="small text-muted fw-bold">
                  {teacherInfo.fullName} - {teacherInfo.subject}
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
};

export default StudentSignupPage;