//EducatorCourseDetails.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import getCoursesDetails from "../../apis/hooks/educator/getCoursesDetails";
import getModules from "../../apis/hooks/educator/getModules";
import getLessonList from "../../apis/hooks/educator/getLessonList";
import getRatesandReviews from "../../apis/hooks/educator/getRatesandReviews";
import useCourseEnrollments from "../../apis/hooks/educator/useCourseEnrollments";
import useCourseAssessments from "../../apis/hooks/educator/useCourseAssessments";
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
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// fixed_data
const fixedcourses = [
  {
    id: 1,
    title: "python",
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

  },
];


export default function EducatorCourseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedModuleId, setSelectedModuleId] = useState(null);


const {
  data: ratesandReviewsData,
  error: ratesandReviewsError,
  isLoading: ratesandReviewsLoading,
} = getRatesandReviews(id);

    // Fetch course details from API
  const {
    data: courseData,
    error: courseError,
    isLoading: courseLoading,
  } = getCoursesDetails(id);

const {
  data: moduleData,
  error: moduleError,
  isLoading: moduleLoading,
} = getModules(id);

const {
  data: lessonData,
  error: lessonError,
  isLoading: lessonLoading,
} = getLessonList(selectedModuleId);

const {
  enrollments,
  error: enrollmentsError,
  isLoading: enrollmentsLoading,
} = useCourseEnrollments(id);

