import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  Maximize,
  Clock,
  BookOpen,
  CheckCircle,
  FileText,

} from "lucide-react";
import { pagePaths } from "../../pagePaths";
import useGetCourseDetails from "../../apis/hooks/student/useGetCourseDetails";
import useListCourseModules, { useModuleLessons } from "../../apis/hooks/student/useListCourseModules";
import useEducatorPublicData from "../../apis/hooks/student/useEducatorPublicData";
import useListEnrolledCourses from "../../apis/hooks/student/useListEnrolledCourses";
import useGetLessonDetails from "../../apis/hooks/student/useGetLessonDetails";
import useLessonStatus from "../../apis/hooks/student/useLessonStatus";

function LessonDetails() {
  const params = useParams();
  const { educatorUsername, courseId, lessonId } = params;
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to format duration from seconds to human-readable format
  const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return "Duration not available";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };



  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data: courseDetails, isLoading: courseLoading, error: courseError } = useGetCourseDetails(courseId);
  const { courseModules, isLoading: modulesLoading } = useListCourseModules(courseId);
  const { data: educatorData } = useEducatorPublicData(educatorUsername);
  const { enrolledInCourses, isLoading: enrolledLoading } = useListEnrolledCourses();
  const { lessonData: apiLessonData, isLoading: lessonLoading, error: lessonError } = useGetLessonDetails(lessonId);
  const { lessonStatus, isLoading: statusLoading, markLessonComplete, isCompleted, error: statusError } = useLessonStatus(lessonId);

  // Fetch lessons for each module
  const moduleIds = courseModules ? courseModules.map(module => module.id) : [];
  const { lessons: firstModuleLessons } = useModuleLessons(moduleIds[0]);
  const { lessons: secondModuleLessons } = useModuleLessons(moduleIds[1]);
  const { lessons: thirdModuleLessons } = useModuleLessons(moduleIds[2]);
  const { lessons: fourthModuleLessons } = useModuleLessons(moduleIds[3]);
  const { lessons: fifthModuleLessons } = useModuleLessons(moduleIds[4]);
  const { lessons: sixthModuleLessons } = useModuleLessons(moduleIds[5]);

  // Create a map of module lessons for easy access
  const moduleLessonsMap = React.useMemo(() => {
    const map = {};
    if (firstModuleLessons) map[moduleIds[0]] = firstModuleLessons;
    if (secondModuleLessons) map[moduleIds[1]] = secondModuleLessons;
    if (thirdModuleLessons) map[moduleIds[2]] = thirdModuleLessons;
    if (fourthModuleLessons) map[moduleIds[3]] = fourthModuleLessons;
    if (fifthModuleLessons) map[moduleIds[4]] = fifthModuleLessons;
    if (sixthModuleLessons) map[moduleIds[5]] = sixthModuleLessons;
    return map;
  }, [moduleIds, firstModuleLessons, secondModuleLessons, thirdModuleLessons, fourthModuleLessons, fifthModuleLessons, sixthModuleLessons]);

  const currentLesson = React.useMemo(() => {
    if (!courseModules || !lessonId) {
      return null;
    }

    // Helper function to find which module contains a specific lesson
    const findModuleForLesson = (targetLessonId) => {
      for (const module of courseModules) {
        // Check if this module contains the lesson
        if (moduleLessonsMap[module.id]) {
          const hasLesson = moduleLessonsMap[module.id].some(lesson => lesson.id === targetLessonId);
          if (hasLesson) {
            return module;
          }
        }
      }
      return courseModules[0]; // fallback
    };

    // Method 0: Use API lesson data first (most reliable and complete)
    if (apiLessonData) {
      return {
        id: apiLessonData.id,
        title: apiLessonData.title || "Lesson Content",
        description: apiLessonData.description || "This is a detailed description of the lesson content.",
        duration: apiLessonData.duration ? formatDuration(apiLessonData.duration) : "Duration not available",
        videoUrl: apiLessonData.playback_info || "",
        otp: apiLessonData.otp || "",
        playbackInfo: apiLessonData.playback_info || "",

        completed: isCompleted, // From lesson status API
        module: findModuleForLesson(apiLessonData.id),
        order: apiLessonData.order,
        is_published: apiLessonData.is_published,
        is_free: apiLessonData.is_free,
        document_url: apiLessonData.document_url,
        thumbnail_url: apiLessonData.thumbnail_url,
        created_at: apiLessonData.created_at
      };
    }

    // Method 1: Check navigation state (fallback)
    if (location.state && location.state.lessonData) {
      const foundLesson = location.state.lessonData;
      return {
        id: foundLesson.id,
        title: foundLesson.title || foundLesson.name || foundLesson.lesson_title || "Lesson Content",
        description: foundLesson.description || foundLesson.lesson_description || "This is a detailed description of the lesson content.",
        duration: foundLesson.duration ? formatDuration(foundLesson.duration) : "Duration not available",
        videoUrl: foundLesson.playback_info || foundLesson.videoUrl || foundLesson.video_url || "",
        otp: foundLesson.otp || "",
        playbackInfo: foundLesson.playback_info || "",

        completed: foundLesson.completed || foundLesson.is_completed || false,
        module: findModuleForLesson(foundLesson.id)
      };
    }

    // Method 2: Search through courseModules for lessons
    if (courseModules) {
      for (const module of courseModules) {
        // Check if module has lessons property
        if (module.lessons && Array.isArray(module.lessons)) {
          const lesson = module.lessons.find(l => l.id === lessonId);
          if (lesson) {
            return {
              id: lesson.id,
              title: lesson.title || "Lesson Content",
              description: lesson.description || "This is a detailed description of the lesson content.",
              duration: lesson.duration ? formatDuration(lesson.duration) : "Duration not available",
              content: lesson.content || "Lesson content will be displayed here.",
              completed: lesson.completed || lesson.is_completed || false,
              module: courseModules.find(m => m.id === lesson.module) || courseModules[0]
            };
          }
        }

        // Check if module has chapterLessons property (from tableOfContents)
        if (module.chapterLessons && Array.isArray(module.chapterLessons)) {
          const lesson = module.chapterLessons.find(l => l.id === lessonId);
          if (lesson) {
            return {
              id: lesson.id,
              title: lesson.title || "Lesson Content",
              description: lesson.description || "This is a detailed description of the lesson content.",
              videoUrl: lesson.playback_info || lesson.videoUrl || "",
        otp: lesson.otp || "",
        playbackInfo: lesson.playback_info || "",
              content: lesson.content || "Lesson content will be displayed here.",
              completed: lesson.completed || lesson.is_completed || false,
              module: courseModules.find(m => m.id === lesson.module) || courseModules[0]
            };
          }
        }
      }
    }

    // If still not found, create a fallback lesson object
    return {
      id: lessonId,
      title: "Lesson Content",
      description: "This is a detailed description of the lesson content.",
      duration: "Duration not available",
      videoUrl: "",
      otp: "",
      playbackInfo: "",
      completed: false,
      module: findModuleForLesson(lessonId)
    };
  }, [courseModules, lessonId, courseDetails, location.state, apiLessonData]);

  const isEnrolled = enrolledInCourses?.some(course => course.id === courseId) || false;
  const hasCourseAccess = courseDetails?.is_free || isEnrolled;

  const videoRef = React.useRef(null);
  const containerRef = React.useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (courseLoading || modulesLoading || enrolledLoading || lessonLoading || statusLoading) {
    return (
      <div className="profile-root min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="loading-spinner mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="profile-joined">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (courseError || !currentLesson) {
    return (
      <div className="profile-root min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2 className="main-title mb-3">Lesson Not Found</h2>
          <p className="profile-joined mb-4">
            Sorry, we couldn't find the lesson you're looking for.
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

  if (!hasCourseAccess) {
    return (
      <div className="profile-root min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2 className="main-title mb-3">Enrollment Required</h2>
          <p className="profile-joined mb-4">
            You need to enroll in this course to access lesson content.
          </p>
          <button
            className="btn-edit-profile"
            onClick={() => navigate(pagePaths.student.courseDetails(educatorUsername, courseId))}
          >
            <BookOpen size={16} className="me-2" />
            Enroll in Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-root">
      <div className="card border-0 shadow-sm">
        <div className="container py-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="header-avatar me-2">
                <BookOpen size={20} />
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="section-title mb-0">{currentLesson.title}</span>
                  {isCompleted && (
                    <span className="badge bg-success">
                      <CheckCircle size={14} className="me-1" />
                      Completed
                    </span>
                  )}
                </div>
                <p className="profile-role mb-0">
                  {courseDetails?.title || 'Course'} • by {educatorData?.full_name || educatorUsername}
                </p>
              </div>
            </div>
            <button
              className="btn-edit-profile d-flex align-items-center"
              onClick={() => navigate(pagePaths.student.courseDetails(educatorUsername, courseId))}
            >
              <ArrowLeft size={16} className="me-2" />
              Back to Course
            </button>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-body p-0">
                <div className="position-relative video-container" style={{ 
                  backgroundColor: '#000',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  {currentLesson.otp && currentLesson.playbackInfo ? (
                    <div className="position-relative">
                      <iframe 
                        src={`https://player.vdocipher.com/v2/?otp=${currentLesson.otp}&playbackInfo=${currentLesson.playbackInfo}`}
                        style={{
                          border: 0,
                          height: '400px',
                          width: '100%',
                          maxWidth: '100%'
                        }}
                        allowFullScreen={true}
                        allow="encrypted-media"
                        title={currentLesson.title || "Lesson Video"}
                        onLoad={() => console.log('VdoCipher iframe loaded successfully')}
                        onError={(e) => console.error('VdoCipher iframe error:', e)}
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center" style={{ height: '400px', color: '#fff' }}>
                      <div className="text-center">
                        <BookOpen size={48} className="mb-3" />
                        <p>Video not available</p>
                        <small>OTP or playback info missing</small>
                      </div>
                    </div>
                  )}                  
                </div>
              </div>
            </div>
            {/* Lesson Description and Actions Card */}
            <div className="card mb-4">
              <div className="card-body">
                {/* Lesson Description */}
                {currentLesson.description && currentLesson.description !== "This is a detailed description of the lesson content." && (
                  <>
                    <h5 className="section-title mb-3">
                      <BookOpen size={20} className="me-2 text-main" />
                      Lesson Description
                    </h5>
                    <div className="about-bubble mb-4" style={{ 
                      backgroundColor: '#f8f9fa', 
                      padding: '1rem', 
                      borderRadius: '8px',
                      border: '1px solid #e9ecef'
                    }}>
                      <p className="mb-0 profile-role" style={{ 
                        lineHeight: '1.6',
                        color: '#495057'
                      }}>
                        {currentLesson.description}
                      </p>
                    </div>
                  </>
                )}
                
                {/* Action Buttons */}
                <div className="d-flex gap-2">
                  {!isCompleted ? (
                    <button 
                      className="btn-edit-profile"
                      onClick={async () => {
                        try {
                          await markLessonComplete();
                        } catch (error) {
                          console.error('Failed to mark lesson complete:', error);
                        }
                      }}
                      disabled={statusLoading}
                    >
                      <CheckCircle size={16} className="me-2" />
                      {statusLoading ? 'Marking...' : 'Mark as Complete'}
                    </button>
                  ) : (
                    <button className="btn-edit-profile" disabled style={{ opacity: 0.6 }}>
                      <CheckCircle size={16} className="me-2" />
                      Completed ✓
                    </button>
                  )}
                  
                  {currentLesson.document_url && (
                    <a 
                      href={currentLesson.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary-action text-decoration-none"
                    >
                      <FileText size={16} className="me-2" />
                      Download Resources
                    </a>
                  )}
                </div>
                
                {/* Error Display */}
                {statusError && (
                  <div className="alert alert-danger mt-3">
                    <strong>Error:</strong> {statusError}
                    {statusError.includes('Authentication') && (
                      <div className="mt-2">
                        <small>Please make sure you are logged in and try again.</small>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Right Sidebar - Fixed Position */}
      <div className="floating-sidebar" 
           style={{
             position: 'fixed',
             right: '20px',
             top: '150px',
             height: 'calc(100vh - 250px)',
             zIndex: 1000,
             transition: 'all 0.3s ease-in-out'
           }}>
        
        {/* Expanded Sidebar (Always Visible) */}
        <div className="sidebar-expanded card" 
             style={{
               width: '320px',
               height: '100%',
               overflow: 'hidden',
               boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
               borderRadius: '8px 0 0 8px'
             }}>
          
          <div className="card-body p-3" style={{ paddingTop: '0' }}>
            {/* Course Content */}
            <div className="sidebar-content">
              <h5 className="section-title mb-3 text-center">Course Content</h5>
              
              {/* Course Navigation */}
              {courseModules && courseModules.length > 0 ? (
                <div className="course-navigation" style={{ height: 'calc(100vh - 350px)', overflowY: 'auto' }}>
                  {courseModules.map((module, moduleIndex) => (
                    <div key={module.id} className="module-section mb-3">
                      {/* Chapter Header */}
                      <div className="about-bubble p-2 rounded mb-2" 
                           style={{ 
                             backgroundColor: currentLesson.module?.id === module.id ? '#e3f2fd' : '#f8f9fa',
                             border: currentLesson.module?.id === module.id ? '2px solid #2196f3' : '1px solid #e9ecef'
                           }}>
                        <h6 className="mb-0 fw-bold text-main" style={{ fontSize: '0.9rem' }}>
                          Ch {moduleIndex + 1}: {module.title}
                        </h6>
                        <small className="text-muted">
                          {(() => {
                            const lessons = moduleLessonsMap[module.id];
                            if (lessons && Array.isArray(lessons)) {
                              return `${lessons.length} lessons`;
                            }
                            return "Loading lessons...";
                          })()}
                        </small>
                      </div>
                      
                      {/* Lessons List */}
                      {(() => {
                        // Get lessons from the moduleLessonsMap
                        const lessons = moduleLessonsMap[module.id];
                        
                        if (lessons && Array.isArray(lessons) && lessons.length > 0) {
                          return (
                            <div className="lessons-list ms-2">
                              {lessons.map((lesson, lessonIndex) => (
                                <div key={lesson.id} className="lesson-item mb-2">
                                  <button
                                    className={`btn btn-sm w-100 text-start d-flex align-items-center justify-content-between ${
                                      lesson.id === currentLesson.id 
                                        ? 'btn-primary' 
                                        : 'btn-outline-secondary'
                                    }`}
                                    onClick={() => navigate(pagePaths.student.lessonDetails(educatorUsername, courseId, lesson.id))}
                                    style={{
                                      fontSize: '0.8rem',
                                      padding: '0.5rem 0.75rem',
                                      borderRadius: '6px',
                                      border: lesson.id === currentLesson.id ? 'none' : '1px solid #dee2e6',
                                      backgroundColor: lesson.id === currentLesson.id ? '#0d6efd' : 'transparent',
                                      color: lesson.id === currentLesson.id ? 'white' : '#495057',
                                      transition: 'all 0.2s ease-in-out',
                                      cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                      if (lesson.id !== currentLesson.id) {
                                        e.target.style.backgroundColor = '#f8f9fa';
                                        e.target.style.borderColor = '#0d6efd';
                                        e.target.style.color = '#0d6efd';
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (lesson.id !== currentLesson.id) {
                                        e.target.style.backgroundColor = 'transparent';
                                        e.target.style.borderColor = '#dee2e6';
                                        e.target.style.color = '#495057';
                                      }
                                    }}
                                  >
                                    <div className="d-flex align-items-center">
                                      <span className="me-2 fw-medium">
                                        {moduleIndex + 1}.{lessonIndex + 1}
                                      </span>
                                      <span className="text-truncate" style={{ maxWidth: '120px' }}>
                                        {lesson.title}
                                      </span>
                                    </div>
                                    
                                    {/* Lesson Status */}
                                    {lesson.completed || lesson.is_completed ? (
                                      <CheckCircle size={14} className="text-success" />
                                    ) : (
                                      <div className="rounded-circle" style={{ 
                                        width: '6px', 
                                        height: '6px', 
                                        backgroundColor: '#dee2e6' 
                                      }} />
                                    )}
                                  </button>
                                </div>
                              ))}
                            </div>
                          );
                        } else {
                          return (
                            <div className="lessons-list ms-2">
                              <div className="text-center py-2">
                                <small className="text-muted">Loading lessons...</small>
                              </div>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3">
                                          <div className="spinner-border spinner-border-sm text-main" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonDetails;