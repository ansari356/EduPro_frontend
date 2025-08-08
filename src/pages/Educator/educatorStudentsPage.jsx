import React from "react";
import { Users, CheckCircle, BarChart2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { pagePaths } from "../../pagePaths";

// Sample students data (replace with real API data)
const students = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    enrolledDate: "2023-02-15",
    isActive: true,
    progress: 78,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    enrolledDate: "2023-01-10",
    isActive: true,
    progress: 88,
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael.j@example.com",
    enrolledDate: "2023-03-01",
    isActive: false,
    progress: 55,
  },
  // Add more students...
];

export default function EducatorStudentsList() {
  const navigate = useNavigate();

  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.isActive).length;
  const averageProgress = totalStudents
    ? Math.round(
        students.reduce((sum, s) => sum + s.progress, 0) / totalStudents
      )
    : 0;

  return (
    <div className="min-vh-100 profile-root p-4">
      <div className="container">
        {/* Header */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="container py-3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <div className="header-avatar me-2 mx-auto w-fit">
                  <Users size={20} />
                </div>
                <div>
                  <span className="section-title mb-0">My Students</span>
                  <p className="profile-role mb-0">
                    Manage your enrolled students
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body text-center">
                <div className="avatar-circle mb-2 mx-auto w-fit">
                  <Users size={24} />
                </div>
                <h4 className="section-title mb-1">{totalStudents}</h4>
                <p className="profile-joined mb-0">Total Students</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-body text-center">
                <div className="avatar-circle mb-2 mx-auto w-fit">
                  <CheckCircle size={24} />
                </div>
                <h4 className="section-title mb-1">{activeStudents}</h4>
                <p className="profile-joined mb-0">Active Students</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-body text-center">
                <div className="avatar-circle mb-2 mx-auto w-fit">
                  <BarChart2 size={24} />
                </div>
                <h4 className="section-title mb-1">{averageProgress}%</h4>
                <p className="profile-joined mb-0">Average Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Students Grid */}
        <section>
          <div className="d-flex align-items-center gap-2 mb-4">
            <div className="avatar-circle">
              <Users size={28} />
            </div>
            <h2 className="main-title mb-0">Student Management</h2>
          </div>

          <div className="row g-4">
            {students.map((student) => (
              <div className="col-md-6 col-xl-4" key={student.id}>
                <div className="card h-100 d-flex flex-column">
                  <div className="card-body d-flex flex-column">
                    <h5 className="section-title mb-2">{student.name}</h5>
                    <p className="profile-role mb-1">{student.email}</p>
                    <p className="profile-joined mb-3">
                      Enrolled:{" "}
                      {new Date(student.enrolledDate).toLocaleDateString()}
                    </p>

                    <p className="mb-3">
                      Status: {student.isActive ? "Active" : "Inactive"}
                    </p>

                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <span>Progress: {student.progress}%</span>
                      <button
                        className="btn-edit-profile d-flex align-items-center"
                        onClick={() =>
                          navigate(
                            pagePaths.educator.studentDetails(student.id)
                          )
                        }
                        aria-label={`View profile of ${student.name}`}
                      >
                        <Eye size={16} className="me-1" />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
