import React, { useState } from "react";
import { Users, CheckCircle, BarChart2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { pagePaths } from "../../pagePaths";
import useEducatorStudentsListData from "../../apis/hooks/educator/useEducatorStudentsListData";

const STUDENTS_PER_PAGE = 5; 

export default function EducatorStudentsList() {
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);
  const { data: students, isLoading, error, studentsCount } = useEducatorStudentsListData(pageNumber);

  if (isLoading) {
    return (
      <div className="min-vh-100 profile-root p-4 d-flex justify-content-center align-items-center">
        <p>Loading students data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 profile-root p-4 d-flex justify-content-center align-items-center">
        <p>Error loading students: {error.message}</p>
      </div>
    );
  }



  return (
		<div className="min-vh-100 profile-root p-4">
			<div className="container">
				{/* Header */}
				<div className="card border-0 shadow-sm mb-4">
					<div className="container py-3">
						<div className="d-flex align-items-center ">
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
								<h4 className="section-title mb-1">{studentsCount}</h4>
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
								<h4 className="section-title mb-1">{studentsCount}</h4>
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
								<h4 className="section-title mb-1">
									{students.reduce(
										(total, student) => total + student.completed_lessons,
										0
									) / students?.length}
								</h4>
								<p className="profile-joined mb-0">Average Completed Lessons</p>
							</div>
						</div>
					</div>
				</div>

				{/* Students Grid */}
				<section>

					<div className="row g-4">
						{students.map((student) => (
							<div className="col-md-6 col-xl-4" key={student.id}>
								<div className="card h-100 d-flex flex-column">
									<div className="card-body d-flex flex-column">
										<div className="d-flex justify-content-between align-items-start mb-2">
											<h5 className="section-title mb-0">
												{student.student.full_name}
											</h5>
											<span
												className={`badge ${
													student.is_active
														? "badge-success-custom"
														: "badge-warning-custom"
												}`}
											>
												{student.is_active ? "Active" : "Inactive"}
											</span>
										</div>

										<p className="profile-role mb-1">
											{student.student.user.email}
										</p>
										<p className="profile-joined mb-1">
											Phone: {student.student.user.phone || "N/A"}
										</p>
										<p className="profile-joined mb-3">
											Parent Phone: {student.student.user.parent_phone || "N/A"}
										</p>

										<div className="d-flex justify-content-between align-items-center mb-3">
											<p className="profile-joined mb-0">
												Enrolled:{" "}
												{new Date(student.enrollment_date).toLocaleDateString()}
											</p>
											<p className="profile-joined mb-0">
												Last Activity:{" "}
												{student.last_activity
													? new Date(student.last_activity).toLocaleDateString()
													: "N/A"}
											</p>
										</div>

										<div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
											<span className="section-title mb-0">
												Lessons: {student.completed_lessons} (Courses:{" "}
												{student.number_of_completed_courses})
											</span>
											<button
												className="btn-edit-profile d-flex align-items-center"
												onClick={() =>
													navigate(
														pagePaths.educator.studentDetails(student?.student.user.id)
													)
												}
												aria-label={`View profile of ${student.student.full_name}`}
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

					{/* Pagination */}
					{studentsCount > STUDENTS_PER_PAGE && (
						<nav aria-label="Page navigation">
							<ul className="pagination justify-content-center mt-4">
								<li
									className={`page-item ${pageNumber === 1 ? "disabled" : ""}`}
								>
									<button
										className="page-link"
										onClick={() =>
											setPageNumber((prev) => Math.max(1, prev - 1))
										}
									>
										Previous
									</button>
								</li>
								{Array.from(
									{ length: Math.ceil(studentsCount / STUDENTS_PER_PAGE) },
									(_, i) => (
										<li
											key={i + 1}
											className={`page-item ${
												pageNumber === i + 1 ? "active" : ""
											}`}
										>
											<button
												className="page-link"
												onClick={() => setPageNumber(i + 1)}
											>
												{i + 1}
											</button>
										</li>
									)
								)}
								<li
									className={`page-item ${
										pageNumber === Math.ceil(studentsCount / STUDENTS_PER_PAGE)
											? "disabled"
											: ""
									}`}
								>
									<button
										className="page-link"
										onClick={() =>
											setPageNumber((prev) =>
												Math.min(
													Math.ceil(studentsCount / STUDENTS_PER_PAGE),
													prev + 1
												)
											)
										}
									>
										Next
									</button>
								</li>
							</ul>
						</nav>
					)}
				</section>
			</div>
		</div>
	);
}
