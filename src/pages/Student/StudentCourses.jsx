import React, { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { pagePaths } from "../../pagePaths";
import { 
  BookOpen, 
  Clock, 
  User, 
  BarChart3, 
  Calendar,
  CheckCircle,
  Play,
  Filter,
  Search
} from "lucide-react";

function StudentCourses() {
  const { educatorUsername } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Dummy enrolled courses data - replace with real API call
  const enrolledCourses = [
    {
      id: 1,
      title: "Data Analysis Fundamentals",
      description: "Master the fundamentals of data analysis with this comprehensive course. Learn to collect, clean, analyze, and visualize data using industry-standard tools.",
      instructor: "Dr. Sarah Johnson",
      image: "https://placehold.co/400x250?text=Data+Analysis",
      progress: 75,
      status: "Active",
      enrolledDate: "2024-01-15",
      nextLesson: {
        title: "Statistical Analysis Methods",
        date: "2025-01-20",
        time: "10:00 AM"
      },
      totalLessons: 24,
      completedLessons: 18,
      duration: "12 weeks",
      category: "Data Science",
      rating: 4.8
    },
    {
      id: 2,
      title: "Advanced Excel Techniques for Business",
      description: "Unlock the full potential of Microsoft Excel with advanced formulas, data analysis tools, and automation techniques.",
      instructor: "Prof. Michael Chen",
      image: "https://placehold.co/400x250?text=Advanced+Excel",
      progress: 60,
      status: "Active",
      enrolledDate: "2024-02-01",
      nextLesson: {
        title: "VBA Programming Basics",
        date: "2025-01-22",
        time: "2:00 PM"
      },
      totalLessons: 16,
      completedLessons: 10,
      duration: "8 weeks",
      category: "Business Skills",
      rating: 4.9
    },
    {
      id: 3,
      title: "Data Visualization Mastery with Tableau",
      description: "Create stunning, interactive data visualizations and dashboards using Tableau. Learn best practices for visual design and storytelling.",
      instructor: "Alex Rodriguez",
      image: "https://placehold.co/400x250?text=Tableau+Mastery",
      progress: 95,
      status: "Nearly Complete",
      enrolledDate: "2023-11-10",
      nextLesson: {
        title: "Final Capstone Project",
        date: "2025-01-18",
        time: "3:00 PM"
      },
      totalLessons: 20,
      completedLessons: 19,
      duration: "10 weeks",
      category: "Data Visualization",
      rating: 4.7
    },
    {
      id: 4,
      title: "Machine Learning Fundamentals",
      description: "Introduction to machine learning concepts, algorithms, and practical applications in real-world scenarios.",
      instructor: "Dr. Sarah Johnson",
      image: "https://placehold.co/400x250?text=Machine+Learning",
      progress: 30,
      status: "Active",
      enrolledDate: "2024-12-01",
      nextLesson: {
        title: "Supervised Learning Algorithms",
        date: "2025-01-21",
        time: "11:00 AM"
      },
      totalLessons: 18,
      completedLessons: 5,
      duration: "14 weeks",
      category: "Machine Learning",
      rating: 4.8
    },
    {
      id: 5,
      title: "Web Development with React",
      description: "Learn modern web development using React, including components, state management, and building responsive applications.",
      instructor: "Jessica Smith",
      image: "https://placehold.co/400x250?text=React+Development",
      progress: 100,
      status: "Completed",
      enrolledDate: "2023-09-15",
      completedDate: "2023-12-20",
      totalLessons: 22,
      completedLessons: 22,
      duration: "12 weeks",
      category: "Web Development",
      rating: 4.6
    },
    {
      id: 6,
      title: "Digital Marketing Strategy",
      description: "Comprehensive guide to digital marketing including SEO, social media, content marketing, and analytics.",
      instructor: "Mark Thompson",
      image: "https://placehold.co/400x250?text=Digital+Marketing",
      progress: 45,
      status: "Active",
      enrolledDate: "2024-10-15",
      nextLesson: {
        title: "Content Marketing Strategies",
        date: "2025-01-19",
        time: "4:00 PM"
      },
      totalLessons: 15,
      completedLessons: 7,
      duration: "9 weeks",
      category: "Marketing",
      rating: 4.5
    }
  ];

  // Filter courses based on search term and status
  const filteredCourses = enrolledCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getProgressColor = (progress) => {
    if (progress >= 80) return "text-success";
    if (progress >= 50) return "text-warning";
    return "text-danger";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return "bg-secondary";
      case "Completed":
        return "";
      case "Nearly Complete":
        return "bg-secondary";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="min-vh-100 profile-root p-4">
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="main-title mb-2">My Courses</h1>
            <p className="section-title">
              Continue your learning journey • {filteredCourses.length} courses enrolled
            </p>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="row mb-4">
          <div className="col-md-8 mb-3">
            <div className="position-relative">
              <Search size={20} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Search courses by title, instructor, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="d-flex align-items-center">
              <Filter size={20} className="me-2 text-muted" />
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Courses</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Nearly Complete">Nearly Complete</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-5">
            <BookOpen size={64} className="text-muted mb-3" />
            <h3 className="section-title mb-2">No courses found</h3>
            <p className="profile-joined">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria."
                : "You haven't enrolled in any courses yet."
              }
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredCourses.map((course) => (
              <div key={course.id} className="col-lg-4 col-md-6">
                <div className="card shadow-sm h-100 course-card">
                  {/* Course Image */}
                  <div className="position-relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="position-absolute top-0 end-0 p-2">
                      <span className={`badge ${getStatusBadge(course.status)} px-2 py-1`}>
                        {course.status}
                      </span>
                    </div>
                    <div className="position-absolute bottom-0 start-0 p-2">
                      <small className="badge bg-secondary bg-opacity-75 px-2 py-1">
                        {course.category}
                      </small>
                    </div>
                  </div>

                  <div className="card-body p-4 d-flex flex-column">
                    {/* Course Title */}
                    <h4 className="section-title mb-2 line-clamp-2">
                      {course.title}
                    </h4>

                    {/* Instructor */}
                    <div className="d-flex align-items-center mb-2">
                      <User size={16} className="me-2 text-muted" />
                      <small className="profile-joined">{course.instructor}</small>
                    </div>

                    {/* Description */}
                    <p className="profile-joined mb-3 flex-grow-1 line-clamp-3">
                      {course.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small className="about-subtitle">Progress</small>
                        <small className={`fw-bold ${getProgressColor(course.progress)}`}>
                          {course.progress}%
                        </small>
                      </div>
                      <div className="progress" style={{ height: "6px" }}>
                        <div
                          className="progress-bar progress-bar-filled"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <div className="d-flex justify-content-between mt-1">
                        <small className="text-muted">
                          {course.completedLessons}/{course.totalLessons} lessons
                        </small>
                        {course.status !== "Completed" && course.nextLesson && (
                          <small className="text-muted">
                            Next: {new Date(course.nextLesson.date).toLocaleDateString()}
                          </small>
                        )}
                      </div>
                    </div>

                    {/* Course Stats */}
                    <div className="row mb-3">
                      <div className="col-6">
                        <div className="about-bubble p-2 text-center">
                          <Clock size={14} className="text-primary mb-1" />
                          <div className="small">{course.duration}</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="about-bubble p-2 text-center">
                          <BarChart3 size={14} className="text-primary mb-1" />
                          <div className="small">★ {course.rating}</div>
                        </div>
                      </div>
                    </div>

                    {/* Next Lesson Info (for active courses) */}
                    {course.status === "Active" && course.nextLesson && (
                      <div className="about-bubble p-3 mb-3">
                        <div className="d-flex align-items-center mb-1">
                          <Calendar size={14} className="me-2 text-primary" />
                          <strong className="small">Next Lesson:</strong>
                        </div>
                        <div className="small profile-joined">
                          {course.nextLesson.title}
                        </div>
                        <div className="small text-muted">
                          {course.nextLesson.date} at {course.nextLesson.time}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="mt-auto">
                      <NavLink
                        to={pagePaths.student.courseDetails(educatorUsername, course.id)}
                        className="btn-edit-profile w-100 text-center text-decoration-none"
                      >
                        {course.status === "Completed" ? (
                          <>
                            <CheckCircle size={16} className="me-2" />
                            Review Course
                          </>
                        ) : (
                          <>
                            <Play size={16} className="me-2" />
                            Continue Learning
                          </>
                        )}
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentCourses;
