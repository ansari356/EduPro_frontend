import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function StudentProfile() {
  const [isBlocked, setIsBlocked] = useState(false);

  const [formData] = useState({
    name: "Mohamed Ali Hassan El-Sayed",
    phone1: "01051456789",
    phone2: "01225456789",
    notes: "",
    profileImage: "",
  });

  const progress = 75;

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
                  isBlocked ? "btn-danger" : "btn-outline-danger"
                }`}
                onClick={toggleBlockStudent}
              >
                {isBlocked ? "Unblock Student" : "Block Student"}
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
                      src="https://placehold.co/120x120?text=Student"
                      alt="avatar"
                      className="rounded-circle me-3"
                      style={{ width: "100px", height: "100px" }}
                    />
                    <div>
                      <h4 className="fw-bold mb-1 profile-main-title">
                        {formData.name}
                      </h4>
                      <div className="small">Student</div>
                      <div className="small">Joined 2022</div>
                    </div>
                  </div>

                  <h5 className="fw-bold section-title mb-3">About</h5>
                  <div className="row">
                    <div className="col-xl-8">
                      <div className="d-flex flex-column gap-2">
                        <div className="d-flex align-items-center px-3">
                          <i className="bi bi-person-badge me-2 text-primary"></i>
                          <strong className="me-2">Professor:</strong>
                          <span className="small">Mr. Mohamed El-Mahdy</span>
                        </div>
                        <div className="d-flex align-items-center px-3">
                          <i className="bi bi-people me-2 text-primary"></i>
                          <strong className="me-2">Group:</strong>
                          <span className="small">Mostafa Kamel - 2</span>
                        </div>
                        <div className="d-flex align-items-center px-3">
                          <i className="bi bi-mortarboard me-2 text-primary"></i>
                          <strong className="me-2">Grade:</strong>
                          <span className="small">Senior 3</span>
                        </div>
                        <div className="d-flex align-items-center px-3">
                          <i className="bi bi-hash me-2 text-primary"></i>
                          <strong className="me-2">Code:</strong>
                          <span className="small">#2k23</span>
                        </div>
                        <div className="d-flex align-items-center px-3">
                          <i className="bi bi-telephone me-2 text-primary"></i>
                          <strong className="me-2">Phone 1:</strong>
                          <span className="small">{formData.phone1}</span>
                        </div>
                        <div className="d-flex align-items-center px-3">
                          <i className="bi bi-telephone-plus me-2 text-primary"></i>
                          <strong className="me-2">Phone 2:</strong>
                          <span className="small">{formData.phone2}</span>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-4 d-flex flex-column align-items-center justify-content-center">
                      <div className="text-center mb-2">
                        <small className="fw-bold fw-medium">Student QR</small>
                      </div>
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=StudentProfile:MohamedAliHassan"
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
                            {item.type === "assignment"
                              ? "Assignment"
                              : "Class"}
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
                              <td>
                                {new Date(exam.date).toLocaleDateString()}
                              </td>
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
