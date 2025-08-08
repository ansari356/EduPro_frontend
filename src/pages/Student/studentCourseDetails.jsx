import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LibraryBig,
  User,
  Clock,
  BookOpen,
  Play,
  CheckCircle,
  Star,
  Calendar,
  Award,
  BarChart3,
  ArrowLeft,
  MessageCircle,
  Download,
  X,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Maximize,
  Settings
} from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Data Analysis Fundamentals",
    description: "Master the fundamentals of data analysis with this comprehensive course. Learn to collect, clean, analyze, and visualize data using industry-standard tools and techniques.",
    fullDescription: "This comprehensive Data Analysis course is designed to take you from a complete beginner to a confident data analyst. You'll learn essential statistical concepts, data cleaning techniques, exploratory data analysis, and how to draw meaningful insights from complex datasets. The course includes hands-on projects using real-world data from various industries including finance, healthcare, and marketing. By the end of this course, you'll be able to confidently analyze data, create compelling visualizations, and present your findings to stakeholders.",
    progress: 75,
    status: "Active",
    image: "https://placehold.co/600x300?text=Data+Analysis+Fundamentals",
    educator: {
      name: "Dr. Sarah Johnson",
      title: "Senior Data Scientist",
      experience: "8 years",
      rating: 4.8,
      avatar: "https://placehold.co/150x150?text=Dr.+Sarah"
    },
    duration: "12 weeks",
    level: "Beginner to Intermediate",
    enrolledStudents: 1247,
    nextLesson: {
      id: 6,
      title: "Statistical Analysis Methods",
      date: "2025-01-20",
      time: "10:00 AM"
    },
    totalLessons: 24,
    completedLessons: 18,
    tableOfContents: [
      {
        chapter: "Chapter 1: Introduction to Data Analysis",
        topics: ["What is Data Analysis?", "Types of Data", "Data Analysis Process", "Tools Overview"],
        lessons: 4,
        completed: 4
      },
      {
        chapter: "Chapter 2: Statistical Foundations",
        topics: ["Descriptive Statistics", "Probability Basics", "Distributions", "Hypothesis Testing"],
        lessons: 4,
        completed: 4
      },
      {
        chapter: "Chapter 3: Data Collection & Cleaning",
        topics: ["Data Sources", "Data Quality Assessment", "Cleaning Techniques", "Missing Data Handling"],
        lessons: 4,
        completed: 4
      },
      {
        chapter: "Chapter 4: Exploratory Data Analysis",
        topics: ["EDA Process", "Pattern Recognition", "Correlation Analysis", "Outlier Detection"],
        lessons: 4,
        completed: 3
      },
      {
        chapter: "Chapter 5: Data Visualization",
        topics: ["Visualization Principles", "Chart Types", "Interactive Dashboards", "Storytelling with Data"],
        lessons: 4,
        completed: 2
      },
      {
        chapter: "Chapter 6: Advanced Analytics",
        topics: ["Predictive Modeling", "Time Series Analysis", "Classification", "Clustering"],
        lessons: 4,
        completed: 1
      }
    ],
    lessons: [
      { 
        id: 1, 
        title: "Welcome to Data Analysis", 
        duration: "15 min", 
        type: "video", 
        completed: true,
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        description: "An introduction to the world of data analysis and what you'll learn in this course."
      },
      { 
        id: 2, 
        title: "Understanding Data Types", 
        duration: "20 min", 
        type: "video", 
        completed: true,
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        description: "Learn about different types of data and how they affect your analysis approach."
      },
      { 
        id: 3, 
        title: "Data Analysis Tools Overview", 
        duration: "25 min", 
        type: "video", 
        completed: true,
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        description: "Overview of the essential tools used in modern data analysis."
      },
      { 
        id: 4, 
        title: "Basic Statistics Quiz", 
        duration: "10 min", 
        type: "quiz", 
        completed: true,
        description: "Test your understanding of basic statistical concepts."
      },
      { 
        id: 5, 
        title: "Descriptive Statistics Deep Dive", 
        duration: "30 min", 
        type: "video", 
        completed: true,
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        description: "Comprehensive look at descriptive statistics and their applications."
      },
      { 
        id: 6, 
        title: "Probability Fundamentals", 
        duration: "35 min", 
        type: "video", 
        completed: false,
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        description: "Understanding probability theory and its role in data analysis."
      },
      { 
        id: 7, 
        title: "Working with Distributions", 
        duration: "28 min", 
        type: "video", 
        completed: false,
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
        description: "Explore different statistical distributions and their characteristics."
      }
    ],
    studentReview: null
  }
];

