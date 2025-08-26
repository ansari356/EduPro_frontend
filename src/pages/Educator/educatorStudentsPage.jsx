import React, { useState } from "react";
import { Users, CheckCircle, BarChart2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { pagePaths } from "../../pagePaths";
import useEducatorStudentsListData from "../../apis/hooks/educator/useEducatorStudentsListData";

// Custom styles for the students table
const tableStyles = {
	table: {
		borderCollapse: 'separate',
		borderSpacing: 0,
	},
	header: {
		backgroundColor: 'var(--color-secondary)',
		borderBottom: '2px solid var(--color-border)',
	},
	row: {
		borderBottom: '1px solid var(--color-border-light)',
		transition: 'background-color 0.2s ease',
	},
	rowHover: {
		backgroundColor: 'var(--color-secondary)',
	},
	cell: {
		border: 'none',
		verticalAlign: 'middle',
	},
	avatar: {
		width: '40px',
		height: '40px',
		borderRadius: '50%',
		objectFit: 'cover',
		border: '2px solid var(--color-border-light)',
	},
	// Responsive styles
	responsive: {
		table: {
			minWidth: '800px', 
		},
		cell: {
			padding: '12px 16px',
		},
		header: {
			padding: '16px',
		},
	},
};

const STUDENTS_PER_PAGE = 5; 

export default function EducatorStudentsList() {
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: students, isLoading, error, studentsCount } = useEducatorStudentsListData(pageNumber);

  // Filter students based on search term and status
  const filteredStudents = students?.filter(student => {
    const matchesSearch = searchTerm === "" || 
      student.student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student.user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && student.is_active) ||
      (statusFilter === "inactive" && !student.is_active);
    
    return matchesSearch && matchesStatus;
  }) || [];

  if (isLoading) {
    return (
      <div className="min-vh-100 profile-root p-4 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="loading-spinner mb-3"></div>
          <h5 className="text-main">Loading Students</h5>
          <p className="text-muted">Please wait while we fetch your student data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    // Check if it's an authentication error
    const isAuthError = error.message?.includes('401') || 
                       error.message?.includes('Authentication') ||
                       error.message?.includes('Unauthorized');
    
    return (
      <div className="min-vh-100 profile-root p-4 d-flex justify-content-center align-items-center">
        <div className="text-center">
          {isAuthError ? (
            <>
              <div className="mb-4">
                <Users size={64} className="text-warning mb-3" />
                <h4 className="text-main">Authentication Required</h4>
                <p className="text-muted">
                  You need to be logged in to view your students.
                </p>
              </div>
              <button
                className="btn-edit-profile"
                onClick={() => navigate('/educator/login')}
              >
                Go to Login
              </button>
            </>
          ) : (
            <>
              <div className="mb-4">
                <Users size={64} className="text-danger mb-3" />
                <h4 className="text-main">Error Loading Students</h4>
                <p className="text-muted">
                  {error.message || 'An unexpected error occurred'}
                </p>
              </div>
              <button
                className="btn-edit-profile"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    );
  }



  return (
		<div className="min-vh-100 profile-root p-4 educator-students-page">
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
						<div className="card stats-card">
							<div className="card-body text-center">
								<div className="avatar-circle mx-auto w-fit">
									<Users size={24} />
								</div>
								<h4 className="section-title mb-1 stats-number">{filteredStudents.length}</h4>
								<p className="profile-joined mb-0 stats-label">Filtered Students</p>
							</div>
						</div>
					</div>

					<div className="col-md-4">
						<div className="card stats-card">
							<div className="card-body text-center">
								<div className="avatar-circle mx-auto w-fit">
									<CheckCircle size={24} />
								</div>
								<h4 className="section-title mb-1 stats-number">
									{filteredStudents.filter(s => s.is_active).length}
								</h4>
								<p className="profile-joined mb-0 stats-label">Active Students</p>
							</div>
						</div>
					</div>

					<div className="col-md-4">
						<div className="card stats-card">
							<div className="card-body text-center">
								<div className="avatar-circle mb-2 mx-auto w-fit">
									<BarChart2 size={24} />
								</div>
								<h4 className="section-title mb-1 stats-number">
									{filteredStudents.length > 0 
										? Math.round(filteredStudents.reduce(
											(total, student) => total + (student.completed_lessons || 0),
											0
										) / filteredStudents.length)
										: 0
									}
								</h4>
								<p className="profile-joined mb-0 stats-label">Average Completed Lessons</p>
							</div>
						</div>
					</div>
				</div>

				{/* Students Table */}
				<section>
					{/* Search and Filter Bar */}
					<div className="card border-0 shadow-sm mb-3 search-filter-card">
						<div className="card-body">
							<div className="row align-items-center">
								<div className="col-md-6">
									<div className="input-group">
										<span className="input-group-text bg-transparent border-end-0">
											<Users size={16} className="text-muted" />
										</span>
										<input
											type="text"
											className="form-control border-start-0"
											placeholder="Search students by name, email, or username..."
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
										/>
									</div>
								</div>
								<div className="col-md-6 text-md-end">
									<div className="d-flex gap-2 justify-content-md-end align-items-center">
										<select
											className="form-select"
											style={{ width: 'auto' }}
											value={statusFilter}
											onChange={(e) => setStatusFilter(e.target.value)}
										>
											<option value="all">All Status</option>
											<option value="active">Active Only</option>
											<option value="inactive">Inactive Only</option>
										</select>
										{(searchTerm || statusFilter !== "all") && (
											<button
												className="btn btn-outline-secondary btn-sm"
												onClick={() => {
													setSearchTerm("");
													setStatusFilter("all");
												}}
											>
												Clear Filters
											</button>
										)}
									</div>
								</div>
							</div>
							{/* Results Summary */}
							{(searchTerm || statusFilter !== "all") && (
								<div className="mt-3 pt-3 border-top">
									<small className="text-muted">
										Showing {filteredStudents.length} of {studentsCount} students
										{searchTerm && ` matching "${searchTerm}"`}
										{statusFilter !== "all" && ` (${statusFilter} only)`}
									</small>
								</div>
							)}
						</div>
					</div>

					<div className="card border-0 shadow-sm">
						<div className="card-body p-0">
							<div className="table-responsive">
								<table className="table mb-0" style={{...tableStyles.table, ...tableStyles.responsive.table}}>
									<thead>
										<tr style={tableStyles.header}>
											<th style={{...tableStyles.cell, ...tableStyles.responsive.header}} className="ps-5">Student</th>
											<th style={{...tableStyles.cell, ...tableStyles.responsive.header}}>Phone Number</th>
											<th style={{...tableStyles.cell, ...tableStyles.responsive.header}}>Enrollment</th>
											<th style={{...tableStyles.cell, ...tableStyles.responsive.header}} >Status</th>
											<th style={{...tableStyles.cell, ...tableStyles.responsive.header}} className="ps-5">Actions</th>
										</tr>
									</thead>
									<tbody>
										{filteredStudents.map((student) => (
											<tr 
												key={student.id} 
												className="align-middle"
												style={tableStyles.row}
												onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tableStyles.rowHover.backgroundColor}
												onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
											>
												<td className="px-4 py-3" style={tableStyles.cell}>
													<div className="d-flex align-items-center">
														<div className="avatar-circle me-3 mb-0" style={{ width: '40px', height: '40px', margin: '0' }}>
															{student.student.profile_picture ? (
																<img 
																	src={student.student.profile_picture} 
																	alt={student.student.full_name}
																	style={tableStyles.avatar}
																/>
															) : (
																<span style={{ fontSize: '16px', fontWeight: '600' }}>
																	{student.student.full_name?.split(' ').map(n => n.charAt(0)).join('').toUpperCase() || 'S'}
																</span>
															)}
														</div>
														<div>
															<div className="fw-bold text-main">{student.student.full_name}</div>
															<small className="text-muted">@{student.student.user.username || 'student'}</small>
														</div>
													</div>
												</td>
												<td className="px-4 py-3" style={tableStyles.cell}>
													<div className="d-flex flex-column">
														<div className="mb-1">
															<small className="text-muted d-block">Phone</small>
															{student.student.user.phone || "N/A"}
														</div>
													</div>
												</td>
												<td className="px-4 py-3" style={tableStyles.cell}>
													<div className="d-flex flex-column">
														<div className="mb-1">
															<small className="text-muted d-block">Enrolled</small>
															{new Date(student.enrollment_date).toLocaleDateString()}
														</div>
													</div>
												</td>
												<td className="px-4 py-3" style={tableStyles.cell}>
													<span
														className={`badge ${
															student.is_active
																? "badge-success-custom"
																: "badge-warning-custom"
														}`}
													>
														{student.is_active ? "Active" : "Inactive"}
													</span>
												</td>
												<td className="px-4 py-3" style={tableStyles.cell}>
													<button
														className="btn-secondary-action btn-sm d-flex align-items-center"
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
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							
							{/* Empty State */}
							{(!filteredStudents || filteredStudents.length === 0) && (
								<div className="text-center py-5">
									<Users size={48} className="text-muted mb-3" />
									<h5 className="text-muted">
										{searchTerm || statusFilter !== "all" 
											? "No Students Match Your Filters" 
											: "No Students Found"
										}
									</h5>
									<p className="text-muted mb-0">
										{searchTerm || statusFilter !== "all"
											? "Try adjusting your search terms or filters."
											: "You haven't enrolled any students yet."
										}
									</p>
									{searchTerm || statusFilter !== "all" ? (
										<button
											className="btn btn-secondary-action btn-sm mt-3"
											onClick={() => {
												setSearchTerm("");
												setStatusFilter("all");
											}}
										>
											Clear All Filters
										</button>
									) : null}
								</div>
							)}
						</div>
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
