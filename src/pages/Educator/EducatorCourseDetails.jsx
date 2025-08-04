import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LibraryBig,
  Users,
  Star,
  Clock,
  Edit,
  Trash2,
  Eye,
  MessageCircle,
  TrendingUp,
  Award,
  Download,
  TriangleAlert,
  DollarSign,
  ArrowBigLeft,
} from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Data Analysis Fundamentals",
    description:
      "Master the art of data analysis with Python, pandas, and statistical methods. Learn to extract meaningful insights from complex datasets.",
    fullDescription:
      "This comprehensive Data Analysis course is designed to take students from complete beginners to confident data analysts. The course covers essential statistical concepts, data cleaning techniques, exploratory data analysis, and how to draw meaningful insights from complex datasets. Students work with real-world data from various industries including finance, healthcare, and marketing. By the end of this course, students will be able to confidently analyze data, create compelling visualizations, and present their findings to stakeholders.",
    status: "Published",
    image: "https://placehold.co/600x300?text=Data+Analysis+Fundamentals",
    duration: "12 weeks",
    lessonsno: 45,
    enrolledStudents: 1247,
    completedStudents: 892,
    activeStudents: 355,
    rating: 4.8,
    reviews: 234,
    level: "Beginner",
    category: "Data Science",
    lastUpdated: "2 days ago",
    createdDate: "2024-01-15",
    publishedDate: "2024-01-20",
    revenue: "$18,705",
    averageProgress: "67%",
    completionRate: "71.5%",
    tags: ["Python", "Pandas", "Statistics", "Visualization"],
    price: "$149",
    language: "English",
    prerequisites: "Basic computer skills",
    certificate: true,
    tableOfContents: [
      {
        chapter: "Chapter 1: Introduction to Data Analysis",
        topics: [
          "What is Data Analysis?",
          "Types of Data",
          "Data Analysis Process",
          "Tools Overview",
        ],
        lessons: 8,
      },
      {
        chapter: "Chapter 2: Statistical Foundations",
        topics: [
          "Descriptive Statistics",
          "Probability Basics",
          "Distributions",
          "Hypothesis Testing",
        ],
        lessons: 9,
      },
      {
        chapter: "Chapter 3: Data Collection & Cleaning",
        topics: [
          "Data Sources",
          "Data Quality Assessment",
          "Cleaning Techniques",
          "Missing Data Handling",
        ],
        lessons: 7,
      },
      {
        chapter: "Chapter 4: Exploratory Data Analysis",
        topics: [
          "EDA Process",
          "Pattern Recognition",
          "Correlation Analysis",
          "Outlier Detection",
        ],
        lessons: 8,
      },
      {
        chapter: "Chapter 5: Data Visualization",
        topics: [
          "Visualization Principles",
          "Chart Types",
          "Interactive Dashboards",
          "Storytelling with Data",
        ],
        lessons: 7,
      },
      {
        chapter: "Chapter 6: Advanced Analytics",
        topics: [
          "Predictive Modeling",
          "Time Series Analysis",
          "Classification",
          "Clustering",
        ],
        lessons: 6,
      },
    ],
    lessons: [
      {
        id: 1,
        title: "Welcome to Data Analysis",
        duration: "15 min",
        type: "video",
        views: 1247,
        avgRating: 4.9,
      },
      {
        id: 2,
        title: "Understanding Data Types",
        duration: "20 min",
        type: "video",
        views: 1198,
        avgRating: 4.8,
      },
      {
        id: 3,
        title: "Data Analysis Tools Overview",
        duration: "25 min",
        type: "video",
        views: 1156,
        avgRating: 4.7,
      },
      {
        id: 4,
        title: "Basic Statistics Quiz",
        duration: "10 min",
        type: "quiz",
        views: 1089,
        avgRating: 4.6,
      },
      {
        id: 5,
        title: "Descriptive Statistics Deep Dive",
        duration: "30 min",
        type: "video",
        views: 1034,
        avgRating: 4.8,
      },
    ],
    recentReviews: [
      {
        id: 1,
        student: "John Smith",
        rating: 5,
        comment: "Excellent course! Very comprehensive and easy to follow.",
        date: "2 days ago",
      },
      {
        id: 2,
        student: "Sarah Johnson",
        rating: 4,
        comment: "Great content, would love more practical exercises.",
        date: "1 week ago",
      },
      {
        id: 3,
        student: "Mike Chen",
        rating: 5,
        comment:
          "Perfect for beginners. The instructor explains everything clearly.",
        date: "1 week ago",
      },
    ],
    analytics: {
      totalViews: 45623,
      completionRate: "71.5%",
      avgTimeSpent: "8.5 hours",
      dropoffPoint: "Chapter 3 - Data Cleaning",
      peakEngagement: "Chapter 1 - Introduction",
    },
  },
];