export default function StudentCourseDetailsPage() {
  const { educatorUsername, id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Video player states
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Review system states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const course = courses.find((c) => c.id === Number(id));

  // Check if student has already submitted a review
  useEffect(() => {
    if (course?.studentReview) {
      setReviewSubmitted(true);
    }
  }, [course]);

  // Video player functions
  const openVideoPlayer = (lesson) => {
    if (lesson.type === 'video' && lesson.videoUrl) {
      setCurrentLesson(lesson);
      setShowVideoModal(true);
      setIsPlaying(true);
    } else if (lesson.type === 'quiz') {
      // Handle quiz opening - you can implement quiz modal here
      alert(`Opening quiz: ${lesson.title}`);
    }
  };

  const closeVideoPlayer = () => {
    setShowVideoModal(false);
    setCurrentLesson(null);
    setIsPlaying(false);
  };

  const handleContinueLearning = () => {
    // Find the next incomplete lesson or the next lesson based on course.nextLesson
    let nextLesson = null;
    
    if (course.nextLesson && course.nextLesson.id) {
      nextLesson = course.lessons.find(lesson => lesson.id === course.nextLesson.id);
    } else {
      // Find first incomplete lesson
      nextLesson = course.lessons.find(lesson => !lesson.completed);
    }
    
    if (nextLesson) {
      openVideoPlayer(nextLesson);
    } else {
      alert("Congratulations! You've completed all available lessons.");
    }
  };

  const markLessonComplete = (lessonId) => {
    // In a real app, this would call an API
    const lessonIndex = course.lessons.findIndex(lesson => lesson.id === lessonId);
    if (lessonIndex !== -1) {
      course.lessons[lessonIndex].completed = true;
      // Update progress calculation
      const newCompletedCount = course.lessons.filter(lesson => lesson.completed).length;
      course.progress = Math.round((newCompletedCount / course.lessons.length) * 100);
    }
  };

  // Handle keyboard shortcuts for video player
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (showVideoModal) {
        switch (e.key) {
          case 'Escape':
            closeVideoPlayer();
            break;
          case ' ':
            e.preventDefault();
            setIsPlaying(!isPlaying);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showVideoModal, isPlaying]);

  if (!course) {
    return (
      <div className="profile-root min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2 className="main-title mb-3">Course Not Found</h2>
          <p className="profile-joined mb-4">
            Sorry, we couldn't find the course you're looking for.
          </p>
          <button 
            className="btn-edit-profile" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} className="me-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewRating === 0) {
      alert("Please select a rating");
      return;
    }

    console.log("Review submitted:", {
      rating: reviewRating,
      comment: reviewComment
    });

    setReviewSubmitted(true);
    setShowReviewForm(false);
    
    course.studentReview = {
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString()
    };

    alert("Thank you for your review! Your feedback helps us improve.");
  };

  const completedLessons = course.lessons.filter(lesson => lesson.completed).length;
  const totalLessons = course.lessons.length;

  return (
    <div className="profile-root">
      {/* Video Player Modal */}
      {showVideoModal && currentLesson && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ 
            backgroundColor: 'rgba(0,0,0,0.9)', 
            zIndex: 1050,
            backdropFilter: 'blur(5px)'
          }}
          onClick={closeVideoPlayer}
        >
          <div 
            className="position-relative bg-secondary rounded"
            style={{ maxWidth: '90vw', maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video Player Header */}
            <div className="d-flex justify-content-between align-items-center p-3 text-white border-bottom border-secondary">
              <div>
                <h5 className="mb-0">{currentLesson.title}</h5>
                <small className="text-muted">{currentLesson.duration} • {course.title}</small>
              </div>
              <button
                className="btn btn-sm text-white p-0"
                onClick={closeVideoPlayer}
                style={{ background: 'none', border: 'none' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Video Element */}
            <div className="position-relative">
              <video
                width="800"
                height="450"
                controls
                autoPlay={isPlaying}
                className="d-block"
                style={{ maxWidth: '90vw', maxHeight: '60vh' }}
                onEnded={() => {
                  markLessonComplete(currentLesson.id);
                  setIsPlaying(false);
                }}
              >
                <source src={currentLesson.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Player Footer */}
            <div className="p-3 text-white border-top border-secondary">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 small">{currentLesson.description}</p>
                </div>
                <div className="d-flex gap-2">
                  {!currentLesson.completed && (
                    <button
                      className="btn btn-secondary-action btn-sm"
                      onClick={() => {
                        markLessonComplete(currentLesson.id);
                        alert("Lesson marked as complete!");
                      }}
                    >
                      <CheckCircle size={16} className="me-1" />
                      Mark Complete
                    </button>
                  )}
                  <button
                    className="btn btn-edit-profile btn-sm"
                    onClick={() => {
                      closeVideoPlayer();
                      // Find next lesson
                      const currentIndex = course.lessons.findIndex(l => l.id === currentLesson.id);
                      const nextLesson = course.lessons[currentIndex + 1];
                      if (nextLesson) {
                        setTimeout(() => openVideoPlayer(nextLesson), 100);
                      }
                    }}
                  >
                    Next Lesson
                    <SkipForward size={16} className="ms-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="card border-0 shadow-sm">
        <div className="container py-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="header-avatar me-2">
                <LibraryBig size={20} />
              </div>
              <div>
                <span className="section-title mb-0">{course.title}</span>
                <p className="profile-role mb-0">by {course.educator.name}</p>
              </div>
            </div>
            <button
              className="btn-edit-profile d-flex align-items-center"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} className="me-2" />
              Back to Courses
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row">
          {/* Course Content */}
          <div className="col-lg-8">
            {/* Course Image */}
            {course.image && (
              <div className="mb-4">
                <img
                  src={course.image}
                  alt={course.title}
                  className="course-detail-image w-100 rounded"
                  style={{ height: "300px", objectFit: "cover" }}
                />
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="card mb-4">
              <div className="card-body p-0">
                <div className="d-flex border-bottom">
                  <button
                    className={`btn-link-custom flex-fill text-center py-3 ${activeTab === 'overview' ? 'text-accent border-bottom border-primary border-3' : 'profile-joined'}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                  <button
                    className={`btn-link-custom flex-fill text-center py-3 ${activeTab === 'curriculum' ? 'text-accent border-bottom border-primary border-3' : 'profile-joined'}`}
                    onClick={() => setActiveTab('curriculum')}
                  >
                    Curriculum
                  </button>
                  <button
                    className={`btn-link-custom flex-fill text-center py-3 ${activeTab === 'lessons' ? 'text-accent border-bottom border-primary border-3' : 'profile-joined'}`}
                    onClick={() => setActiveTab('lessons')}
                  >
                    Lessons
                  </button>
                  <button
                    className={`btn-link-custom flex-fill text-center py-3 ${activeTab === 'review' ? 'text-accent border-bottom border-primary border-3' : 'profile-joined'}`}
                    onClick={() => setActiveTab('review')}
                  >
                    Review
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="card">
                <div className="card-body">
                  <h3 className="section-title mb-4">Course Overview</h3>
                  
                  <div className="mb-4">
                    <h4 className="about-subtitle mb-2">Description</h4>
                    <p className="profile-joined">{course.fullDescription}</p>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                      <div className="about-bubble p-3">
                        <Clock size={16} className="me-2 text-primary" />
                        <strong>Duration:</strong> {course.duration}
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="about-bubble p-3">
                        <BookOpen size={16} className="me-2 text-primary" />
                        <strong>Level:</strong> {course.level}
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="about-bubble p-3">
                        <User size={16} className="me-2 text-primary" />
                        <strong>Students:</strong> {course.enrolledStudents}
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="about-bubble p-3">
                        <Star size={16} className="me-2 text-primary" />
                        <strong>Rating:</strong> {course.educator.rating}/5.0
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="card">
                <div className="card-body">
                  <h3 className="section-title mb-4">Course Curriculum</h3>
                  
                  {course.tableOfContents.map((chapter, index) => (
                    <div key={index} className="mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="about-subtitle mb-0">{chapter.chapter}</h4>
                        <div className="d-flex align-items-center">
                          <span className="badge bg-secondary me-2">
                            {chapter.completed}/{chapter.lessons} completed
                          </span>
                          <div className="progress" style={{ width: "100px", height: "6px" }}>
                            <div
                              className="progress-bar progress-bar-filled"
                              style={{ width: `${(chapter.completed / chapter.lessons) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="ms-3">
                        {chapter.topics.map((topic, topicIndex) => (
                          <div key={topicIndex} className="about-bubble mb-2 d-flex align-items-center">
                            <div className="me-2">
                              {topicIndex < chapter.completed ? (
                                <CheckCircle size={16} className="text-success" />
                              ) : (
                                <Play size={16} className="text-muted" />
                              )}
                            </div>
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'lessons' && (
              <div className="card">
                <div className="card-body">
                  <h3 className="section-title mb-4">Course Lessons</h3>
                  
                  {course.lessons.map((lesson) => (
                    <div 
                      key={lesson.id} 
                      className="d-flex align-items-center p-3 mb-2 about-bubble position-relative"
                      style={{ 
                        cursor: lesson.type === 'video' ? 'pointer' : 'default',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => openVideoPlayer(lesson)}
                      onMouseEnter={(e) => {
                        if (lesson.type === 'video') {
                          e.currentTarget.style.transform = 'translateX(5px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (lesson.type === 'video') {
                          e.currentTarget.style.transform = 'translateX(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      <div className="me-3">
                        {lesson.completed ? (
                          <CheckCircle size={20} className="text-success" />
                        ) : (
                          <Play 
                            size={20} 
                            className={lesson.type === 'video' ? "text-primary" : "text-muted"} 
                          />
                        )}
                      </div>
                      
                      <div className="flex-grow-1">
                        <h5 className="about-subtitle mb-1">{lesson.title}</h5>
                        <div className="d-flex align-items-center gap-3">
                          <small className="profile-joined">
                            <Clock size={14} className="me-1" />
                            {lesson.duration}
                          </small>
                          <small 
                            className="border rounded px-2 py-1" 
                            style={{ 
                              color: lesson.type === 'video' ? "var(--color-primary)" : "var(--color-secondary)",
                              borderColor: lesson.type === 'video' ? "var(--color-primary)" : "var(--color-secondary)"
                            }}
                          >
                            {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
                          </small>
                        </div>
                        {lesson.description && (
                          <small className="text-muted d-block mt-1">
                            {lesson.description}
                          </small>
                        )}
                      </div>
                      
                      <div className="d-flex align-items-center">
                        {lesson.completed && (
                          <div className="text-success me-2">
                            <CheckCircle size={20} />
                          </div>
                        )}
                        {lesson.type === 'video' && !lesson.completed && (
                          <div className="text-primary opacity-75">
                            <Play size={16} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'review' && (
              <div className="card">
                <div className="card-body">
                  <h3 className="section-title mb-4">Course Review</h3>
                  
                  {reviewSubmitted || course.studentReview ? (
                    <div className="alert alert-success">
                      <h5 className="alert-heading d-flex align-items-center">
                        <CheckCircle size={20} className="me-2" />
                        Review Submitted
                      </h5>
                      <p className="mb-0">
                        Thank you for your feedback! You've already reviewed this course.
                        {course.studentReview && (
                          <>
                            <br />
                            <strong>Your Rating:</strong> 
                            <span className="ms-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={i < course.studentReview.rating ? "text-warning" : "text-muted"}
                                  fill={i < course.studentReview.rating ? "currentColor" : "none"}
                                />
                              ))}
                            </span>
                            {course.studentReview.comment && (
                              <>
                                <br />
                                <strong>Your Comment:</strong> {course.studentReview.comment}
                              </>
                            )}
                          </>
                        )}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="profile-joined mb-4">
                        Share your experience with this course to help other students make informed decisions.
                      </p>
                      
                      {!showReviewForm ? (
                        <button
                          className="btn-edit-profile"
                          onClick={() => setShowReviewForm(true)}
                        >
                          <Star size={16} className="me-2" />
                          Write a Review
                        </button>
                      ) : (
                        <form onSubmit={handleReviewSubmit}>
                          <div className="mb-4">
                            <h5 className="about-subtitle mb-3">Rate this course</h5>
                            <div className="d-flex gap-1">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <Star
                                  key={rating}
                                  size={32}
                                  className={`cursor-pointer ${
                                    rating <= (hoverRating || reviewRating)
                                      ? "text-warning"
                                      : "text-muted"
                                  }`}
                                  fill={rating <= (hoverRating || reviewRating) ? "currentColor" : "none"}
                                  onMouseEnter={() => setHoverRating(rating)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  onClick={() => setReviewRating(rating)}
                                  style={{ cursor: "pointer" }}
                                />
                              ))}
                            </div>
                            {reviewRating > 0 && (
                              <small className="text-muted d-block mt-2">
                                You rated this course {reviewRating} out of 5 stars
                              </small>
                            )}
                          </div>

                          <div className="mb-4">
                            <label className="form-label about-subtitle">
                              Share your thoughts (optional)
                            </label>
                            <textarea
                              className="form-control"
                              rows="4"
                              placeholder="Tell other students about your experience with this course..."
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                            />
                          </div>

                          <div className="d-flex gap-2">
                            <button
                              type="submit"
                              className="btn-edit-profile"
                              disabled={reviewRating === 0}
                            >
                              Submit Review
                            </button>
                            <button
                              type="button"
                              className="btn-edit-profile"
                              onClick={() => {
                                setShowReviewForm(false);
                                setReviewRating(0);
                                setReviewComment('');
                                setHoverRating(0);
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Course Progress */}
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="section-title mb-3">Your Progress</h4>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="about-subtitle">Overall Progress</span>
                    <span className="text-accent fw-bold">{course.progress}%</span>
                  </div>
                  <div className="progress mb-2">
                    <div 
                      className="progress-bar progress-bar-filled" 
                      style={{width: `${course.progress}%`}}
                    />
                  </div>
                  <small className="text-muted">
                    {completedLessons}/{totalLessons} lessons completed
                  </small>
                </div>

                <div className="mb-3">
                  <span className={`badge ${course.status === "Active" ? "bg-secondary" : ""} px-3 py-2`}>
                    {course.status}
                  </span>
                </div>

                {course.nextLesson && (
                  <div className="about-bubble p-3">
                    <h6 className="about-subtitle mb-2">Next Lesson</h6>
                    <div className="mb-1">{course.nextLesson.title}</div>
                    <small className="text-muted">
                      <Calendar size={14} className="me-1" />
                      {course.nextLesson.date} at {course.nextLesson.time}
                    </small>
                  </div>
                )}
              </div>
            </div>

            {/* Instructor Info */}
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="section-title mb-3">Your Instructor</h4>
                
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={course.educator.avatar}
                    alt={course.educator.name}
                    className="rounded-circle me-3"
                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                  />
                  <div>
                    <h5 className="about-subtitle mb-1">{course.educator.name}</h5>
                    <p className="profile-joined mb-0">{course.educator.title}</p>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-6">
                    <div className="about-bubble p-2 text-center">
                      <Award size={16} className="text-primary mb-1" />
                      <div className="small">{course.educator.experience}</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="about-bubble p-2 text-center">
                      <Star size={16} className="text-primary mb-1" />
                      <div className="small">★ {course.educator.rating}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card">
              <div className="card-body">
                <div className="d-grid gap-2">
                  {course.status === "Active" && (
                    <button 
                      className="btn-edit-profile"
                      onClick={handleContinueLearning}
                    >
                      <Play size={16} className="me-2" />
                      Continue Learning
                    </button>
                  )}
                  <button className="btn-edit-profile">
                    <Download size={16} className="me-2" />
                    Download Materials
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
