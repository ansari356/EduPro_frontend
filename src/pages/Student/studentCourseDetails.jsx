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
import useGetCourseDetails from "../../apis/hooks/student/useGetCourseDetails";
import useListCourseModules, { useModuleLessons } from "../../apis/hooks/student/useListCourseModules";
import useEducatorPublicData from "../../apis/hooks/student/useEducatorPublicData";

/**
 * StudentCourseDetails Component - Connected to Backend Hooks
 * 
 * HOOKS CONNECTED:
 * ✅ useGetCourseDetails() - Course details and information
 * ✅ useListCourseModules() - Course modules and lessons
 * ✅ useEducatorPublicData() - Educator information
 * 
 * REAL DATA FROM BACKEND:
 * ✅ Course basic info (title, description, category, price, etc.)
 * ✅ Course modules and lessons
 * ✅ Educator information (name, profile)
 * ✅ Lessons for each module
 * 
 * DUMMY DATA (NO BACKEND RESPONSE YET):
 * ❌ Course progress calculations
 * ❌ Lesson completion status
 * ❌ Next lesson details
 * ❌ Course ratings and reviews
 * ❌ Student progress tracking
 */
function StudentCourseDetails() {
  const params = useParams();
  const courseId = params.id; 
  const educatorUsername = params.educatorUsername;
  const navigate = useNavigate();
  
  // Debug all available params
  console.log("🔍 All URL Params:", params);
  console.log("🔍 Course ID from params.id:", courseId);
  console.log("🔍 Educator Username from params.educatorUsername:", educatorUsername);
  
  // ===== REAL DATA FROM HOOKS =====
  const { data: courseDetails, isLoading: courseLoading, error: courseError } = useGetCourseDetails(courseId);
  const { courseModules, isLoading: modulesLoading } = useListCourseModules(courseId);
  const { data: educatorData } = useEducatorPublicData(educatorUsername);

  // Fetch lessons for the first module (Chapter 1) only
  const firstModuleId = courseModules && courseModules.length > 0 ? courseModules[0].id : null;
  const { lessons: firstModuleLessons, isLoading: firstModuleLessonsLoading, error: firstModuleLessonsError } = useModuleLessons(firstModuleId);

  // Debug the hook calls
  console.log("🔍 Hook Debug:");
  console.log("useGetCourseDetails called with courseId:", courseId);
  console.log("useListCourseModules called with courseId:", courseId);
  console.log("useEducatorPublicData called with educatorUsername:", educatorUsername);
  console.log("First Module ID:", firstModuleId);
  console.log("First Module Lessons:", firstModuleLessons);
  console.log("First Module Lessons Loading:", firstModuleLessonsLoading);
  console.log("First Module Lessons Error:", firstModuleLessonsError);

  // Debug logging
  console.log("🔍 Course Details Debug:");
  console.log("courseId from params:", courseId);
  console.log("courseDetails:", courseDetails);
  console.log("courseError:", courseError);
  console.log("courseModules:", courseModules);
  console.log("educatorData:", educatorData);

  // ===== DUMMY DATA - NO BACKEND RESPONSE YET =====
  // These fields don't have backend responses, so keeping dummy data for now
  const dummyCourseData = {
    progress: 75,
    status: "Active",
    nextLesson: {
      id: 6,
      title: "Next Lesson Topic",
      date: "2025-01-20",
      time: "10:00 AM"
    },
    completedLessons: 18,
    enrolledStudents: 1247,
    level: "Beginner to Intermediate",
    tableOfContents: [
      {
        chapter: "Chapter 1: Introduction",
        topics: ["What is this course?", "Course Overview", "Getting Started"],
        lessons: 3,
        completed: 3
      },
      {
        chapter: "Chapter 2: Fundamentals",
        topics: ["Basic Concepts", "Core Principles", "Foundation Skills"],
        lessons: 4,
        completed: 2
      }
    ],
    lessons: [
      { 
        id: 1, 
        title: "Welcome to the Course", 
        duration: "15 min", 
        type: "video", 
        completed: true,
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        description: "An introduction to the course and what you'll learn."
      },
      { 
        id: 2, 
        title: "Getting Started", 
        duration: "20 min", 
        type: "video", 
        completed: true,
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        description: "Learn how to get started with the course materials."
      },
      { 
        id: 3, 
        title: "First Lesson", 
        duration: "25 min", 
        type: "video", 
        completed: false,
        videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        description: "Your first real lesson in the course."
      }
    ]
  };

  // ===== PROCESSED COURSE DATA =====
  // Combine real course data with dummy data for missing fields
  const course = courseDetails ? {
    ...courseDetails,
    // Real data from backend - handle different possible field names
    id: courseDetails.id || courseDetails.course_id,
    title: courseDetails.title || courseDetails.course || courseDetails.name || "Untitled Course",
    description: courseDetails.description || courseDetails.course_description || "Course description not available",
    image: courseDetails.image_url || courseDetails.thumbnail || courseDetails.image || "https://placehold.co/600x300?text=Course",
    category: courseDetails.category?.name || courseDetails.category_name || courseDetails.category || "General",
    totalLessons: courseModules && courseModules.length > 0 ? courseModules.length : (courseDetails.total_lessons || courseDetails.lessons_count || 0),
    duration: courseDetails.total_durations || courseDetails.duration ? `${courseDetails.total_durations || courseDetails.duration} weeks` : "N/A",
    price: courseDetails.price || courseDetails.course_price || "0.00",
    isFree: courseDetails.is_free || courseDetails.free || false,
    
    // Real course modules data from backend
    modules: courseModules || [],
    
    // Dummy data for missing backend fields
    progress: dummyCourseData.progress,
    status: dummyCourseData.status,
    nextLesson: dummyCourseData.nextLesson,
    completedLessons: dummyCourseData.completedLessons,
    enrolledStudents: dummyCourseData.enrolledStudents,
    level: dummyCourseData.level,
    
    // Use real modules for table of contents if available, otherwise fall back to dummy
    tableOfContents: courseModules && courseModules.length > 0 ? 
      courseModules.map((module, index) => {
        const chapterTitle = `Chapter ${index + 1}: ${module.title || `Module ${index + 1}`}`;
        
        // Get real lessons for this module (only Chapter 1 has lessons for now)
        const moduleLessons = index === 0 ? (firstModuleLessons || []) : [];
        const lessonsCount = moduleLessons.length;
        const hasPermissionError = index === 0 && firstModuleLessonsError;
        
        return {
          id: module.id || index + 1,
          chapter: chapterTitle,
          topics: [module.description || "Chapter Introduction"],
          lessons: lessonsCount,
          completed: 0, // TODO: Get completion status from backend when available
          module: module, // Store the full module data for reference
          hasLessons: lessonsCount > 0,
          hasPermissionError: hasPermissionError,
          // Use real lesson data from API
          chapterLessons: moduleLessons.map((lesson, lessonIndex) => ({
            id: lesson.id,
            title: lesson.title,
            duration: lesson.duration,
            type: "video", // Default to video, can be enhanced based on lesson data
            completed: false, // TODO: Get from backend when available
            videoUrl: lesson.playback_info || "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            description: lesson.description || "Lesson description not available",
            order: lesson.order || lessonIndex + 1,
            is_published: lesson.is_published || true,
            is_free: lesson.is_free || false,
            module: lesson.module || module.id,
            document_url: lesson.document_url,
            thumbnail_url: lesson.thumbnail_url,
            playback_info: lesson.playback_info,
            created_at: lesson.created_at
          }))
        };
      }) : dummyCourseData.tableOfContents,
    
    // Create a flat lessons array grouped by chapters for the lessons tab
    lessons: courseModules && courseModules.length > 0 ? 
      courseModules.flatMap((module, index) => {
        const chapterTitle = `Chapter ${index + 1}: ${module.title || `Module ${index + 1}`}`;
        
        // Get real lessons for this module (only Chapter 1 has lessons for now)
        const moduleLessons = index === 0 ? (firstModuleLessons || []) : [];
        const hasLessons = moduleLessons.length > 0;
        const hasPermissionError = index === 0 && firstModuleLessonsError;
        
        const result = [
          // Chapter header
          {
            id: `chapter-${module.id || index + 1}`,
            title: chapterTitle,
            isChapter: true,
            chapterId: module.id || index + 1,
            description: module.description || "Chapter description not available",
            hasLessons: hasLessons,
            hasPermissionError: hasPermissionError
          }
        ];
        
        // Add lessons only if this chapter has them
        if (hasLessons) {
          // Add real lessons from API
          const chapterLessons = moduleLessons.map((lesson, lessonIndex) => ({
            id: lesson.id,
            title: lesson.title,
            duration: lesson.duration,
            type: "video", // Default to video, can be enhanced based on lesson data
            completed: false, // TODO: Get from backend when available
            videoUrl: lesson.playback_info || "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
            description: lesson.description || "Lesson description not available",
            order: lesson.order || lessonIndex + 1,
            is_published: lesson.is_published || true,
            is_free: lesson.is_free || false,
            module: lesson.module || module.id,
            chapterId: module.id || index + 1,
            chapterTitle: chapterTitle,
            isChapter: false,
            document_url: lesson.document_url,
            thumbnail_url: lesson.thumbnail_url,
            playback_info: lesson.playback_info,
            created_at: lesson.created_at
          }));
          
          result.push(...chapterLessons);
        } else if (hasPermissionError) {
          // Add permission error message
          result.push({
            id: `${module.id}-permission-error`,
            title: "Enrollment Required",
            isChapter: false,
            chapterId: module.id || index + 1,
            chapterTitle: chapterTitle,
            isPermissionError: true,
            errorMessage: "You need to be enrolled in this course to access lessons."
          });
        } else {
          // Add a placeholder for chapters without lessons
          result.push({
            id: `${module.id}-no-lessons`,
            title: "No lessons available yet",
            isChapter: false,
            chapterId: module.id || index + 1,
            chapterTitle: chapterTitle,
            isEmpty: true
          });
        }
        
        return result;
      }) : dummyCourseData.lessons,
    
    // Educator information
    educator: {
      name: educatorData?.full_name || educatorData?.name || "Instructor",
      title: "Course Instructor",
      experience: "N/A",
      rating: courseDetails.average_rating || courseDetails.rating || "0.00",
      avatar: educatorData?.profile_picture || educatorData?.avatar || "https://placehold.co/150x150?text=Instructor"
    }
  } : null;

  // Debug the processed course data
  console.log("🔍 Processed Course Data:", course);
  console.log("🔍 Course Details Raw:", courseDetails);
  console.log("🔍 Course Modules Raw:", courseModules);
  console.log("🔍 First Module Lessons Raw:", firstModuleLessons);
  console.log("🔍 Educator Data Raw:", educatorData);
  
  // Check if modules are available
  const hasModules = courseModules && courseModules.length > 0;
  console.log("🔍 Has Modules:", hasModules);
  
  // Debug module structure
  if (hasModules) {
    console.log("🔍 First Module Structure:", courseModules[0]);
    console.log("🔍 All Modules:", courseModules);
    console.log("🔍 First Module Lessons Count:", firstModuleLessons ? firstModuleLessons.length : 0);
    if (firstModuleLessons && firstModuleLessons.length > 0) {
      console.log("🔍 First Lesson Structure:", firstModuleLessons[0]);
    }
  }

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

  // Tab state
  const [activeTab, setActiveTab] = useState('overview');

  // Check if student has already submitted a review
  useEffect(() => {
    if (course?.studentReview) {
      setReviewSubmitted(true);
    }
  }, [course]);

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

  // ===== LOADING AND ERROR STATES =====
  // Check if lessons are still loading
  const lessonsLoading = firstModuleLessonsLoading;
  
  if (courseLoading || modulesLoading || lessonsLoading) {
    return (
      <div className="profile-root min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="loading-spinner mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="profile-joined">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="profile-root min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2 className="main-title mb-3">Course Not Found</h2>
          <p className="profile-joined mb-4">
            Sorry, we couldn't find the course you're looking for.
          </p>
          {courseError && (
            <div className="alert alert-danger mb-3">
              <strong>Error Details:</strong> {courseError.message || courseError}
            </div>
          )}
          <div className="mb-3">
            <small className="text-muted">
              Course ID: {courseId}<br/>
              Educator: {educatorUsername}<br/>
              Course Details: {courseDetails ? 'Loaded' : 'Not loaded'}<br/>
              Educator Data: {educatorData ? 'Loaded' : 'Not loaded'}
            </small>
          </div>
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
                  
                  {hasModules ? (
                    course.tableOfContents.map((chapter, index) => (
                      <div key={chapter.id} className="mb-4">
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
                        
                        {/* Chapter Description */}
                        {chapter.module && chapter.module.description && (
                          <div className="ms-3 mb-3">
                            <p className="text-muted mb-2">{chapter.module.description}</p>
                          </div>
                        )}
                        
                        {/* Chapter Topics */}
                        <div className="ms-3 mb-3">
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
                        
                        {/* Chapter Lessons */}
                        {chapter.chapterLessons && chapter.chapterLessons.length > 0 ? (
                          <div className="ms-4">
                            <h6 className="text-muted mb-2">Lessons in this chapter:</h6>
                            {chapter.chapterLessons.map((lesson, lessonIndex) => (
                              <div key={lesson.id} className="about-bubble mb-2 d-flex align-items-center">
                                <div className="me-2">
                                  {lesson.completed ? (
                                    <CheckCircle size={14} className="text-success" />
                                  ) : (
                                    <Play size={14} className="text-muted" />
                                  )}
                                </div>
                                <span className="me-2">{lesson.title}</span>
                                <small className="text-muted">
                                  <Clock size={12} className="me-1" />
                                  {typeof lesson.duration === 'number' ? `${lesson.duration} min` : lesson.duration}
                                </small>
                                {lesson.order && (
                                  <small className="text-muted ms-2">
                                    Order: {lesson.order}
                                  </small>
                                )}
                                {lesson.is_free && (
                                  <small className="badge bg-success ms-2">
                                    Free
                                  </small>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : chapter.hasPermissionError ? (
                          <div className="ms-4">
                            <div className="alert alert-warning mb-2">
                              <div className="d-flex align-items-center">
                                <div className="me-2">
                                  <Clock size={16} className="text-warning" />
                                </div>
                                <div>
                                  <strong>Enrollment Required</strong>
                                  <br />
                                  <small>You need to be enrolled in this course to access lessons.</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="ms-4">
                            <div className="about-bubble mb-2 d-flex align-items-center">
                              <div className="me-2">
                                <Clock size={14} className="text-muted" />
                              </div>
                              <span className="text-muted">No lessons available yet</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Chapter Metadata */}
                        {chapter.module && (
                          <div className="ms-3 mt-2">
                            <small className="text-muted">
                              <Clock size={12} className="me-1" />
                              Duration: {chapter.module.duration || "N/A"}
                            </small>
                            {chapter.module.total_lessons && (
                              <small className="text-muted ms-3">
                                <BookOpen size={12} className="me-1" />
                                Lessons: {chapter.module.total_lessons}
                              </small>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-5">
                      <p className="profile-joined">No curriculum available for this course yet.</p>
                      <p className="profile-joined">Please check back later or contact the instructor.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'lessons' && (
              <div className="card">
                <div className="card-body">
                  <h3 className="section-title mb-4">Course Lessons</h3>
                  
                  {hasModules ? (
                    course.lessons.map((lesson) => {
                      if (lesson.isChapter) {
                        // Render chapter header
                        return (
                          <div key={lesson.id} className="mb-4">
                            <div className="d-flex align-items-center p-3 mb-2 about-bubble bg-light">
                              <div className="me-3">
                                <BookOpen size={24} className="text-primary" />
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="about-subtitle mb-1">{lesson.title}</h5>
                                {lesson.description && (
                                  <small className="text-muted">{lesson.description}</small>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        // Render lesson under its chapter
                        if (lesson.isEmpty) {
                          // Render empty chapter placeholder
                          return (
                            <div key={lesson.id} className="ms-4 mb-2">
                              <div className="about-bubble d-flex align-items-center p-3">
                                <div className="me-3">
                                  <Clock size={16} className="text-muted" />
                                </div>
                                <div className="flex-grow-1">
                                  <small className="text-muted">No lessons available yet</small>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        
                        if (lesson.isPermissionError) {
                          // Render permission error message
                          return (
                            <div key={lesson.id} className="ms-4 mb-2">
                              <div className="alert alert-warning d-flex align-items-center p-3">
                                <div className="me-3">
                                  <Clock size={16} className="text-warning" />
                                </div>
                                <div className="flex-grow-1">
                                  <strong>Enrollment Required</strong>
                                  <br />
                                  <small>{lesson.errorMessage}</small>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        
                        return (
                          <div 
                            key={lesson.id} 
                            className="d-flex align-items-center p-3 mb-2 about-bubble position-relative ms-4"
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
                              <h6 className="about-subtitle mb-1">{lesson.title}</h6>
                              <div className="d-flex align-items-center gap-3">
                                <small className="profile-joined">
                                  <Clock size={14} className="me-1" />
                                  {typeof lesson.duration === 'number' ? `${lesson.duration} min` : lesson.duration}
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
                                {lesson.order && (
                                  <small className="text-muted">
                                    Order: {lesson.order}
                                  </small>
                                )}
                                {lesson.is_free && (
                                  <small className="badge bg-success">
                                    Free
                                  </small>
                                )}
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
                        );
                      }
                    })
                  ) : (
                    <div className="text-center py-5">
                      <p className="profile-joined">No lessons available for this course yet.</p>
                      <p className="profile-joined">Please check back later or contact the instructor.</p>
                    </div>
                  )}
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
                    className="avatar-circle me-3"
                    style={{ width: "60px", height: "80px", objectFit: "cover" }}
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

export default StudentCourseDetails;
