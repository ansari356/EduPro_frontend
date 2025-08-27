import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import useEducatorStudentProfileData from "../../apis/hooks/educator/useEducatorStudentProfileData";
import useEducatorProfileData from "../../apis/hooks/educator/useEducatorProfileData";
import useStudentAssessmentAttempts from "../../apis/hooks/educator/useStudentAssessmentAttempts";
import useStudentEnrollments from "../../apis/hooks/educator/useStudentEnrollments";
// Removed problematic hooks that require student authentication
import MainLoader from "../../components/common/MainLoader";
import toggleBlockStudentApi from "../../apis/actions/educator/toggleBlockStudent";

function StudentProfile() {
	const { t } = useTranslation();
	const { studentId } = useParams();
	const { isLoading, error, data, mutate } = useEducatorStudentProfileData(studentId);
	const { data: teacherData } = useEducatorProfileData();

	// Get student assessment attempts
	const {
		data: assessmentAttempts,
		count: assessmentCount,
		isLoading: assessmentLoading,
		error: assessmentError
	} = useStudentAssessmentAttempts(data?.student?.user?.username);

	// Get student enrollments
	const {
		enrollments: courseEnrollments,
		count: enrollmentsCount,
		isLoading: enrollmentsLoading,
		error: enrollmentsError
	} = useStudentEnrollments(studentId);

	const [isUpdatingBlock, setIsUpdatingBlock] = useState(false);

	if (isLoading) {
		return <MainLoader />;
	}

	if (error) {
		return (
			<div className="alert alert-danger">
				{t('educatorStudentDetails.errorLoadingStudentProfile')} {error.message}
			</div>
		);
	}

	const notes = data?.notes;
	const numberOfEnrollmentCourses = data?.number_of_enrollment_courses;

	const formData = {
		name: data?.student?.full_name || "N/A",
		phone1: data?.student?.user?.phone || "N/A",
		phone2: data?.student?.user?.parent_phone || "N/A",
		notes: notes || "",
		profileImage: data?.student?.profile_picture || "https://placehold.co/120x120?text=Student",
	};

	// Create mock/calculated data based on available student profile information
	// Since we can't access student-specific assessment and enrollment endpoints from educator side,
	// we'll use the available data from the student profile and create reasonable estimates

	const completedCourses = data?.number_of_completed_courses || 0;
	const enrolledCourses = enrollmentsCount || 0;
	const completedLessons = data?.completed_lessons || 0;

	// Calculate overall progress based on real enrollment data
	const overallProgress = courseEnrollments && courseEnrollments.length > 0
		? Math.round(courseEnrollments.reduce((total, enrollment) => total + parseFloat(enrollment.progress || 0), 0) / courseEnrollments.length)
		: 0;

	// Calculate assessment success rate from real data
	const assessmentSuccessRate = assessmentAttempts && assessmentAttempts.length > 0
		? Math.round((assessmentAttempts.filter(attempt => attempt.is_passed).length / assessmentAttempts.length) * 100)
		: 0;

	// Create missing items based on real progress data
	const missingItems = [];

	if (overallProgress < 100) {
		const incompleteCourses = courseEnrollments?.filter(enrollment => parseFloat(enrollment.progress || 0) < 100).length || 0;
		if (incompleteCourses > 0) {
			missingItems.push({
				type: "course",
				message: `${incompleteCourses} course${incompleteCourses > 1 ? 's' : ''} in progress`,
				progress: overallProgress
			});
		}
	}

	// Check for courses with low progress
	const lowProgressCourses = courseEnrollments?.filter(enrollment => parseFloat(enrollment.progress || 0) < 50).length || 0;
	if (lowProgressCourses > 0) {
		missingItems.push({
			type: "assignment",
			message: `${lowProgressCourses} course${lowProgressCourses > 1 ? 's' : ''} need attention (below 50% progress)`,
			progress: Math.round((lowProgressCourses / enrolledCourses) * 100)
		});
	}

	// Course enrollments are now fetched from API via useStudentEnrollments hook

	const toggleBlockStudent = async () => {
		if (isUpdatingBlock) return;

		setIsUpdatingBlock(true);
		try {
			await toggleBlockStudentApi(studentId);
			mutate(); // Refresh the student data
			alert(data?.is_active ? t('educatorStudentDetails.studentHasBeenBlocked') : t('educatorStudentDetails.studentHasBeenUnblocked'));
		} catch (error) {
			console.error("Error toggling student block status:", error);
			alert(t('educatorStudentDetails.failedToUpdateStudentStatus'));
		} finally {
			setIsUpdatingBlock(false);
		}
	};

	return (
		<div className="min-vh-100 profile-root p-4">
			<div className="container-fluid">
				{/* Header */}
				<div className="d-flex justify-content-between align-items-center mb-4">
					<h2 className="fw-bold main-title" tabIndex={0}>
						{t('educatorStudentDetails.studentProfile')}
					</h2>
					<div className="d-flex align-items-center">
						{/* Block/Unblock Button */}
						<button
							className={`px-4 me-3 btn-secondary-danger ${!data?.is_active ? "btn-danger" : "btn-outline-danger"
								}`}
							onClick={toggleBlockStudent}
							disabled={isUpdatingBlock}
						>
							{isUpdatingBlock ? (
								<>
									<span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
									{t('educatorStudentDetails.updating')}
								</>
							) : (
								!data?.is_active ? t('educatorStudentDetails.unblockStudent') : t('educatorStudentDetails.blockStudent')
							)}
						</button>
						{/* Back Button */}
						<button
							className=" btn-edit-profile ms-3 px-4"
							onClick={() => window.history.back()}
						>
							<i className="bi bi-arrow-left me-2"></i> {t('educatorStudentDetails.back')}
						</button>
					</div>
				</div>

				{/* First Row - Two Column Layout */}
				<div className="row g-4">
					{/* Left Column - Student Info */}
					<div className="col-lg-6">
						<div className="illustration-card shadow-sm">
							<div className="card-body p-4">
								<div className="d-flex align-items-start mb-4">
									<img
										src={formData.profileImage}
										alt="avatar"
										className="avatar-rectangle profile-avatar me-3"
										style={{
											width: "150px",
											height: "150px",
											objectFit: "cover",
										}}
										aria-label="Student avatar"
									/>
									<div>
										<h4 className="fw-bold mb-1 section-title">
											{formData.name}
										</h4>
										<div className="small section-title">{t('educatorStudentDetails.student')}</div>
										<div className="small section-title">
											{t('educatorStudentDetails.joined')} {new Date(data?.enrollment_date).getFullYear()}
										</div>
									</div>
								</div>

								<h5 className="fw-bold section-title mb-3">{t('educatorStudentDetails.about')}</h5>
								<div className="row">
									<div className="col-xl-8">
										<div className="d-flex flex-column gap-2">
											{/* Student Code */}
											<div className="d-flex align-items-center px-3">
												<i className="bi bi-hash me-2 section-title"></i>
												<div>
													<strong className="me-2 section-title">{t('educatorStudentDetails.code')}</strong>
													<span className="small section-title">
														{data?.student?.user?.slug || "N/A"}
													</span>
												</div>
											</div>
											{/* Phone Numbers */}
											<div className="d-flex align-items-center px-3">
												<i className="bi bi-telephone me-2 section-title"></i>
												<div>
													<strong className="me-2 section-title">{t('educatorStudentDetails.phone1')}</strong>
													<span className="small section-title">{formData.phone1}</span>
												</div>
											</div>
											<div className="d-flex align-items-center px-3">
												<i className="bi bi-telephone-plus me-2 section-title"></i>
												<div>
													<strong className="me-2 section-title">{t('educatorStudentDetails.phone2')}</strong>
													<span className="small section-title">{formData.phone2}</span>
												</div>
											</div>
											{/* Bio */}
											{data?.student?.bio && (
												<div className="d-flex align-items-center px-3">
													<i className="bi bi-info-circle me-2 section-title"></i>
													<div>
														<strong className="me-2 section-title">{t('educatorStudentDetails.bio')}</strong>
														<span className="small section-title">{data?.student?.bio}</span>
													</div>
												</div>
											)}
											{/* Date of Birth */}
											{data?.student?.date_of_birth && (
												<div className="d-flex align-items-center px-3">
													<i className="bi bi-calendar me-2 section-title"></i>
													<div>
														<strong className="me-2 section-title">{t('educatorStudentDetails.dateOfBirth')}</strong>
														<span className="small section-title">
															{new Date(data?.student.date_of_birth).toLocaleDateString()}
														</span>
													</div>
												</div>
											)}
											{/* Address */}
											{data?.student?.address && (
												<div className="d-flex align-items-center px-3">
													<i className="bi bi-house me-2 section-title"></i>
													<div>
														<strong className="me-2 section-title">{t('educatorStudentDetails.address')}</strong>
														<span className="small section-title">{data?.student?.address}</span>
													</div>
												</div>
											)}
											{/* City */}
											{data?.student?.city && (
												<div className="d-flex align-items-center px-3">
													<i className="bi bi-geo-alt me-2 section-title"></i>
													<div>
														<strong className="me-2 section-title">{t('educatorStudentDetails.city')}</strong>
														<span className="small section-title">{data?.student?.city}</span>
													</div>
												</div>
											)}
											{/* Country */}
											{data?.student?.country && (
												<div className="d-flex align-items-center px-3">
													<i className="bi bi-globe me-2 section-title"></i>
													<div>
														<strong className="me-2 section-title">{t('educatorStudentDetails.country')}</strong>
														<span className="small section-title">{data?.student?.country}</span>
													</div>
												</div>
											)}
											{/* Gender */}
											{data?.student?.gender && (
												<div className="d-flex align-items-center px-3">
													<i className="bi bi-gender-ambiguous me-2 section-title"></i>
													<div>
														<strong className="me-2 section-title">{t('educatorStudentDetails.gender')}</strong>
														<span className="small section-title">{data?.student?.gender}</span>
													</div>
												</div>
											)}
										</div>
									</div>

									{/* QR Code */}
									<div className="col-xl-4 d-flex flex-column align-items-center justify-content-center">
										<div className="text-center mb-2">
											<small className="fw-bold fw-medium section-title">
												{t('educatorStudentDetails.studentQR')}
											</small>
										</div>
										<div className="qr-container">
											<img
												src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=StudentProfile:${data?.student?.user?.slug}`}
												alt="QR Code"
												className="qr-code-img"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column - Stats and Quick Info */}
					<div className="col-lg-6">
						{/* Student Statistics Card */}
						<div className="card shadow-sm mb-4">
							<div className="card-body p-4">
								<h5 className="fw-bold section-title mb-3">
									{t('educatorStudentDetails.progress')}
								</h5>

								<div className="row text-center mb-3">
									<div className="col-6">
										<div className="about-bubble p-3 text-center">
											<h4 className="fw-bold mb-1">
												{enrollmentsCount || 0}
											</h4>
											<small className="about-subtitle fw-medium">
												{t('educatorStudentDetails.enrolledCourses')}
											</small>
										</div>
									</div>
									<div className="col-6">
										<div className="about-bubble p-3 text-center">
											<h4 className="fw-bold mb-1">
												{assessmentCount || 0}
											</h4>
											<small className="about-subtitle fw-medium">
												{t('educatorStudentDetails.assessmentsTaken')}
											</small>
										</div>
									</div>
								</div>

								<div className="d-flex justify-content-between mb-2">
									<small className="fw-medium section-title">
										{t('educatorStudentDetails.overallCourseCompletion')}
									</small>
									<small className="fw-medium">{overallProgress}%</small>
								</div>

								<div
									className="progress mb-3"
									role="progressbar"
									aria-valuenow={overallProgress}
									aria-valuemin="0"
									aria-valuemax="100"
								>
									<div
										className="progress-bar progress-bar-filled"
										style={{ width: `${overallProgress}%` }}
									/>
								</div>

								{/* Assessment Success Rate */}
								{assessmentAttempts && assessmentAttempts.length > 0 && (
									<>
										<div className="d-flex justify-content-between mb-2">
											<small className="fw-medium section-title">
												{t('educatorStudentDetails.assessmentSuccessRate')}
											</small>
											<small className="fw-medium">{assessmentSuccessRate}%</small>
										</div>

										<div
											className="progress mb-3"
											role="progressbar"
											aria-valuenow={assessmentSuccessRate}
											aria-valuemin="0"
											aria-valuemax="100"
										>
											<div
												className="progress-bar progress-bar-filled"
												style={{ width: `${assessmentSuccessRate}%` }}
											/>
										</div>
									</>
								)}
							</div>
						</div>

						{/* Missing Assignments Card */}
						<div className="card shadow-sm mb-4">
							<div className="card-body p-4">
								<h5 className="fw-bold mb-3 section-title">
									{t('educatorStudentDetails.missingClassesAssignments')}
								</h5>
								{missingItems.length === 0 ? (
									<div className="alert alert-primary">
										{t('educatorStudentDetails.noMissingClassesOrAssignments')}
									</div>
								) : (
									<div className="list-group">
										{missingItems.map((item, idx) => (
											<div
												key={idx}
												className="about-bubble px-3 py-2 mb-2 d-flex align-items-center"
											>
												<span className={`badge me-2 ${item.type === "course" ? "text-main border border-primary" :
														item.type === "assessment" ? "text-warning border border-warning" :
															"text-danger border border-danger"
													}`}>
													{item.type === "course" ? t('educatorStudentDetails.course') :
														item.type === "assessment" ? t('educatorStudentDetails.assessment') :
															t('educatorStudentDetails.assignment')}
												</span>
												<div className="flex-grow-1">{item.message}</div>
												{item.progress && (
													<small className="text-muted ms-2">{item.progress} % </small>
												)}
											</div>
										))}
									</div>
								)}
							</div>
						</div>

						{/* Recent Assessments Card */}
						<div className="card shadow-sm">
							<div className="card-body p-4">
								<h5 className="fw-bold mb-3 section-title">{t('educatorStudentDetails.recentAssessments')}</h5>
								{assessmentLoading ? (
									<div className="text-center py-3">
										<div className="spinner-border spinner-border-sm text-primary" role="status">
											<span className="visually-hidden">Loading...</span>
										</div>
										<small className="text-muted d-block mt-2">Loading assessments...</small>
									</div>
								) : assessmentError ? (
									<div className="alert alert-warning">
										<small>Unable to load assessment data</small>
									</div>
								) : !assessmentAttempts || assessmentAttempts.length === 0 ? (
									<div className="alert alert-secondary">
										{t('educatorStudentDetails.noAssessmentHistoryAvailable')}
									</div>
								) : (
									<div className="about-bubble">
										{assessmentAttempts.slice(0, 3).map((attempt) => (
											<div key={attempt.id} className="list-group-item border-0 px-0">
												<div className="d-flex justify-content-between align-items-start">
													<div className="flex-grow-1">
														<h6 className="mb-1">{attempt.assessment_title}</h6>
														<small className="text-muted">
															{new Date(attempt.started_at).toLocaleDateString()} • {attempt.assessment_type}
														</small>
														<small className="text-muted d-block">
															{attempt.related_to}
														</small>
													</div>
													<div className="text-end">
														<div className="mb-1">
															<strong>{attempt.score}</strong>
															<small className="text-muted ms-1">
																({attempt.percentage}%)
															</small>
														</div>
														<span
															className={`badge ${attempt.is_passed
																	? "bg-success"
																	: "border border-danger"
																}`}
														>
															{attempt.is_passed ? "Passed" : "Failed"}
														</span>
														<div className="mt-1">
															<small className="text-muted">
																{attempt.status}
															</small>
														</div>
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Course Enrollments */}
				<div className="row mt-4">
					<div className="col-12">
						<div className="card shadow-sm">
							<div className="card-body">
								<div className="d-flex justify-content-between align-items-center mb-4">
									<h5 className="fw-bold mb-0 section-title">{t('educatorStudentDetails.courseEnrollments')}</h5>
									<div className="d-flex align-items-center">
										<span className="badge  bg-success me-2">
											{enrollmentsCount || 0} Course{enrollmentsCount !== 1 ? 's' : ''}
										</span>
									</div>
								</div>
								
								{enrollmentsLoading ? (
									<div className="text-center py-5">
										<div className="spinner-border spinner-border-sm text-primary" role="status">
											<span className="visually-hidden">Loading...</span>
										</div>
										<small className="text-muted d-block mt-2">Loading enrollments...</small>
									</div>
								) : enrollmentsError ? (
									<div className="alert alert-warning">
										<small>Unable to load enrollment data</small>
									</div>
								) : courseEnrollments && courseEnrollments.length > 0 ? (
									<div className="table-responsive">
										<table className="table table-hover custom-table-container">
											<thead>
												<tr>
													<th scope="col">Course</th>
													<th scope="col">Progress</th>
													<th scope="col">Status</th>
													<th scope="col">Access</th>
													<th scope="col">Enrollment Date</th>
													<th scope="col">End Date</th>
													<th scope="col">Last Activity</th>
												</tr>
											</thead>
											<tbody>
												{courseEnrollments.map((enrollment) => (
													<tr key={enrollment.id}>
														<td>
															<div>
																<strong className="section-title">{enrollment.course_name}</strong>
																<div className="small text-muted">
																	Student: {enrollment.student_name}
																</div>
															</div>
														</td>
														<td>
															<div className="d-flex align-items-center">
																<div className="progress me-2" style={{ width: '120px', height: '8px' }}>
																	<div 
																		className={`progress-bar ${parseFloat(enrollment.progress || 0) >= 80 ? 'bg-success' : parseFloat(enrollment.progress || 0) >= 50 ? 'bg-warning' : 'bg-danger'}`}
																		style={{ width: `${enrollment.progress || 0}%` }}
																	/>
																</div>
																<span className="small fw-medium">{enrollment.progress || 0}%</span>
															</div>
														</td>
														<td>
															<span className={`badge ${enrollment.status === 'active' ? 'bg-success' : enrollment.status === 'completed' ? ' bg-success' : 'bg-secondary'}`}>
																{enrollment.status}
															</span>
														</td>
														<td>
															<span className="badge  bg-success">
																{enrollment.access_type}
															</span>
														</td>
														<td>
															<div className="small">
																{new Date(enrollment.enrollment_date).toLocaleDateString()}
															</div>
														</td>
														<td>
															<div className="small">
																{new Date(enrollment.ended_date).toLocaleDateString()}
															</div>
														</td>
														<td>
															{enrollment.last_activity ? (
																<div className="small text-muted">
																	{new Date(enrollment.last_activity).toLocaleDateString()}
																</div>
															) : (
																<div className="small text-muted">No activity</div>
															)}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								) : (
									<div className="text-center py-5">
										<div className="text-muted mb-3">
											<i className="bi bi-book" style={{ fontSize: '3rem' }}></i>
										</div>
										<h6 className="text-muted">{t('educatorStudentDetails.noCourseEnrollmentsFound')}</h6>
										<small className="text-muted">This student hasn't enrolled in any courses yet.</small>
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
