import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LibraryBig, User, Clock, BookOpen, Play, CheckCircle } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: "Data Analysis Fundamentals",
    description: "Master the fundamentals of data analysis with this comprehensive course. Learn to collect, clean, analyze, and visualize data using industry-standard tools and techniques. This course covers statistical concepts, data manipulation, and practical applications in real-world scenarios. Perfect for beginners who want to start their journey in data science and analytics.",
    fullDescription: "This comprehensive Data Analysis course is designed to take you from a complete beginner to a confident data analyst. You'll learn essential statistical concepts, data cleaning techniques, exploratory data analysis, and how to draw meaningful insights from complex datasets. The course includes hands-on projects using real-world data from various industries including finance, healthcare, and marketing. By the end of this course, you'll be able to confidently analyze data, create compelling visualizations, and present your findings to stakeholders.",
    progress: "80%",
    status: "Active",
    image: "https://placehold.co/600x300?text=Data+Analysis+Fundamentals",
    educator: {
      name: "Dr. Sarah Johnson",
      title: "Senior Data Scientist",
      experience: "8 years",
      rating: 4.8,
      avatar: "👩‍💻"
    },
    duration: "12 weeks",
    level: "Beginner to Intermediate",
    enrolledStudents: 1247,
    tableOfContents: [
      {
        chapter: "Chapter 1: Introduction to Data Analysis",
        topics: ["What is Data Analysis?", "Types of Data", "Data Analysis Process", "Tools Overview"]
      },
      {
        chapter: "Chapter 2: Statistical Foundations",
        topics: ["Descriptive Statistics", "Probability Basics", "Distributions", "Hypothesis Testing"]
      },
      {
        chapter: "Chapter 3: Data Collection & Cleaning",
        topics: ["Data Sources", "Data Quality Assessment", "Cleaning Techniques", "Missing Data Handling"]
      },
      {
        chapter: "Chapter 4: Exploratory Data Analysis",
        topics: ["EDA Process", "Pattern Recognition", "Correlation Analysis", "Outlier Detection"]
      },
      {
        chapter: "Chapter 5: Data Visualization",
        topics: ["Visualization Principles", "Chart Types", "Interactive Dashboards", "Storytelling with Data"]
      },
      {
        chapter: "Chapter 6: Advanced Analytics",
        topics: ["Predictive Modeling", "Time Series Analysis", "Classification", "Clustering"]
      }
    ],
    lessons: [
      { id: 1, title: "Welcome to Data Analysis", duration: "15 min", type: "video", completed: true },
      { id: 2, title: "Understanding Data Types", duration: "20 min", type: "video", completed: true },
      { id: 3, title: "Data Analysis Tools Overview", duration: "25 min", type: "video", completed: true },
      { id: 4, title: "Basic Statistics Quiz", duration: "10 min", type: "quiz", completed: true },
      { id: 5, title: "Descriptive Statistics Deep Dive", duration: "30 min", type: "video", completed: true },
      { id: 6, title: "Probability Fundamentals", duration: "35 min", type: "video", completed: false },
      { id: 7, title: "Working with Distributions", duration: "28 min", type: "video", completed: false },
      { id: 8, title: "Data Collection Methods", duration: "22 min", type: "video", completed: false },
      { id: 9, title: "Data Cleaning Exercise", duration: "45 min", type: "exercise", completed: false },
      { id: 10, title: "EDA Project Assignment", duration: "60 min", type: "project", completed: false }
    ]
  },
  {
    id: 2,
    title: "Advanced Excel Techniques for Business",
    description: "Unlock the full potential of Microsoft Excel with advanced formulas, data analysis tools, and automation techniques. Learn to create dynamic dashboards, perform complex calculations, and streamline your workflow with VBA programming.",
    fullDescription: "Transform your Excel skills from basic to expert level with this comprehensive course. You'll master advanced formulas, pivot tables, data validation, conditional formatting, and VBA programming. The course focuses on practical business applications including financial modeling, data analysis, reporting automation, and dashboard creation. Each module includes real-world scenarios and hands-on exercises that you can immediately apply in your workplace.",
    progress: "65%",
    status: "Active",
    image: "https://placehold.co/600x300?text=Advanced+Excel+Techniques",
    educator: {
      name: "Prof. Michael Chen",
      title: "Business Analytics Expert",
      experience: "12 years",
      rating: 4.9,
      avatar: "👨‍🏫"
    },
    duration: "8 weeks",
    level: "Intermediate to Advanced",
    enrolledStudents: 892,
    tableOfContents: [
      {
        chapter: "Chapter 1: Advanced Formulas & Functions",
        topics: ["INDEX-MATCH", "Array Formulas", "Nested Functions", "Error Handling"]
      },
      {
        chapter: "Chapter 2: Data Analysis Tools",
        topics: ["Pivot Tables Mastery", "Power Query", "Data Modeling", "What-If Analysis"]
      },
      {
        chapter: "Chapter 3: Visualization & Dashboards",
        topics: ["Advanced Charts", "Interactive Dashboards", "Conditional Formatting", "Sparklines"]
      },
      {
        chapter: "Chapter 4: Automation with VBA",
        topics: ["VBA Basics", "Macro Creation", "User Forms", "Event Programming"]
      },
      {
        chapter: "Chapter 5: Business Applications",
        topics: ["Financial Modeling", "Budgeting Templates", "Reporting Automation", "Data Integration"]
      }
    ],
    lessons: [
      { id: 1, title: "Advanced Formula Techniques", duration: "25 min", type: "video", completed: true },
      { id: 2, title: "Mastering INDEX-MATCH", duration: "30 min", type: "video", completed: true },
      { id: 3, title: "Array Formulas Workshop", duration: "40 min", type: "exercise", completed: true },
      { id: 4, title: "Pivot Tables Deep Dive", duration: "35 min", type: "video", completed: true },
      { id: 5, title: "Power Query Introduction", duration: "28 min", type: "video", completed: false },
      { id: 6, title: "Dashboard Creation Project", duration: "90 min", type: "project", completed: false },
      { id: 7, title: "VBA Programming Basics", duration: "45 min", type: "video", completed: false },
      { id: 8, title: "Macro Automation Exercise", duration: "50 min", type: "exercise", completed: false }
    ]
  },
  {
    id: 3,
    title: "Data Visualization Mastery with Tableau",
    description: "Create stunning, interactive data visualizations and dashboards using Tableau. Learn best practices for visual design, storytelling with data, and building compelling reports that drive business decisions.",
    fullDescription: "Become a data visualization expert with this comprehensive Tableau course. You'll learn to transform raw data into compelling visual stories that inform and influence decision-making. The course covers everything from basic chart creation to advanced dashboard design, calculated fields, parameters, and custom visualizations. You'll work with real datasets from various industries and learn to apply design principles that make your visualizations both beautiful and functional. By the end, you'll be able to create publication-ready dashboards and present data insights effectively to any audience.",
    progress: "92%",
    status: "Active",
    image: "https://placehold.co/600x300?text=Tableau+Mastery",
    educator: {
      name: "Alex Rodriguez",
      title: "Data Visualization Specialist",
      experience: "6 years",
      rating: 4.7,
      avatar: "🎨"
    },
    duration: "10 weeks",
    level: "Beginner to Advanced",
    enrolledStudents: 654,
    tableOfContents: [
      {
        chapter: "Chapter 1: Tableau Fundamentals",
        topics: ["Interface Overview", "Data Connections", "Basic Charts", "Filters & Sorting"]
      },
      {
        chapter: "Chapter 2: Advanced Visualizations",
        topics: ["Custom Charts", "Dual Axis", "Calculated Fields", "Parameters"]
      },
      {
        chapter: "Chapter 3: Dashboard Design",
        topics: ["Layout Principles", "Interactivity", "Actions", "Mobile Design"]
      },
      {
        chapter: "Chapter 4: Data Storytelling",
        topics: ["Narrative Structure", "Story Points", "Annotations", "Presentation Tips"]
      },
      {
        chapter: "Chapter 5: Advanced Features",
        topics: ["LOD Expressions", "Table Calculations", "Mapping", "Statistical Functions"]
      },
      {
        chapter: "Chapter 6: Publishing & Sharing",
        topics: ["Tableau Server", "Tableau Online", "Embedding", "Security"]
      }
    ],
    lessons: [
      { id: 1, title: "Getting Started with Tableau", duration: "20 min", type: "video", completed: true },
      { id: 2, title: "Creating Your First Visualization", duration: "25 min", type: "video", completed: true },
      { id: 3, title: "Working with Filters", duration: "18 min", type: "video", completed: true },
      { id: 4, title: "Basic Charts Practice", duration: "30 min", type: "exercise", completed: true },
      { id: 5, title: "Advanced Chart Types", duration: "35 min", type: "video", completed: true },
      { id: 6, title: "Calculated Fields Workshop", duration: "40 min", type: "exercise", completed: true },
      { id: 7, title: "Dashboard Design Principles", duration: "28 min", type: "video", completed: true },
      { id: 8, title: "Interactive Dashboard Project", duration: "75 min", type: "project", completed: true },
      { id: 9, title: "Data Storytelling Techniques", duration: "32 min", type: "video", completed: false },
      { id: 10, title: "Final Capstone Project", duration: "120 min", type: "project", completed: false }
    ]
  }
];

