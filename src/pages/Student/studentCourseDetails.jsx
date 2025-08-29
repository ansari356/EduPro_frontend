import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  Info,
} from "lucide-react";
import useGetCourseDetails from "../../apis/hooks/student/useGetCourseDetails";
import useListCourseModules, { useModuleLessons } from "../../apis/hooks/student/useListCourseModules";
import useEducatorPublicData from "../../apis/hooks/student/useEducatorPublicData";
import useCourseProgress from "../../apis/hooks/student/useCourseProgress";
import useListEnrolledCourses from "../../apis/hooks/student/useListEnrolledCourses";
import useAvailableAssessments from "../../apis/hooks/student/useAvailableAssessments";
import useStudentReview from "../../apis/hooks/student/useStudentReview";
import submitCourseRating from "../../apis/actions/student/submitCourseRating";
import { pagePaths } from "../../pagePaths";



/* StudentCourseDetails Component */
function StudentCourseDetails() {
  const { t } = useTranslation();
  const params = useParams();
  const courseId = params.id;
  const educatorUsername = params.educatorUsername;
  const navigate = useNavigate();




  const { data: courseDetails, isLoading: courseLoading, error: courseError } = useGetCourseDetails(courseId);
  const { courseModules, isLoading: modulesLoading } = useListCourseModules(courseId);
  const { data: educatorData } = useEducatorPublicData(educatorUsername);
  const { enrolledInCourses, isLoading: enrolledLoading } = useListEnrolledCourses();
  // Call the hook and get assessments data
  const { assessments, isLoading: assessmentsLoading } = useAvailableAssessments(educatorUsername, courseId);
  console.log('Enrolled courses :', enrolledInCourses);
  // Get student's review for this course
  const { studentReview, hasReview, isLoading: reviewLoading } = useStudentReview(courseId);
  
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
    title: courseDetails.title || courseDetails.course || courseDetails.name || t('student.untitledCourse'),
    description: courseDetails.description || courseDetails.course_description || t('student.courseDescriptionNotAvailable'),
    image: courseDetails.image_url || courseDetails.thumbnail || courseDetails.image || "",
    category: courseDetails.category?.name || courseDetails.category_name || courseDetails.category || t('student.general'),
    totalLessons: courseModules && courseModules.length > 0 ? courseModules.length : (courseDetails.total_lessons || courseDetails.lessons_count || 0),
    duration: courseDetails.total_durations || courseDetails.duration ? `${courseDetails.total_durations || courseDetails.duration} ${t('student.weeks')}` : "N/A",
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
    if (studentReview) {
      setReviewRating(studentReview.rating);
      setReviewComment(studentReview.comment);
      setReviewSubmitted(true);
    } else {
      // Fallback to localStorage if no backend review found
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
    }
  }, [studentReview, courseId]);

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
            <span className="visually-hidden">{t('common.loading')}</span>
          </div>
          <p className="profile-joined">{t('student.loadingCourseData')}</p>
        </div>
      </div>
    );
  }

  // Check if student has access to course content (enrolled or course is free)
  const studentEnrollment = enrolledInCourses?.find(course => course.id === courseId);
  // Check if student has active enrollment with proper access
  const hasActiveEnrollment = studentEnrollment  
  // Check if student has any enrollment (including pending)
  const hasAnyEnrollment = !!studentEnrollment;
  
  // Student has access if course is free OR they have active enrollment
  const hasCourseAccess = courseDetails?.is_free || hasActiveEnrollment;
  
  // Show enrollment message if no access
  const showEnrollmentMessage = !hasCourseAccess;
  
  // Debug logging
  console.log('🔍 Enrollment Debug:', {
    courseId,
    courseIsFree: courseDetails?.is_free,
    studentEnrollment,
    hasActiveEnrollment,
    hasAnyEnrollment,
    hasCourseAccess,
    enrollmentStatus: studentEnrollment?.status,
    accessType: studentEnrollment?.access_type,
    isActive: studentEnrollment?.is_active
  });

  if (courseError || !course) {
    return (
      <div className="profile-root min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2 className="main-title mb-3">{t('student.courseNotFound')}</h2>
          <p className="profile-joined mb-4">
            {t('student.courseNotFoundMessage')}
          </p>
          {courseError && (
            <div className="alert alert-danger mb-3">
              <strong>{t('student.errorDetails')}</strong> {courseError.message || courseError}
            </div>
          )}
          <div className="mb-3">
            <small className="text-muted">
              {t('student.courseId')} {courseId}<br />
              {t('student.educator')} {educatorUsername}<br />
              {t('student.courseDetails')} {courseDetails ? t('student.loaded') : t('student.notLoaded')}<br />
              {t('student.educatorData')} {educatorData ? t('student.loaded') : t('student.notLoaded')}
            </small>
          </div>
          <button
            className="btn-edit-profile"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} className="me-2" />
            {t('student.goBack')}
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
      alert(t('student.openingQuiz', { title: lessonForVideo.title }));
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
      alert(t('student.congratulationsCompleted'));
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
      alert(t('student.pleaseSelectRating'));
      return;
    }

    // Validate comment is not empty
    if (!reviewComment.trim()) {
      alert(t('student.shareThoughts'));
      return;
    }

    // Validate comment length
    if (reviewComment.trim().length < 3) {
      alert(t('student.commentMinLength'));
      return;
    }

    if (reviewComment.trim().length > 500) {
      alert(t('student.commentMaxLength'));
      return;
    }

    // Check if student has access to submit a review
    if (!hasCourseAccess) {
      if (hasAnyEnrollment) {
        alert(t('student.enrollmentPendingReview'));
      } else {
        alert(t('student.mustBeEnrolledToReview'));
      }
      return;
    }

    try {
      const ratingData = {
        rating: reviewRating,
        comment: reviewComment.trim()
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

      // Refresh the review data from the backend
      if (window.location.reload) {
        window.location.reload();
      }

      alert(t('student.thankYouForReview'));

    } catch (error) {
      console.error('Failed to submit review:', error);
      
      // Handle specific error cases based on backend logic
      if (error.response?.status === 403) {
        if (error.response?.data?.detail?.includes("already rated")) {
          alert(t('student.alreadyReviewed'));
          // Refresh the page to show the existing review
          window.location.reload();
        } else if (error.response?.data?.detail?.includes("must have full access") || 
                   error.response?.data?.detail?.includes("enrolled")) {
          if (hasAnyEnrollment) {
            alert(t('student.enrollmentPendingApproval'));
          } else {
            alert(t('student.mustEnrollFirst'));
          }
          // Hide the review form since they can't submit
          setShowReviewForm(false);
        } else {
          alert(t('student.noPermissionToReview'));
        }
      } else {
        alert(t('student.failedToSubmitReview', { error: error.response?.data?.detail || error.message }));
      }
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
              							{t('student.backToCourses')}
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
                    {t('student.overview')}
                  </button>
                  <button
                    className={`btn-link-custom flex-fill text-center py-3 ${activeTab === 'curriculum' ? 'text-accent border-bottom border-primary border-3' : 'profile-joined'}`}
                    onClick={() => setActiveTab('curriculum')}
                  >
                    {t('student.curriculum')}
                  </button>
                  <button
                    className={`btn-link-custom flex-fill text-center py-3 ${activeTab === 'assessments' ? 'text-accent border-bottom border-primary border-3' : 'profile-joined'}`}
                    onClick={() => setActiveTab('assessments')}
                  >
                    {t('student.assessments')}
                  </button>
                  <button
                    className={`btn-link-custom flex-fill text-center py-3 ${activeTab === 'review' ? 'text-accent border-bottom border-primary border-3' : 'profile-joined'}`}
                    onClick={() => setActiveTab('review')}
                  >
                    {t('student.review')}
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="card">
                <div className="card-body">
                  							<h3 className="section-title mb-4">{t('student.courseOverview')}</h3>

                  {/* Enrollment Required Message */}
                  {showEnrollmentMessage && (
                    <div className="alert alert-info mb-4">
                      <div className="d-flex align-items-center">
                        <BookOpen size={20} className="me-2" />
                        <div>
                          <strong>{t('student.enrollmentRequired')}</strong>
                          <br />
                          <small>{t('student.enrollmentRequiredMessage')}</small>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h4 className="about-subtitle mb-2">{t('student.description')}</h4>
                    <p className="about-bubble">{course.description}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="card">
                <div className="card-body">
                  <h3 className="section-title mb-4">{t('student.courseCurriculum')}</h3>
                  {hasModules ? (
                    course.tableOfContents.map((chapter, index) => (
                      <div key={chapter.id} className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h4 className="about-subtitle mb-0">{chapter.chapter}</h4>
                          <div className="d-flex align-items-center">
                            <span className="badge bg-secondary me-2">
                              {chapter.completed}/{chapter.lessons} {t('student.completed')}
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
                            <h6 className="text-muted mb-2">{t('student.lessons')}</h6>
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
                                  <strong>{t('student.enrollmentRequired')}</strong>
                                  <br />
                                  <small>{t('student.enrollmentRequiredForLessons')}</small>
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
                              <span className="text-muted">{t('student.noLessonsAvailableYet')}</span>
                            </div>
                          </div>
                        )}


                      </div>
                    ))
                  ) : (
                    <div className="text-center py-5">
                      <p className="profile-joined">{t('student.noCurriculumAvailable')}</p>
                      <p className="profile-joined">{t('student.checkBackLater')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'assessments' && (
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="section-title mb-0">{t('student.courseAssessments')}</h3>
                  </div>



                  {/* Enrollment Required Message */}
                  {showEnrollmentMessage && (
                    <div className="alert alert-info">
                      <div className="d-flex align-items-center">
                        <BookOpen size={16} className="me-2" />
                        <div>
                          <strong>{t('student.enrollmentRequired')}</strong>
                          <br />
                          <small>{t('student.enrollmentRequiredForAssessments')}</small>
                        </div>
                      </div>
                    </div>
                  )}

                  {assessmentsLoading ? (
                    <div className="text-center py-5">
                      <div className="loading-spinner mb-3" role="status">
                        <span className="visually-hidden">{t('common.loading')}</span>
                      </div>
                      <p className="profile-joined">{t('student.loadingAssessments')}</p>
                    </div>
                  ) : assessments && assessments.length > 0 ? (
                    assessments.map((assessment) => (
                      <div key={assessment.id} className="mb-4">
                        <div className="d-flex align-items-center p-3 mb-3 about-bubble bg-light">
                          <div className="me-3">
                            {assessment.assessment_type === 'quiz' ? (
                              <BarChart3 size={24} className="text-main" />
                            ) : assessment.assessment_type === 'assignment' ? (
                              <Download size={24} className="text-main" />
                            ) : (
                              <BookOpen size={24} className="text-main" />
                            )}
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="about-subtitle mb-1">{assessment.title}</h5>
                            <div className="d-flex align-items-center gap-3 mb-2">
                              {assessment.is_timed && assessment.time_limit && (
                                <small className="profile-joined">
                                  <Clock size={14} className="me-1" />
                                  {assessment.time_limit} min
                                </small>
                              )}
                              <small
                                className="border rounded px-2 py-1"
                                style={{
                                  color: "var(--color-primary)",
                                  borderColor: "var(--color-primary)"
                                }}
                              >
                                {assessment.assessment_type === 'quiz' ? t('student.quiz') : 
                                 assessment.assessment_type === 'assignment' ? t('student.assignment') : 
                                 assessment.assessment_type === 'course_exam' ? t('student.finalExam') : t('student.assessment')}
                              </small>
                              {assessment.total_questions > 0 && (
                                <small className="badge bg-secondary">
                                  {assessment.total_questions} {t('student.questions')}
                                </small>
                              )}
                              {assessment.total_marks > 0 && (
                                <small className="badge bg-secondary">
                                  {assessment.total_marks} {t('student.marks')}
                                </small>
                              )}
                            </div>
                            <small className="text-muted d-block">
                              {assessment.related_to || t('student.courseAssessment')}
                            </small>
                            {assessment.is_timed && (
                              <small className="text-warning d-block mt-1">
                                ⏰ {t('student.timedAssessment')}
                              </small>
                            )}
                            {!assessment.is_available && (
                              <small className="text-danger d-block mt-1">
                                ⚠️ {t('student.assessmentNotAvailable')}
                              </small>
                            )}
                          </div>
                          <div className="d-flex align-items-center">
                            <button
                              className={`btn-edit-profile btn-sm ${!assessment.is_available ? 'disabled' : ''}`}
                              onClick={() => {
                                if (showEnrollmentMessage) {
                                  alert(t('student.pleaseEnrollToAccessAssessments'));
                                } else if (!assessment.is_available) {
                                  alert(t('student.assessmentNotAvailableAtMoment'));
                                } else {
                                  navigate(pagePaths.student.assessmentDetails(educatorUsername, assessment.id), {
                                    state: { assessment }
                                  });
                                }
                              }}
                              disabled={!assessment.is_available}
                            >
                              {assessment.assessment_type === 'quiz' ? 'View' : 
                               assessment.assessment_type === 'assignment' ? 'View' : 
                               'View'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-5">
                      <p className="profile-joined">{t('student.noAssessmentsAvailable')}</p>
                      <p className="profile-joined">{t('student.checkBackLater')}</p>
                    </div>
                  )}


                </div>
              </div>
            )}

            {activeTab === 'review' && (
              <div className="card">
                <div className="card-body">
                  <h3 className="section-title mb-4">{t('student.courseReview')}</h3>



                  {reviewLoading ? (
                    <div className="text-center py-5">
                      <div className="loading-spinner mb-3" role="status">
                        <span className="visually-hidden">{t('common.loading')}</span>
                      </div>
                      <p className="profile-joined">{t('student.loadingReviewData')}</p>
                    </div>
                  ) : hasReview ? (
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
                              className={i < studentReview?.rating ? "text-warning" : "text-muted"}
                              fill={i < studentReview?.rating ? "currentColor" : "none"}
                            />
                          ))}
                        </span>
                        {studentReview?.comment && (
                          <>
                            <br />
                            <strong>Your Comment:</strong> {studentReview.comment}
                          </>
                        )}
                      </p>
                    </div>
                  ) : (
                    <div>
                      {!hasCourseAccess ? (
                        <div className="alert alert-info">
                          <h5 className="alert-heading d-flex align-items-center">
                            <Info size={20} className="me-2" />
                            {hasAnyEnrollment ? 'Enrollment Pending' : 'Enrollment Required'}
                          </h5>
                          <p className="mb-0">
                            {hasAnyEnrollment ? (
                              <>
                                Your enrollment is currently <strong>pending</strong> and needs to be approved by the instructor.
                                <br />
                                <strong>Status:</strong> {studentEnrollment?.status} | <strong>Access:</strong> {studentEnrollment?.access_type}
                                <br />
                                You'll be able to submit a review once your enrollment is approved and activated.
                              </>
                            ) : (
                              <>
                                You need to be enrolled in this course to submit a review. 
                                {!courseDetails?.is_free && (
                                  <>
                                    <br />
                                    													<strong>{t('common.note')}:</strong> {t('student.courseRequiresEnrollment')}
                                  </>
                                )}
                              </>
                            )}
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="profile-joined mb-4">
                            Share your experience with this course to help other students make informed decisions.
                          </p>

                          {!showReviewForm && !hasReview ? (
                            <button
                              className="btn-edit-profile"
                              onClick={() => setShowReviewForm(true)}
                            >
                              <Star size={16} className="me-2" />
                              Write a Review
                            </button>
                          ) : showReviewForm ? (
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
                              Share your thoughts <span className="text-danger">*</span>
                            </label>
                            <textarea
                              className={`form-control ${reviewComment.trim() === '' && reviewComment !== '' ? 'is-invalid' : reviewComment.trim().length > 0 && reviewComment.trim().length < 3 ? 'is-invalid' : reviewComment.trim().length > 500 ? 'is-invalid' : reviewComment.trim().length >= 3 ? 'is-valid' : ''}`}
                              rows="4"
                              placeholder="Tell other students about your experience with this course..."
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              required
                            />
                            <div className="d-flex justify-content-between align-items-center mt-1">
                              <small className={`${reviewComment.trim().length < 3 ? 'text-danger' : reviewComment.trim().length > 500 ? 'text-danger' : reviewComment.trim().length >= 3 ? 'text-success' : 'text-muted'}`}>
                                {reviewComment.trim().length < 3 ? 'Comment too short' : reviewComment.trim().length > 500 ? 'Comment too long' : reviewComment.trim().length >= 3 ? 'Comment looks good!' : 'Minimum 3 characters required'}
                              </small>
                              <small className={`${reviewComment.trim().length > 500 ? 'text-danger' : 'text-muted'}`}>
                                {reviewComment.trim().length}/500 characters
                              </small>
                            </div>
                            {reviewComment.trim() === '' && reviewComment !== '' && (
                              <div className="invalid-feedback">
                                Please share your thoughts about this course.
                              </div>
                            )}
                            {reviewComment.trim().length > 0 && reviewComment.trim().length < 3 && (
                              <div className="invalid-feedback">
                                Comment must be at least 3 characters long.
                              </div>
                            )}
                          </div>

                          <div className="d-flex gap-2">
                            <button
                              type="submit"
                              className="btn-edit-profile"
                              disabled={reviewRating === 0 || !reviewComment.trim() || reviewComment.trim().length < 3 || reviewComment.trim().length > 500}
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
                      ) : null}
                        </>
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