const {
  assessments,
  error: assessmentsError,
  isLoading: assessmentsLoading,
} = useCourseAssessments(id);



  React.useEffect(() => {
    if (moduleData && moduleData.length > 0 && !selectedModuleId) {
      setSelectedModuleId(moduleData[0].id);
    }
  }, [moduleData, selectedModuleId]);

  
   if (courseLoading) {
    return (
      <div className="profile-root">
        <div className="container py-5 text-center">
          <div className="spinner-border text-main" role="status">
            <span className="visually-hidden">{t('courses.loading')}</span>
          </div>
        </div>
      </div>
    );
  }


   // Error state
  if (courseError || !courseData) {
    return (
      <div className="profile-root">
        <div className="card border-0 shadow-sm">
          <div className="container py-3">
            <div className="d-flex align-items-center">
              <div className="header-avatar me-2">
                <TriangleAlert size={20} />
              </div>
              <div>
                <span className="section-title mb-0">{t('courses.courseNotFound')}</span>
                <p className="profile-role mb-0">
                  {t('courses.courseNotFoundMessage')}
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
                  <div className="avatar-circle mb-4 d-flex justify-content-center w-fit">
                    <TriangleAlert size={40} />
                  </div>
                  <h2 className="main-title mb-3">{t('courses.courseNotFound')}</h2>
                  <p className="profile-joined mb-4">
                    {t('courses.courseNotFoundDescription')}
                  </p>
                  <button
                    className="btn-edit-profile"
                    onClick={() => navigate("/educator")}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    {t('courses.backToProfile')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  
     const course = courseData;

  
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
                <span className="section-title mb-0">{t('courses.courseNotFound')}</span>
                <p className="profile-role mb-0">
                  {t('courses.courseNotFoundMessage')}
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
                  <div className="avatar-circle mb-4 d-flex justify-content-center w-fit">
                    <TriangleAlert size={40} />
                  </div>
                  <h2 className="main-title mb-3">{t('courses.courseNotFound')}</h2>
                  <p className="profile-joined mb-4">
                    {t('courses.courseNotFoundDescription')}
                  </p>
                  <button
                    className="btn-edit-profile"
                    onClick={() => navigate("/courses")}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    {t('courses.backToCourses')}
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
                <p className="profile-role mb-0">{t('courses.courseManagementDashboard')}</p>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn-edit-profile d-flex align-items-center"
                onClick={() => navigate(`/courses`)}
              >
                <i className="bi bi-arrow-left me-2"></i>
                {t('courses.backToCourses')}
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
                <div className="avatar-circle mb-2 d-flex justify-content-center w-fit">
                  <Users size={20} />
                </div>
                <h5 className="section-title mb-1">
                  {course.total_enrollments}
                </h5>
                <small className="profile-joined">{t('courses.enrolled')}</small>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card">
              <div className="card-body text-center">
                <div className="avatar-circle mb-2 d-flex justify-content-center w-fit">
                  <Award size={20} />
                </div>
                <h5 className="section-title mb-1">
                  {course.total_lessons}
                </h5>
                <small className="profile-joined">{t('courses.totalLesson')}</small>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card">
              <div className="card-body text-center">
                <div className="avatar-circle mb-2 d-flex justify-content-center w-fit">
                  <TrendingUp size={20} />
                </div>
                <h5 className="section-title mb-1">{course.total_durations}</h5>
                <small className="profile-joined">{t('courses.totalDuration')}</small>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card">
              <div className="card-body text-center">
                <div className="avatar-circle mb-2 d-flex justify-content-center w-fit">
                  <Star size={20} />
                </div>
                <h5 className="section-title mb-1">{course.average_rating}</h5>
                <small className="profile-joined">{t('courses.averageRating')}</small>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card">
              <div className="card-body text-center">
                <div className="avatar-circle mb-2 d-flex justify-content-center w-fit">
                  <MessageCircle size={20} />
                </div>
                <h5 className="section-title mb-1">{course.total_reviews}</h5>
                <small className="profile-joined">{t('courses.reviews')}</small>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card">
              <div className="card-body text-center">
                <div className="avatar-circle mb-2 d-flex justify-content-center w-fit">
                  <DollarSign size={24} />
                </div>
                <h5 className="section-title mb-1">{course.total_revenue}</h5>
                <small className="profile-joined">{t('courses.revenue')}</small>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            {/* Course Image */}
            <div className="mb-4">
              <img
                src={course.thumbnail || 'https://placehold.co/120x120?text=Course'}
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
                        ? "text-accent border-main"
                        : "profile-joined"
                    }`}
                    onClick={() => setActiveTab("overview")}
                  >
                    {t('courses.overview')}
                  </button>
                  <button
                    className={`btn-link-custom flex-fill text-center py-3 ${
                      activeTab === "curriculum"
                        ? "text-accent border-main"
                        : "profile-joined"
                    }`}
                    onClick={() => setActiveTab("curriculum")}
                  >
                    {t('courses.curriculum')}
                  </button>
                  <button
                    className={`btn-link-custom flex-fill text-center py-3 ${
                      activeTab === "students"
                        ? "text-accent border-main"
                        : "profile-joined"
                    }`}
                    onClick={() => setActiveTab("students")}
                  >
                    {t('courses.students')}
                  </button>
                  <button
                    className={`btn-link-custom flex-fill text-center py-3 ${
                      activeTab === "reviews"
                        ? "text-accent border-main"
                        : "profile-joined"
                    }`}
                    onClick={() => setActiveTab("reviews")}
                  >
                    {t('courses.reviews')}
                  </button>
                  <button
                    className={`btn-link-custom flex-fill text-center py-3 ${
                      activeTab === "assessments"
                        ? "text-accent border-main"
                        : "profile-joined"
                    }`}
                    onClick={() => setActiveTab("assessments")}
                  >
                    {t('courses.assessments')}
                  </button>

                </div>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="card">
                <div className="card-body">
                  <h3 className="section-title mb-4">{t('courses.courseInformation')}</h3>

                  <div className="mb-4">
                    <h4 className="about-subtitle mb-2">{t('courses.description')}</h4>
                    <p className="profile-joined">{course.description}</p>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                      <div className="about-bubble">
                        <Clock size={16} className="me-2" />
                        <strong>{t('courses.duration')}:</strong> {course.total_durations}
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="about-bubble">
                        <i className="bi bi-bookmark me-2"></i>
                        <strong>{t('courses.category')}:</strong> {course.category.name}
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="about-bubble">
                        <i className="bi bi-currency-dollar me-2"></i>
                        <strong>{t('courses.price')}:</strong> {course.price}
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="about-bubble">
                        <i className="bi bi-globe me-2"></i>
                        <strong>{t('courses.totalEnrollments')}:</strong> {course.total_enrollments}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}



            {activeTab === "curriculum" && (
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="section-title mb-0">{t('courses.courseCurriculum')}</h3>
                    {/* <button className="btn-edit-profile d-flex align-items-center">
                      <i className="bi bi-plus me-2"></i>
                      {t('courses.addModule')}
                    </button> */}
                  </div>

                  {moduleLoading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-main" role="status">
                        <span className="visually-hidden">{t('courses.loadingModules')}</span>
                      </div>
                    </div>
                  ) : moduleError || !moduleData ? (
                    <div className="card mb-3">
                      <div className="card-body text-center">
                        <TriangleAlert size={40} className="text-muted mb-3" />
                        <h5 className="section-title">{t('courses.noModulesFound')}</h5>
                        <p className="profile-joined">{t('courses.noModulesYet')}</p>
                        <button className="btn-edit-profile">
                          <i className="bi bi-plus me-2"></i>
                          {t('courses.createFirstModule')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    moduleData?.map((module, index) => (
                      <div key={module.id} className="card mb-3">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div
                              className="flex-grow-1"
                              style={{ cursor: "pointer" }}
                              onClick={() => setSelectedModuleId(module.id)}
                            >
                              <h4 className={`about-subtitle mb-1 ${selectedModuleId === module.id ? "" : ""}`}>
                                {module.title}
                              </h4>
                              <div className="d-flex gap-3 mb-2">
                                <small className="profile-joined">
                                  <i className="bi bi-list-ol me-1"></i>
                                  {t('courses.order')}: {module.order}
                                </small>
                                <small className="profile-joined">
                                  <i className="bi bi-play-circle me-1"></i>
                                  {module.total_lessons} {t('courses.lessons')}
                                </small>

                                
                                <small className="profile-joined">
                                  <Clock size={12} className="me-1" />
                                  {Math.floor(module.total_duration / 60)}{t('courses.min')}
                                </small>
                                <small className={`${module.is_free ? 'text-success' : 'text-accent'}`}>
                                  <i className={`bi ${module.is_free ? 'bi-unlock' : 'bi-lock'} me-1`}></i>
                                  {module.is_free ? t('courses.free') : `$${module.price}`}
                                </small>
                              </div>
                            </div>
                            <div className="d-flex gap-2">
                              {/* <button className="btn-edit-profile d-flex align-items-center">
                                <Edit size={14} className="me-1" />
                                Edit
                              </button> */}
                              {/* <button className="btn-edit-profile d-flex align-items-center">
                                <i className="bi bi-plus me-1"></i>
                                Add Lesson
                              </button> */}
                            </div>
                          </div>

                          {/* Module Lessons: تظهر فقط عند اختيار الموديول */}
                   {selectedModuleId === module.id && (
                              <div className="ms-3">
                                {lessonLoading ? (
                                  <div className="text-center py-2">
                                    <small className="profile-joined">{t('courses.loadingLessons')}</small>
                                  </div>
                                ) : lessonError || !lessonData || !Array.isArray(lessonData) || lessonData.length === 0 ? (
                                  <div className="about-bubble mb-2 text-center">
                                    <span className="profile-joined">
                                      <i className="bi bi-info-circle me-2"></i>
                                      {t('courses.noLessonsAvailable')}
                                    </span>
                                  </div>
                                ) : (
                                  lessonData
                                    ?.sort((a, b) => a.order - b.order)
                                    ?.map((lesson, lessonIndex) => (
                                      <div
                                        key={lesson.id}
                                        className="about-bubble mb-2 d-flex justify-content-between align-items-center"
                                      >
                                        <div className="flex-grow-1">
                                          <span className="d-flex align-items-center">
                                            <i className="bi bi-play-circle me-2"></i>
                                            <span className="me-2">{lesson.title}</span>
                                            <small className="profile-joined me-2">
                                              ({Math.floor(lesson.duration / 60)}{t('courses.min')})
                                            </small>
                                            <small className={`badge ${lesson.is_published ? 'bg-success' : 'bg-warning'}`}>
                                              {lesson.is_published ? t('courses.published') : t('courses.draft')}
                                            </small>
                                            {/* {lesson.is_free && (
                                              <small className="badge bg-info ms-1">Free</small>
                                            )} */}
                                          </span>
                                          {lesson.description && (
                                            <div className="mt-1">
                                              <small className="profile-joined d-block">
                                                {lesson.description}
                                              </small>
                                            </div>
                                          )}
                                        </div>
                                        <div className="d-flex gap-1">
                                          {/* <button 
                                            className="btn p-0 border-0 bg-transparent"
                                            title="Edit Lesson"
                                          >
                                            <Edit size={12} />
                                          </button>
                                          <button 
                                            className="btn p-0 border-0 bg-transparent"
                                            title="Preview Lesson"
                                          >
                                            <Eye size={12} />
                                          </button>
                                          <button 
                                            className="btn p-0 border-0 bg-transparent text-danger"
                                            title="Delete Lesson"
                                          >
                                            <Trash2 size={12} />
                                          </button> */}
                                        </div>
                                      </div>
                                    ))
                                )}
                              </div>
                            )}

                          {/* Module Summary */}
                          {module.total_lessons > 0 && (
                            <div className="mt-3 pt-2 border-top">
                              <div className="row text-center">
                                <div className="col-3">
                                  <small className="profile-joined d-block">{t('courses.totalLessons')}</small>
                                  <strong className="text-accent">{module.total_lessons}</strong>
                                </div>
                                <div className="col-3">
                                  <small className="profile-joined d-block">{t('courses.duration')}</small>
                                  <strong className="text-accent">
                                    {Math.floor(module.total_duration / 3600)}h {Math.floor((module.total_duration % 3600) / 60)}m
                                  </strong>
                                </div>
                                <div className="col-3">
                                  <small className="profile-joined d-block">{t('courses.price')}</small>
                                  <strong className={module.is_free ? 'text-success' : 'text-accent'}>
                                    {module.is_free ? t('courses.free') : `$${module.price}`}
                                  </strong>
                                </div>
                                <div className="col-3">
                                  <small className="profile-joined d-block">{t('courses.order')}</small>
                                  <strong className="text-accent">{module.order}</strong>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}

                  {/* Course Summary */}
                  {moduleData && moduleData.length > 0 && (
                    <div className="card ">
                      <div className="card-body">
                        <h5 className="about-subtitle mb-3">{t('courses.courseSummary')}</h5>
                        <div className="row text-center">
                          <div className="col-md-3">
                            <div className="mb-2">
                              <i className="bi bi-collection text-main" style={{fontSize: '1.5rem'}}></i>
                            </div>
                            <small className="profile-joined d-block">{t('courses.totalModules')}</small>
                            <strong className="text-accent">{moduleData.length}</strong>
                          </div>
                          <div className="col-md-3">
                            <div className="mb-2">
                              <i className="bi bi-play-circle text-main" style={{fontSize: '1.5rem'}}></i>
                            </div>
                            <small className="profile-joined d-block">{t('courses.totalLessons')}</small>
                            <strong className="text-accent">
                              {moduleData.reduce((total, module) => total + module.total_lessons, 0)}
                            </strong>
                          </div>
                          <div className="col-md-3">
                            <div className="mb-2">
                              <Clock size={24} className="text-main" />
                            </div>
                            <small className="profile-joined d-block">{t('courses.totalDuration')}</small>
                            <strong className="text-accent">
                              {Math.floor(moduleData.reduce((total, module) => total + module.total_duration, 0) / 3600)}h {Math.floor((moduleData.reduce((total, module) => total + module.total_duration, 0) % 3600) / 60)}m
                            </strong>
                          </div>
                          <div className="col-md-3">
                            <div className="mb-2">
                              <DollarSign size={24} className="text-main" />
                            </div>
                            <small className="profile-joined d-block">{t('courses.freeModules')}</small>
                            <strong className="text-success">
                              {moduleData.filter(module => module.is_free).length} / {moduleData.length}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}


            {activeTab === "students" && (
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="section-title mb-0">{t('courses.courseStudents')}</h3>
                  </div>
                  <div className="mb-4">
                    {enrollmentsLoading ? (
                      <div className="text-center py-4">
                        <div className="spinner-border text-main" role="status">
                          <span className="visually-hidden">{t('courses.loadingStudents')}</span>
                        </div>
                      </div>
                    ) : enrollmentsError ? (
                      <div className="card mb-3">
                        <div className="card-body text-center">
                          <TriangleAlert size={40} className="text-muted mb-3" />
                          <h5 className="section-title">{t('courses.errorLoadingStudents')}</h5>
                          <p className="profile-joined">{t('courses.failedToLoadStudents')}</p>
                        </div>
                      </div>
                    ) : enrollments.length === 0 ? (
                      <div className="card mb-3">
                        <div className="card-body text-center">
                          <Users size={40} className="text-muted mb-3" />
                          <h5 className="section-title">{t('courses.noStudentsEnrolled')}</h5>
                          <p className="profile-joined">{t('courses.noStudentsYet')}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="table-responsive custom-table-container">
                        <table className="table table-borderless">
                          <thead>
                            <tr>
                              <th>{t('courses.student')}</th>
                              <th>{t('courses.email')}</th>
                              <th>{t('courses.username')}</th>
                              <th>{t('courses.phone')}</th>
                              <th>{t('courses.status')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {enrollments.map((enrollment) => (
                              <tr key={enrollment.id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <img
                                      src={enrollment.profile_picture || "https://placehold.co/40x40?text=U"}
                                      alt={enrollment.full_name}
                                      className="rounded-circle me-2"
                                      style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                    />
                                    <div>
                                      <div className="fw-bold">{enrollment.full_name}</div>
                                      <small className="text-muted">{enrollment.user?.username}</small>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <small className="profile-joined">{enrollment.user?.email}</small>
                                </td>
                                <td>
                                  <span className="badge bg-light text-dark">{enrollment.user?.username}</span>
                                </td>
                                <td>
                                  <small className="profile-joined">{enrollment.user?.phone || "N/A"}</small>
                                </td>
                                <td>
                                  <span className={`badge ${enrollment.user?.is_active ? "bg-success" : "bg-secondary"}`}>
                                    {enrollment.user?.is_active ? t('courses.active') : t('courses.inactive')}
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
            )}

            {activeTab === "reviews" && (
              <div className="card">
                <div className="card-body">
                  <h3 className="section-title mb-4">{t('courses.studentReviews')}</h3>

                  {/* Ratings Summary */}
                  <div className="row mb-4">
                    <div className="col-md-4 text-center">
                      <h2 className="section-title text-accent">
                        {ratesandReviewsData && ratesandReviewsData.length > 0
                          ? (
                              ratesandReviewsData.reduce((sum, r) => sum + r.rating, 0) /
                              ratesandReviewsData.length
                            ).toFixed(1)
                          : "0.0"}
                      </h2>
                      <div className="mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className={
                              i < Math.round(
                                ratesandReviewsData && ratesandReviewsData.length > 0
                                  ? ratesandReviewsData.reduce((sum, r) => sum + r.rating, 0) /
                                    ratesandReviewsData.length
                                  : 0
                              )
                                ? "text-warning"
                                : "text-muted"
                            }
                          />
                        ))}
                      </div>
                      <p className="profile-joined">
                        {t('courses.basedOnReviews', { count: ratesandReviewsData ? ratesandReviewsData.length : 0 })}
                      </p>
                    </div>
                    <div className="col-md-8">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count =
                          ratesandReviewsData?.filter((r) => r.rating === rating).length || 0;
                        const percent =
                          ratesandReviewsData && ratesandReviewsData.length > 0
                            ? (count / ratesandReviewsData.length) * 100
                            : 0;
                        return (
                          <div key={rating} className="d-flex align-items-center mb-2">
                            <span className="me-2">{rating} {t('courses.star')}</span>
                            <div className="progress flex-grow-1 me-2">
                              <div
                                className="progress-bar-filled"
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                            <small className="profile-joined">{count}</small>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Reviews */}
                  <div>
                    <h4 className="about-subtitle mb-3">{t('courses.recentReviews')}</h4>
                    {ratesandReviewsData && ratesandReviewsData.length > 0 ? (
                      ratesandReviewsData.map((review) => (
                        <div key={review.id} className="card mb-3">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <h6 className="about-subtitle mb-1">
                                  {review.student?.full_name || t('courses.unknown')}
                                </h6>
                                <div className="mb-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={16}
                                      className={i < review.rating ? "text-warning" : "text-muted"}
                                    />
                                  ))}
                                </div>
                              </div>
                              <small className="profile-joined">
                                {review.created_at
                                  ? new Date(review.created_at).toLocaleDateString()
                                  : ""}
                              </small>
                            </div>
                            <p className="profile-joined mb-0">{review.comment}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted py-3">
                        {t('courses.noReviewsAvailable')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "assessments" && (
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="section-title mb-0">{t('courses.courseAssessments')}</h3>
                    <button 
                      className="btn-edit-profile d-flex align-items-center"
                      onClick={() => navigate(`/assessments`)}
                    >
                      <i className="bi bi-plus me-2"></i>
                      {t('courses.createAssessment')}
                    </button>
                  </div>

                  {assessmentsLoading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-main" role="status">
                        <span className="visually-hidden">{t('courses.loadingAssessments')}</span>
                      </div>
                    </div>
                  ) : assessmentsError ? (
                    <div className="card mb-3">
                      <div className="card-body text-center">
                        <TriangleAlert size={40} className="text-muted mb-3" />
                        <h5 className="section-title">{t('courses.errorLoadingAssessments')}</h5>
                        <p className="profile-joined">{t('courses.failedToLoadAssessments')}</p>
                      </div>
                    </div>
                  ) : !assessments || Object.keys(assessments).length === 0 ? (
                    <div className="card mb-3">
                      <div className="card-body text-center">
                        <FileText size={40} className="text-muted mb-3" />
                        <h5 className="section-title">{t('courses.noAssessmentsFound')}</h5>
                        <p className="profile-joined">{t('courses.noAssessmentsYet')}</p>
                        <button 
                          className="btn-edit-profile"
                          onClick={() => navigate(`/assessments`)}
                        >
                          <i className="bi bi-plus me-2"></i>
                          {t('courses.createFirstAssessment')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {Object.values(assessments)
                        .sort((a, b) => {
                          // Sort by creation date - newest first
                          return new Date(b.created_at) - new Date(a.created_at);
                        })
                        .map((assessment) => (
                        <div key={assessment.id} className="card">
                          <div className="card-body p-3">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center gap-2 mb-2">
                                  <h6 className="about-subtitle mb-0">{assessment.title}</h6>
                                  <span className={`badge badge-sm ${
                                    assessment.assessment_type === 'quiz' ? 'bg-info' :
                                    assessment.assessment_type === 'exam' ? 'bg-warning' :
                                    assessment.assessment_type === 'assignment' ? 'bg-primary' :
                                    'bg-secondary'
                                  }`}>
                                    {assessment.assessment_type?.charAt(0).toUpperCase() + assessment.assessment_type?.slice(1)}
                                  </span>
                                  <span className={`badge badge-sm ${assessment.is_published ? 'bg-success' : 'bg-secondary'}`}>
                                    {assessment.is_published ? 'Published' : 'Draft'}
                                  </span>
                                </div>
                                
                                {/* Related To */}
                                <div className="mb-2">
                                  <small className="profile-joined">
                                    <i className="bi bi-link-45deg me-1"></i>
                                    {assessment.related_to || t('courses.courseAssessments')}
                                  </small>
                                </div>

                                {/* Assessment Info */}
                                <div className="d-flex flex-wrap gap-3 mb-2">
                                  <small className="profile-joined">
                                    <i className="bi bi-list-ol me-1"></i>
                                    {assessment.total_questions} {t('courses.questions')}
                                  </small>
                                  <small className="profile-joined">
                                    <i className="bi bi-award me-1"></i>
                                    {assessment.total_marks} {t('courses.marks')}
                                  </small>
                                  {assessment.is_timed && assessment.time_limit && (
                                    <small className="profile-joined">
                                      <i className="bi bi-clock me-1"></i>
                                      {assessment.time_limit} {t('courses.min')}
                                    </small>
                                  )}
                                  <small className="profile-joined">
                                    <i className="bi bi-arrow-repeat me-1"></i>
                                    {assessment.max_attempts} {assessment.max_attempts !== 1 ? t('courses.attempts') : t('courses.attempt')}
                                  </small>
                                </div>

                                {/* Availability */}
                                <div className="d-flex align-items-center gap-2">
                                  <span className={`badge badge-sm ${assessment.is_available ? 'bg-success' : 'bg-warning'}`}>
                                    {assessment.is_available ? t('courses.available') : t('courses.notAvailable')}
                                  </span>
                                  <small className="profile-joined">
                                    {t('courses.created')}: {assessment.created_at ? new Date(assessment.created_at).toLocaleDateString() : 'N/A'}
                                  </small>
                                </div>
                              </div>

                              {/* Action Icons */}
                              <div className="d-flex gap-1">
                                <button 
                                  className="btn btn-sm p-1 border-0 bg-transparent text-primary"
                                  title={t('courses.viewAssessmentDetails')}
                                  onClick={() => navigate(`/assessments/${assessment.id}`)}
                                >
                                  <Eye size={16} />
                                </button>
            
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Assessment Summary */}
                  {assessments && Object.keys(assessments).length > 0 && (
                    <div className="card mt-4">
                      <div className="card-body">
                        <h5 className="about-subtitle mb-3">{t('courses.assessmentSummary')}</h5>
                        <div className="row text-center">
                          <div className="col-6 col-md-3">
                            <div className="mb-2">
                              <FileText size={24} className="text-main" />
                            </div>
                            <small className="profile-joined d-block">{t('courses.total')}</small>
                            <strong className="text-accent">{Object.keys(assessments).length}</strong>
                          </div>
                          <div className="col-6 col-md-3">
                            <div className="mb-2">
                              <CheckCircle size={24} className="text-success" />
                            </div>
                            <small className="profile-joined d-block">{t('courses.published')}</small>
                            <strong className="text-success">
                              {Object.values(assessments).filter(a => a.is_published).length}
                            </strong>
                          </div>
                          <div className="col-6 col-md-3">
                            <div className="mb-2">
                              <AlertCircle size={24} className="text-warning" />
                            </div>
                            <small className="profile-joined d-block">{t('courses.available')}</small>
                            <strong className="text-success">
                              {Object.values(assessments).filter(a => a.is_available).length}
                            </strong>
                          </div>
                          <div className="col-6 col-md-3">
                            <div className="mb-2">
                              <i className="bi bi-clock text-main" style={{fontSize: '24px'}}></i>
                            </div>
                            <small className="profile-joined d-block">{t('courses.timed')}</small>
                            <strong className="text-accent">
                              {Object.values(assessments).filter(a => a.is_timed).length}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}


          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Quick Actions */}
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="section-title mb-3">{t('courses.quickActions')}</h4>

                <div className="d-grid gap-2">
                  <button onClick={() => navigate(`/courses/edit/${course.id}`)} className="btn-edit-profile d-flex align-items-center justify-content-center">
                    <Edit size={16} className="me-2" />
                    {t('courses.editCourseContent')}
                  </button>
                </div>
              </div>
            </div>

            {/* Course Status */}
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="section-title mb-3">{t('courses.courseStatus')}</h4>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="about-subtitle">{t('courses.status')}</span>
                    <span className="text-accent fw-bold">{course?.is_free ? t('courses.free') : t('courses.paid')}</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="about-subtitle">{t('courses.created')}</span>
                    <span className="profile-joined">    {course?.created_at ? course.created_at.split("T")[0] : ""} </span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="about-subtitle">{t('courses.published')}</span>
                    <span className="profile-joined">
                      {course?.is_published ? t('courses.published') : t('courses.unpublished')}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="about-subtitle">{t('courses.courseLastUpdated')}</span>
                    <span className="profile-joined">{course.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Summary */}
            <div className="card">
              <div className="card-body">
                <h4 className="section-title mb-3">{t('courses.revenueSummary')}</h4>

                <div className="text-center mb-3">
                  <h3 className="section-title text-accent">
                    {course.total_revenue}
                  </h3>
                  <p className="profile-joined">{t('courses.totalRevenue')}</p>
                </div>

                <div className="mb-2">
                  <div className="d-flex justify-content-between">
                    <span className="about-subtitle">{t('courses.pricePerStudent')}</span>
                    <span className="profile-joined">{course.price}</span>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="d-flex justify-content-between">
                    <span className="about-subtitle">{t('courses.totalEnrollments')}</span>
                    <span className="profile-joined">
                      {course.total_enrollments}
                    </span>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="d-flex justify-content-between">
                    <span className="about-subtitle">{t('courses.totalRevenue')}</span>
                    <span className="profile-joined">
                      {course.total_revenue}
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