export default function EducatorCourseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const course = courses.find((c) => c.id === Number(id));

  if (!course) {
    return (
      <div className="profile-root">
        <div className="card border-0 shadow-sm">
          <div className="container py-3">
            <div className="d-flex align-items-center">
              <div className="header-avatar me-2">
                <TriangleAlert size={20} />
              </div>
              <div>
                <span className="section-title mb-0">Course Not Found</span>
                <p className="profile-role mb-0">
                  The requested course could not be found
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body text-center">
                  <div className="avatar-circle mb-4 mx-auto w-fit">
                    <TriangleAlert size={40} />
                  </div>
                  <h2 className="main-title mb-3">Course Not Found</h2>
                  <p className="profile-joined mb-4">
                    Sorry, we couldn't find the course you're looking for.
                  </p>
                  <button
                    className="btn-edit-profile"
                    onClick={() => navigate("/courses")}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Courses
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-root">
      {/* Header */}
      <div className="card border-0 shadow-sm">
        <div className="container py-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="header-avatar me-2">
                <LibraryBig size={20} />
              </div>
              <div>
                <span className="section-title mb-0">{course.title}</span>
                <p className="profile-role mb-0">Course Management Dashboard</p>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn-edit-profile d-flex align-items-center"
                onClick={() => navigate(`/courses`)}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Courses
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Stats Overview */}
      <div className="container py-4">
        <div className="row g-3 mb-4">
          <div className="col-md-2">
            <div className="card">
              <div className="card-body text-center">
                <div className="avatar-circle mb-2 mx-auto w-fit">
                  <Users size={20} />
                </div>
                <h5 className="section-title mb-1">
                  {course.enrolledStudents}
                </h5>
                <small className="profile-joined">Enrolled</small>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card">
              <div className="card-body text-center">
                <div className="avatar-circle mb-2 mx-auto w-fit">
                  <Award size={20} />
                </div>
                <h5 className="section-title mb-1">
                  {course.completedStudents}
                </h5>
                <small className="profile-joined">Completed</small>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card">
              <div className="card-body text-center">
                <div className="avatar-circle mb-2 mx-auto w-fit">
                  <TrendingUp size={20} />
                </div>
                <h5 className="section-title mb-1">{course.activeStudents}</h5>
                <small className="profile-joined">Active</small>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card">
              <div className="card-body text-center">
                <div className="avatar-circle mb-2 mx-auto w-fit">
                  <Star size={20} />
                </div>
                <h5 className="section-title mb-1">{course.rating}</h5>
                <small className="profile-joined">Rating</small>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card">
              <div className="card-body text-center">
                <div className="avatar-circle mb-2 mx-auto w-fit">
                  <MessageCircle size={20} />
                </div>
                <h5 className="section-title mb-1">{course.reviews}</h5>
                <small className="profile-joined">Reviews</small>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card">
              <div className="card-body text-center">
                <div className="avatar-circle mb-2 mx-auto w-fit">
                  <DollarSign size={24} />
                </div>
                <h5 className="section-title mb-1">{course.revenue}</h5>
                <small className="profile-joined">Revenue</small>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            {/* Course Image */}
            <div className="mb-4">
              <img
                src={course.image}
                alt={course.title}
                className="course-detail-image"
              />
            </div>

            {/* Navigation Tabs */}
            <div className="card mb-4">
              <div className="card-body p-0">
                <div className="d-flex border-bottom">
                  <button
                    className={`btn-link-custom flex-fill text-center py-3 ${
                      activeTab === "overview"
                        ? "text-accent border-bottom border-primary border-3"
                        : "profile-joined"
                    }`}
                    onClick={() => setActiveTab("overview")}
                  >
                    Overview
                  </button>
                  <button
                    className={`btn-link-custom flex-fill text-center py-3 ${
                      activeTab === "curriculum"
                        ? "text-accent border-bottom border-primary border-3"
                        : "profile-joined"
                    }`}
                    onClick={() => setActiveTab("curriculum")}
                  >
                    Curriculum
                  </button>
                  <button
                    className={`btn-link-custom flex-fill text-center py-3 ${
                      activeTab === "students"
                        ? "text-accent border-bottom border-primary border-3"
                        : "profile-joined"
                    }`}
                    onClick={() => setActiveTab("students")}
                  >
                    Students
                  </button>
                  <button
                    className={`btn-link-custom flex-fill text-center py-3 ${
                      activeTab === "reviews"
                        ? "text-accent border-bottom border-primary border-3"
                        : "profile-joined"
                    }`}
                    onClick={() => setActiveTab("reviews")}
                  >
                    Reviews
                  </button>
                  <button
                    className={`btn-link-custom flex-fill text-center py-3 ${
                      activeTab === "analytics"
                        ? "text-accent border-bottom border-primary border-3"
                        : "profile-joined"
                    }`}
                    onClick={() => setActiveTab("analytics")}
                  >
                    Analytics
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="card">
                <div className="card-body">
                  <h3 className="section-title mb-4">Course Information</h3>

                  <div className="mb-4">
                    <h4 className="about-subtitle mb-2">Description</h4>
                    <p className="profile-joined">{course.fullDescription}</p>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                      <div className="about-bubble">
                        <Clock size={16} className="me-2" />
                        <strong>Duration:</strong> {course.duration}
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="about-bubble">
                        <i className="bi bi-bookmark me-2"></i>
                        <strong>Level:</strong> {course.level}
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="about-bubble">
                        <i className="bi bi-currency-dollar me-2"></i>
                        <strong>Price:</strong> {course.price}
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="about-bubble">
                        <i className="bi bi-globe me-2"></i>
                        <strong>Language:</strong> {course.language}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="about-subtitle mb-2">Tags</h4>
                    <div className="d-flex flex-wrap gap-2">
                      {course.tags.map((tag, index) => (
                        <span key={index} className="about-bubble">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "curriculum" && (
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="section-title mb-0">Course Curriculum</h3>
                    <button className="btn-edit-profile d-flex align-items-center">
                      <i className="bi bi-plus me-2"></i>
                      Add Chapter
                    </button>
                  </div>

                  {course.tableOfContents.map((chapter, index) => (
                    <div key={index} className="card mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h4 className="about-subtitle mb-0">
                            {chapter.chapter}
                          </h4>
                          <div className="d-flex gap-2">
                            <button className="btn-edit-profile d-flex align-items-center">
                              <Edit size={14} className="me-1" />
                              Edit
                            </button>
                            <button className="btn-edit-profile d-flex align-items-center">
                              <i className="bi bi-plus me-1"></i>
                              Add Lesson
                            </button>
                          </div>
                        </div>
                        <small className="profile-joined mb-2">
                          {chapter.lessons} lessons
                        </small>
                        <div className="ms-3">
                          {chapter.topics.map((topic, topicIndex) => (
                            <div
                              key={topicIndex}
                              className="about-bubble mb-2 d-flex justify-content-between align-items-center"
                            >
                              <span>
                                <i className="bi bi-play-circle me-2"></i>
                                {topic}
                              </span>
                              <div className="d-flex gap-1">
                                <button className="btn p-0 border-0 bg-transparent">
                                  <Edit size={12} />
                                </button>
                                <button className="btn p-0 border-0 bg-transparent text-danger">
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "students" && (
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="section-title mb-0">Student Performance</h3>
                    <button className="btn-edit-profile d-flex align-items-center">
                      <Download size={16} className="me-2" />
                      Export Data
                    </button>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-4">
                      <div className="text-center">
                        <h4 className="section-title text-accent">
                          {course.completionRate}
                        </h4>
                        <p className="profile-joined">Completion Rate</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center">
                        <h4 className="section-title text-accent">
                          {course.averageProgress}
                        </h4>
                        <p className="profile-joined">Average Progress</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center">
                        <h4 className="section-title text-accent">
                          {course.analytics.avgTimeSpent}
                        </h4>
                        <p className="profile-joined">Avg. Time Spent</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="about-subtitle mb-3">
                      Recent Student Activity
                    </h4>
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Student</th>
                            <th>Progress</th>
                            <th>Last Activity</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>John Smith</td>
                            <td>
                              <div className="progress">
                                <div
                                  className="progress-bar-filled"
                                  style={{ width: "85%" }}
                                ></div>
                              </div>
                              <small className="profile-joined">85%</small>
                            </td>
                            <td>2 hours ago</td>
                            <td>
                              <span className="text-accent">Active</span>
                            </td>
                          </tr>
                          <tr>
                            <td>Sarah Johnson</td>
                            <td>
                              <div className="progress">
                                <div
                                  className="progress-bar-filled"
                                  style={{ width: "92%" }}
                                ></div>
                              </div>
                              <small className="profile-joined">92%</small>
                            </td>
                            <td>1 day ago</td>
                            <td>
                              <span className="text-accent">Active</span>
                            </td>
                          </tr>
                          <tr>
                            <td>Mike Chen</td>
                            <td>
                              <div className="progress">
                                <div
                                  className="progress-bar-filled"
                                  style={{ width: "100%" }}
                                ></div>
                              </div>
                              <small className="profile-joined">100%</small>
                            </td>
                            <td>3 days ago</td>
                            <td>
                              <span className="text-success">Completed</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="card">
                <div className="card-body">
                  <h3 className="section-title mb-4">Student Reviews</h3>

                  <div className="row mb-4">
                    <div className="col-md-4 text-center">
                      <h2 className="section-title text-accent">
                        {course.rating}
                      </h2>
                      <div className="mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className={
                              i < Math.floor(course.rating)
                                ? "text-warning"
                                : "text-muted"
                            }
                          />
                        ))}
                      </div>
                      <p className="profile-joined">
                        Based on {course.reviews} reviews
                      </p>
                    </div>
                    <div className="col-md-8">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div
                          key={rating}
                          className="d-flex align-items-center mb-2"
                        >
                          <span className="me-2">{rating} star</span>
                          <div className="progress flex-grow-1 me-2">
                            <div
                              className="progress-bar-filled"
                              style={{
                                width: `${
                                  rating === 5
                                    ? 70
                                    : rating === 4
                                    ? 20
                                    : rating === 3
                                    ? 7
                                    : rating === 2
                                    ? 2
                                    : 1
                                }%`,
                              }}
                            ></div>
                          </div>
                          <small className="profile-joined">
                            {rating === 5
                              ? 164
                              : rating === 4
                              ? 47
                              : rating === 3
                              ? 16
                              : rating === 2
                              ? 5
                              : 2}
                          </small>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="about-subtitle mb-3">Recent Reviews</h4>
                    {course.recentReviews.map((review) => (
                      <div key={review.id} className="card mb-3">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <h6 className="about-subtitle mb-1">
                                {review.student}
                              </h6>
                              <div className="mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className={
                                      i < review.rating
                                        ? "text-warning"
                                        : "text-muted"
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                            <small className="profile-joined">
                              {review.date}
                            </small>
                          </div>
                          <p className="profile-joined mb-0">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="card">
                <div className="card-body">
                  <h3 className="section-title mb-4">Course Analytics</h3>

                  <div className="row mb-4">
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="about-subtitle mb-3">
                            Engagement Metrics
                          </h5>
                          <div className="mb-2">
                            <div className="d-flex justify-content-between">
                              <span className="profile-joined">
                                Total Views
                              </span>
                              <span className="text-accent fw-bold">
                                {course.analytics.totalViews.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="mb-2">
                            <div className="d-flex justify-content-between">
                              <span className="profile-joined">
                                Completion Rate
                              </span>
                              <span className="text-accent fw-bold">
                                {course.analytics.completionRate}
                              </span>
                            </div>
                          </div>
                          <div className="mb-2">
                            <div className="d-flex justify-content-between">
                              <span className="profile-joined">
                                Avg. Time Spent
                              </span>
                              <span className="text-accent fw-bold">
                                {course.analytics.avgTimeSpent}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="about-subtitle mb-3">
                            Learning Insights
                          </h5>
                          <div className="mb-2">
                            <div className="d-flex justify-content-between">
                              <span className="profile-joined">
                                Peak Engagement
                              </span>
                              <span className="text-accent fw-bold">
                                {course.analytics.peakEngagement}
                              </span>
                            </div>
                          </div>
                          <div className="mb-2">
                            <div className="d-flex justify-content-between">
                              <span className="profile-joined">
                                Drop-off Point
                              </span>
                              <span className="text-warning fw-bold">
                                {course.analytics.dropoffPoint}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-body">
                      <h5 className="about-subtitle mb-3">
                        Lesson Performance
                      </h5>
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Lesson</th>
                              <th>Views</th>
                              <th>Avg. Rating</th>
                              <th>Completion Rate</th>
                            </tr>
                          </thead>
                          <tbody>
                            {course.lessons.map((lesson) => (
                              <tr key={lesson.id}>
                                <td>{lesson.title}</td>
                                <td>{lesson.views.toLocaleString()}</td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <Star
                                      size={16}
                                      className="text-warning me-1"
                                    />
                                    {lesson.avgRating}
                                  </div>
                                </td>
                                <td>
                                  <div className="progress">
                                    <div
                                      className="progress-bar-filled"
                                      style={{
                                        width: `${
                                          (lesson.views /
                                            course.enrolledStudents) *
                                          100
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Quick Actions */}
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="section-title mb-3">Quick Actions</h4>

                <div className="d-grid gap-2">
                  <button onClick={() => navigate(`/courses/edit/${course.id}`)} className="btn-edit-profile d-flex align-items-center justify-content-center">
                    <Edit size={16} className="me-2" />
                    Edit Course Content
                  </button>
                  <button className="btn-edit-profile d-flex align-items-center justify-content-center">
                    <MessageCircle size={16} className="me-2" />
                    Message Students
                  </button>
                  <button className="btn-edit-profile d-flex align-items-center justify-content-center">
                    <Download size={16} className="me-2" />
                    Export Analytics
                  </button>
                  <button className="btn-edit-profile d-flex align-items-center justify-content-center">
                    <Eye size={16} className="me-2" />
                    Preview as Student
                  </button>
                </div>
              </div>
            </div>

            {/* Course Status */}
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="section-title mb-3">Course Status</h4>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="about-subtitle">Status</span>
                    <span className="text-accent fw-bold">{course.status}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="about-subtitle">Created</span>
                    <span className="profile-joined">{course.createdDate}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="about-subtitle">Published</span>
                    <span className="profile-joined">
                      {course.publishedDate}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="about-subtitle">Last Updated</span>
                    <span className="profile-joined">{course.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Summary */}
            <div className="card">
              <div className="card-body">
                <h4 className="section-title mb-3">Revenue Summary</h4>

                <div className="text-center mb-3">
                  <h3 className="section-title text-accent">
                    {course.revenue}
                  </h3>
                  <p className="profile-joined">Total Revenue</p>
                </div>

                <div className="mb-2">
                  <div className="d-flex justify-content-between">
                    <span className="about-subtitle">Price per student</span>
                    <span className="profile-joined">{course.price}</span>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="d-flex justify-content-between">
                    <span className="about-subtitle">Total enrollments</span>
                    <span className="profile-joined">
                      {course.enrolledStudents}
                    </span>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="d-flex justify-content-between">
                    <span className="about-subtitle">Completion rate</span>
                    <span className="profile-joined">
                      {course.completionRate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
