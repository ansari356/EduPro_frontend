import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LibraryBig,
  Clock,
  BookOpen,
  Play,
  CheckCircle,
  Star,
  Calendar,
  Award,
  BarChart3,
  ArrowLeft,
  Download,
  X,
  SkipForward,
  BadgeCheck,
} from "lucide-react";
import useGetCourseDetails from "../../apis/hooks/student/useGetCourseDetails";
import useListCourseModules, { useModuleLessons } from "../../apis/hooks/student/useListCourseModules";
import useEducatorPublicData from "../../apis/hooks/student/useEducatorPublicData";
import useCourseProgress from "../../apis/hooks/student/useCourseProgress";
import useListEnrolledCourses from "../../apis/hooks/student/useListEnrolledCourses";
import submitCourseRating from "../../apis/actions/student/submitCourseRating";
import { pagePaths } from "../../pagePaths";


/* StudentCourseDetails Component */
function StudentCourseDetails() {
  const params = useParams();
  const courseId = params.id;
  const educatorUsername = params.educatorUsername;
  const navigate = useNavigate();




  const { data: courseDetails, isLoading: courseLoading, error: courseError } = useGetCourseDetails(courseId);
  const { courseModules, isLoading: modulesLoading } = useListCourseModules(courseId);
  const { data: educatorData } = useEducatorPublicData(educatorUsername);
  const { enrolledInCourses, isLoading: enrolledLoading } = useListEnrolledCourses();
  // Fetch lessons for all modules
  const allModuleIds = courseModules && courseModules.length > 0 ? courseModules.map(module => module.id) : [];

  // Fetch lessons for each module individually
  const firstModuleId = allModuleIds[0] || null;
  const secondModuleId = allModuleIds[1] || null;
  const thirdModuleId = allModuleIds[2] || null;
  const fourthModuleId = allModuleIds[3] || null;

  const { lessons: firstModuleLessons, isLoading: firstModuleLessonsLoading, error: firstModuleLessonsError } = useModuleLessons(firstModuleId);
  const { lessons: secondModuleLessons, isLoading: secondModuleLessonsLoading, error: secondModuleLessonsError } = useModuleLessons(secondModuleId);
  const { lessons: thirdModuleLessons, isLoading: thirdModuleLessonsLoading, error: thirdModuleLessonsError } = useModuleLessons(thirdModuleId);
  const { lessons: fourthModuleLessons, isLoading: fourthModuleLessonsLoading, error: fourthModuleLessonsError } = useModuleLessons(fourthModuleId);

  // Combine all lessons from all modules (memoized to prevent infinite re-renders)
  const allModuleLessonsCombined = useMemo(() => [
    ...(firstModuleLessons || []),
    ...(secondModuleLessons || []),
    ...(thirdModuleLessons || []),
    ...(fourthModuleLessons || [])
  ], [firstModuleLessons, secondModuleLessons, thirdModuleLessons, fourthModuleLessons]);

  // Define loading and error states
  const lessonsLoading = firstModuleLessonsLoading || secondModuleLessonsLoading || thirdModuleLessonsLoading || fourthModuleLessonsLoading;
  const lessonsError = firstModuleLessonsError || secondModuleLessonsError || thirdModuleLessonsError || fourthModuleLessonsError;

  // Use the new course progress hook for real-time analytics
  const courseProgressData = useCourseProgress(courseId, allModuleLessonsCombined);








  const course = courseDetails ? {
    ...courseDetails,
    id: courseDetails.id || courseDetails.course_id,
    title: courseDetails.title || courseDetails.course || courseDetails.name || "Untitled Course",
    description: courseDetails.description || courseDetails.course_description || "Course description not available",
    image: courseDetails.image_url || courseDetails.thumbnail || courseDetails.image || "",
    category: courseDetails.category?.name || courseDetails.category_name || courseDetails.category || "General",
    totalLessons: courseModules && courseModules.length > 0 ? courseModules.length : (courseDetails.total_lessons || courseDetails.lessons_count || 0),
    duration: courseDetails.total_durations || courseDetails.duration ? `${courseDetails.total_durations || courseDetails.duration} weeks` : "N/A",
    price: courseDetails.price || courseDetails.course_price || "0.00",
    isFree: courseDetails.is_free || courseDetails.free || false,
    modules: courseModules || [],

    tableOfContents: courseModules && courseModules.length > 0 ?
      courseModules.map((module, index) => {
        const chapterTitle = `Chapter ${index + 1}: ${module.title || `Module ${index + 1}`}`;
        // Get lessons for this specific module
        const moduleLessons = index === 0 ? (firstModuleLessons || []) :
          index === 1 ? (secondModuleLessons || []) :
            index === 2 ? (thirdModuleLessons || []) :
              index === 3 ? (fourthModuleLessons || []) : [];
        const lessonsCount = moduleLessons.length;
        const hasPermissionError = index === 0 && firstModuleLessonsError ||
          index === 1 && secondModuleLessonsError ||
          index === 2 && thirdModuleLessonsError ||
          index === 3 && fourthModuleLessonsError;

        return {
          id: module.id || index + 1,
          chapter: chapterTitle,
          topics: [module.description || "Chapter Introduction"],
          lessons: lessonsCount,
          completed: moduleLessons.filter(lesson => 
            courseProgressData?.isLessonCompleted?.(lesson.id)
          ).length,
          module: module,
          hasLessons: lessonsCount > 0,
          hasPermissionError: hasPermissionError,
          chapterLessons: moduleLessons.map((lesson, lessonIndex) => ({
            id: lesson.id,
            title: lesson.title,
            duration: lesson.duration,
            type: "video", // Default to video, can be enhanced based on lesson data
            // Preserve existing progress data from backend (Chapter 1 lessons have this)
            completed: lesson.completed || lesson.is_completed || false,
            is_completed: lesson.is_completed || lesson.completed || false,
            progress: lesson.progress || 0,
            completed_at: lesson.completed_at || null,
            videoUrl: lesson.playback_info || "",
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
      }) : [],

    // Create a flat lessons array grouped by chapters for the lessons tab
    lessons: courseModules && courseModules.length > 0 ?
      courseModules.flatMap((module, index) => {
        const chapterTitle = `Chapter ${index + 1}: ${module.title || `Module ${index + 1}`}`;

        // Get real lessons for this module
        const moduleLessons = index === 0 ? (firstModuleLessons || []) :
          index === 1 ? (secondModuleLessons || []) :
            index === 2 ? (thirdModuleLessons || []) :
              index === 3 ? (fourthModuleLessons || []) : [];
        const hasLessons = moduleLessons.length > 0;
        const hasPermissionError = index === 0 && firstModuleLessonsError ||
          index === 1 && secondModuleLessonsError ||
          index === 2 && thirdModuleLessonsError ||
          index === 3 && fourthModuleLessonsError;

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
            // Preserve existing progress data from backend (Chapter 1 lessons have this)
            completed: lesson.completed || lesson.is_completed || false,
            is_completed: lesson.is_completed || lesson.completed || false,
            progress: lesson.progress || 0,
            completed_at: lesson.completed_at || null,
            videoUrl: lesson.playback_info || "",
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
      }) : [],

    // Educator information
    educator: {
      name: educatorData?.full_name || educatorData?.name || "Instructor",
      title: "Course Instructor",
      experience: "N/A",
      rating: courseDetails.average_rating || courseDetails.rating || "0.00",
      avatar: educatorData?.profile_picture || educatorData?.avatar || ""
    }
  } : null;


  // Check if modules are available
  const hasModules = courseModules && courseModules.length > 0;

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

    // Also check localStorage for existing review
    if (courseId) {
      const existingReview = localStorage.getItem(`courseReview_${courseId}`);
      if (existingReview) {
        try {
          const reviewData = JSON.parse(existingReview);
          setReviewRating(reviewData.rating);
          setReviewComment(reviewData.comment);
          setReviewSubmitted(true);

        } catch (error) {
          console.error("Failed to parse existing review:", error);
        }
      }
    }
  }, [course, courseId]);

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




  if (courseLoading || modulesLoading || lessonsLoading || enrolledLoading || courseProgressData?.isLoading) {
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

  // Check if student has access to course content (enrolled or course is free)
  const isEnrolled = enrolledInCourses?.some(course => course.id === courseId) || false;
  const hasCourseAccess = courseDetails?.is_free || isEnrolled;
  const showEnrollmentMessage = !hasCourseAccess && !lessonsError;

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
              Course ID: {courseId}<br />
              Educator: {educatorUsername}<br />
              Course Details: {courseDetails ? 'Loaded' : 'Not loaded'}<br />
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


  const openVideoPlayer = (lesson) => {
    const lessonWithProgress = lessonsWithProgress.find(l => l.id === lesson.id) || lesson;

    const lessonForVideo = {
      ...lessonWithProgress,
      type: lessonWithProgress.type || 'video',
      videoUrl: lessonWithProgress.videoUrl || "",
      duration: lessonWithProgress.duration || '15 min'
    };



    if (lessonForVideo.type === 'video' && lessonForVideo.videoUrl) {
      setCurrentLesson(lessonForVideo);
      setShowVideoModal(true);
      setIsPlaying(true);
    } else if (lessonForVideo.type === 'quiz') {
      // Handle quiz opening - you can implement quiz modal here
      alert(`Opening quiz: ${lessonForVideo.title}`);
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

  const markLessonComplete = async (lessonId) => {
    try {
      // Mark lesson as complete in backend
      await markLessonAsComplete(lessonId, true);

    } catch (error) {
      console.error('Failed to mark lesson as complete:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewRating === 0) {
      alert("Please select a rating");
      return;
    }

    try {
      const ratingData = {
        rating: reviewRating,
        comment: reviewComment
      };

      const response = await submitCourseRating(courseId, ratingData);

      // Update local state
      setReviewSubmitted(true);
      setShowReviewForm(false);

      // Store the submitted review locally
      const submittedReview = {
        rating: reviewRating,
        comment: reviewComment,
        date: new Date().toISOString()
      };

      // Save to localStorage for persistence
      localStorage.setItem(`courseReview_${courseId}`, JSON.stringify(submittedReview));

      alert("Thank you for your review! Your feedback helps us improve.");

    } catch (error) {
      console.error('Failed to submit review:', error);
      alert(`Failed to submit review: ${error.response?.data?.detail || error.message}`);
    }
  };

  // Calculate real progress from lessons data
  // Use all lessons from all modules
  let allLessons = allModuleLessonsCombined || [];

  // Use lesson statuses from the backend instead of localStorage
  const lessonsWithProgress = allLessons.map(lesson => ({
    ...lesson,
    is_completed: courseProgressData?.isLessonCompleted?.(lesson.id) || false,
    completed: courseProgressData?.isLessonCompleted?.(lesson.id) || false,
    status: courseProgressData?.isLessonCompleted?.(lesson.id) ? 'completed' : 'not_started'
  }));

  // Use real-time analytics from course progress hook
  const completedLessons = courseProgressData?.completedLessons || 0;
  const totalLessons = courseProgressData?.totalLessons || 0;
  const courseProgress = courseProgressData?.progress || 0;
  const nextLesson = courseProgressData?.nextLesson || null;

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
                onEnded={async () => {
                  try {
                    // Refresh course progress after video completion
                    await courseProgressData?.refreshStatuses?.();
                    setIsPlaying(false);
                    // You can add a success notification here
                  } catch (error) {
                    console.error('Failed to refresh progress:', error);
                    // You can add an error notification here
                  }
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
                  {!(currentLesson.is_completed || currentLesson.completed || currentLesson.status === 'completed') && (
                    <button
                      className="btn-secondary-action"
                      onClick={async () => {
                        try {
                          // Refresh course progress after marking complete
                          await courseProgressData?.refreshStatuses?.();
                          // Close video player and show success
                          closeVideoPlayer();
                          // You can add a success notification here
                        } catch (error) {
                          console.error('Failed to refresh progress:', error);
                          // You can add an error notification here
                        }
                      }}
                      disabled={courseProgressData?.isLoading}
                    >
                      <CheckCircle size={16} className="me-1" />
                      {courseProgressData?.isLoading ? 'Marking...' : 'Mark Complete'}
                    </button>
                  )}
                  <button
                    className="btn-edit-profile"
                    onClick={() => {
                      closeVideoPlayer();
                      // Find next lesson from lessons with progress
                      const currentIndex = lessonsWithProgress.findIndex(l => l.id === currentLesson.id);
                      const nextLesson = lessonsWithProgress[currentIndex + 1];
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
                    className={`btn-link-custom flex-fill text-center py-3 ${activeTab === 'assessments' ? 'text-accent border-bottom border-primary border-3' : 'profile-joined'}`}
                    onClick={() => setActiveTab('assessments')}
                  >
                    Assessments
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

                  {/* Enrollment Required Message */}
                  {showEnrollmentMessage && (
                    <div className="alert alert-info mb-4">
                      <div className="d-flex align-items-center">
                        <BookOpen size={20} className="me-2" />
                        <div>
                          <strong>Enrollment Required</strong>
                          <br />
                          <small>You need to enroll in this course to access the full content, including lessons and progress tracking.</small>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h4 className="about-subtitle mb-2">Description</h4>
                    <p className="about-bubble">{course.description}</p>
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
                          </div>
                        </div>

                        {/* Chapter Description */}
                        {chapter.module && chapter.module.description && (
                          <div className="ms-3 mb-3">
                            <p className="text-muted mb-2">{chapter.module.description}</p>
                          </div>
                        )}
                        {/* Chapter Lessons */}
                        {chapter.chapterLessons && chapter.chapterLessons.length > 0 ? (
                          <div className="ms-4">
                            <h6 className="text-muted mb-2">Lessons:</h6>
                            {chapter.chapterLessons.map((lesson, lessonIndex) => (
                              <div
                                key={lesson.id}
                                className="about-bubble mb-2 d-flex align-items-center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(pagePaths.student.lessonDetails(educatorUsername, courseId, lesson.id), {
                                  state: { lessonData: lesson, courseData: course }
                                })}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'translateX(5px)';
                                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'translateX(0)';
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              >
                                <div className="me-2">
                                  {lesson.completed ? (
                                    <CheckCircle size={14} className="text-main" />
                                  ) : (
                                    <Play size={14} className="text-main" />
                                  )}
                                </div>
                                <span className="me-2">{lesson.title}</span>
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

            {activeTab === 'assessments' && (
              <div className="card">
                <div className="card-body">
                  <h3 className="section-title mb-4">Course Assessments</h3>

                  {/* Enrollment Required Message */}
                  {showEnrollmentMessage && (
                    <div className="alert alert-info">
                      <div className="d-flex align-items-center">
                        <BookOpen size={16} className="me-2" />
                        <div>
                          <strong>Enrollment Required</strong>
                          <br />
                          <small>You need to enroll in this course to access assessments and track your progress.</small>
                        </div>
                      </div>
                    </div>
                  )}

                  {hasModules ? (
                    courseModules.map((module, index) => (
                      <div key={module.id} className="mb-4">
                        <div className="d-flex align-items-center p-3 mb-2 about-bubble bg-light">
                          <div className="me-3">
                            <BookOpen size={24} className="text-primary" />
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="about-subtitle mb-1">Chapter {index + 1}: {module.title}</h5>
                            {module.description && (
                              <small className="text-muted">{module.description}</small>
                            )}
                          </div>
                        </div>

                        {/* Module Assessments */}
                        <div className="ms-4">
                          {/* Quiz Assessment */}
                          <div className="d-flex align-items-center p-3 mb-2 about-bubble position-relative">
                            <div className="me-3">
                              <BarChart3 size={20} className="text-warning" />
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="about-subtitle mb-1">Chapter {index + 1} Quiz</h6>
                              <div className="d-flex align-items-center gap-3">
                                <small className="profile-joined">
                                  <Clock size={14} className="me-1" />
                                  15 min
                                </small>
                                <small
                                  className="border rounded px-2 py-1"
                                  style={{
                                    color: "var(--color-primary)",
                                    borderColor: "var(--color-primary)"
                                  }}
                                >
                                  Quiz
                                </small>
                                <small className="badge bg-info">
                                  10 Questions
                                </small>
                              </div>
                              <small className="text-muted d-block mt-1">
                                Test your knowledge of Chapter {index + 1} concepts
                              </small>
                            </div>
                            <div className="d-flex align-items-center">
                              <button
                                className="btn-edit-profile btn-sm"
                                onClick={() => {
                                  if (showEnrollmentMessage) {
                                    alert("Please enroll in this course to access assessments.");
                                  } else {
                                    alert(`Starting Chapter ${index + 1} Quiz...`);
                                  }
                                }}
                              >
                                Start Quiz
                              </button>
                            </div>
                          </div>

                          {/* Assignment Assessment */}
                          <div className="d-flex align-items-center p-3 mb-2 about-bubble position-relative">
                            <div className="me-3">
                              <Download size={20} className="text-success" />
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="about-subtitle mb-1">Chapter {index + 1} Assignment</h6>
                              <div className="d-flex align-items-center gap-3">
                                <small className="profile-joined">
                                  <Clock size={14} className="me-1" />
                                  2 hours
                                </small>
                                <small
                                  className="border rounded px-2 py-1"
                                  style={{
                                    color: "var(--color-primary)",
                                    borderColor: "var(--color-primary)"
                                  }}
                                >
                                  Assignment
                                </small>
                                <small className="badge bg-warning">
                                  Due: 7 days
                                </small>
                              </div>
                              <small className="text-muted d-block mt-1">
                                Practical assignment to apply Chapter {index + 1} concepts
                              </small>
                            </div>
                            <div className="d-flex align-items-center">
                              <button
                                className="btn-edit-profile btn-sm"
                                onClick={() => {
                                  if (showEnrollmentMessage) {
                                    alert("Please enroll in this course to access assessments.");
                                  } else {
                                    alert(`Opening Chapter ${index + 1} Assignment...`);
                                  }
                                }}
                              >
                                View Assignment
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-5">
                      <p className="profile-joined">No assessments available for this course yet.</p>
                      <p className="profile-joined">Please check back later or contact the instructor.</p>
                    </div>
                  )}

                  {/* Final Assessment */}
                  {hasModules && (
                    <div className="mt-4">
                      <div className="d-flex align-items-center p-3 mb-2 about-bubble bg-primary text-white">
                        <div className="me-3">
                          <Award size={24} className="text-white" />
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="about-subtitle mb-1 text-white">Final Course Assessment</h5>
                          <div className="d-flex align-items-center gap-3">
                            <small className="text-white-50">
                              <Clock size={14} className="me-1" />
                              3 hours
                            </small>
                            <small
                              className="border rounded px-2 py-1 text-white"
                              style={{
                                borderColor: "white"
                              }}
                            >
                              Final Exam
                            </small>
                            <small className="badge bg-warning">
                              50 Questions
                            </small>
                          </div>
                          <small className="text-white-50 d-block mt-1">
                            Comprehensive final exam covering all course material
                          </small>
                        </div>
                        <div className="d-flex align-items-center">
                          <button
                            className="btn-edit-profile btn-sm"
                            style={{ backgroundColor: 'white', color: 'var(--color-primary)' }}
                            onClick={() => {
                              if (showEnrollmentMessage) {
                                alert("Please enroll in this course to access assessments.");
                              } else {
                                alert("Starting Final Course Assessment...");
                              }
                            }}
                          >
                            Start Final Exam
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'review' && (
              <div className="card">
                <div className="card-body">
                  <h3 className="section-title mb-4">Course Review</h3>

                  {reviewSubmitted ? (
                    <div className="alert alert-success">
                      <h5 className="alert-heading d-flex align-items-center">
                        <CheckCircle size={20} className="me-2" />
                        Review Submitted
                      </h5>
                      <p className="mb-0">
                        Thank you for your feedback! You've already reviewed this course.
                        <br />
                        <strong>Your Rating:</strong>
                        <span className="ms-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < reviewRating ? "text-warning" : "text-muted"}
                              fill={i < reviewRating ? "currentColor" : "none"}
                            />
                          ))}
                        </span>
                        {reviewComment && (
                          <>
                            <br />
                            <strong>Your Comment:</strong> {reviewComment}
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
                                  className={`cursor-pointer ${rating <= (hoverRating || reviewRating)
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
            {/* Course Progress - Only show if student has access */}
            {!showEnrollmentMessage && (
              <div className="card mb-4">
                <div className="card-body">
                  <h4 className="section-title mb-3">Your Progress</h4>

                  {courseProgressData?.isLoading ? (
                    <div className="text-center py-3">
                      <div className="loading-spinner mb-2" role="status">
                        <span className="visually-hidden">Loading progress...</span>
                      </div>
                      <small className="text-muted">Loading progress...</small>
                    </div>
                  ) : courseProgressData?.error ? (
                    <div className="alert alert-warning">
                      <small>Unable to load progress data. Please refresh the page.</small>
                    </div>
                  ) : (
                    <>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="about-subtitle">Overall Progress</span>
                          <span className="text-accent fw-bold">{courseProgress}%</span>
                        </div>
                        <div className="progress mb-2">
                          <div
                            className="progress-bar progress-bar-filled"
                            style={{ width: `${courseProgress}%` }}
                          />
                        </div>
                        <small className="text-muted">
                          {completedLessons}/{totalLessons} lessons completed
                        </small>
                      </div>

                      <div className="mb-3">
                        <span className={`badge ${courseProgress === 100 ? "bg-success" : courseProgress > 0 ? "bg-secondary" : "bg-warning"} px-3 py-2`}>
                          {courseProgress === 100 ? "Completed" : courseProgress > 0 ? "In Progress" : "Not Started"}
                        </span>
                      </div>

                      {nextLesson && (
                        <div 
                          className="about-bubble p-3" 
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigate(pagePaths.student.lessonDetails(educatorUsername, courseId, nextLesson.id))}
                        >
                          <h6 className="about-subtitle mb-2">Next Lesson</h6>
                          <div className="mb-1">{nextLesson.title}</div>
                          <small className="text-muted">
                            <Calendar size={14} className="me-1" />
                            {nextLesson.duration || 'Continue learning'}
                          </small>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Analytics - Only show if student has access */}
            {!showEnrollmentMessage && (
              <div className="card mb-4">
                <div className="card-body">
                  <h4 className="section-title mb-3">Analytics</h4>

                  {courseProgressData?.isLoading ? (
                    <div className="text-center py-3">
                      <div className="loading-spinner mb-2" role="status">
                        <span className="visually-hidden">Loading analytics...</span>
                      </div>
                      <small className="text-muted">Loading analytics...</small>
                    </div>
                  ) : courseProgressData?.error ? (
                    <div className="alert alert-warning">
                      <small>Unable to load analytics. Please refresh the page.</small>
                    </div>
                  ) : (
                    <div className="row g-3">
                      <div className="col-6">
                        <div className="about-bubble p-3 text-center">
                          <CheckCircle size={20} className="text-main mb-2" />
                          <div className="h5 mb-1 text-main">{completedLessons}</div>
                          <div className="small text-muted">Attended Sessions</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="about-bubble p-3 text-center">
                          <Clock size={20} className="text-main mb-2" />
                          <div className="h5 mb-1 text-main">{totalLessons - completedLessons}</div>
                          <div className="small text-muted">Remaining Lessons</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Instructor Info */}
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="section-title mb-3">Your Instructor</h4>

                <div className="d-flex align-items-center mb-3">
                  <img
                    src={course.educator.avatar}
                    alt={course.educator.name}
                    className="avatar-rectangle instructor-avatar me-3"
                  />
                  <div>
                    <h5 className="about-subtitle mb-1">{course.educator.name}</h5>
                    <p className="profile-joined mb-0">{course.educator.title}</p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <div className="about-bubble p-2 text-center">
                      <BadgeCheck size={16} className="text-main mb-1" />
                      <div className="small">{courseDetails?.total_reviews || 'N/A'}</div>
                      <div className="small text-muted">Total Reviews</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="about-bubble p-2 text-center">
                      <Star size={16} className="text-main mb-1" />
                      <div className="small">★ {parseFloat(course.educator.rating).toFixed(1)}</div>
                      <div className="small text-muted">Average Rating</div>
                    </div>
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

export default StudentCourseDetails;
