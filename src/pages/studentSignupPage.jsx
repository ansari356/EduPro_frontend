import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, Phone, Mail, BookOpen, ArrowRight, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Teachers Database (unchanged)
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
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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
    } else if (!/^01[0125][0-9]{8}$/.test(formData.parentPhone)) {
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

  const switchTeacher = (teacherSlug) => {
    const teacher = teachersDatabase[teacherSlug];
    if (teacher) {
      setTeacherInfo(teacher);
      window.history.pushState({}, '', `/${teacherSlug}/student-signup`);
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
            
            <div className="d-flex align-items-center gap-2">
              <button 
                className="btn-edit-profile d-flex align-items-center"
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
            <div className="card">
              <div className="card-body">
                <div className="text-center mb-4">
                  <div className="avatar-circle">
                    <span>{teacherInfo.avatar}</span>
                  </div>
                  <h1 className="section-title mb-2">
                    Join
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
                      />
                      <User className="position-absolute top-50 translate-middle-y input-icon" size={20} />
                      {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                    </div>
                  </div>

                  {/* Student ID */}
                  <div className="mb-3">
                    <label className="form-label">
                      Student ID *
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        name="studentId"
                        className={`form-control ${errors.studentId ? 'is-invalid' : ''}`}
                        value={formData.studentId}
                        onChange={handleInputChange}
                        placeholder="Enter your student ID"
                      />
                      <BookOpen className="position-absolute top-50 translate-middle-y input-icon" size={20} />
                      {errors.studentId && <div className="invalid-feedback">{errors.studentId}</div>}
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

                  {/* Grade */}
                  <div className="mb-3">
                    <label className="form-label">
                      Grade *
                    </label>
                    <select
                      name="grade"
                      className={`form-control ${errors.grade ? 'is-invalid' : ''}`}
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
                  >
                    <UserPlus size={20} className="me-2" />
                    Register for {teacherInfo.subject} Class
                  </button>
                </form>

                <div className="text-center">
                  <p className="profile-joined">
                    Already have an account? 
                    <button 
                      className="btn-link-custom text-accent ms-1"
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
            <div className="illustration-card">
              <div className="text-center mb-4">
                <h2 className="section-title text-white mb-2">
                  Register for {teacherInfo.subject}
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
                  <UserPlus size={24} />
                </div>
                <div className="floating-pulse"></div>
              </div>
              
              <div className="card p-4 mb-4">
                <div className="row text-center">
                  <div className="col-6">
                    <div className="section-title text-accent">
                      {teacherInfo.students}
                    </div>
                    <div className="profile-joined">Current Students</div>
                  </div>
                  <div className="col-6">
                    <div className="section-title text-accent">
                      {teacherInfo.grades.length}
                    </div>
                    <div className="profile-joined">Available Grades</div>
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

export default StudentSignupPage;
