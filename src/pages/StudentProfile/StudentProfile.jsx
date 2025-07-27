import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./StudentProfile.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";

function StudentProfile() {
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "Mohamed Ali Hassan El-Sayed",
    phone1: "01051456789",
    phone2: "01225456789",
    profileImage: "",
    cancelRequest: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    // Sending a request
    alert("Your request has been submitted to the educator.");
    setShowEditForm(false);
  };

  const progress = 75;

  const missingItems = [
    { type: "assignment", message: "Algebra Homework #2 is overdue" },
    { type: "class", message: "Missed Calculus lecture on Wednesday" },
  ];

  const schedule = [
    { day: "Monday", time: "10:00 AM", subject: "Algebra", date: "2023-09-12" },
    {
      day: "Wednesday",
      time: "12:00 PM",
      subject: "Calculus",
      date: "2023-09-14",
    },
    {
      day: "Friday",
      time: "09:00 AM",
      subject: "Mechanics",
      date: "2023-09-16",
    },
  ];

  return (
    <div
      className="min-vh-100 profile-root p-4"
      style={{ backgroundColor: "#f5f5f5" }}
    >
      {showEditForm && (
        <div className="container">
          <div className="mt-4 w-100">
            <h5 className="fw-bold mb-3 section-title">Edit Request Form</h5>

            {/* Name */}
            <div className="mb-3">
              <label className="form-label about-subtitle fw-medium">Full Name</label>
              <input
                type="text"
                className="form-control border border-primary"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            {/* Phone 1 */}
            <div className="mb-3">
              <label className="form-label about-subtitle fw-medium">Phone 1</label>
              <input
                type="tel"
                className="form-control border border-primary"
                name="phone1"
                value={formData.phone1}
                onChange={handleInputChange}
              />
            </div>

            {/* Phone 2 */}
            <div className="mb-3">
              <label className="form-label about-subtitle fw-medium">Phone 2</label>
              <input
                type="tel"
                className="form-control border border-primary"
                name="phone2"
                value={formData.phone2}
                onChange={handleInputChange}
              />
            </div>

            {/* Profile Image Upload */}
            <div className="mb-3">
              <label className="form-label about-subtitle fw-medium">New Profile Image</label>
              <input
                type="file"
                className="form-control border border-primary"
                name="profileImage"
                accept="image/*"
                onChange={handleInputChange}
              />
            </div>

            {/* Cancel Subscription */}
            <div className="form-check mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="cancelRequest"
                name="cancelRequest"
                checked={formData.cancelRequest}
                onChange={handleInputChange}
              />
              <label className="form-check-label about-subtitle fw-medium" htmlFor="cancelRequest">
                Request to cancel subscription
              </label>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitRequest}
              type="submit"
              className="btn btn-light px-4 btn-edit-profile"
            >
              Submit Request
            </button>
            <button
              type="button"
              onClick={() => setShowEditForm(false)}
              className="ms-2 btn btn-light px-4 btn-edit-profile"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!showEditForm && (
        <div className="container-fluid">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold profile-main-title" tabIndex={0}>
              Student Profile
            </h2>
            <div className="d-flex align-items-center">
              <button
                className="btn btn-light px-4 btn-edit-profile me-2"
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
              <div className="card h-100 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex align-items-start mb-4">
                    <img
                      src="https://placehold.co/120x120?text=Student"
                      alt="avatar"
                      className="rounded-circle me-3"
                      style={{ width: "100px", height: "100px" }}
                      aria-label="User avatar"
                    />
                    <div>
                      <h4 className="fw-bold mb-1 profile-main-title">
                        Mohamed Ali Hassan El-Sayed
                      </h4>
                      <div className="text-accent small">Student</div>
                      <div className="text-accent small">Joined 2022</div>
                    </div>
                  </div>

                  {/* About Section */}
                  <h5 className="fw-bold section-title mb-3">About</h5>
                  <div className="row">
                    <div className="col-8">
                      <div className="d-flex flex-column gap-2">
                        <div className=" d-flex align-items-center px-3">
                          <i className="bi bi-person-badge me-2 text-primary"></i>
                          <div>
                            <strong className="me-2 about-subtitle">Professor:</strong>
                            <span className="fw-medium">Mr. Mohamed El-Mahdy</span>
                          </div>
                        </div>
                        <div className=" d-flex align-items-center px-3">
                          <i className="bi bi-people me-2 text-primary"></i>
                          <strong className="me-2 about-subtitle">Group:</strong>
                          <span className="fw-medium">Mostafa Kamel - 2</span>
                        </div>
                        <div className=" d-flex align-items-center px-3 ">
                          <i className="bi bi-mortarboard me-2 text-primary"></i>
                          <strong className="me-2 about-subtitle">Grade:</strong>
                          <span className="fw-medium">Senior 3</span>
                        </div>
                        <div className=" d-flex align-items-center px-3 ">
                          <i className="bi bi-hash me-2 text-primary"></i>
                          <strong className="me-2 about-subtitle">Code:</strong>
                          <span className="fw-medium">#2k23</span>
                        </div>
                        <div className=" d-flex align-items-center px-3">
                          <i className="bi bi-telephone me-2 text-primary"></i>
                          <strong className="me-2 about-subtitle">Phone 1:</strong>
                          <span className="fw-medium">01051456789</span>
                        </div>
                        <div className=" d-flex align-items-center px-3 ">
                          <i className="bi bi-telephone-plus me-2 text-primary"></i>
                          <strong className="me-2 about-subtitle">Phone 2:</strong>
                          <span className="fw-medium">01225456789</span>
                        </div>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="col-4 d-flex flex-column align-items-center justify-content-center">
                      <div className="text-center mb-2">
                        <small className="fw-bold about-subtitle fw-medium">
                          Student QR
                        </small>
                      </div>
                      <div className="qr-container">
                        <img
                          src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=StudentProfile:EmilyCarter"
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
                            <span className="badge bg-light text-primary border border-primary me-2">
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
                          <tr className="border-bottom">
                            <td className="fw-medium">Tuesday</td>
                            <td className="fw-medium">4:00 PM – 6:00 PM</td>
                            <td className="fw-medium">Algebra</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Thursday</td>
                            <td className="fw-medium">6:00 PM – 08:00 PM</td>
                            <td className="fw-medium">Mechanics</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Sunday</td>
                            <td className="fw-medium">2:00 PM – 4:00 PM</td>
                            <td className="fw-medium">Calculs</td>
                          </tr>
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
