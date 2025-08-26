import React, { useState, useEffect, useMemo } from "react";
import useStudentProfileData from "../../apis/hooks/student/useStudentProfileData";
import updateStudentProfile from "../../apis/actions/student/updateStudentProfile";
import { NavLink, useParams } from "react-router-dom";
import { pagePaths } from "../../pagePaths";
import useListEnrolledCourses from "../../apis/hooks/student/useListEnrolledCourses";
import useEducatorPublicData from "../../apis/hooks/student/useEducatorPublicData";
import useListCourseModules, { useModuleLessons } from "../../apis/hooks/student/useListCourseModules";
import baseApi from "../../apis/base";

// Hook to fetch assessment attempts
const useAssessmentAttempts = (educatorUsername) => {
  const [attempts, setAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!educatorUsername) return;

    const fetchAttempts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await baseApi.get(`/student/${educatorUsername}/attempts/`);
        setAttempts(response.data || []);
      } catch (err) {
        console.error('Failed to fetch assessment attempts:', err);
        setError('Failed to load assessment attempts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttempts();
  }, [educatorUsername]);

  return { attempts, isLoading, error };
};

/**
 * StudentProfile Component
 */
function StudentProfile() {
  const { educatorUsername } = useParams();
  const { data: studentData, isLoading, error, mutate } = useStudentProfileData();
  const { enrolledInCourses, isLoading: coursesLoading } = useListEnrolledCourses();
  const { data: educatorData } = useEducatorPublicData(educatorUsername);
  const { attempts: assessmentAttempts, isLoading: attemptsLoading, error: attemptsError } = useAssessmentAttempts(educatorUsername);
  
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    profile_picture: null,
    date_of_birth: "",
    address: "",
    country: "",
    city: "",
    gender: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);




  // Calculate real combined analytics from enrolled courses
  const totalCourses = enrolledInCourses?.length || 0;
  
  // State for storing real lesson data and progress
  const [courseProgressData, setCourseProgressData] = useState({});
  const [isCalculatingProgress, setIsCalculatingProgress] = useState(false);
  const [progressError, setProgressError] = useState(null);
  
  // Calculate real analytics by fetching lesson data for each course
  const { totalLessons, totalCompletedLessons, progress } = useMemo(() => {
    if (!enrolledInCourses || enrolledInCourses.length === 0) {
      return { totalLessons: 0, totalCompletedLessons: 0, progress: 0 };
    }
    
    const total = Object.values(courseProgressData).reduce((sum, courseData) => {
      return sum + (courseData.totalLessons || 0);
    }, 0);
    
    const completed = Object.values(courseProgressData).reduce((sum, courseData) => {
      return sum + (courseData.completedLessons || 0);
    }, 0);
    
    const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      totalLessons: total,
      totalCompletedLessons: completed,
      progress: progressPercent
    };
  }, [enrolledInCourses, courseProgressData]);
  
  // Calculate remaining lessons
  const totalSessionsLeft = totalLessons - totalCompletedLessons;
  
  // Fetch lesson data and progress for each enrolled course
  useEffect(() => {
    if (!enrolledInCourses || enrolledInCourses.length === 0) return;
    
    // Create AbortController to cancel previous requests
    const abortController = new AbortController();
    
    const fetchCourseProgress = async () => {
      setIsCalculatingProgress(true);
      setProgressError(null);
      const progressMap = {};
      
      // Add overall timeout for the entire operation
      const overallTimeout = setTimeout(() => {
        abortController.abort();
        setProgressError('Progress calculation timed out. Please try again.');
      }, 30000); // 30 second timeout
      
      try {
        for (const course of enrolledInCourses) {
          // Check if request was aborted
          if (abortController.signal.aborted) {
            console.log('Request aborted, stopping progress calculation');
            return;
          }
          
          try {
            // Get course modules
            const modulesResponse = await baseApi.get(`/courses/${course.id}/modules/`, {
              signal: abortController.signal
            });
            const modules = modulesResponse.data || [];
            
            let totalLessons = 0;
            let completedLessons = 0;
            
            // Get lessons for each module
            for (const module of modules) {
              // Check if request was aborted
              if (abortController.signal.aborted) return;
              
              try {
                const lessonsResponse = await baseApi.get(`/modules/${module.id}/lessons/`, {
                  signal: abortController.signal
                });
                const lessons = lessonsResponse.data || [];
                totalLessons += lessons.length;
                
                // Get lesson statuses (limit concurrent requests and add timeout)
                const lessonStatusPromises = lessons.slice(0, 5).map(async (lesson) => {
                  try {
                    const timeoutId = setTimeout(() => {
                      abortController.abort();
                    }, 10000); // 10 second timeout
                    
                    const statusResponse = await baseApi.get(`/lessons/${lesson.id}/status/`, {
                      signal: abortController.signal
                    });
                    
                    clearTimeout(timeoutId);
                    return statusResponse.data?.is_completed || false;
                  } catch (error) {
                    if (error.code === 'ECONNABORTED') {
                      console.log(`Lesson status request aborted for ${lesson.id}`);
                      return false;
                    }
                    console.error(`Failed to fetch lesson status for ${lesson.id}:`, error);
                    return false;
                  }
                });
                
                // Wait for lesson statuses with timeout
                const lessonStatuses = await Promise.allSettled(lessonStatusPromises);
                completedLessons += lessonStatuses.filter(result => 
                  result.status === 'fulfilled' && result.value
                ).length;
                
              } catch (error) {
                if (error.code === 'ECONNABORTED') {
                  console.log(`Lessons request aborted for module ${module.id}`);
                  break;
                }
                console.error(`Failed to fetch lessons for module ${module.id}:`, error);
              }
            }
            
            // Find the next lesson (first uncompleted lesson)
            let nextLesson = null;
            for (const module of modules) {
              if (abortController.signal.aborted) break;
              
              try {
                const lessonsResponse = await baseApi.get(`/modules/${module.id}/lessons/`, {
                  signal: abortController.signal
                });
                const lessons = lessonsResponse.data || [];
                
                // Find first uncompleted lesson
                for (const lesson of lessons) {
                  try {
                    const statusResponse = await baseApi.get(`/lessons/${lesson.id}/status/`, {
                      signal: abortController.signal
                    });
                    const isCompleted = statusResponse.data?.is_completed || false;
                    
                    if (!isCompleted) {
                      nextLesson = lesson;
                      break;
                    }
                  } catch (error) {
                    if (error.code === 'ECONNABORTED') break;
                    console.error(`Failed to check lesson status for ${lesson.id}:`, error);
                  }
                }
                
                if (nextLesson) break; // Found next lesson, no need to check other modules
                
              } catch (error) {
                if (error.code === 'ECONNABORTED') break;
                console.error(`Failed to fetch lessons for module ${module.id}:`, error);
              }
            }
            
            progressMap[course.id] = {
              totalLessons,
              completedLessons,
              progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
              nextLesson: nextLesson ? {
                id: nextLesson.id,
                title: nextLesson.title || nextLesson.name,
                moduleTitle: nextLesson.module?.title || 'Unknown Module'
              } : null
            };
            
          } catch (error) {
            if (error.code === 'ECONNABORTED') {
              console.log(`Course progress request aborted for ${course.id}`);
              break;
            }
            console.error(`Failed to fetch progress for course ${course.id}:`, error);
            progressMap[course.id] = { totalLessons: 0, completedLessons: 0, progress: 0 };
          }
        }
        
        // Only update state if request wasn't aborted
        if (!abortController.signal.aborted) {
          setCourseProgressData(progressMap);
        }
             } catch (error) {
         if (error.code === 'ECONNABORTED') {
           console.log('Progress calculation aborted');
         } else {
           console.error('Error in progress calculation:', error);
           setProgressError('Failed to calculate progress. Please try again.');
         }
       } finally {
         clearTimeout(overallTimeout);
         if (!abortController.signal.aborted) {
           setIsCalculatingProgress(false);
         }
       }
    };
    
    fetchCourseProgress();
    
    // Cleanup function to abort requests when component unmounts or dependencies change
    return () => {
      abortController.abort();
    };
  }, [enrolledInCourses]);
  
  // Retry progress calculation
  const retryProgressCalculation = () => {
    setProgressError(null);
    // Trigger the useEffect again by changing a dependency
    setCourseProgressData({});
  };
  
  // Find the next lesson from any enrolled course
  const nextCourse = enrolledInCourses?.find(course => {
    const courseData = courseProgressData[course.id];
    return courseData && courseData.completedLessons < courseData.totalLessons;
  });
  
  // Prepare next lesson data
  const nextCourseData = courseProgressData[nextCourse?.id];
  const upcomingLessons = nextCourse ? [{
    topic: nextCourseData?.nextLesson?.title || "Continue learning",
    course: nextCourse.title || nextCourse.name,
    instructor: educatorData?.full_name || educatorUsername,
    date: new Date().toDateString(),
    time: nextCourseData?.nextLesson?.title ? "Next lesson available" : "Continue with your courses"
  }] : [];

  // ===== FORM DATA INITIALIZATION =====
  useEffect(() => {
    if (studentData) {
      setFormData({
        full_name: studentData.student?.full_name || "",
        bio: studentData.student?.bio || "",
        profile_picture: null,
        date_of_birth: studentData.student?.date_of_birth || "",
        address: studentData.student?.address || "",
        country: studentData.student?.country || "",
        city: studentData.student?.city || "",
        gender: studentData.student?.gender || "",
      });
      setProfilePicture(studentData.student?.profile_picture || null);
    }
  }, [studentData]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));

    if (name === "profile_picture") {
      if (files && files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => setProfilePicture(reader.result);
        reader.readAsDataURL(files[0]);
      } else {
        setProfilePicture(null);
      }
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    const dataToSubmit = new FormData();
    for (const key in formData) {
      if (
        formData[key] !== null &&
        formData[key] !== undefined &&
        formData[key] !== ""
      ) {
        dataToSubmit.append(key, formData[key]);
      }
    }
    try {
      await updateStudentProfile(dataToSubmit);
      // Refresh the data after successful update
      if (mutate) {
        mutate();
      }
      alert("Your profile has been updated successfully!");
      setShowEditForm(false);
    } catch {
      alert("Failed to update profile. Please try again.");
    }
  };

  // ===== LOADING AND ERROR STATES =====
  if (isLoading || coursesLoading || isCalculatingProgress) {
    return (
      <div className="profile-root min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="loading-spinner mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="profile-joined">Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-root min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <p className="text-danger">
            {error ? 'Error loading profile data.' : 'Error loading analytics data.'} 
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="profile-root min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <p className="profile-joined">No student data available.</p>
        </div>
      </div>
    );
  }

  return (
		<div className="min-vh-100 profile-root p-4">
			{showEditForm ? (
				<div className="container w-75 d-flex justify-content-center">
					<div className="mt-4 card card-body ">
						<h5 className="fw-bold mb-3 section-title">Edit Profile</h5>
						<form onSubmit={handleSubmitRequest}>
							{/* Full Name */}
							<div className="mb-3">
								<label className="form-label about-subtitle fw-medium">
									Full Name
								</label>
								<input
									type="text"
									className="form-control"
									name="full_name"
									value={formData.full_name}
									onChange={handleInputChange}
									required
								/>
							</div>

							{/* Bio */}
							<div className="mb-3">
								<label className="form-label about-subtitle fw-medium">
									Bio
								</label>
								<textarea
									className="form-control"
									name="bio"
									rows="4"
									value={formData.bio}
									onChange={handleInputChange}
								/>
							</div>

							{/* Profile Picture Upload */}
							<div className="mb-3">
								<label className="form-label about-subtitle fw-medium">
									Profile Picture
								</label>
								<input
									type="file"
									className="form-control"
									name="profile_picture"
									accept="image/*"
									onChange={handleInputChange}
								/>
								{profilePicture && (
									<div className="mt-2">
										<small className="text-muted">Preview:</small>
										<div className="mt-1">
											<img
												src={profilePicture}
												alt="Profile preview"
												style={{ width: 60, height: 60, objectFit: "cover" }}
												className="rounded-circle"
											/>
										</div>
									</div>
								)}
							</div>

							{/* Date of Birth */}
							<div className="mb-3">
								<label className="form-label about-subtitle fw-medium">
									Date of Birth
								</label>
								<input
									type="date"
									className="form-control"
									name="date_of_birth"
									value={formData.date_of_birth}
									onChange={handleInputChange}
								/>
							</div>

							{/* Address */}
							<div className="mb-3">
								<label className="form-label about-subtitle fw-medium">
									Address
								</label>
								<input
									type="text"
									className="form-control"
									name="address"
									value={formData.address}
									onChange={handleInputChange}
								/>
							</div>

							{/* Country */}
							<div className="mb-3">
								<label className="form-label about-subtitle fw-medium">
									Country
								</label>
								<input
									type="text"
									className="form-control"
									name="country"
									value={formData.country}
									onChange={handleInputChange}
								/>
							</div>

							{/* City */}
							<div className="mb-3">
								<label className="form-label about-subtitle fw-medium">
									City
								</label>
								<input
									type="text"
									className="form-control"
									name="city"
									value={formData.city}
									onChange={handleInputChange}
								/>
							</div>

							{/* Gender */}
							<div className="mb-3">
								<label className="form-label about-subtitle fw-medium">
									Gender
								</label>
								<select
									className="form-control"
									name="gender"
									value={formData.gender}
									onChange={handleInputChange}
								>
									<option value="">Select Gender</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
									<option value="Other">Other</option>
								</select>
							</div>

							<button type="submit" className="px-4 btn-edit-profile">
								Submit
							</button>
							<button
								type="button"
								onClick={() => setShowEditForm(false)}
								className="ms-2 px-4 btn-edit-profile"
							>
								Cancel
							</button>
						</form>
					</div>
				</div>
			) : (
				<div className="container-fluid">
					{/* Header */}
					<div className="d-flex justify-content-between align-items-center mb-4">
						<h2 className="fw-bold main-title" tabIndex={0}>
							Student Profile
						</h2>
						<div className="d-flex align-items-center">
							<button
								className="px-4 btn-edit-profile me-2"
								aria-label="Edit Profile"
								onClick={() => setShowEditForm(true)}
							>
								Edit Profile
							</button>
						</div>
					</div>

					<div className="row g-4">
						{/* Profile Card */}
						<div className="col-lg-6">
							<div className="illustration-card shadow-sm">
								<div className="card-body p-4">
									<div className="d-flex align-items-start mb-4">
										<img
											src={
												studentData.student?.profile_picture ||
												"https://placehold.co/120x120?text=Student"
											}
											alt="avatar"
											className="avatar-rectangle profile-avatar me-3"
											style={{
												width: "150px",
												height: "150px",
												objectFit: "cover",
											}}
											aria-label="User avatar"
										/>
										<div>
											<h4 className="fw-bold mb-1 section-title">
												{studentData.student?.full_name}
											</h4>
											<div className="small section-title">Student</div>
											<div className="small section-title">
												Joined{" "}
												{new Date(
													studentData.student?.user?.created_at
												).getFullYear()}
											</div>
										</div>
									</div>

									{/* About Section */}
									<h5 className="fw-bold section-title mb-3">About</h5>
									<div className="row">
										<div className="col-xl-8">
											<div className="d-flex flex-column gap-2">
												{/* ===== REAL DATA FROM HOOK ===== */}
												<div className="d-flex align-items-center px-3">
													<i className="bi bi-person-badge me-2 section-title"></i>
													<div>
														<strong className="me-2 section-title">
															Professor:
														</strong>
														<span className="small section-title">
															{educatorData?.full_name || "Loading..."}
														</span>
													</div>
												</div>
												{/* ===== REAL DATA FROM HOOK ===== */}
												<div className="d-flex align-items-center px-3">
													<i className="bi bi-hash me-2 section-title"></i>
													<strong className="me-2 section-title">Code:</strong>
													<span className="small section-title">
														{studentData.student?.user?.slug || "N/A"}
													</span>
												</div>
												<div className="d-flex align-items-center px-3">
													<i className="bi bi-telephone me-2 section-title"></i>
													<strong className="me-2 section-title">
														Phone 1:
													</strong>
													<span className="small section-title">
														{studentData.student?.user?.phone || "N/A"}
													</span>
												</div>
												<div className="d-flex align-items-center px-3 ">
													<i className="bi bi-telephone-plus me-2 section-title"></i>
													<strong className="me-2 section-title">
														Phone 2:
													</strong>
													<span className="small section-title">
														{studentData.student?.user?.parent_phone || "N/A"}
													</span>
												</div>
											</div>
										</div>

										{/* QR Code */}
										<div className="col-xl-4 d-flex flex-column align-items-center justify-content-center">
											<div className="text-center mb-2">
												<small className="fw-bold fw-medium section-title">
													Student QR
												</small>
											</div>
											<div className="qr-container">
												<img
													src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=StudentProfile:${studentData.student?.user?.slug}`}
													alt="QR Code"
													className="qr-code-img"
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Progress and Next Lessons Column */}
						<div className="col-lg-6">
							{/* Progress Card */}
							<div className="card shadow-sm mb-4">
								<div className="card-body p-4">
									<div className="d-flex justify-content-between align-items-center mb-3">
										<h5 className="fw-bold section-title mb-0">Progress</h5>
									</div>
									                    <div className="d-flex justify-content-between mb-2">
                      <small className="fw-medium section-title">
                        Progress Across All Courses
                      </small>
                      <small className="fw-medium">{progress}%</small>
                    </div>
                    <div
                      className="progress mb-3"
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-label="Overall course completion progress"
                    >
                      <div
                        className="progress-bar progress-bar-filled"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <small
                      className="d-block profile-progress-text section-title"
                      aria-live="polite"
                    >
                      {totalLessons === 0
                        ? "No lessons available yet. Visit your courses to start learning!"
                        : progress === 100
                        ? "Excellent! You've completed all available lessons across all courses."
                        : progress > 50
                        ? `Great progress! You're ${progress}% through your learning journey (${totalCompletedLessons}/${totalLessons} lessons).`
                        : `Keep going! You're ${progress}% through your enrolled courses (${totalCompletedLessons}/${totalLessons} lessons).`}
                    </small>
								</div>
							</div>

							{/* Next Lessons Card */}
							<div className="card shadow-sm">
								<div className="card-body">
									<h5 className="fw-bold section-title mb-3">Next Lessons</h5>
									                  {upcomingLessons.length === 0 ? (
                    <div className="alert alert-info">
                      {enrolledInCourses.length === 0 
                        ? "Not enrolled in any courses yet!" 
                        : totalLessons === 0
                        ? "No lessons available yet. Visit your courses to start learning!"
                        : "All lessons completed! Great job!"}
                    </div>
                  ) : (
										upcomingLessons.map((lesson, idx) => (
											<div key={idx} className="mb-3 about-bubble p-3 rounded">
												<div>
													<strong>{lesson.course}</strong>
												</div>
												<div>
													<span className="fw-medium">{lesson.topic}</span>
												</div>
												{lesson.instructor && (
													<div>
														<span
															className="text-muted"
															style={{ fontSize: 13 }}
														>
															with Professor : {lesson.instructor}
														</span>
													</div>
												)}
												{nextCourseData?.nextLesson?.id && (
													<div className="mt-2">
														<NavLink
															to={pagePaths.student.lessonDetails(
																educatorUsername,
																nextCourse.id,
																nextCourseData.nextLesson.id
															)}
															className="btn-secondary-action"
														>
															Continue Learning
														</NavLink>
													</div>
												)}
											</div>
										))
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Analytics & Enrolled Courses Section */}
					<div className="row mt-4">
						<div className="col-12">
							<h5 className="fw-bold section-title mb-4">
								Your Learning Analytics
							</h5>
							<div className="card shadow-sm">
								<div className="card-body text-center">
									{isCalculatingProgress ? (
										<div className="py-3">
											                    <div className="spinner-border text-main" role="status">
												<span className="visually-hidden">Calculating progress...</span>
											</div>
											<p className="text-muted">Calculating your learning progress...</p>
										</div>
									) : progressError ? (
										<div className="py-3">
											<div className="text-danger">
												<i className="bi bi-exclamation-triangle me-2"></i>
												{progressError}
											</div>
											<button 
												className="btn btn-outline-primary btn-sm"
												onClick={retryProgressCalculation}
											>
												<i className="bi bi-arrow-clockwise me-2"></i>
												Retry
											</button>
										</div>
									) : (
										<>
											<div className="row">
												{/* ===== REAL DATA FROM HOOKS ===== */}
												<div className="col-md-4 section-title border-end">
													<h4>{totalCompletedLessons}</h4>
													<small>Total Lessons Completed</small>
												</div>
												<div className="col-md-4 section-title border-end">
													<h4>{totalSessionsLeft}</h4>
													<small>Total Lessons Remaining</small>
												</div>
												<div className="col-md-4 section-title">
													<h4>{totalCourses}</h4>
													<small>Courses Enrolled</small>
												</div>
											</div>
										</>
									)}
								</div>
							</div>

							<div className="row mt-4">
								{/* Enrolled Courses Section */}
								<div className="col-lg-6">
									<h5 className="fw-bold section-title mb-3">Enrolled Courses</h5>
									<div className="row g-4">
										{enrolledInCourses.length === 0 ? (
											<div className="alert alert-info">
												Not enrolled in any courses yet!
											</div>
										) : (
											enrolledInCourses.map((course) => (
												<div className="col-12" key={course.id}>
													<div className="card h-100 shadow-sm d-flex flex-column">
														{/* Course Image */}
														{course.thumbnail && (
															<img
																src={course.thumbnail}
																alt={course.title || course.name}
																className="card-img-top"
																style={{ height: '200px', objectFit: 'cover' }}
															/>
														)}
														{!course.thumbnail && (
															<div 
																className="card-img-top d-flex align-items-center justify-content-center"
																style={{ 
																	height: '200px', 
																	backgroundColor: '#f8f9fa',
																	color: '#6c757d'
																}}
															>
																<BookOpen size={48} />
															</div>
														)}
														
														<div className="card-body d-flex flex-column">
															<h5 className="section-title mb-2">
																{course.title || course.name}
															</h5>
															
															<p className="text-muted mb-3 flex-grow-1">
																{course.description || "No description available"}
															</p>
															
															<NavLink
																to={pagePaths.student.courseDetails(
																	educatorUsername,
																	course.id
																)}
																className="btn-edit-profile mt-auto"
															>
																View Course
															</NavLink>
														</div>
													</div>
												</div>
											))
										)}
									</div>
								</div>

								{/* Assessment Attempts Section */}
								<div className="col-lg-6">
									<h5 className="fw-bold section-title mb-3">Assessment History</h5>
									<div className="card shadow-sm">
										<div className="card-body">
											{attemptsLoading ? (
												<div className="text-center py-3">
													                        <div className="spinner-border spinner-border-sm text-main" role="status">
														<span className="visually-hidden">Loading...</span>
													</div>
													<small className="text-muted">Loading assessments...</small>
												</div>
											) : attemptsError ? (
												<div className="text-center py-3">
													<div className="text-danger">
														<i className="bi bi-exclamation-triangle me-2"></i>
														<small>{attemptsError}</small>
													</div>
												</div>
											) : assessmentAttempts.length === 0 ? (
												<div className="text-center py-3">
													<small className="text-muted">No assessment attempts yet</small>
												</div>
											) : (
												<div className="assessment-list">
													{assessmentAttempts.slice(0, 5).map((attempt) => (
														<div key={attempt.id} className="assessment-item mb-3 p-3 rounded" 
															 style={{ 
																backgroundColor: attempt.is_passed ? '#d4edda' : '#f8d7da',
																border: `1px solid ${attempt.is_passed ? '#c3e6cb' : '#f5c6cb'}`
															 }}>
															<div className="d-flex justify-content-between align-items-start mb-2">
																<h6 className="mb-1 fw-bold" style={{ fontSize: '0.9rem' }}>
																	{attempt.assessment_title}
																</h6>
																<span className={`badge ${attempt.is_passed ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: '0.7rem' }}>
																	{attempt.is_passed ? 'Passed' : 'Failed'}
																</span>
															</div>
															
															<div className="mb-2">
																<small className="text-muted d-block">
																	<strong>Type:</strong> {attempt.assessment_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
																</small>
																<small className="text-muted d-block">
																	<strong>Score:</strong> {attempt.score}/{attempt.percentage}%
																</small>
																<small className="text-muted d-block">
																	<strong>Time:</strong> {attempt.time_taken}s
																</small>
															</div>
															
															<small className="text-muted">
																{new Date(attempt.started_at).toLocaleDateString()}
															</small>
														</div>
													))}
													
													{assessmentAttempts.length > 5 && (
														<div className="text-center mt-3">
															<small className="text-muted">
																+{assessmentAttempts.length - 5} more attempts
															</small>
														</div>
													)}
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default StudentProfile;
