import React, { useState, useEffect } from "react";
import useStudentProfileData from "../../apis/hooks/student/useStudentProfileData";
import updateStudentProfile from "../../apis/actions/student/updateStudentProfile";
import { NavLink, useParams } from "react-router-dom";
import { pagePaths } from "../../pagePaths";
import useListEnrolledCourses from "../../apis/hooks/student/useListEnrolledCourses";
import useEducatorPublicData from "../../apis/hooks/student/useEducatorPublicData";
import useStudentCourseAnalytics from "../../apis/hooks/student/useStudentCourseAnalytics";

/**
 * StudentProfile Component
 */
function StudentProfile() {
  const { educatorUsername } = useParams();
  const { data: studentData, isLoading, error, mutate } = useStudentProfileData();
  const { enrolledInCourses, isLoading: coursesLoading } = useListEnrolledCourses();
  const { data: educatorData } = useEducatorPublicData(educatorUsername);
  const { analytics, isLoading: analyticsLoading, error: analyticsError } = useStudentCourseAnalytics();
  
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




  // Use analytics data from the new hook
  const {
    totalCourses,
    totalLessons,
    totalCompletedLessons,
    overallProgress,
    totalEnrollments,
    averageRating,
    totalReviews,
    totalDuration,
    nextLesson,
    courses: enrolledCourses
  } = analytics;

  // Calculate remaining lessons
  const totalSessionsLeft = totalLessons - totalCompletedLessons;
  
  // Calculate progress percentage
  const progress = overallProgress;
  // Prepare next lesson data
  const upcomingLessons = nextLesson ? [{
    topic: nextLesson.title,
    course: nextLesson.course,
    instructor: educatorData?.full_name || educatorUsername,
    date: new Date().toDateString(),
    time: "10:00 AM"
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
  if (isLoading || analyticsLoading) {
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

  if (error || analyticsError) {
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
                      {enrolledCourses.length === 0 
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
							<div className="card shadow-sm mb-4">
								<div className="card-body text-center">
									<div className="row">
										{/* ===== REAL DATA FROM HOOKS ===== */}
										                    <div className="col-md-3 section-title border-end">
                      <h4>{totalCompletedLessons}</h4>
                      <small>Total Lessons Completed</small>
                    </div>
                    <div className="col-md-3 section-title  border-end">
                      <h4>{totalSessionsLeft}</h4>
                      <small>Total Lessons Remaining</small>
                    </div>
                    <div className="col-md-3 section-title  border-end">
                      <h4>{totalCourses}</h4>
                      <small>Courses Enrolled</small>
                    </div>
										                    <div className="col-md-3 section-title ">
                      <h4>
                        {upcomingLessons.length > 0
                          ? upcomingLessons[0].topic
                          : "No upcoming lessons"}
                      </h4>
                      <small className="text-muted">
                        {upcomingLessons.length > 0
                          ? upcomingLessons[0].course
                          : "No course"}
                      </small>
                    </div>
									</div>
								</div>
							</div>

							<div className="mb-4">
								<h5 className="fw-bold section-title mb-3">Enrolled Courses</h5>
								<div className="row g-4">
									{enrolledCourses.length === 0 ? (
										<div className="alert alert-info">
											Not enrolled in any courses yet!
										</div>
									) : (
										enrolledCourses.map((course) => (
											<div className="col-md-6 col-lg-4" key={course.id}>
												<div className="card h-100 shadow-sm d-flex flex-column">
													<div className="card-body d-flex flex-column">
														<h5 className="section-title mb-2">
															{course.title || course.name}
														</h5>
														<div
															className="mb-1 text-muted"
															style={{ fontSize: ".96em" }}
														>
															Instructor:{" "}
															<span className="text-dark">
																{educatorData?.full_name || educatorUsername}
															</span>
														</div>

														                        <div className="mb-2">
                          <strong>Progress:</strong>{" "}
                          {course.progress || 0}%
                          <div
                            className="progress mt-1"
                            style={{
                              height: 6,
                              backgroundColor: "#e0e0e0",
                              borderRadius: "var(--border-radius-sm)",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              className="progress-bar progress-bar-filled"
                              style={{
                                width: `${Math.min(course.progress || 0, 100)}%`,
                                backgroundColor:
                                  "var(--color-primary-dark)",
                                borderRadius: "var(--border-radius-sm)",
                              }}
                            />
                          </div>
                        </div>
                        
                        <div className="mb-1">
                          <strong>Lessons:&nbsp;</strong>
                          {course.completed_lessons || 0}/{course.total_lessons || 0}
                        </div>
                        <div className="mb-1">
                          <strong>Category:&nbsp;</strong>
                          {course.category?.name || "N/A"}
                        </div>
                        <div className="mb-1">
                          <strong>Total Duration:&nbsp;</strong>
                          {totalDuration} min
                        </div>
                        
                        <div className="mb-1">
                          <strong>Next Lesson:&nbsp;</strong>
                          {course.next_lesson && course.next_lesson.topic
                            ? course.next_lesson.topic
                            : "No upcoming lessons"}
                        </div>
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
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default StudentProfile;
