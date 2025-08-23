// EducatorProfile.jsx
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";
import useEducatorProfileData from "../../apis/hooks/educator/useEducatorProfileData";
import updateEducatorProfile from "../../apis/actions/educator/updateEducatorProfile";
import useEducatorCoursesData from "../../apis/hooks/educator/useEducatorCoursesData";
import { pagePaths } from "../../pagePaths";
import { QRCodeSVG } from "qrcode.react";
import { CircleUserRound } from "lucide-react";

function EducatorProfile() {
  const [showEditForm, setShowEditForm] = useState(false);
  const navigate = useNavigate();

  const {
    isLoading,
    data: educatorData,
    error,
    mutate,
  } = useEducatorProfileData();

  const {
    data: coursesData,
    error: coursesError,
    isLoading: coursesLoading,
  } = useEducatorCoursesData(educatorData?.user?.username);

  const [formData, setFormData] = useState({
    full_name: educatorData?.full_name || "",
    bio: educatorData?.bio || "",
    profile_picture: null,
    date_of_birth: educatorData?.date_of_birth || "",
    address: educatorData?.address || "",
    country: educatorData?.country || "",
    city: educatorData?.city || "",
    specialization: educatorData?.specialization || "",
    institution: educatorData?.institution || "",
    experiance: educatorData?.experiance || "",
    gender: educatorData?.gender || "",
    logo: null,
    primary_color: educatorData?.primary_color,
    primary_color_light: educatorData?.primary_color_light,
    primary_color_dark: educatorData?.primary_color_dark,
    secondary_color: educatorData?.secondary_color,
    accent_color: educatorData?.accent_color,
    background_color: educatorData?.background_color,
  });

  const [profileImageUrl, setProfileImageUrl] = useState(
    educatorData?.profile_picture ||
      "https://placehold.co/120x120?text=Educator"
  );
  const [logoImageUrl, setLogoImageUrl] = useState(educatorData?.logo || null);

  useEffect(() => {
    if (educatorData) {
      setFormData({
        full_name: educatorData.full_name || "",
        bio: educatorData.bio || "",
        profile_picture: null,
        date_of_birth: educatorData.date_of_birth || "",
        address: educatorData.address || "",
        country: educatorData.country || "",
        city: educatorData.city || "",
        specialization: educatorData.specialization || "",
        institution: educatorData.institution || "",
        experiance: educatorData.experiance || "",
        gender: educatorData.gender || "",
        logo: null,
        primary_color: educatorData.primary_color || "",
        primary_color_light: educatorData.primary_color_light || "",
        primary_color_dark: educatorData.primary_color_dark || "",
        secondary_color: educatorData.secondary_color || "",
        accent_color: educatorData.accent_color || "",
        background_color: educatorData.background_color || "",
      });
      setProfileImageUrl(
        educatorData.profile_picture ||
          "https://placehold.co/120x120?text=Educator"
      );
      setLogoImageUrl(educatorData.logo || null);
    }
  }, [educatorData]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));

    if (name === "profile_picture" && files?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else if (name === "logo" && files?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoImageUrl(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    if (!formData.full_name.trim()) {
      alert("Please enter a valid full name.");
      return;
    }
    if (!formData.specialization.trim()) {
      alert("Please enter a valid specialization.");
      return;
    }
    if (!formData.institution.trim()) {
      alert("Please enter a valid institution.");
      return;
    }

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

    await updateEducatorProfile(dataToSubmit)
      .then((res) => {
        console.log(res.data);
        mutate();
        setShowEditForm(false);
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        alert("Failed to update profile. Please try again.");
      });
  };

  const courses = 
    coursesData?.map((course) => ({
      id: course.id,
      name: course.title, 
      students: course.total_enrollments, 
      status: course.is_published ? "Active" : "Inactive",
    })) || [];
  
  const handleRowClick = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  // Handle eye button click - navigate to course details
  const handleViewCourse = (e, courseId) => {
    e.stopPropagation(); // Prevent row click event
    navigate(`/courses/${courseId}`);
  };

  // Handle edit button click
  const handleEditCourse = (e, courseId) => {
  e.stopPropagation();
  navigate(`/courses/edit/${courseId}`);
};

  return (
    <div className="min-vh-100 profile-root p-4">
      {showEditForm ? (
        <div className="container w-75 d-flex justify-content-center">
          <div className="mt-4 card card-body">
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
                  rows={4}
                  value={formData.bio}
                  onChange={handleInputChange}
                />
              </div>

              {/* Profile Picture and Logo Uploads */}
              <div className="row mb-3">
                <div className="col-md-6">
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
                  {profileImageUrl && (
                    <div className="mt-2">
                      <small className="text-muted">Preview:</small>
                      <div className="mt-1">
                        <img
                          src={profileImageUrl}
                          alt="Profile preview"
                          style={{ width: 60, height: 60, objectFit: "cover" }}
                          className="rounded-circle"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label about-subtitle fw-medium">
                    Logo
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    name="logo"
                    accept="image/*"
                    onChange={handleInputChange}
                  />
                  {logoImageUrl && (
                    <div className="mt-2">
                      <small className="text-muted">Preview:</small>
                      <div className="mt-1">
                        <img
                          src={logoImageUrl}
                          alt="Logo preview"
                          style={{ width: 60, height: 60, objectFit: "cover" }}
                          className="rounded-circle"
                        />
                      </div>
                    </div>
                  )}
                </div>
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

              {/* Specialization */}
              <div className="mb-3">
                <label className="form-label about-subtitle fw-medium">
                  Specialization
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="specialization"
                  value={formData.specialization}
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

              {/* Experience */}
              <div className="mb-3">
                <label className="form-label about-subtitle fw-medium">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="experiance"
                  value={formData.experiance}
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
                </select>
              </div>

              {/* Color Settings */}
              <h6 className="fw-bold mb-2">Theme Colors</h6>
              <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
                {/* <div className="flex-grow-1">
                  <label className="form-label about-subtitle fw-medium">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    className="form-control form-control-color"
                    name="primary_color"
                    value={formData.primary_color}
                    onChange={handleInputChange}
                  />
                </div> */}

                <div className="flex-grow-1">
                  <label className="form-label about-subtitle fw-medium">
                    Primary Color Light
                  </label>
                  <input
                    type="color"
                    className="form-control form-control-color"
                    name="primary_color_light"
                    value={formData.primary_color_light}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex-grow-1">
                  <label className="form-label about-subtitle fw-medium">
                    Primary Color Dark
                  </label>
                  <input
                    type="color"
                    className="form-control form-control-color"
                    name="primary_color_dark"
                    value={formData.primary_color_dark}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex-grow-1">
                  <label className="form-label about-subtitle fw-medium">
                    Secondary Color
                  </label>
                  <input
                    type="color"
                    className="form-control form-control-color"
                    name="secondary_color"
                    value={formData.secondary_color}
                    onChange={handleInputChange}
                  />
                </div>

                {/* <div className="flex-grow-1">
                  <label className="form-label about-subtitle fw-medium">
                    Accent Color
                  </label>
                  <input
                    type="color"
                    className="form-control form-control-color"
                    name="accent_color"
                    value={formData.accent_color}
                    onChange={handleInputChange}
                  />
                </div> */}

                <div className="flex-grow-1">
                  <label className="form-label about-subtitle fw-medium">
                    Background Color
                  </label>
                  <input
                    type="color"
                    className="form-control form-control-color"
                    name="background_color"
                    value={formData.background_color}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="d-flex justify-content-end mt-5">
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
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="container">
          {/* Header */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="container py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <div className="header-avatar">
                    <CircleUserRound size={20} />
                  </div>
                  <div>
                    <span className="section-title">Educator Profile</span>
                    <p className="profile-role">
                      Manage your profile and quick actions
                    </p>
                  </div>
                </div>
                <button
                  className="px-4 btn-edit-profile me-2"
                  aria-label="Edit Profile"
                  onClick={() => setShowEditForm(true)}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Card Grid Layout */}
          <div className="row g-4">
            {/* Profile Card */}
            <div className="col-lg-6">
              <div className="illustration-card shadow-sm">
                <div className="container">
                  <div className="d-flex align-items-start justify-content-start mb-4">
                    <div className="d-flex align-items-start justify-content-start">
                      <img
                        src={profileImageUrl}
                        alt="avatar"
                        className="avatar-rectangle me-3"
                        style={{ 
                          alignSelf: 'flex-start', 
                          justifySelf: 'flex-start',
                          marginLeft: '0',
                          marginRight: 'auto',
                          display: 'block'
                        }}
                        aria-label="Educator avatar"
                      />
                    </div>
                    <div>
                      <h4 className="fw-bold mb-1 profile-main-title">
                        {educatorData?.user?.first_name || "__"}{" "}
                        {educatorData?.user?.last_name || "__"}
                      </h4>
                      <div className="small">
                        {educatorData?.full_name || "__"}
                      </div>
                      <div className="small">
                        {educatorData?.created_at
                          ? new Date(
                              educatorData.created_at
                            ).toLocaleDateString()
                          : "__"}
                      </div>
                    </div>
                  </div>

                  {/* About Section */}
                  <h5 className="fw-bold mb-3">About</h5>
                  <div className="row">
                    <div className="col-xl-8">
                      <div className="d-flex flex-column gap-2">
                        <div className="d-flex">
                          <i className="bi bi-building"></i>
                          <div className="d-flex flex-sm-row flex-column px-3">
                            <strong className="me-2">username:</strong>
                            <span className="text-light small">
                              {educatorData?.user?.username || "__"}
                            </span>
                          </div>
                        </div>
                        <div className="d-flex">
                          <i className="bi bi-envelope"></i>
                          <div className="d-flex flex-sm-row flex-column px-3">
                            <strong className="me-2">Email:</strong>
                            <span className="small">
                              {educatorData?.user?.email || "__"}
                            </span>
                          </div>
                        </div>
                        <div className="d-flex">
                          <i className="bi bi-telephone"></i>
                          <div className="d-flex flex-sm-row flex-column px-3">
                            <strong className="me-2">Phone:</strong>
                            <span className="small">
                              {educatorData?.user?.phone || "__"}
                            </span>
                          </div>
                        </div>
                        <div className="d-flex">
                          <i className="bi bi-calendar-event"></i>
                          <div className="d-flex flex-sm-row flex-column px-3">
                            <strong className="me-2">Experience:</strong>
                            <span className="small">
                              {educatorData?.experiance || "__"} Years
                            </span>
                          </div>
                        </div>
                        <div className="d-flex">
                          <i className="bi bi-mortarboard"></i>
                          <div className="d-flex flex-sm-row flex-column px-3">
                            <strong className="me-2">Specialization:</strong>
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
                        <QRCodeSVG
                          value={
                            window.location.origin +
                            pagePaths.student.home(educatorData?.user?.username || "")
                          }
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
                        <h4 className="fw-bold mb-1">
                          {educatorData?.number_of_courses ?? "__"}
                        </h4>
                        <small className="about-subtitle fw-medium">
                          Total Courses
                        </small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="about-bubble p-3 text-center">
                        <h4 className="fw-bold mb-1">
                          {educatorData?.rating ?? "__"}
                        </h4>
                        <small className="about-subtitle fw-medium">
                          Rating
                        </small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="about-bubble p-3 text-center">
                        <h4 className="fw-bold mb-1">
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
                          className="bi bi-plus-circle me-3"
                          style={{ fontSize: "1.2rem" }}
                        ></i>
                        <div className="flex-grow-1">
                          <span className="fw-medium">Create New Course</span>
                        </div>
                        <i className="bi bi-chevron-right"></i>
                      </div>
                    </Link>
                    <Link
                      to={pagePaths.educator.students}
                      style={{ textDecoration: "none" }}
                    >
                      <div className="about-bubble px-3 py-2 d-flex align-items-center">
                        <i
                          className="bi bi-people me-3"
                          style={{ fontSize: "1.2rem" }}
                        ></i>
                        <div className="flex-grow-1">
                          <span className="fw-medium">Manage Students</span>
                        </div>
                        <i className="bi bi-chevron-right"></i>
                      </div>
                    </Link>
                    <Link
                      to={pagePaths.educator.coupons}
                      style={{ textDecoration: "none" }}
                    >
                      <div className="about-bubble px-3 py-2 d-flex align-items-center">
                        <i
                          className="bi bi-calendar-check me-3"
                          style={{ fontSize: "1.2rem" }}
                        ></i>
                        <div className="flex-grow-1">
                          <span className="fw-medium">Manage Coupons</span>
                        </div>
                        <i className="bi bi-chevron-right"></i>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Table Card */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4 section-title">Courses Taught</h5>
                  {courses.length === 0 ? (
                    <div className="alert alert-primary">
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
                              onClick={() => handleRowClick(course.id)}
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
                                    onClick={(e) => handleViewCourse(e, course.id)}
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
                                    onClick={(e) => handleEditCourse(e, course.id)}
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

