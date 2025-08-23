import React, { useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { Search, Filter, BookOpen, Play, Lock, Star, Clock, Users, ArrowRight, User, BarChart3, CheckCircle, Plus } from "lucide-react";

import { pagePaths } from "../../pagePaths";
import useListAllEducatorCourses from "../../apis/hooks/student/useListAllEducatorCourses";
import useListEnrolledCourses from "../../apis/hooks/student/useListEnrolledCourses";
import useEducatorPublicData from "../../apis/hooks/student/useEducatorPublicData";
import useGetCourseDetails from "../../apis/hooks/student/useGetCourseDetails";
import useGetCourseModules from "../../apis/hooks/student/useGetCourseModules";
import enrollStudentInCourse from "../../apis/actions/student/enrollStudentInCourse";



/**
 * Courses Component - Shows all courses created by the educator
 */
function Courses() {
  const { educatorUsername } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all" or "enrolled"
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrollmentType, setEnrollmentType] = useState("full"); // "full" or "chapter"
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [isCouponValid, setIsCouponValid] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const { data: allCourses, isLoading: allCoursesLoading } = useListAllEducatorCourses();
  const { enrolledInCourses, isLoading: enrolledLoading } = useListEnrolledCourses();
  const { data: educatorData } = useEducatorPublicData();
  const { data: detailedCourseData, isLoading: detailedCourseLoading, error: detailedCourseError } = useGetCourseDetails(selectedCourseId);
  const { data: courseModules, isLoading: modulesLoading, error: modulesError } = useGetCourseModules(selectedCourseId);

  const processedAllCourses = allCourses ? 
    (Array.isArray(allCourses) ? allCourses : allCourses.results || allCourses.data || [])
      .map(course => ({
        ...course,
        id: course.id,
        title: course.title || course.name || "Untitled Course",
        description: course.description || "No description available",
        instructor: educatorData?.full_name || educatorUsername,
        image: course.thumbnail || course.image_url || course.image || "",
        category: course.category?.name || course.category || "General",
        totalLessons: course.total_lessons || course.lessons_count || 0,
        duration: course.total_durations ? `${course.total_durations} weeks` : "N/A",
        price: course.price || "0.00",
        isFree: course.is_free || course.price === "0.00" || course.price === 0,
        rating: course.average_rating || course.rating || "0.00",
        enrolledStudents: course.total_enrollments || 0,
        chapters: course.chapters || course.modules || [],
      })) : [];

  // Check if a course is enrolled
  const isCourseEnrolled = (courseId) => {
    return enrolledInCourses?.some(course => course.id === courseId) || false;
  };

  // Filter courses based on search term and filter type
  const filteredCourses = processedAllCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || 
                         (filterType === "enrolled" && isCourseEnrolled(course.id));
    
    return matchesSearch && matchesFilter;
  });

  // ===== ENROLLMENT FUNCTIONS =====
  const openEnrollmentModal = async (course) => {
    setSelectedCourse(course);
    setSelectedCourseId(course.id);
    setShowEnrollmentModal(true);
    setEnrollmentType("full");
    setSelectedChapter(null);
    setCouponCode("");
    setCouponError("");
    setIsCouponValid(false);
  };

  const closeEnrollmentModal = () => {
    setShowEnrollmentModal(false);
    setSelectedCourse(null);
    setSelectedCourseId(null);
    setEnrollmentType("full");
    setSelectedChapter(null);
    setCouponCode("");
    setCouponError("");
    setIsCouponValid(false);
  };

  const handleEnrollmentTypeChange = (type) => {
    setEnrollmentType(type);
    setSelectedChapter(null);
    setCouponCode("");
    setCouponError("");
    setIsCouponValid(false);
  };

  const handleChapterSelection = (chapter) => {
    setSelectedChapter(chapter);
    setCouponCode("");
    setCouponError("");
    setIsCouponValid(false);
  };

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError("");
    
    try {
      // Simulate coupon validation - in real implementation, this would call a separate API endpoint
      // For now, we'll just check if the coupon code is not empty and has a reasonable format
      if (couponCode.trim().length >= 3) {
        setIsCouponValid(true);
        setCouponError("");
      } else {
        setIsCouponValid(false);
        setCouponError("Invalid coupon code format. Please try again.");
      }
    } catch (error) {
      setIsCouponValid(false);
      setCouponError("An error occurred while validating the coupon.");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleEnrollment = async () => {
    if (!isCouponValid) {
      setCouponError("Please validate your coupon code first");
      return;
    }

    setIsEnrolling(true);
    
    try {
      // Call the real enrollment API
      const response = await enrollStudentInCourse(selectedCourse.id, couponCode.trim());
      
      if (response.status === 201 || response.data) {
        closeEnrollmentModal();
        
        // Redirect to course details page
        if (enrollmentType === "full") {
          navigate(pagePaths.student.courseDetails(educatorUsername, selectedCourse.id));
        } else if (selectedChapter) {
          navigate(pagePaths.student.courseDetails(educatorUsername, selectedCourse.id), {
            state: { activeTab: 'curriculum', chapterId: selectedChapter.id }
          });
        }
      } else {
        setCouponError("Enrollment failed. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setCouponError("Invalid coupon code. Please try again.");
        } else if (error.response.status === 401) {
          setCouponError("Please log in to enroll in courses.");
        } else if (error.response.status === 403) {
          setCouponError("You don't have permission to enroll in this course.");
        } else {
          setCouponError("An error occurred during enrollment.");
        }
      } else if (error.request) {
        setCouponError("Network error. Please check your connection and try again.");
      } else {
        setCouponError("An error occurred during enrollment.");
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "text-success";
    if (progress >= 50) return "text-warning";
    return "text-danger";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return "badge-success-custom";
      case "Completed":
        return "badge-success-custom";
      case "Nearly Complete":
        return "badge-warning-custom";
      default:
        return "badge-warning-custom";
    }
  };

  // ===== LOADING AND ERROR STATES =====
  if (allCoursesLoading || enrolledLoading) {
    return (
      <div className="profile-root min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="loading-spinner mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="profile-joined">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 profile-root p-4">
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="main-title mb-2">Courses</h1>
            <p className="section-title">
              Explore courses by {educatorData?.full_name || educatorUsername} • {filteredCourses.length} courses available
            </p>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="row mb-4">
          <div className="col-md-8 mb-3">
            <div className="position-relative">
              <Search size={20} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Search courses by title, instructor, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="d-flex align-items-center">
              <Filter size={20} className="me-2 text-muted" />
              <select
                className="form-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Courses</option>
                <option value="enrolled">Enrolled Courses</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-5">
            <BookOpen size={64} className="text-muted mb-3" />
            <h3 className="section-title mb-2">No courses found</h3>
            <p className="profile-joined">
              {searchTerm || filterType !== "all" 
                ? "Try adjusting your search or filter criteria."
                : filterType === "enrolled" 
                  ? "You haven't enrolled in any courses yet."
                  : "No courses available at the moment."
              }
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredCourses.map((course) => (
              <div key={course.id} className="col-lg-4 col-md-6">
                <div className="card shadow-sm h-100 course-card">
                  {/* Course Image */}
                  <div className="position-relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="position-absolute top-0 end-0 p-2">
                      {isCourseEnrolled(course.id) ? (
                        <span className="badge bg-success px-2 py-1">
                          <CheckCircle size={14} className="me-1" />
                          Enrolled
                        </span>
                      ) : (
                        <span className="badge bg-warning px-2 py-1">
                          <Lock size={14} className="me-1" />
                          Locked
                        </span>
                      )}
                    </div>
                    <div className="position-absolute bottom-0 start-0 p-2">
                      <small className="badge bg-secondary px-2 py-1">
                        {course.category}
                      </small>
                    </div>
                  </div>

                  <div className="card-body p-4 d-flex flex-column">
                    {/* Course Title */}
                    <h4 className="section-title mb-2 line-clamp-2">
                      {course.title}
                    </h4>

                    {/* Instructor */}
                    <div className="d-flex align-items-center mb-2">
                      <User size={16} className="me-2 text-muted" />
                      <small className="profile-joined">{course.instructor}</small>
                    </div>

                    {/* Description */}
                    <p className="profile-joined mb-3 flex-grow-1 line-clamp-3">
                      {course.description}
                    </p>

                    {/* Course Stats */}
                    <div className="row mb-3">
                      <div className="col-6">
                        <div className="about-bubble p-2 text-center">
                          <Clock size={14} className="text-main mb-1" />
                          <div className="small">{course.duration}</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="about-bubble p-2 text-center">
                          <BarChart3 size={14} className="text-main mb-1" />
                          <div className="small">★ {course.rating}</div>
                        </div>
                      </div>
                    </div>

                    {/* Price and Enrollment Status */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          {course.isFree ? (
                            <span className="badge bg-success px-3 py-2">Free</span>
                          ) : (
                            <span className="badge bg-warning px-3 py-2">${course.price}</span>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto">
                      {isCourseEnrolled(course.id) ? (
                        <NavLink
                          to={pagePaths.student.courseDetails(educatorUsername, course.id)}
                          className="btn-edit-profile w-100 text-center text-decoration-none"
                        >
                          <Play size={16} className="me-2" />
                          Continue Learning
                        </NavLink>
                      ) : (
                        <button
                          className="btn-edit-profile w-100"
                          onClick={() => openEnrollmentModal(course)}
                        >
                          <Plus size={16} className="me-2" />
                          Enroll Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enrollment Modal */}
      {showEnrollmentModal && selectedCourse && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center enrollment-modal-backdrop"
          style={{ zIndex: 1050 }}
          onClick={closeEnrollmentModal}
        >
          <div 
            className="card enrollment-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
              <h5 className="mb-0 d-flex align-items-center">
                <BookOpen size={20} className="me-2" />
                Enroll in Course
              </h5>
            </div>
            <div className="card-body p-4">
              <h6 className="section-title mb-3">{selectedCourse.title}</h6>
              
              {/* Enrollment Type Selection */}
              <div className="mb-4">
                <label className="form-label about-subtitle fw-medium">Enrollment Type</label>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className={`${enrollmentType === 'full' ? 'btn-edit-profile' : 'btn-secondary-action'} flex-fill`}
                    onClick={() => handleEnrollmentTypeChange('full')}
                  >
                    <BookOpen size={16} className="me-2" />
                    Full Course
                  </button>
                  <button
                    type="button"
                    className={`${enrollmentType === 'chapter' ? 'btn-edit-profile' : 'btn-secondary-action'} flex-fill`}
                    onClick={() => handleEnrollmentTypeChange('chapter')}
                  >
                    <Play size={16} className="me-2" />
                    Single Chapter
                  </button>
                </div>
              </div>

              {/* Chapter Selection (if single chapter) */}
              {enrollmentType === 'chapter' && (
                <div className="mb-4">
                  <label className="form-label about-subtitle fw-medium">Select Chapter</label>
                  {courseModules && courseModules.length > 0 ? (
                    <div className="row g-2">
                      {courseModules.map((module) => (
                        <div key={module.id} className="col-6">
                          <button
                            type="button"
                            className={`w-100 chapter-selection-btn ${selectedChapter?.id === module.id ? 'btn-edit-profile' : 'btn-secondary-action'}`}
                            onClick={() => handleChapterSelection(module)}
                          >
                            <div className="small fw-bold">{module.title}</div>
                            <div className="small text-muted">
                              {module.total_lessons || 0} lessons • ${module.price}
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <p className="text-muted mb-2">
                        {modulesLoading ? 'Loading chapters...' : 'No chapters available for this course.'}
                      </p>
                      <small className="text-muted">
                        {modulesLoading ? 'Please wait while we load the course details.' : 'Please select "Full Course" enrollment instead.'}
                      </small>
                    </div>
                  )}
                </div>
              )}

              {/* Coupon Input */}
              <div className="mb-4">
                <label className="form-label about-subtitle fw-medium">
                  Coupon Code
                </label>
                <div className="input-group coupon-input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your coupon code (e.g., WELCOME2024)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={isValidatingCoupon || isEnrolling}
                  />
                  <button
                    className="btn-edit-profile"
                    onClick={validateCoupon}
                    disabled={!couponCode.trim() || isValidatingCoupon || isEnrolling}
                  >
                    {isValidatingCoupon ? (
                      <>
                        <div className="loading-spinner me-2" style={{ width: '1rem', height: '1rem' }}></div>
                        Validating...
                      </>
                    ) : (
                      'Apply Coupon'
                    )}
                  </button>
                </div>
                {couponError && (
                  <div className="text-danger small mt-1">{couponError}</div>
                )}
                {isCouponValid && (
                  <div className="text-success small mt-1">
                    <CheckCircle size={14} className="me-1" />
                    Coupon code is valid!
                  </div>
                )}
                <small className="text-muted">
                  Enter a valid coupon code to unlock this {enrollmentType === 'full' ? 'course' : 'chapter'}.
                </small>
              </div>

              {/* Course/Chapter Info */}
              <div className="about-bubble p-3 mb-4">
                <h6 className="about-subtitle mb-2">What you'll get:</h6>
                {enrollmentType === 'full' ? (
                  <ul className="mb-0 small">
                    <li>Access to all {selectedCourse.totalLessons} lessons</li>
                    <li>Complete course materials and resources</li>
                    <li>Course completion certificate</li>
                    <li>Lifetime access to course content</li>
                  </ul>
                ) : selectedChapter ? (
                  <ul className="mb-0 small">
                    <li>Access to {selectedChapter.title} chapter</li>
                    <li>{selectedChapter.total_lessons || 0} focused lessons</li>
                    <li>Chapter-specific materials</li>
                    <li>Price: ${selectedChapter.price}</li>
                    <li>Duration: {selectedChapter.total_duration || 0} minutes</li>
                  </ul>
                ) : (
                  <p className="text-muted mb-0">Please select a chapter to see what's included.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn-secondary-action flex-fill"
                  onClick={closeEnrollmentModal}
                  disabled={isEnrolling}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-edit-profile flex-fill"
                  onClick={handleEnrollment}
                  disabled={!isCouponValid || isEnrolling || (enrollmentType === 'chapter' && !selectedChapter)}
                >
                  {isEnrolling ? (
                    <>
                      <div className="loading-spinner me-2" style={{ width: '1rem', height: '1rem' }}></div>
                      Enrolling...
                    </>
                  ) : (
                    'Enroll Now'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;
