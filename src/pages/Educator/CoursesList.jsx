import { LibraryBig, Clock, Users, Star, Award, TrendingUp, Edit, Trash2, Eye, DollarSign } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useEducatorCoursesData from "../../apis/hooks/educator/useEducatorCoursesData";
import useEducatorProfileData from "../../apis/hooks/educator/useEducatorProfileData";
import useEducatorStudentsListData from "../../apis/hooks/educator/useEducatorStudentsListData";
import useEducatorTotalRevenue from "../../apis/hooks/educator/useEducatorTotalRevenue";
import {pagePaths} from "../../pagePaths";
export default function EducatorCoursesList() {
  const {data:educator} = useEducatorProfileData();
  const {data:courses} = useEducatorCoursesData();
  const {studentsCount} = useEducatorStudentsListData()
  const {totalRevenue}= useEducatorTotalRevenue()
  const totalStudents = studentsCount;
  const publishedCourses = courses?.results?.filter(
		(course) => course?.is_published === true
	);
  const averageRating = educator?.rating
  return (
		<div className="min-vh-100 profile-root p-4">
			<div className="container">
				{/* Header */}
				<div className="card border-0 shadow-sm mb-4">
					<div className="container py-3">
						<div className="d-flex align-items-center justify-content-between">
							<div className="d-flex align-items-center">
								<div className="header-avatar me-2 mx-auto w-fit">
									<LibraryBig size={20} />
								</div>
								<div>
									<span className="section-title mb-0">My Courses</span>
									<p className="profile-role mb-0">
										Manage your course content and track performance
									</p>
								</div>
							</div>

							<Link to="/courses/create" className="text-decoration-none">
								<button className="btn-edit-profile d-flex align-items-center">
									<i className="bi bi-plus-lg me-2"></i>
									Create New Course
								</button>
							</Link>
						</div>
					</div>
				</div>

				{/* Stats Overview */}
				<div className="row g-3 mb-4">
					<div className="col-md-3">
						<div className="card">
							<div className="card-body text-center">
								<div className="avatar-circle mb-2 mx-auto w-fit">
									<LibraryBig size={24} />
								</div>
								<h4 className="section-title mb-1">{publishedCourses?.length}</h4>
								<p className="profile-joined mb-0">Published Courses</p>
							</div>
						</div>
					</div>
					<div className="col-md-3">
						<div className="card">
							<div className="card-body text-center">
								<div className="avatar-circle mb-2 mx-auto w-fit">
									<Users size={24} />
								</div>
								<h4 className="section-title mb-1">
									{totalStudents?.toLocaleString()}
								</h4>
								<p className="profile-joined mb-0">Total Students</p>
							</div>
						</div>
					</div>
					<div className="col-md-3">
						<div className="card">
							<div className="card-body text-center">
								<div className="avatar-circle mb-2 mx-auto w-fit">
									<DollarSign size={24} />
								</div>
								<h4 className="section-title mb-1">
									${totalRevenue?.toLocaleString()}
								</h4>
								<p className="profile-joined mb-0">Total Revenue</p>
							</div>
						</div>
					</div>
					<div className="col-md-3">
						<div className="card">
							<div className="card-body text-center">
								<div className="avatar-circle mb-2 mx-auto w-fit">
									<Star size={24} />
								</div>
								<h4 className="section-title mb-1">{averageRating}</h4>
								<p className="profile-joined mb-0">Average Rating</p>
							</div>
						</div>
					</div>
				</div>

				{/* Courses Grid */}
				<section>
					<div className="row g-4">
						{courses?.results?.map((course) => (
								<EducatorCourseCard course={course} key={course?.id} />
						))}
					</div>
				</section>
			</div>
		</div>
	);
}

