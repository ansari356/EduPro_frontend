import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import useEducatorProfileData from "../../apis/hooks/educator/useEducatorProfileData";
import { pagePaths } from "../../pagePaths";

function EducatorProfile() {
  const [showEditForm, setShowEditForm] = useState(false);
  const {isLoading,data:educatorData,error} = useEducatorProfileData();
  const [formData, setFormData] = useState({
    name: "Dr. Amelia Carter",
    institution: "University of Springfield",
    bio: "Dr. Carter is a dedicated educator with over 10 years of experience in higher education. She specializes in curriculum development and innovative teaching methods.",
    email: "amelia.carter@springfield.edu",
    phone: "01234567890",
    profileImage: "",
  });

  // Add state for the profile image URL
  const [profileImageUrl, setProfileImageUrl] = useState(
    "https://placehold.co/120x120?text=Educator"
  );

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));

    // Handle profile image preview
    if (type === "file" && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert("Please enter a valid name.");
      return;
    }
    if (!formData.email.trim()) {
      alert("Please enter a valid email.");
      return;
    }
    if (!formData.institution.trim()) {
      alert("Please enter a valid institution.");
      return;
    }

    alert("Profile has been updated successfully.");
    setShowEditForm(false);
  };

  const courses = [
    { name: "Introduction to Psychology", students: 50, status: "Active" },
    { name: "Advanced Research Methods", students: 25, status: "Active" },
    { name: "Educational Psychology", students: 40, status: "Inactive" },
    { name: "Cognitive Psychology", students: 35, status: "Active" },
    { name: "Statistics for Psychology", students: 28, status: "Active" },
  ];

  const handleRowClick = (courseName) => {
    window.location.href = `/courses/${encodeURIComponent(courseName)}`;
  };

  const totalStudents = courses.reduce(
    (sum, course) => sum + course.students,
    0
  );
  const activeCourses = courses.filter(
    (course) => course.status === "Active"
  ).length;

  return (
		<div className="min-vh-100 profile-root p-4">
			{showEditForm && (
				<div className="container w-75 d-flex justify-content-center">
					<div className="mt-4 card card-body ">
						<h5 className="fw-bold mb-3 section-title">Edit Profile</h5>

						<form onSubmit={handleSubmitRequest}>
							{/* Name */}
							<div className="mb-3">
								<label className="form-label about-subtitle fw-medium">
									Full Name
								</label>
								<input
									type="text"
									className="form-control"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									required
								/>
							</div>

							{/* Institution */}
							<div className="mb-3">
								<label className="form-label about-subtitle fw-medium">
									Institution
								</label>
								<input
									type="text"
									className="form-control"
									name="institution"
									value={formData.institution}
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

							{/* Email */}
							<div className="mb-3">
								<label className="form-label about-subtitle fw-medium">
									Email
								</label>
								<input
									type="email"
									className="form-control"
									name="email"
									value={formData.email}
									onChange={handleInputChange}
									required
								/>
							</div>

							{/* Phone */}
							<div className="mb-3">
								<label className="form-label about-subtitle fw-medium">
									Phone
								</label>
								<input
									type="tel"
									className="form-control"
									name="phone"
									value={formData.phone}
									onChange={handleInputChange}
								/>
							</div>

							{/* Profile Image Upload */}
							<div className="mb-3">
								<label className="form-label about-subtitle fw-medium">
									Profile Image
								</label>
								<input
									type="file"
									className="form-control"
									name="profileImage"
									accept="image/*"
									onChange={handleInputChange}
								/>
								{profileImageUrl && (
									<div className="mt-2">
										<small className="text-muted">Preview:</small>
										<div className="mt-1">
											<img
												src={profileImageUrl}
												alt="Profile preview"
												style={{
													width: "60px",
													height: "60px",
													objectFit: "cover",
												}}
												className="rounded-circle"
											/>
										</div>
									</div>
								)}
							</div>

							{/* Submit Button */}
							<button type="submit" className="px-4 btn-edit-profile">
								Update Profile
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
			)}

			{!showEditForm && (
				<div className="container-fluid">
					{/* Header */}
					<div className="d-flex justify-content-between align-items-center mb-4">
						<h2 className="fw-bold profile-main-title main-title" tabIndex={0}>
							Educator Profile
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

					{/* Card Grid Layout */}
					<div className="row g-4">
						{/* Profile Card */}
						<div className="col-lg-6">
							<div className="illustration-card shadow-sm">
								<div className="container">
									<div className="d-flex align-items-start mb-4">
										<img
											src={profileImageUrl}
											alt="avatar"
											className="rounded-circle me-3"
											style={{
												width: "100px",
												height: "100px",
												objectFit: "cover",
											}}
											aria-label="Educator avatar"
										/>
										<div>
											<h4 className="fw-bold mb-1 profile-main-title">
												{educatorData?.user?.first_name || "__"}{" "}
												{educatorData?.user?.last_name || "__"}
											</h4>
											<div className=" small">
												{educatorData?.user?.username || "__"}
											</div>
											<div className=" small">
												{educatorData?.created_at
													? new Date(
															educatorData.created_at
													  ).toLocaleDateString()
													: "__"}
											</div>
										</div>
									</div>

									{/* About Section */}
									<h5 className="fw-bold  mb-3">About</h5>
									<div className="row">
										<div className="col-xl-8">
											<div className="d-flex flex-column gap-2">
												<div className="d-flex">
													<i className="bi bi-building text-primary"></i>
													<div className="d-flex flex-sm-row flex-column px-3">
														<strong className="me-2">username:</strong>
														<span className="text-light small">
															{educatorData?.user?.username || "__"}
														</span>
													</div>
												</div>
												<div className="d-flex">
													<i className="bi bi-envelope text-primary"></i>
													<div className="d-flex flex-sm-row flex-column px-3">
														<strong className="me-2 ">Email:</strong>
														<span className="small">
															{educatorData?.user?.email || "__"}
														</span>
													</div>
												</div>
												<div className="d-flex">
													<i className="bi bi-telephone text-primary"></i>
													<div className="d-flex flex-sm-row flex-column px-3">
														<strong className="me-2 ">Phone:</strong>
														<span className="small">
															{educatorData?.user?.phone || "__"}
														</span>
													</div>
												</div>
												<div className="d-flex">
													<i className="bi bi-calendar-event text-primary"></i>
													<div className="d-flex flex-sm-row flex-column px-3">
														<strong className="me-2 ">Experience:</strong>
														<span className="small">
															{(educatorData?.experience || "__")}{" "}
															Years
														</span>
													</div>
												</div>
												<div className="d-flex">
													<i className="bi bi-mortarboard text-primary"></i>
													<div className="d-flex flex-sm-row flex-column px-3">
														<strong className="me-2 ">Specialization:</strong>
														<span className="small">
															{educatorData?.specialization || "__"}
														</span>
													</div>
												</div>
											</div>
										</div>

										{/* QR Code */}
										<div className="col-xl-4 d-flex flex-column mt-4 align-items-center justify-content-center">
											<div className="text-center mb-2">
												<small className="fw-bold fw-medium">Educator QR</small>
											</div>
											<div className="qr-container">
												<img
													src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=EducatorProfile:${encodeURIComponent(
														formData.name
													)}`}
													alt="QR Code"
													className="qr-code-img"
												/>
											</div>
										</div>
									</div>

									{/* Bio Section */}
									<div className="mt-4">
										<h6 className="fw-bold mb-2">Bio</h6>
										<div className="about-bubble px-3 py-2">
											<p
												className="mb-0 fw-medium"
												style={{ fontSize: "0.9rem", lineHeight: "1.5" }}
											>
												{educatorData?.bio || "edit your profile to add a bio"}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="col-lg-6">
							{/* Stats Card */}
							<div className="card shadow-sm mb-4">
								<div className="card-body p-4">
									<h5 className="fw-bold section-title mb-3">
										Teaching Statistics
									</h5>

									<div className="row text-center">
										<div className="col-4">
											<div className="about-bubble p-3 text-center">
												<h4 className="fw-bold mb-1 text-primary">
													{educatorData?.number_of_courses ?? "__"}
												</h4>
												<small className="about-subtitle fw-medium">
													Total Courses
												</small>
											</div>
										</div>
										<div className="col-4">
											<div className="about-bubble p-3 text-center">
												<h4 className="fw-bold mb-1 text-primary">
													{educatorData?.rating ?? "__"}
												</h4>
												<small className="about-subtitle fw-medium">
													Rating
												</small>
											</div>
										</div>
										<div className="col-4">
											<div className="about-bubble p-3 text-center">
												<h4 className="fw-bold mb-1 text-primary">
													{educatorData?.number_of_students ?? "__"}
												</h4>
												<small className="about-subtitle fw-medium">
													Total Students
												</small>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Quick Actions Card */}
							<div className="card shadow-sm">
								<div className="card-body p-4">
									<h5 className="fw-bold section-title mb-3">Quick Actions</h5>
									<div className="d-flex flex-column gap-2">
										<Link
											to={pagePaths.educator.createCourse}
											style={{ textDecoration: "none" }}
										>
											<div className="about-bubble px-3 py-2 d-flex align-items-center">
												<i
													className="bi bi-plus-circle me-3 text-primary"
													style={{ fontSize: "1.2rem" }}
												></i>
												<div className="flex-grow-1">
													<span className="fw-medium">Create New Course</span>
												</div>
												<i className="bi bi-chevron-right text-primary"></i>
											</div>
										</Link>
										<Link to={pagePaths.educator.students} style={{ textDecoration: "none" }}>
											<div className="about-bubble px-3 py-2 d-flex align-items-center">
												<i
													className="bi bi-people me-3 text-primary"
													style={{ fontSize: "1.2rem" }}
												></i>
												<div className="flex-grow-1">
													<span className="fw-medium">Manage Students</span>
												</div>
												<i className="bi bi-chevron-right text-primary"></i>
											</div>
										</Link>
										<Link style={{ textDecoration: "none" }}>
											<div className="about-bubble px-3 py-2 d-flex align-items-center">
												<i
													className="bi bi-calendar-check me-3 text-primary"
													style={{ fontSize: "1.2rem" }}
												></i>
												<div className="flex-grow-1">
													<span className="fw-medium">Schedule Classes</span>
												</div>
												<i className="bi bi-chevron-right text-primary"></i>
											</div>
										</Link>
										<Link style={{ textDecoration: "none" }}>
											<div className="about-bubble px-3 py-2 d-flex align-items-center">
												<i
													className="bi bi-bar-chart me-3 text-primary"
													style={{ fontSize: "1.2rem" }}
												></i>
												<div className="flex-grow-1">
													<span className="fw-medium">View Analytics</span>
												</div>
												<i className="bi bi-chevron-right text-primary"></i>
											</div>
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Courses Table Card - Keep your existing code */}
					<div className="row mt-4">
						<div className="col-12">
							<div className="card shadow-sm">
								<div className="card-body p-4">
									<h5 className="fw-bold mb-4 section-title">Courses Taught</h5>
									{courses.length === 0 ? (
										<div className="alert alert-secondary">
											No courses available.
										</div>
									) : (
										<div className="table-responsive">
											<table className="table table-borderless">
												<thead>
													<tr className="border-bottom">
														<th scope="col" className="fw-bold">
															Course Name
														</th>
														<th scope="col" className="fw-bold">
															Students
														</th>
														<th scope="col" className="fw-bold">
															Status
														</th>
														<th scope="col" className="fw-bold">
															Actions
														</th>
													</tr>
												</thead>
												<tbody>
													{courses.map((course, idx) => (
														<tr
															key={idx}
															className="border-bottom"
															style={{ cursor: "pointer" }}
															onClick={() => handleRowClick(course.name)}
														>
															<td className="fw-medium text-primary">
																{course.name}
															</td>
															<td className="fw-medium">{course.students}</td>
															<td>
																<span
																	className={`badge ${
																		course.status === "Active"
																			? "bg-primary"
																			: "bg-secondary"
																	}`}
																>
																	{course.status}
																</span>
															</td>
															<td>
																<div className="d-flex gap-2">
																	<button
																		className="btn btn-sm"
																		style={{
																			backgroundColor: "var(--color-surface)",
																			color: "var(--color-primary-light)",
																			border:
																				"1px solid var(--color-border-light)",
																			borderRadius: "0.5rem",
																		}}
																	>
																		<i className="bi bi-eye"></i>
																	</button>
																	<button
																		className="btn btn-sm"
																		style={{
																			backgroundColor: "var(--color-surface)",
																			color: "var(--color-primary-light)",
																			border:
																				"1px solid var(--color-border-light)",
																			borderRadius: "0.5rem",
																		}}
																	>
																		<i className="bi bi-pencil"></i>
																	</button>
																</div>
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
			)}
		</div>
	);
}

export default EducatorProfile;