export default function EducatorCourseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const course = courses.find((c) => c.id === Number(id));

  if (!course) {
    return (
      <div className="profile-root">
        {/* Header */}
        <div className="card border-0 shadow-sm">
          <div className="container py-3">
            <div className="d-flex align-items-center">
              <div className="header-avatar me-2">
                <i className="bi bi-exclamation-triangle"></i>
              </div>
              <div>
                <span className="section-title mb-0">Course Not Found</span>
                <p className="profile-role mb-0">The requested course could not be found</p>
              </div>
            </div>
          </div>
        </div>

        {/* Not Found Content */}
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body text-center">
                  <div className="avatar-circle mb-4">
                    <i className="bi bi-exclamation-triangle"></i>
                  </div>
                  <h2 className="main-title mb-3">Course Not Found</h2>
                  <p className="profile-joined mb-4">
                    Sorry, we couldn't find the course you're looking for. 
                    It may have been removed or the link might be incorrect.
                  </p>
                  <button 
                    className="btn-edit-profile" 
                    onClick={() => navigate('/courses')}
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

  const completedLessons = course.lessons.filter(lesson => lesson.completed).length;
  const totalLessons = course.lessons.length;

  return (
    <div className="profile-root">
      {/* Header */}
      <div className="card border-0 shadow-sm">
        <div className="container py-3">
          <div className="d-flex align-items-center">
            <div className="header-avatar me-2">
              <LibraryBig size={20} />
            </div>
            <div>
              <span className="section-title mb-0">{course.title}</span>
              <p className="profile-role mb-0">by {course.educator.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row">
          {/* Course Content */}
          <div className="col-lg-8">
            {/* Course Image */}
            {course.image && (
              <div className="mb-4">
                <img
                  src={course.image}
                  alt={course.title}
                  className="course-detail-image"
                />
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="card mb-4">
              <div className="card-body p-0">
                <div className="d-flex border-bottom">
                  <button
                    className={`btn-link-custom flex-fill text-center py-3 ${activeTab === 'overview' ? 'text-accent border-bottom border-primary border-3' : 'profile-joined'}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                  <button
                    className={`btn-link-custom flex-fill text-center py-3 ${activeTab === 'curriculum' ? 'text-accent border-bottom border-primary border-3' : 'profile-joined'}`}
                    onClick={() => setActiveTab('curriculum')}
                  >
                    Curriculum
                  </button>
                  <button
                    className={`btn-link-custom flex-fill text-center py-3 ${activeTab === 'lessons' ? 'text-accent border-bottom border-primary border-3' : 'profile-joined'}`}
                    onClick={() => setActiveTab('lessons')}
                  >
                    Lessons
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="card">
                <div className="card-body">
                  <h3 className="section-title mb-4">Course Overview</h3>
                  
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
                        <BookOpen size={16} className="me-2" />
                        <strong>Level:</strong> {course.level}
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="about-bubble">
                        <User size={16} className="me-2" />
                        <strong>Students:</strong> {course.enrolledStudents}
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="about-bubble">
                        <i className="bi bi-star-fill me-2"></i>
                        <strong>Rating:</strong> {course.educator.rating}/5.0
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="card">
                <div className="card-body">
                  <h3 className="section-title mb-4">Course Curriculum</h3>
                  
                  {course.tableOfContents.map((chapter, index) => (
                    <div key={index} className="mb-4">
                      <h4 className="about-subtitle mb-3">{chapter.chapter}</h4>
                      <div className="ms-3">
                        {chapter.topics.map((topic, topicIndex) => (
                          <div key={topicIndex} className="about-bubble mb-2">
                            <i className="bi bi-play-circle me-2"></i>
                            {topic}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'lessons' && (
              <div className="card">
                <div className="card-body">
                  <h3 className="section-title mb-4">Course Lessons</h3>
                  
                  {course.lessons.map((lesson) => (
                    <div key={lesson.id} className="d-flex align-items-center p-3 mb-2 about-bubble">
                      <div className="me-3">
                        {lesson.completed ? (
                          <CheckCircle size={20} className="text-success" />
                        ) : (
                          <Play size={20} className="text-muted" />
                        )}
                      </div>
                      
                      <div className="flex-grow-1">
                        <h5 className="about-subtitle mb-1">{lesson.title}</h5>
                        <div className="d-flex align-items-center gap-3">
                          <small className="profile-joined">
                            <Clock size={14} className="me-1" />
                            {lesson.duration}
                          </small>
                          <small className="border border-primary rounded px-4" style={{ color: "var(--color-primary)" }}>
                            {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
                          </small>
                        </div>
                      </div>
                      
                      {lesson.completed && (
                        <div className="text-success">
                          <i className="bi bi-check-circle-fill"></i>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Educator Info */}
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="section-title mb-3">Your Instructor</h4>
                
                <div className="d-flex align-items-center mb-3">
                  <div className="header-avatar me-3">
                    <span>{course.educator.avatar}</span>
                  </div>
                  <div>
                    <h5 className="profile-name mb-1">{course.educator.name}</h5>
                    <p className="profile-role mb-0">{course.educator.title}</p>
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="about-bubble mb-2">
                    <i className="bi bi-award me-2"></i>
                    <strong>Experience:</strong> {course.educator.experience}
                  </div>
                  <div className="about-bubble">
                    <i className="bi bi-star-fill me-2"></i>
                    <strong>Rating:</strong> {course.educator.rating}/5.0
                  </div>
                </div>
              </div>
            </div>

            {/* Course Stats */}
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="section-title mb-3">Course Stats</h4>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="about-subtitle">Status</span>
                    <span className={course.status === "Active" ? "text-accent fw-bold" : "profile-joined"}>
                      {course.status}
                    </span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="about-subtitle">Progress</span>
                    <span className="text-accent fw-bold">{course.progress}</span>
                  </div>
                  <div className="progress">
                    <div 
                      className="progress-bar-filled" 
                      style={{width: course.progress}}
                    ></div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span className="about-subtitle">Lessons Completed</span>
                    <span className="profile-joined">{completedLessons}/{totalLessons}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="card">
              <div className="card-body">
                <div className="d-grid gap-2">
                  {course.status === "Active" && (
                    <button className="btn-edit-profile mb-2">
                      <i className="bi bi-play-circle me-2"></i>
                      Continue Learning
                    </button>
                  )}
                  
                  <button
                    className="btn-edit-profile"
                    onClick={() => navigate('/courses')}
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
    </div>
  );
}
