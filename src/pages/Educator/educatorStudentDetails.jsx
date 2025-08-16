import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import useEducatorStudentProfileData from "../../apis/hooks/educator/useEducatorStudentProfileData";
import MainLoader from "../../components/common/MainLoader";
import toggleBlockStudentApi from "../../apis/actions/educator/toggleBlockStudent";

function StudentProfile() {
  const { studentId } = useParams();
  const { isLoading, error, data, mutate } = useEducatorStudentProfileData(studentId);
  // Removed useEducatorProfileData as it's not used for student details
  // Removed isBlocked state as we will rely on data?.is_active

  if (isLoading) {
    return <MainLoader />;
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        Error loading student profile: {error.message}
      </div>
    );
  }

  const notes = data?.notes;
  const completedLessons = data?.completed_lessons;
  const numberOfEnrollmentCourses = data?.number_of_enrollment_courses;

  const formData = {
    name: data?.student?.full_name || "N/A",
    phone1: data?.student?.user?.phone || "N/A",
    phone2: data?.student?.user?.parent_phone || "N/A",
    notes: notes || "",
    profileImage: data?.student?.profile_picture || "https://placehold.co/120x120?text=Student",
  };

  const progress = numberOfEnrollmentCourses > 0 ? Math.round((completedLessons / numberOfEnrollmentCourses) * 100) : 0;

  // Dummy data for missingItems and examsHistory as they are not in the provided hook data structure
  const missingItems = [
    { type: "assignment", message: "Algebra Homework #2 is overdue" },
    { type: "class", message: "Missed Calculus lecture on Wednesday" },
    { type: "assignment", message: "Mechanics Project submission is pending" },
  ];

  const examsHistory = [
    { date: "2023-05-10", subject: "Algebra", score: 85, status: "Passed" },
    { date: "2023-06-15", subject: "Calculus", score: 70, status: "Passed" },
    { date: "2023-07-20", subject: "Mechanics", score: 55, status: "Failed" },
  ];


  const toggleBlockStudent = () => {
    setIsBlocked((prev) => !prev);
    alert(`Student has been ${!isBlocked ? "blocked" : "unblocked"}.`);
  };

  return (
		<div className="min-vh-100 profile-root p-4">
			<div className="container-fluid">
				{/* Header */}
				<div className="d-flex justify-content-between align-items-center mb-4">
					<h2 className="fw-bold main-title" tabIndex={0}>
						Student Profile
					</h2>
					<div className="d-flex align-items-center">
						{/* Block/Unblock Button */}
						<button
							className={`px-4 btn-secondary-danger ${
								!data?.is_active ? "btn-danger" : "btn-outline-danger"
							}`}
							onClick={toggleBlockStudent}
						>
							{!data?.is_active ? "Unblock Student" : "Block Student"}
						</button>
						{/* Back Button */}
						<button
							className="btn btn-edit-profile ms-3 px-4"
							onClick={() => window.history.back()}
						>
							<i className="bi bi-arrow-left me-2"></i> Back
						</button>
					</div>
				</div>

				{/* First Row */}
				<div className="row g-4">
					{/* Info Card */}
					<div className="col-lg-6">
						<div className="illustration-card shadow-sm">
							<div className="card-body p-4">
								<div className="d-flex align-items-start mb-4">
									<img
										src={formData.profileImage}
										alt="avatar"
										className="rounded-circle me-3"
										style={{ width: "100px", height: "100px" }}
									/>
									<div>
										<h4 className="fw-bold mb-1 profile-main-title">
											{formData.name}
										</h4>
										<div className="small">Student</div>
										<div className="small">
											Joined {new Date(data?.enrollment_date).toLocaleDateString()}
										</div>
									</div>
								</div>

								<h5 className="fw-bold section-title mb-3">About</h5>
								<div className="row">
									<div className="col-xl-8">
										<div className="d-flex flex-column gap-2">
                        <div className="d-flex align-items-center px-3">
                          <i className="bi bi-info-circle me-2 text-primary"></i>
                          <strong className="me-2">Bio:</strong>
                          <span className="small">{data?.student?.bio || "N/A"}</span>
                        </div>
                        <div className="d-flex align-items-center px-3">
                          <i className="bi bi-calendar me-2 text-primary"></i>
                          <strong className="me-2">Date of Birth:</strong>
                          <span className="small">{data?.student?.date_of_birth ? new Date(data?.student.date_of_birth).toLocaleDateString() : "N/A"}</span>
                        </div>
                        <div className="d-flex align-items-center px-3">
                          <i className="bi bi-house me-2 text-primary"></i>
                          <strong className="me-2">Address:</strong>
                          <span className="small">{data?.student?.address || "N/A"}</span>
                        </div>
                        <div className="d-flex align-items-center px-3">
                          <i className="bi bi-geo-alt me-2 text-primary"></i>
                          <strong className="me-2">City:</strong>
                          <span className="small">{data?.student?.city || "N/A"}</span>
                        </div>
                        <div className="d-flex align-items-center px-3">
                          <i className="bi bi-gender-ambiguous me-2 text-primary"></i>
                          <strong className="me-2">Gender:</strong>
                          <span className="small">{data?.student?.gender || "N/A"}</span>
                        </div>
											<div className="d-flex align-items-center px-3">
												<i className="bi bi-telephone me-2 text-primary"></i>
												<strong className="me-2">Phone:</strong>
												<span className="small">{formData.phone1}</span>
											</div>
											<div className="d-flex align-items-center px-3">
												<i className="bi bi-telephone-plus me-2 text-primary"></i>
												<strong className="me-2">Parent Phone:</strong>
												<span className="small">{formData.phone2}</span>
											</div>
										</div>
									</div>

									<div className="col-xl-4 d-flex flex-column align-items-center justify-content-center">
										<div className="text-center mb-2">
											<small className="fw-bold fw-medium">Student QR</small>
										</div>
										<img
											src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=StudentProfile:${data?.student?.user?.username}`}
											alt="QR Code"
											className="qr-code-img"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Right Cards */}
					<div className="col-lg-6">
						{/* Progress */}
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
								>
									<div
										className="progress-bar progress-bar-filled"
										style={{ width: `${progress}%` }}
									/>
								</div>

								<small
									className={`d-block profile-progress-text ${
										progress === 100 ? "text-primary" : "text-danger"
									}`}
								>
									{progress === 100
										? "Student has completed all coursework."
										: "Student has pending assignments or classes."}
								</small>
							</div>
						</div>

						{/* Missing Assignments */}
						<div className="card shadow-sm mb-4">
							<div className="card-body p-4">
								<h5 className="fw-bold mb-3 section-title">
									Missing Classes / Assignments
								</h5>
								{missingItems.length === 0 ? (
									<div className="alert alert-primary">
										🎉 No missing classes or assignments right now!
									</div>
								) : (
									<div className="list-group">
										{missingItems.map((item, idx) => (
											<div
												key={idx}
												className="about-bubble px-3 py-2 mb-2 d-flex align-items-center"
											>
												<span className="badge text-primary border border-primary me-2">
													{item.type === "assignment" ? "Assignment" : "Class"}
												</span>
												<div className="flex-grow-1">{item.message}</div>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Exams History - NEW FULL WIDTH ROW */}
				<div className="row mt-4">
					<div className="col-12">
						<div className="card shadow-sm">
							<div className="card-body">
								<h5 className="fw-bold mb-3 section-title">Exams History</h5>
								{examsHistory.length === 0 ? (
									<div className="alert alert-secondary">
										No exams history available.
									</div>
								) : (
									<div className="table-responsive">
										<table className="table table-borderless">
											<thead>
												<tr>
													<th>Date</th>
													<th>Subject</th>
													<th>Score</th>
													<th>Status</th>
												</tr>
											</thead>
											<tbody>
												{examsHistory.map((exam, idx) => (
													<tr key={idx}>
														<td>{new Date(exam.date).toLocaleDateString()}</td>
														<td>{exam.subject}</td>
														<td>{exam.score}%</td>
														<td>
															<span
																className={`badge ${
																	exam.status === "Passed"
																		? "bg-success"
																		: "bg-danger"
																}`}
															>
																{exam.status}
															</span>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default StudentProfile;
