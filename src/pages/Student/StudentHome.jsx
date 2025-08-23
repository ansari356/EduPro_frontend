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
import useEducatorPublicData from "../../apis/hooks/student/useEducatorPublicData";
import MainLoader from "../../components/common/MainLoader";

function StudentHome() {
  const { educatorUsername } = useParams();
  const { isLoading, error, data: educatorData } = useEducatorPublicData();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <MainLoader />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <h3 className="text-danger">Error Loading Educator Data</h3>
          <p className="text-muted">Unable to load educator information. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Show message if no educator data
  if (!educatorData) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <h3 className="text-muted">No Educator Found</h3>
          <p className="text-muted">The requested educator profile could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 profile-root p-4">
      <div className="container-fluid">
        {/* Welcome Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="text-center">
              <h1 className="main-title mb-2">Welcome to EduPlatform</h1>
              <p className="section-title">
                Your journey to knowledge starts here with {educatorData.full_name}
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
                  <User size={24} className="me-2 text-main" />
                  <h3 className="section-title mb-0">Meet Your Educator</h3>
                </div>

                <div className="row">
                  {/* Educator Info */}
                  <div className="col-md-4 text-center mb-4">
                    <div className="d-flex flex-column align-items-center">
                      <div style={{width: "250px", height: "320px"}} className="avatar-rectangle mb-3">
                        <img
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          src={educatorData.profile_picture || "https://placehold.co/150x180?text=Educator"}
                          alt={educatorData.full_name || educatorData.username}
                        />
                      </div>
                      <h4 className="profile-main-title mb-1">{educatorData.full_name || educatorData.username}</h4>
                      <p className="about-subtitle mb-3">{educatorData.specialization || "Educator"}</p>
                      
                      <div className="d-flex justify-content-center align-items-center mb-2">
                        <Star size={16} className="text-warning me-1" fill="currentColor" />
                        <span className="fw-bold me-2">{educatorData.rating || 0}</span>
                        <small className="text-muted">({educatorData.number_of_students || 0} students)</small>
                      </div>
                    </div>
                  </div>

                  {/* Educator Details */}
                  <div className="col-md-8">
                    <h5 className="section-title mb-3">About Your Instructor</h5>
                    <p className="profile-joined mb-3">{educatorData.bio || "No bio available."}</p>

                    <div className="row mb-3">
                      <div className="col-sm-6 mb-3">
                        <div className="about-bubble p-3">
                          <div className="d-flex align-items-center mb-2">
                            <BookOpen size={16} className="me-2 text-main" />
                            <strong>Specialization</strong>
                          </div>
                          <small className="text-muted">{educatorData.specialization || "Not specified"}</small>
                        </div>
                      </div>
                      <div className="col-sm-6 mb-3">
                        <div className="about-bubble p-3">
                          <div className="d-flex align-items-center mb-2">
                            <Clock size={16} className="me-2 text-main" />
                            <strong>Experience</strong>
                          </div>
                          <small className="text-muted">{educatorData.experiance || "Not specified"}+</small>
                        </div>
                      </div>
                      <div className="col-sm-6 mb-3">
                        <div className="about-bubble p-3">
                          <div className="d-flex align-items-center mb-2">
                            <Users size={16} className="me-2 text-main" />
                            <strong>Students Taught</strong>
                          </div>
                          <small className="text-muted">{educatorData.number_of_students || 0}+</small>
                        </div>
                      </div>
                      <div className="col-sm-6 mb-3">
                        <div className="about-bubble p-3">
                          <div className="d-flex align-items-center mb-2">
                            <Award size={16} className="me-2 text-main" />
                            <strong>Courses Created</strong>
                          </div>
                          <small className="text-muted">{educatorData.number_of_courses || 0}</small>
                        </div>
                      </div>
                    </div>

                    {educatorData.achievements && educatorData.achievements.length > 0 && (
                      <div>
                        <h6 className="about-subtitle mb-2">Achievements & Qualifications</h6>
                        <div className="row">
                          {educatorData.achievements.map((achievement, index) => (
                            <div key={index} className="col-sm-6 mb-2">
                              <div className="d-flex align-items-center">
                                <Award size={14} className="me-2 text-success" />
                                <small className="text-muted">{achievement}</small>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
                  <Phone size={24} className="me-2 text-main" />
                  <h3 className="section-title mb-0">Contact Information</h3>
                </div>

                <div className="space-y-3">
                  {/* Email */}
                  {educatorData.user?.email && (
                    <div className="about-bubble p-3 mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <Mail size={16} className="me-2 text-main" />
                        <strong className="about-subtitle">Email</strong>
                      </div>
                      <a 
                        href={`mailto:${educatorData.user.email}`}
                        className="text-decoration-none small text-muted"
                      >
                        {educatorData.user.email}
                      </a>
                    </div>
                  )}

                  {/* Phone Numbers */}
                  {educatorData.user?.phone && (
                    <div className="about-bubble p-3 mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <Phone size={16} className="me-2 text-main" />
                        <strong className="about-subtitle">Phone</strong>
                      </div>
                      <div className="mb-1">
                        <a 
                          href={`tel:${educatorData.user.phone}`}
                          className="text-decoration-none small text-muted"
                        >
                          {educatorData.user.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {(educatorData.city || educatorData.country) && (
                    <div className="about-bubble p-3 mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <MapPin size={16} className="me-2 text-main" />
                        <strong className="about-subtitle">Location</strong>
                      </div>
                      <div className="small">
                        <div className="mb-1 text-muted">{educatorData.city && educatorData.country ? `${educatorData.city}, ${educatorData.country}` : educatorData.city || educatorData.country}</div>
                        {educatorData.address && (
                          <div className="text-muted">{educatorData.address}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Show message if no contact info */}
                  {!educatorData.user?.email && !educatorData.user?.phone && !educatorData.city && !educatorData.country && (
                    <div className="text-center text-muted">
                      <p>Contact information not available</p>
                    </div>
                  )}
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
                      <Heart size={32} className="text-main mb-3" />
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
                      <Target size={32} className="text-main mb-3" />
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
                      <Shield size={32} className="text-main mb-3" />
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
                    <div className="fw-bold fs-3 text-main">10,000+</div>
                    <small className="text-muted">Students</small>
                  </div>
                  <div className="col-md-3 col-6 text-center mb-3">
                    <div className="fw-bold fs-3 text-main">500+</div>
                    <small className="text-muted">Expert Instructors</small>
                  </div>
                  <div className="col-md-3 col-6 text-center mb-3">
                    <div className="fw-bold fs-3 text-main">2,000+</div>
                    <small className="text-muted">Courses Available</small>
                  </div>
                  <div className="col-md-3 col-6 text-center mb-3">
                    <div className="fw-bold fs-3 text-main">95%</div>
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