function EducatorCourseCard({ course }) {
  const navigate = useNavigate();
  const imgPlaceholder = () => `https://placehold.co/300x200?text${course?.title}`
	/* 
   New API Response Structure:
   courses = {
        "count": 1,
        "next": null,
        "previous": null,
        "results": [
            {
                "id": "b259b8be-b0a6-43b1-b5a0-026210797c87",
                "title": "Introduction to Astrophysics",
                "description": "Introduction to Astrophysics is the study of the physical nature of celestial objects...",
                "trailer_video": null,
                "price": "100.00",
                "is_published": true,
                "is_free": false,
                "category": {
                    "id": "2c746147-7e28-4f90-8e50-b3af0e662f65",
                    "name": "Physics",
                    "icon": null
                },
                "thumbnail": "http://127.0.0.1:8000/media/course_thumbnails/maxresdefault.jpg",
                "created_at": "2025-08-23T13:58:31.197484Z",
                "total_enrollments": 5,
                "total_lessons": 3,
                "total_reviews": 1,
                "average_rating": "5.00",
                "total_durations": 0
            }
        ]
    }
    
    Individual course object structure remains the same
    */
	const getStatusColor = (status) => {
		switch (status) {
      case true:
        return "text-accent";
      case false:
        return "profile-joined";
			case "Published":
				return "text-accent";
			case "Draft":
				return "profile-joined";
			case "Under Review":
				return "text-warning";
			case "Rejected":
				return "text-danger";
			default:
				return "profile-joined";
		}
	};

	return (
		<div className="col-md-6 col-xl-4">
			<div className="card h-100 d-flex flex-column">
				<div className="position-relative">
					<img
						src={course?.thumbnail || imgPlaceholder()}
						alt={course?.title}
						className="course-card-image"
					/>
					<div className="position-absolute top-0 end-0 m-2">
						<span
							className={`about-bubble ${getStatusColor(course?.is_published)}`}
						>
							{course?.is_published ? "Published" : "Draft"}
						</span>
					</div>
				</div>

				<div className="card-body d-flex flex-column flex-grow-1">
					{/* Course Title and Category */}
					<div className="mb-2">
						<h5 className="section-title mb-1">{course?.title}</h5>
						<p className="profile-role mb-0">{course?.category?.name}</p>
					</div>
					{/* Course Performance Stats */}
					<div className="row g-2 mb-3">
						<div className="col-6">
							<div className="d-flex align-items-center">
								<Users size={14} className="me-1 text-muted" />
								<small className="profile-joined">
									{course?.total_enrollments} students
								</small>
							</div>
						</div>
						<div className="col-6">
							<div className="d-flex align-items-center">
								<Star size={14} className="me-1 text-muted" />
								<small className="profile-joined">
									{course?.average_rating	 || "No rating"}
								</small>
							</div>
						</div>
						<div className="col-6">
							<div className="d-flex align-items-center">
								<Clock size={14} className="me-1 text-muted" />
								<small className="profile-joined">
									{course?.total_lessons} lessons
								</small>
							</div>
						</div>
						<div className="col-6">
							<div className="d-flex align-items-center">
								<i
									className="bi bi-currency-dollar me-1 text-muted"
									size={14}
								></i>
								<small className="text-accent fw-bold">
									{course?.total_enrollments * course?.price}
								</small>
							</div>
						</div>
					</div>

					{/* Course Info */}
					<div className="mt-auto">
						<div className="d-flex justify-content-between align-items-center mb-2">
							<span className="about-subtitle">Status:</span>
							<span
								className={`fw-bold ${getStatusColor(course?.is_published)}`}
							>
								{course?.is_published ? "Published" : "Draft"}
							</span>
						</div>

						<div className="mb-3">
							<small className="profile-joined">
								<strong>Last updated:</strong>{" "}
								{new Date(course?.created_at).toDateString()}
							</small>
						</div>

						{/* Action Buttons */}
						<div className="d-flex gap-2 mb-3">
							<button
								className="btn-edit-profile flex-fill d-flex align-items-center justify-content-center"
								onClick={() => navigate(pagePaths.educator.courseDetails(course?.id))}
							>
								<Eye size={16} className="me-1" />
								View
							</button>
							<button
								className="btn-secondary-action flex-fill d-flex align-items-center justify-content-center"
								onClick={() => navigate(pagePaths.educator.editCourse(course?.id))}
							>
								<Edit size={16} className="me-1" />
								Edit
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
