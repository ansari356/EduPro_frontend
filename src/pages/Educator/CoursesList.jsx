import { LibraryBig, Clock, Users, Star, Award, TrendingUp, Edit, Trash2, Eye, DollarSign } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const courses = [
  {
    id: 1,
    title: "Data Analysis Fundamentals",
    description: "Master the art of data analysis with Python, pandas, and statistical methods. Learn to extract meaningful insights from complex datasets.",
    fullDescription: "Comprehensive course covering data collection, cleaning, analysis, and visualization using industry-standard tools and techniques.",
    status: "Published",
    image: "https://placehold.co/300x200?text=Data+Analysis+Fundamentals",
    duration: "12 weeks",
    lessons: 45,
    enrolledStudents: 1247,
    completedStudents: 892,
    rating: 4.8,
    reviews: 234,
    level: "Beginner",
    category: "Data Science",
    lastUpdated: "2 days ago",
    createdDate: "2024-01-15",
    revenue: "$18,705",
    averageProgress: "67%",
    tags: ["Python", "Pandas", "Statistics", "Visualization"]
  },
  {
    id: 2,
    title: "Advanced Excel for Business Analytics",
    description: "Transform your Excel skills with advanced formulas, pivot tables, VBA programming, and dynamic dashboard creation for business intelligence.",
    fullDescription: "Professional-level Excel training focusing on business applications, automation, and advanced data analysis techniques.",
    status: "Published",
    image: "https://placehold.co/300x200?text=Advanced+Excel+Analytics",
    duration: "8 weeks",
    lessons: 32,
    enrolledStudents: 892,
    completedStudents: 567,
    rating: 4.9,
    reviews: 156,
    level: "Intermediate",
    category: "Business Intelligence",
    lastUpdated: "1 day ago",
    createdDate: "2024-02-20",
    revenue: "$13,380",
    averageProgress: "73%",
    tags: ["Excel", "VBA", "Dashboards", "Business Intelligence"]
  },
  {
    id: 3,
    title: "Data Visualization Mastery with Tableau",
    description: "Create stunning, interactive visualizations and dashboards. Learn design principles, storytelling with data, and advanced Tableau features.",
    fullDescription: "Complete Tableau mastery course from basics to advanced features including LOD expressions, calculated fields, and interactive dashboards.",
    status: "Published",
    image: "https://placehold.co/300x200?text=Tableau+Mastery",
    duration: "10 weeks",
    lessons: 38,
    enrolledStudents: 654,
    completedStudents: 398,
    rating: 4.7,
    reviews: 89,
    level: "Intermediate",
    category: "Data Visualization",
    lastUpdated: "Today",
    createdDate: "2024-03-10",
    revenue: "$9,810",
    averageProgress: "61%",
    tags: ["Tableau", "Visualization", "Dashboards", "Analytics"]
  },
  {
    id: 4,
    title: "Machine Learning with Python",
    description: "Dive into machine learning algorithms, model building, and predictive analytics using scikit-learn, TensorFlow, and real-world datasets.",
    fullDescription: "Comprehensive ML course covering supervised and unsupervised learning, neural networks, and model deployment strategies.",
    status: "Draft",
    image: "https://placehold.co/300x200?text=Machine+Learning+Python",
    duration: "16 weeks",
    lessons: 52,
    enrolledStudents: 0,
    completedStudents: 0,
    rating: 0,
    reviews: 0,
    level: "Advanced",
    category: "Machine Learning",
    lastUpdated: "3 days ago",
    createdDate: "2024-06-01",
    revenue: "$0",
    averageProgress: "0%",
    tags: ["Python", "Scikit-learn", "TensorFlow", "AI"]
  },
  {
    id: 5,
    title: "SQL Database Management",
    description: "Master SQL queries, database design, performance optimization, and advanced database management techniques for modern applications.",
    fullDescription: "Complete SQL course covering everything from basic queries to advanced optimization, stored procedures, and database administration.",
    status: "Published",
    image: "https://placehold.co/300x200?text=SQL+Database+Management",
    duration: "6 weeks",
    lessons: 28,
    enrolledStudents: 756,
    completedStudents: 543,
    rating: 4.6,
    reviews: 112,
    level: "Intermediate",
    category: "Database",
    lastUpdated: "5 days ago",
    createdDate: "2024-04-05",
    revenue: "$11,340",
    averageProgress: "72%",
    tags: ["SQL", "Database", "PostgreSQL", "Optimization"]
  },
  {
    id: 6,
    title: "Power BI Business Intelligence",
    description: "Build powerful business intelligence solutions with Power BI. Create interactive reports, dashboards, and automated data pipelines.",
    fullDescription: "Professional Power BI training covering data modeling, DAX formulas, advanced visualizations, and enterprise deployment.",
    status: "Under Review",
    image: "https://placehold.co/300x200?text=Power+BI+Business+Intelligence",
    duration: "9 weeks",
    lessons: 35,
    enrolledStudents: 0,
    completedStudents: 0,
    rating: 0,
    reviews: 0,
    level: "Intermediate",
    category: "Business Intelligence",
    lastUpdated: "1 week ago",
    createdDate: "2024-05-15",
    revenue: "$0",
    averageProgress: "0%",
    tags: ["Power BI", "DAX", "Microsoft", "BI"]
  }
];

