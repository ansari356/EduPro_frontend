import React from "react";
import { useParams } from "react-router-dom";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Star, 
  Award, 
  Clock, 
  BookOpen,
  Users,
  Heart,
  Target,
  Shield
} from "lucide-react";

function StudentHome() {
  const { educatorUsername } = useParams();

  // Dummy educator data - replace with real API call
  const educatorData = {
    name: "Dr. Sarah Johnson",
    title: "Senior Data Scientist & Educator",
    avatar: "https://placehold.co/150x150?text=Dr.+Sarah",
    bio: "Passionate educator with over 8 years of experience in data science and analytics. I believe in making complex concepts simple and accessible to all students. My goal is to empower the next generation of data professionals through hands-on learning and real-world applications.",
    specialization: "Data Science, Machine Learning, Statistics",
    experience: "8+ years",
    rating: 4.8,
    totalStudents: 1247,
    totalCourses: 12,
    institution: "Stanford University",
    achievements: [
      "PhD in Computer Science",
      "Published 25+ Research Papers",
      "Google Developer Expert",
      "AWS Certified Solutions Architect"
    ],
    contact: {
      email: "sarah.johnson@eduplatform.com",
      phone: "+1 (555) 123-4567",
      office: "+1 (555) 765-4321",
      location: "San Francisco, CA",
      address: "123 Education Street, San Francisco, CA 94102",
      officeHours: "Mon-Fri: 2:00 PM - 4:00 PM"
    }
  };

  return (
    <div className="min-vh-100 profile-root p-4">
      <div className="container-fluid">
        {/* Welcome Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="text-center">
              <h1 className="main-title mb-2">Welcome to EduPlatform</h1>
              <p className="section-title">
                Your journey to knowledge starts here with {educatorData.name}
              </p>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Educator Profile Card */}
          <div className="col-lg-8">
            <div className="card shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <User size={24} className="me-2 text-primary" />
                  <h3 className="section-title mb-0">Meet Your Educator</h3>
                </div>

                <div className="row">
                  {/* Educator Info */}
                  <div className="col-md-4 text-center mb-4">
                    <img
                      src={educatorData.avatar}
                      alt={educatorData.name}
                      className="rounded-circle mb-3"
                      style={{ width: "120px", height: "120px", objectFit: "cover" }}
                    />
                    <h4 className="profile-main-title mb-1">{educatorData.name}</h4>
                    <p className="about-subtitle mb-3">{educatorData.title}</p>
                    
                    <div className="d-flex justify-content-center align-items-center mb-2">
                      <Star size={16} className="text-warning me-1" fill="currentColor" />
                      <span className="fw-bold me-2">{educatorData.rating}</span>
                      <small className="text-muted">({educatorData.totalStudents} students)</small>
                    </div>
                  </div>

                  {/* Educator Details */}
                  <div className="col-md-8">
                    <h5 className="section-title mb-3">About Your Instructor</h5>
                    <p className="profile-joined mb-3">{educatorData.bio}</p>

                    <div className="row mb-3">
                      <div className="col-sm-6 mb-3">
                        <div className="about-bubble p-3">
                          <div className="d-flex align-items-center mb-2">
                            <BookOpen size={16} className="me-2 text-primary" />
                            <strong>Specialization</strong>
                          </div>
                          <small>{educatorData.specialization}</small>
                        </div>
                      </div>
                      <div className="col-sm-6 mb-3">
                        <div className="about-bubble p-3">
                          <div className="d-flex align-items-center mb-2">
                            <Clock size={16} className="me-2 text-primary" />
                            <strong>Experience</strong>
                          </div>
                          <small>{educatorData.experience}</small>
                        </div>
                      </div>
                      <div className="col-sm-6 mb-3">
                        <div className="about-bubble p-3">
                          <div className="d-flex align-items-center mb-2">
                            <Users size={16} className="me-2 text-primary" />
                            <strong>Students Taught</strong>
                          </div>
                          <small>{educatorData.totalStudents}+</small>
                        </div>
                      </div>
                      <div className="col-sm-6 mb-3">
                        <div className="about-bubble p-3">
                          <div className="d-flex align-items-center mb-2">
                            <Award size={16} className="me-2 text-primary" />
                            <strong>Courses Created</strong>
                          </div>
                          <small>{educatorData.totalCourses}</small>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h6 className="about-subtitle mb-2">Achievements & Qualifications</h6>
                      <div className="row">
                        {educatorData.achievements.map((achievement, index) => (
                          <div key={index} className="col-sm-6 mb-2">
                            <div className="d-flex align-items-center">
                              <Award size={14} className="me-2 text-success" />
                              <small>{achievement}</small>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <Phone size={24} className="me-2 text-primary" />
                  <h3 className="section-title mb-0">Contact Information</h3>
                </div>

                <div className="space-y-3">
                  {/* Email */}
                  <div className="about-bubble p-3 mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <Mail size={16} className="me-2 text-primary" />
                      <strong className="about-subtitle">Email</strong>
                    </div>
                    <a 
                      href={`mailto:${educatorData.contact.email}`}
                      className="text-decoration-none small"
                    >
                      {educatorData.contact.email}
                    </a>
                  </div>

                  {/* Phone Numbers */}
                  <div className="about-bubble p-3 mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <Phone size={16} className="me-2 text-primary" />
                      <strong className="about-subtitle">Phone</strong>
                    </div>
                    <div className="mb-1">
                      <small className="text-muted">Primary:</small>
                      <a 
                        href={`tel:${educatorData.contact.phone}`}
                        className="text-decoration-none small ms-2"
                      >
                        {educatorData.contact.phone}
                      </a>
                    </div>
                    <div>
                      <small className="text-muted">Office:</small>
                      <a 
                        href={`tel:${educatorData.contact.office}`}
                        className="text-decoration-none small ms-2"
                      >
                        {educatorData.contact.office}
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="about-bubble p-3 mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <MapPin size={16} className="me-2 text-primary" />
                      <strong className="about-subtitle">Location</strong>
                    </div>
                    <div className="small">
                      <div className="mb-1">{educatorData.contact.location}</div>
                      <div className="text-muted">{educatorData.contact.address}</div>
                    </div>
                  </div>

                  {/* Office Hours */}
                  <div className="about-bubble p-3">
                    <div className="d-flex align-items-center mb-2">
                      <Clock size={16} className="me-2 text-primary" />
                      <strong className="about-subtitle">Office Hours</strong>
                    </div>
                    <small>{educatorData.contact.officeHours}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Us Section */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <h3 className="section-title mb-2">About EduPlatform</h3>
                  <p className="about-subtitle">Empowering minds, shaping futures</p>
                </div>

                <div className="row">
                  {/* Who We Are */}
                  <div className="col-md-4 mb-4">
                    <div className="text-center about-bubble p-4 h-100">
                      <Heart size={32} className="text-primary mb-3" />
                      <h4 className="about-subtitle mb-3">Who We Are</h4>
                      <p className="profile-joined">
                        We are a passionate team of educators and technology enthusiasts 
                        dedicated to revolutionizing online learning. Our platform connects 
                        students with expert instructors from around the world, creating 
                        meaningful learning experiences that transcend geographical boundaries.
                      </p>
                    </div>
                  </div>

                  {/* What We Do */}
                  <div className="col-md-4 mb-4">
                    <div className="text-center about-bubble p-4 h-100">
                      <Target size={32} className="text-primary mb-3" />
                      <h4 className="about-subtitle mb-3">What We Do</h4>
                      <p className="profile-joined">
                        EduPlatform provides a comprehensive learning management system 
                        that enables personalized education journeys. We offer interactive 
                        courses, real-time collaboration tools, progress tracking, and 
                        direct communication channels between students and educators.
                      </p>
                    </div>
                  </div>

                  {/* Our Mission */}
                  <div className="col-md-4 mb-4">
                    <div className="text-center about-bubble p-4 h-100">
                      <Shield size={32} className="text-primary mb-3" />
                      <h4 className="about-subtitle mb-3">Our Mission</h4>
                      <p className="profile-joined">
                        To democratize quality education by making it accessible, 
                        affordable, and engaging for learners everywhere. We believe 
                        that everyone deserves the opportunity to learn, grow, and 
                        achieve their full potential regardless of their background.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Platform Stats */}
                <div className="row mt-4 pt-4 border-top">
                  <div className="col-12 text-center mb-3">
                    <h5 className="about-subtitle">Platform Statistics</h5>
                  </div>
                  <div className="col-md-3 col-6 text-center mb-3">
                    <div className="fw-bold fs-3 text-primary">10,000+</div>
                    <small className="text-muted">Students</small>
                  </div>
                  <div className="col-md-3 col-6 text-center mb-3">
                    <div className="fw-bold fs-3 text-primary">500+</div>
                    <small className="text-muted">Expert Instructors</small>
                  </div>
                  <div className="col-md-3 col-6 text-center mb-3">
                    <div className="fw-bold fs-3 text-primary">2,000+</div>
                    <small className="text-muted">Courses Available</small>
                  </div>
                  <div className="col-md-3 col-6 text-center mb-3">
                    <div className="fw-bold fs-3 text-primary">95%</div>
                    <small className="text-muted">Student Satisfaction</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentHome;
