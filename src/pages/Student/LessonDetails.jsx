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
import useListCourseModules from "../../apis/hooks/student/useListCourseModules";
import useEducatorPublicData from "../../apis/hooks/student/useEducatorPublicData";
import useListEnrolledCourses from "../../apis/hooks/student/useListEnrolledCourses";
import useGetLessonDetails from "../../apis/hooks/student/useGetLessonDetails";
import useLessonStatus from "../../apis/hooks/student/useLessonStatus";

function LessonDetails() {
  const params = useParams();
  const { educatorUsername, courseId, lessonId } = params;
  const navigate = useNavigate();
  const location = useLocation();



  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data: courseDetails, isLoading: courseLoading, error: courseError } = useGetCourseDetails(courseId);
  const { courseModules, isLoading: modulesLoading } = useListCourseModules(courseId);
  const { data: educatorData } = useEducatorPublicData(educatorUsername);
  const { enrolledInCourses, isLoading: enrolledLoading } = useListEnrolledCourses();
  const { lessonData: apiLessonData, isLoading: lessonLoading, error: lessonError } = useGetLessonDetails(lessonId);
  const { lessonStatus, isLoading: statusLoading, markLessonComplete, isCompleted, error: statusError } = useLessonStatus(lessonId);

  const currentLesson = React.useMemo(() => {
    if (!courseModules || !lessonId) {
      return null;
    }

    // Method 0: Use API lesson data first (most reliable and complete)
    if (apiLessonData) {
      return {
        id: apiLessonData.id,
        title: apiLessonData.title || "Lesson Content",
        description: apiLessonData.description || "This is a detailed description of the lesson content.",
        duration: apiLessonData.duration ? `${apiLessonData.duration} min` : "25 min",
        videoUrl: apiLessonData.playback_info || "",

        completed: isCompleted, // From lesson status API
        module: courseModules.find(m => m.id === apiLessonData.module) || courseModules[0],
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
        duration: foundLesson.duration || "25 min",
        videoUrl: foundLesson.playback_info || foundLesson.videoUrl || foundLesson.video_url || "",

        completed: foundLesson.completed || foundLesson.is_completed || false,
        module: courseModules.find(m => m.id === foundLesson.module) || courseModules[0]
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
              duration: lesson.duration || "25 min",
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
      duration: "25 min",
      videoUrl: "",
      completed: false,
      module: courseModules[0] || null
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
                <div className="position-relative video-container" style={{ backgroundColor: '#000' }}>
                  <video
                    ref={videoRef}
                    className="w-100"
                    style={{ height: '400px', objectFit: 'contain' }}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={async () => {
                      setIsPlaying(false);
                      // Auto-mark lesson as complete when video ends
                      try {
                        await markLessonComplete();
                      } catch (error) {
                        console.error('Failed to auto-mark lesson complete:', error);
                      }
                    }}
                  >
                    <source src={currentLesson.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  <div className="video-controls-overlay">

                    <div className="video-controls d-flex align-items-center justify-content-between p-3">
                      <div className="d-flex align-items-center gap-3">
                        <button
                          className="btn btn-sm text-white"
                          onClick={togglePlay}
                          style={{ background: 'none', border: 'none' }}
                        >
                          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                        </button>


                      </div>

                      <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center">
                          <Volume2 size={16} className="text-white me-2" />
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="form-range"
                            style={{ width: '80px' }}
                          />
                        </div>

                        <button
                          className="btn btn-sm text-white"
                          onClick={toggleFullscreen}
                          style={{ background: 'none', border: 'none' }}
                        >
                          <Maximize size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="d-flex gap-2 mt-4 pt-4 border-top">
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
                  {apiLessonData?.document_url && (
                    <a 
                      href={apiLessonData.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary-action text-decoration-none"
                    >
                      <FileText size={16} className="me-2" />
                      Resources
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

          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="section-title mb-3">Lesson Information</h4>

                <div className="about-bubble p-3 mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <Clock size={16} className="me-2 text-primary" />
                    <span className="about-subtitle">Duration</span>
                  </div>
                  <p className="mb-0 profile-joined">{currentLesson.duration}</p>
                </div>

                <div className="about-bubble p-3 mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <BookOpen size={16} className="me-2 text-primary" />
                    <span className="about-subtitle">Module</span>
                  </div>
                  <p className="mb-0 profile-joined">{currentLesson.module?.title || 'N/A'}</p>
                </div>

                <div className="about-bubble p-3">
                  <div className="d-flex align-items-center mb-2">
                    <CheckCircle size={16} className="me-2 text-primary" />
                    <span className="about-subtitle">Status</span>
                  </div>
                  <p className="mb-0">
                    <span className={`badge ${isCompleted ? 'bg-success' : 'bg-warning'}`}>
                      {isCompleted ? 'Completed' : 'In Progress'}
                    </span>
                  </p>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonDetails;