export default function EducatorCoursesList({ id }) {
  const navigate = useNavigate();

  const totalStudents = courses.reduce((sum, course) => sum + course.enrolledStudents, 0);
  const totalRevenue = courses.reduce((sum, course) => sum + parseFloat(course.revenue.replace('$', '').replace(',', '')), 0);
  const publishedCourses = courses.filter(course => course.status === 'Published').length;
  const averageRating = courses.filter(course => course.rating > 0).reduce((sum, course) => sum + course.rating, 0) / courses.filter(course => course.rating > 0).length;

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
                <p className="profile-role mb-0">Manage your course content and track performance</p>
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
                <h4 className="section-title mb-1">{publishedCourses}</h4>
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
                <h4 className="section-title mb-1">{totalStudents.toLocaleString()}</h4>
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
                <h4 className="section-title mb-1">${totalRevenue.toLocaleString()}</h4>
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
                <h4 className="section-title mb-1">{averageRating.toFixed(1)}</h4>
                <p className="profile-joined mb-0">Average Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <section id={id}>
          <div className="d-flex align-items-center gap-2 mb-4">
            <div className="avatar-circle">
              <LibraryBig size={28} />
            </div>
            <h2 className="main-title mb-0">Course Management</h2>
          </div>

          <div className="row g-4">
            {courses.map(course => (
              <div className="col-md-6 col-xl-4" key={course.id}>
                <EducatorCourseCard course={course} navigate={navigate} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function EducatorCourseCard({ course, navigate }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return 'text-accent';
      case 'Draft': return 'profile-joined';
      case 'Under Review': return 'text-warning';
      case 'Rejected': return 'text-danger';
      default: return 'profile-joined';
    }
  };

  return (
    <div className="card h-100 d-flex flex-column">
      <div className="position-relative">
        <img
          src={course.image}
          alt={course.title}
          className="course-card-image"
        />
        <div className="position-absolute top-0 end-0 m-2">
          <span className={`about-bubble ${getStatusColor(course.status)}`}>
            {course.status}
          </span>
        </div>
      </div>

      <div className="card-body d-flex flex-column flex-grow-1">
        {/* Course Title and Category */}
        <div className="mb-2">
          <h5 className="section-title mb-1">{course.title}</h5>
          <p className="profile-role mb-0">{course.category}</p>
        </div>

        {/* Description */}
        <p className="profile-joined mb-3 flex-grow-1">{course.description}</p>

        {/* Course Performance Stats */}
        <div className="row g-2 mb-3">
          <div className="col-6">
            <div className="d-flex align-items-center">
              <Users size={14} className="me-1 text-muted" />
              <small className="profile-joined">{course.enrolledStudents} students</small>
            </div>
          </div>
          <div className="col-6">
            <div className="d-flex align-items-center">
              <Star size={14} className="me-1 text-muted" />
              <small className="profile-joined">{course.rating || 'No rating'}</small>
            </div>
          </div>
          <div className="col-6">
            <div className="d-flex align-items-center">
              <Clock size={14} className="me-1 text-muted" />
              <small className="profile-joined">{course.lessons} lessons</small>
            </div>
          </div>
          <div className="col-6">
            <div className="d-flex align-items-center">
              <i className="bi bi-currency-dollar me-1 text-muted" size={14}></i>
              <small className="text-accent fw-bold">{course.revenue}</small>
            </div>
          </div>
        </div>

        {/* Student Progress */}
        {course.status === 'Published' && (
          <div className="mb-3">
            <div className="d-flex justify-content-between mb-1">
              <span className="about-subtitle">Student Progress</span>
              <span className="text-accent fw-bold">{course.averageProgress}</span>
            </div>
            <div className="progress mb-2">
              <div 
                className="progress-bar-filled" 
                style={{width: course.averageProgress}}
              ></div>
            </div>
            <small className="profile-joined">
              {course.completedStudents} of {course.enrolledStudents} students completed
            </small>
          </div>
        )}

        {/* Course Info */}
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="about-subtitle">Status:</span>
            <span className={`fw-bold ${getStatusColor(course.status)}`}>
              {course.status}
            </span>
          </div>
          
          <div className="mb-3">
            <small className="profile-joined">
              <strong>Last updated:</strong> {course.lastUpdated}
            </small>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2 mb-3">
            <button 
              className="btn-edit-profile flex-fill d-flex align-items-center justify-content-center"
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              <Eye size={16} className="me-1" />
              View
            </button>
            <button 
              className="btn-edit-profile flex-fill d-flex align-items-center justify-content-center"
              onClick={() => navigate(`/courses/edit/${course.id}`)}
            >
              <Edit size={16} className="me-1" />
              Edit
            </button>
          </div>

          {/* Tags */}
          <div className="d-flex flex-wrap gap-1">
            {course.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className="about-bubble small">
                {tag}
              </span>
            ))}
            {course.tags.length > 2 && (
              <span className="about-bubble small">
                +{course.tags.length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
