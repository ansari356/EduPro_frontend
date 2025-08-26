import React, { useState, useEffect, useMemo } from "react";
import { Users, CheckCircle, BarChart2, Eye, Search, Filter, SortAsc, SortDesc, RefreshCw } from "lucide-react";
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

// Custom styles for active buttons
const buttonActiveStyle = {
	backgroundColor: 'var(--color-primary-dark)',
	color: 'white',
	transform: 'translateY(-1px)',
	boxShadow: '0 4px 12px rgba(51, 144, 236, 0.25)'
};

// Custom styles for disabled buttons
const buttonDisabledStyle = {
	opacity: 0.6,
	cursor: 'not-allowed',
	transform: 'none',
	pointerEvents: 'none'
};

// Add spin animation style
const spinStyle = {
	animation: 'spin 1s linear infinite'
};

const STUDENTS_PER_PAGE = 5; 

export default function EducatorStudentsList() {
  const navigate = useNavigate();
  
  // State for filters and pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("enrollment_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Debounced search term to avoid too many API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPageNumber(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Build API parameters
  const apiParams = useMemo(() => {
    const params = {
      page: pageNumber,
    };

    // Add search parameter
    if (debouncedSearchTerm.trim()) {
      params.search = debouncedSearchTerm.trim();
    }

    // Add status filter
    if (statusFilter !== "all") {
      params.is_active = statusFilter === "active";
    }

    // Add sorting
    const orderingValue = sortOrder === "desc" ? `-${sortBy}` : sortBy;
    params.ordering = orderingValue;

    return params;
  }, [pageNumber, debouncedSearchTerm, statusFilter, sortBy, sortOrder]);

  // Fetch data using the enhanced hook
  const { 
    students, 
    isLoading, 
    error, 
    totalCount,
    hasNext,
    hasPrevious,
    mutate
  } = useEducatorStudentsListData(apiParams);

  // Handle sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPageNumber(1); // Reset to first page when sorting
  };

  // Handle filter changes
  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setPageNumber(1); // Reset to first page when filtering
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setStatusFilter("all");
    setSortBy("enrollment_date");
    setSortOrder("desc");
    setPageNumber(1);
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm || statusFilter !== "all" || sortBy !== "enrollment_date" || sortOrder !== "desc";

  // Calculate statistics
  const stats = useMemo(() => {
    if (!students) return { total: 0, active: 0, avgLessons: 0 };
    
    return {
      total: totalCount || 0,
      active: students.filter(s => s.isActive).length,
      avgLessons: students.length > 0 
        ? Math.round(students.reduce((total, student) => total + (student.completedLessons || 0), 0) / students.length)
        : 0
    };
  }, [students, totalCount]);

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
								<div className="avatar-circle mx-auto w-fit">
									<Users size={24} />
								</div>
								<h4 className="section-title mb-1">{stats.total}</h4>
								<p className="profile-joined mb-0">Total Students</p>
							</div>
						</div>
					</div>

					<div className="col-md-4">
						<div className="card">
							<div className="card-body text-center">
								<div className="avatar-circle mx-auto w-fit">
									<CheckCircle size={24} />
								</div>
								<h4 className="section-title mb-1">{stats.active}</h4>
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
								<h4 className="section-title mb-1">{stats.avgLessons}</h4>
								<p className="profile-joined mb-0">Average Completed Lessons</p>
							</div>
						</div>
					</div>
				</div>

				{/* Students Table */}
				<section>
					{/* Search and Filter Bar */}
					<div className="card border-0 shadow-sm mb-3">
						<div className="card-body">
							{/* Main Filter Row */}
							<div className="row align-items-center mb-3">
								<div className="col-md-6">
									<div className="input-group">
										<span className="input-group-text bg-transparent border-end-0">
											<Search size={16} className="text-muted" />
										</span>
										<input
											type="text"
											className="form-control border-start-0"
											placeholder="Search students by name, email, or username..."
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
										/>
										{searchTerm && (
											<button
												className="btn-secondary-action btn-sm"
												type="button"
												onClick={() => setSearchTerm("")}
											>
												×
											</button>
										)}
									</div>
								</div>
								<div className="col-md-6">
									<div className="d-flex gap-2 justify-content-md-end align-items-center">
										<select
											className="form-select"
											style={{ width: 'auto' }}
											value={statusFilter}
											onChange={(e) => handleStatusFilterChange(e.target.value)}
										>
											<option value="all">All Status</option>
											<option value="active">Active Only</option>
											<option value="inactive">Inactive Only</option>
										</select>
										
										<button
											className="btn-secondary-action"
											style={showAdvancedFilters ? buttonActiveStyle : {}}
											onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
										>
											<Filter size={16} className="me-1" />
											Filters
										</button>

										<button
											className="btn-edit-profile"
											style={isLoading ? buttonDisabledStyle : {}}
											onClick={() => mutate()}
											disabled={isLoading}
										>
											<RefreshCw size={16} style={isLoading ? spinStyle : {}} />
										</button>

										{hasActiveFilters && (
											<button
												className="btn-secondary-action btn-sm"
												onClick={clearAllFilters}
											>
												Clear All
											</button>
										)}
									</div>
								</div>
							</div>

							{/* Advanced Filters */}
							{showAdvancedFilters && (
								<div className="row align-items-center p-3 bg-light rounded">
									<div className="col-md-6">
										<label className="form-label small text-muted mb-1">Sort By</label>
										<select
											className="form-select form-select-sm"
											value={sortBy}
											onChange={(e) => setSortBy(e.target.value)}
										>
											<option value="enrollment_date">Enrollment Date</option>
											<option value="student__full_name">Student Name</option>
											<option value="student__user__email">Email</option>
											<option value="student__user__username">Username</option>
											<option value="completed_lessons">Completed Lessons</option>
											<option value="last_activity">Last Activity</option>
										</select>
									</div>
									<div className="col-md-6">
										<label className="form-label small text-muted mb-1">Sort Order</label>
										<div className="d-flex gap-2 w-100">
											<button
												type="button"
												className="btn-secondary-action btn-sm flex-fill"
												style={sortOrder === 'asc' ? buttonActiveStyle : {}}
												onClick={() => setSortOrder('asc')}
											>
												<SortAsc size={14} className="me-1" />
												Ascending
											</button>
											<button
												type="button"
												className="btn-secondary-action btn-sm flex-fill"
												style={sortOrder === 'desc' ? buttonActiveStyle : {}}
												onClick={() => setSortOrder('desc')}
											>
												<SortDesc size={14} className="me-1" />
												Descending
											</button>
										</div>
									</div>
								</div>
							)}

							{/* Results Summary */}
							{hasActiveFilters && (
								<div className="mt-3 pt-3 border-top">
									<small className="text-muted">
										Showing {students?.length || 0} of {totalCount || 0} students
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
											<th 
												style={{...tableStyles.cell, ...tableStyles.responsive.header, cursor: 'pointer'}} 
												className="ps-5"
												onClick={() => handleSort('student__full_name')}
											>
												<div className="d-flex align-items-center">
													Student
													{sortBy === 'student__full_name' && (
														sortOrder === 'asc' ? <SortAsc size={14} className="ms-1" /> : <SortDesc size={14} className="ms-1" />
													)}
												</div>
											</th>
											<th style={{...tableStyles.cell, ...tableStyles.responsive.header}}>Contact</th>
											<th 
												style={{...tableStyles.cell, ...tableStyles.responsive.header, cursor: 'pointer'}}
												onClick={() => handleSort('enrollment_date')}
											>
												<div className="d-flex align-items-center">
													Enrollment
													{sortBy === 'enrollment_date' && (
														sortOrder === 'asc' ? <SortAsc size={14} className="ms-1" /> : <SortDesc size={14} className="ms-1" />
													)}
												</div>
											</th>
											<th style={{...tableStyles.cell, ...tableStyles.responsive.header}}>Progress</th>
											<th style={{...tableStyles.cell, ...tableStyles.responsive.header}}>Status</th>
											<th 
												style={{...tableStyles.cell, ...tableStyles.responsive.header, cursor: 'pointer'}}
												onClick={() => handleSort('last_activity')}
											>
												<div className="d-flex align-items-center">
													Last Activity
													{sortBy === 'last_activity' && (
														sortOrder === 'asc' ? <SortAsc size={14} className="ms-1" /> : <SortDesc size={14} className="ms-1" />
													)}
												</div>
											</th>
											<th style={{...tableStyles.cell, ...tableStyles.responsive.header}} className="ps-5">Actions</th>
										</tr>
									</thead>
									<tbody>
										{students?.map((student) => (
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
															{student.avatar ? (
																<img 
																	src={student.avatar} 
																	alt={student.fullName}
																	style={tableStyles.avatar}
																/>
															) : (
																<span style={{ fontSize: '16px', fontWeight: '600' }}>
																	{student.fullName?.split(' ').map(n => n.charAt(0)).join('').toUpperCase() || 'S'}
																</span>
															)}
														</div>
														<div>
															<div className="fw-bold text-main">{student.fullName}</div>
															<small className="text-muted">@{student.username || 'student'}</small>
														</div>
													</div>
												</td>
												<td className="px-4 py-3" style={tableStyles.cell}>
													<div className="d-flex flex-column">
														<div className="mb-1">
															<small className="text-muted d-block">Email</small>
															<span className="small">{student.email || "N/A"}</span>
														</div>
														<div>
															<small className="text-muted d-block">Phone</small>
															<span className="small">{student.student?.user?.phone || "N/A"}</span>
														</div>
													</div>
												</td>
												<td className="px-4 py-3" style={tableStyles.cell}>
													<div className="d-flex flex-column">
														<div className="mb-1">
															<small className="text-muted d-block">Enrolled</small>
															<span className="small">{new Date(student.enrollmentDate).toLocaleDateString()}</span>
														</div>
														<div>
															<small className="text-muted d-block">Notes</small>
															<span className="small">{student.notes || "No notes"}</span>
														</div>
													</div>
												</td>
												<td className="px-4 py-3" style={tableStyles.cell}>
													<div className="d-flex flex-column">
														<div className="mb-1">
															<small className="text-muted d-block">Lessons</small>
															<span className="fw-medium">{student.completedLessons}</span>
														</div>
														<div>
															<small className="text-muted d-block">Courses</small>
															<span className="fw-medium">{student.completedCourses}</span>
														</div>
													</div>
												</td>
												<td className="px-4 py-3" style={tableStyles.cell}>
													<span
														className={`badge ${
															student.isActive
																? "badge-success-custom"
																: "badge-warning-custom"
														}`}
													>
														{student.isActive ? "Active" : "Inactive"}
													</span>
												</td>
												<td className="px-4 py-3" style={tableStyles.cell}>
													<div className="d-flex flex-column">
														<div className="mb-1">
															<small className="text-muted d-block">Last Seen</small>
															<span className="small">
																{student.lastActivity 
																	? new Date(student.lastActivity).toLocaleDateString()
																	: "Never"
																}
															</span>
														</div>
													</div>
												</td>
												<td className="px-4 py-3" style={tableStyles.cell}>
													<button
														className="btn-secondary-action btn-sm d-flex align-items-center"
														onClick={() =>
															navigate(
																pagePaths.educator.studentDetails(student?.student?.user?.id || student?.id)
															)
														}
														aria-label={`View profile of ${student.fullName}`}
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
							{(!students || students.length === 0) && !isLoading && (
								<div className="text-center py-5">
									<Users size={48} className="text-muted mb-3" />
									<h5 className="text-muted">
										{hasActiveFilters
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
									{hasActiveFilters ? (
										<button
											className="btn-secondary-action mt-3"
											onClick={clearAllFilters}
										>
											Clear All Filters
										</button>
									) : null}
								</div>
							)}
						</div>
					</div>

					{/* Pagination */}
					{totalCount > 5 && (
						<div className="d-flex justify-content-between align-items-center mt-4">
							<div className="text-muted small">
								Showing {((pageNumber - 1) * 5) + 1} to {Math.min(pageNumber * 5, totalCount)} of {totalCount} students
							</div>
							<nav aria-label="Page navigation">
								<div className="d-flex gap-2 align-items-center">
									<button
										className="btn-secondary-action btn-sm"
										style={!hasPrevious ? buttonDisabledStyle : {}}
										onClick={() => setPageNumber(prev => prev - 1)}
										disabled={!hasPrevious}
									>
										Previous
									</button>
									
									{/* Page Numbers */}
									<div className="d-flex gap-1">
										{Array.from(
											{ length: Math.min(5, Math.ceil(totalCount / 5)) },
											(_, i) => {
												const startPage = Math.max(1, pageNumber - 2);
												const pageNum = startPage + i;
												const maxPage = Math.ceil(totalCount / 5);
												
												if (pageNum > maxPage) return null;
												
												return (
													<button
														key={pageNum}
														className="btn-secondary-action btn-sm"
														style={pageNumber === pageNum ? buttonActiveStyle : {}}
														onClick={() => setPageNumber(pageNum)}
													>
														{pageNum}
													</button>
												);
											}
										).filter(Boolean)}
									</div>
									
									<button
										className="btn-secondary-action btn-sm"
										style={!hasNext ? buttonDisabledStyle : {}}
										onClick={() => setPageNumber(prev => prev + 1)}
										disabled={!hasNext}
									>
										Next
									</button>
								</div>
							</nav>
						</div>
					)}
				</section>
			</div>
		</div>
	);
}
