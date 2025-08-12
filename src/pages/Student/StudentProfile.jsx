import React, { useState, useEffect } from "react";
import useStudentProfileData from "../../apis/hooks/student/useStudentProfileData";
import updateStudentProfile from "../../apis/actions/student/updateStudentProfile";
import { NavLink, useParams } from "react-router-dom";
import { pagePaths } from "../../pagePaths";
import useListEnrolledCourses from "../../apis/hooks/student/useListEnrolledCourses";
function StudentProfile() {
  const { educatorUsername } = useParams();
  const { data: studentData, isLoading, error } = useStudentProfileData();
  const { enrolledInCourses } = useListEnrolledCourses();
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

  // Dummy enrolled courses; replace with your actual API data
  const enrolledCourses = studentData?.enrolled_courses || [
    {
      id: 1,
      name: "Mathematics I",
      instructor: "Mr. Smith",
      progress: 60,
      sessions_attended: 12,
      sessions_total: 20,
      status: "Active",
      next_lesson: { date: "2025-08-11", time: "10:00", topic: "Integrals" },
      average_assignment_rate: 85,
    },
    {
      id: 2,
      name: "English Literature",
      instructor: "Ms. Johnson",
      progress: 40,
      sessions_attended: 8,
      sessions_total: 18,
      status: "Active",
      next_lesson: {
        date: "2025-08-09",
        time: "08:00",
        topic: "Modern Poetry",
      },
      average_assignment_rate: 91,
    },
  ];

  // Analytics calculations
  const totalSessionsAttended = enrolledCourses.reduce(
    (sum, c) => sum + (c.sessions_attended || 0),
    0
  );
  const totalSessionsPlanned = enrolledCourses.reduce(
    (sum, c) => sum + (c.sessions_total || 0),
    0
  );
  const totalSessionsLeft = totalSessionsPlanned - totalSessionsAttended;
  const avgAssignmentRate =
    enrolledCourses.length > 0
      ? (
          enrolledCourses.reduce(
            (sum, c) => sum + (c.average_assignment_rate || 0),
            0
          ) / enrolledCourses.length
        ).toFixed(1)
      : "N/A";
  const progress = 100; // You can compute real progress if you have data

  // Get all upcoming lessons sorted by date/time
  const now = new Date();
  const upcomingLessons = enrolledCourses
    .map((course) => {
      if (course.next_lesson && course.next_lesson.date) {
        return {
          ...course.next_lesson,
          course: course.name,
          instructor: course.instructor,
        };
      }
      return null;
    })
    .filter(
      (lesson) =>
        lesson && new Date(lesson.date + "T" + (lesson.time || "00:00")) > now
    )
    .sort(
      (a, b) =>
        new Date(a.date + "T" + (a.time || "00:00")) -
        new Date(b.date + "T" + (b.time || "00:00"))
    );

  useEffect(() => {
    if (studentData) {
      setFormData({
        full_name: studentData.student.full_name || "",
        bio: studentData.student.bio || "",
        profile_picture: null,
        date_of_birth: studentData.student.date_of_birth || "",
        address: studentData.student.address || "",
        country: studentData.student.country || "",
        city: studentData.student.city || "",
        gender: studentData.student.gender || "",
      });
      setProfilePicture(studentData.student.profile_picture || null);
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
      if (typeof studentData?.mutate === "function") {
        studentData.mutate();
      }
      alert("Your profile has been updated successfully!");
      setShowEditForm(false);
    } catch {
      alert("Failed to update profile. Please try again.");
    }
  };

  if (isLoading) {
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
												studentData.student.profile_picture ||
												"https://placehold.co/120x120?text=Student"
											}
											alt="avatar"
											className="rounded-circle me-3"
											style={{
												width: "100px",
												height: "100px",
												objectFit: "cover",
											}}
											aria-label="User avatar"
										/>
										<div>
											<h4 className="fw-bold mb-1 section-title">
												{studentData.student.full_name}
											</h4>
											<div className="small section-title">Student</div>
											<div className="small section-title">
												Joined{" "}
												{new Date(
													studentData.student.user.created_at
												).getFullYear()}
											</div>
										</div>
									</div>

									{/* About Section */}
									<h5 className="fw-bold section-title mb-3">About</h5>
									<div className="row">
										<div className="col-xl-8">
											<div className="d-flex flex-column gap-2">
												<div className="d-flex align-items-center px-3">
													<i className="bi bi-person-badge me-2 section-title"></i>
													<div>
														<strong className="me-2 section-title">
															Professor:
														</strong>
														<span className="small section-title">N/A</span>
													</div>
												</div>
												<div className="d-flex align-items-center px-3">
													<i className="bi bi-people me-2 section-title"></i>
													<strong className="me-2 section-title">Group:</strong>
													<span className="small section-title">N/A</span>
												</div>
												<div className="d-flex align-items-center px-3">
													<i className="bi bi-mortarboard me-2 section-title"></i>
													<strong className="me-2 section-title">Grade:</strong>
													<span className="small section-title">N/A</span>
												</div>
												<div className="d-flex align-items-center px-3">
													<i className="bi bi-hash me-2 section-title"></i>
													<strong className="me-2 section-title">Code:</strong>
													<span className="small section-title">
														{studentData.student.user.slug}
													</span>
												</div>
												<div className="d-flex align-items-center px-3">
													<i className="bi bi-telephone me-2 section-title"></i>
													<strong className="me-2 section-title">
														Phone 1:
													</strong>
													<span className="small section-title">
														{studentData.student.user.phone}
													</span>
												</div>
												<div className="d-flex align-items-center px-3 ">
													<i className="bi bi-telephone-plus me-2 section-title"></i>
													<strong className="me-2 section-title">
														Phone 2:
													</strong>
													<span className="small section-title">
														{studentData.student.user.parent_phone}
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
													src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=StudentProfile:${studentData.student.user.slug}`}
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
											Overall Course Completion
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
										{progress === 100
											? "You're doing great! Keep up the momentum."
											: "Careful! Missing a few assignments or classes"}
									</small>
								</div>
							</div>

							{/* Next Lessons Card */}
							<div className="card shadow-sm">
								<div className="card-body">
									<h5 className="fw-bold section-title mb-3">Next Lessons</h5>
									{upcomingLessons.length === 0 ? (
										<div className="alert alert-info">No upcoming lessons.</div>
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
															with {lesson.instructor}
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
										<div className="col-md-3 section-title border-end">
											<h4>{totalSessionsAttended}</h4>
											<small>Sessions Attended</small>
										</div>
										<div className="col-md-3 section-title  border-end">
											<h4>{totalSessionsLeft}</h4>
											<small>Sessions Left</small>
										</div>
										<div className="col-md-3 section-title  border-end">
											<h4>{avgAssignmentRate}%</h4>
											<small>Avg. Assignment Rate</small>
										</div>
										<div className="col-md-3 section-title ">
											<h4>
												{upcomingLessons.length > 0
													? upcomingLessons[0].topic
													: "-"}
											</h4>
											<small>Next Lesson Topic</small>
										</div>
									</div>
								</div>
							</div>

							<div className="mb-4">
								<h5 className="fw-bold section-title mb-3">Enrolled Courses</h5>
								<div className="row g-4">
									{enrolledInCourses.length === 0 ? (
										<div className="alert alert-info">
											Not enrolled in any courses yet!
										</div>
									) : (
										enrolledInCourses.map((course) => (
											<div className="col-md-6 col-lg-4" key={course.id}>
												<div className="card h-100 shadow-sm d-flex flex-column">
													<div className="card-body d-flex flex-column">
														<h5 className="section-title mb-2">
															{course.title}
														</h5>
														<div
															className="mb-1 text-muted"
															style={{ fontSize: ".96em" }}
														>
															Instructor:{" "}
															<span className="text-dark">
																{educatorUsername}
															</span>
														</div>

														<div className="mb-2">
															<strong>Progress:</strong>{" "}
															{(+studentData.completed_lessons /
																(+course.total_lessons || 1)) *
																100}
															%
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
																		width: `${
																			(+studentData.completed_lessons /
																				(+course.total_lessons || 1)) *
																			100
																		}%`,
																		backgroundColor:
																			"var(--color-primary-dark)",
																		borderRadius: "var(--border-radius-sm)",
																	}}
																/>
															</div>
														</div>
														<div className="mb-1">
															<strong>Sessions:&nbsp;</strong>
															{studentData.completed_lessons } /{" "}
															{course.total_lessons}
														</div>
														<div className="mb-1">
															<strong>Avg. Assignment Rate:&nbsp;</strong>
															{course.average_assignment_rate}%
														</div>
														<div className="mb-1">
															<strong>Next Lesson:&nbsp;</strong>
															{course.next_lesson && course.next_lesson.topic
																? course.next_lesson.topic
																: "-"}
														</div>
														<NavLink
															to={pagePaths.student.courseDetails(
																educatorUsername,
																course.id
															)}
															className="btn-edit-profile mt-auto"
														>
															View
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
