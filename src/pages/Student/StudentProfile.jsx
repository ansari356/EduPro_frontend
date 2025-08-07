import React, { useState, useEffect } from "react";
import useStudentProfileData from "../../apis/hooks/student/useStudentProfileData";
import updateStudentProfile from "../../apis/actions/student/updateStudentProfile";


function StudentProfile() {
  const { data: studentData, isLoading, error } = useStudentProfileData();
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

  // Add state for the profile image URL
  const [profilePicturePreview, setProfilePicturePreview] = useState(
    null
  );

  useEffect(() => {
    if (studentData) {
      setFormData({
        full_name: studentData.student.full_name || "",
        bio: studentData.student.bio || "",
        profile_picture: null, // We don't pre-fill file inputs
        date_of_birth: studentData.student.date_of_birth || "",
        address: studentData.student.address || "",
        country: studentData.student.country || "",
        city: studentData.student.city || "",
        gender: studentData.student.gender || "",
      });
      setProfilePicturePreview(studentData.student.profile_picture || null);
    }
  }, [studentData]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));

    // Handle profile image preview
    if (name === "profile_picture" && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else if (name === "profile_picture" && !files[0]) {
      setProfilePicturePreview(null);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    const dataToSubmit = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && formData[key] !== undefined && formData[key] !== "") {
        dataToSubmit.append(key, formData[key]);
      }
    }

    await updateStudentProfile(dataToSubmit)
      .then((res) => {
        console.log(res.data);
        // Assuming useStudentProfileData provides a mutate function to re-fetch data
        // If not, you might need to manually re-fetch or update state
        // For now, assuming mutate is available from the hook
        if (typeof studentData?.mutate === 'function') {
          studentData.mutate();
        }
        alert("Your profile has been updated successfully!");
        setShowEditForm(false);
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        alert("Failed to update profile. Please try again.");
      });
  };

  // Dummy data for progress, missing items, and schedule (replace with real data if available from hook)
  const progress = studentData?.completed_lessons > 0 && studentData?.number_of_enrollment_courses > 0 
    ? Math.round((studentData.completed_lessons / studentData.number_of_enrollment_courses) * 100) 
    : 0;

  const missingItems = []; // Placeholder, replace with actual missing items from studentData if available

  const schedule = []; // Placeholder, replace with actual schedule from studentData if available

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
    <div
      className="min-vh-100 profile-root p-4"
    >
      {showEditForm && (
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
              {profilePicturePreview && (
                <div className="mt-2">
                  <small className="text-muted">Preview:</small>
                  <div className="mt-1">
                    <img
                      src={profilePicturePreview}
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

            {/* Submit Button */}
            <button
              type="submit"
              className="px-4 btn-edit-profile"
            >
              Submit Request
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
            <h2 className="fw-bold main-title" tabIndex={0}>
              Student Profile
            </h2>
            <div className="d-flex align-items-center">
              <button
                className=" px-4 btn-edit-profile me-2"
                aria-label="Edit Profile"
                onClick={() => setShowEditForm(true)}
              >
                Edit Profile
              </button>
              <form/>
            </div>
          </div>

          {/* Card Grid Layout */}
          <div className="row g-4">
            {/* Profile Card */}
            <div className="col-lg-6">
              <div className="illustration-card shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex align-items-start mb-4">
                    <img
                      src={studentData.student.profile_picture || "https://placehold.co/120x120?text=Student"}
                      alt="avatar"
                      className="rounded-circle me-3"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      aria-label="User avatar"
                    />
                    <div>
                      <h4 className="fw-bold mb-1 profile-main-title">
                        {studentData.student.full_name}
                      </h4>
                      <div className="small">Student</div>
                      <div className="small">Joined {new Date(studentData.student.user.created_at).getFullYear()}</div>
                    </div>
                  </div>

                  {/* About Section */}
                  <h5 className="fw-bold section-title mb-3">About</h5>
                  <div className="row">
                    <div className="col-xl-8">
                      <div className="d-flex flex-column gap-2">
                        <div className=" d-flex align-items-center px-3">
                          <i className="bi bi-person-badge me-2 text-primary"></i>
                          <div>
                            <strong className="me-2">Professor:</strong>
                            <span className="small">N/A</span> {/* Professor data not in hook */}
                          </div>
                        </div>
                        <div className=" d-flex align-items-center px-3">
                          <i className="bi bi-people me-2 text-primary"></i>
                          <strong className="me-2">Group:</strong>
                          <span className="small">N/A</span> {/* Group data not in hook */}
                        </div>
                        <div className=" d-flex align-items-center px-3 ">
                          <i className="bi bi-mortarboard me-2 text-primary"></i>
                          <strong className="me-2">Grade:</strong>
                          <span className="small">N/A</span> {/* Grade data not in hook */}
                        </div>
                        <div className=" d-flex align-items-center px-3 ">
                          <i className="bi bi-hash me-2 text-primary"></i>
                          <strong className="me-2">Code:</strong>
                          <span className="small">{studentData.student.user.slug}</span>
                        </div>
                        <div className=" d-flex align-items-center px-3">
                          <i className="bi bi-telephone me-2 text-primary"></i>
                          <strong className="me-2">Phone 1:</strong>
                          <span className="small">{studentData.student.user.phone}</span>
                        </div>
                        <div className=" d-flex align-items-center px-3 ">
                          <i className="bi bi-telephone-plus me-2 text-primary"></i>
                          <strong className="me-2">Phone 2:</strong>
                          <span className="small">{studentData.student.user.parent_phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="col-xl-4 d-flex flex-column align-items-center justify-content-center">
                      <div className="text-center mb-2">
                        <small className="fw-bold fw-medium">
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

            {/* Progress and Missing Items Column */}
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
                    className={`d-block profile-progress-text ${
                      progress === 100 ? "text-primary" : "text-danger"
                    }`}
                    aria-live="polite"
                  >
                    {progress === 100
                      ? "You're doing great! Keep up the momentum."
                      : "Careful! Missing a few assignments or classes"}
                  </small>
                </div>
              </div>

              {/* Missing Assignments Card */}
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  {/* Missing Assignments & Classes */}
                  <section className="mb-5">
                    <h5 className="fw-bold mb-3 section-title">
                      Missing Classes / Assignments
                    </h5>
                    {missingItems.length === 0 ? (
                      <div className="alert alert-primary" role="alert">
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
                              {item.type === "assignment"
                                ? "Assignment"
                                : "Class"}
                            </span>
                            <div className="flex-grow-1">{item.message}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Schedule Card */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4 section-title">
                    Weekly Schedule
                  </h5>
                  {schedule.length === 0 ? (
                    <div className="alert alert-secondary">
                      No upcoming classes scheduled.
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-borderless">
                        <thead>
                          <tr className="border-bottom">
                            <th scope="col" className="fw-bold">
                              Day
                            </th>
                            <th scope="col" className="fw-bold">
                              Time
                            </th>
                            <th scope="col" className="fw-bold">
                              Subject
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {schedule.map((item, idx) => (
                            <tr key={idx} className="border-bottom">
                              <td className="fw-medium">{item.day}</td>
                              <td className="fw-medium">{item.time}</td>
                              <td className="fw-medium">{item.subject}</td>
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

export default StudentProfile;
