import {
  LibraryBig,
  FileText,
  Clock,
  Layers,
  Tag,
  Edit3,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

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

export default function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [courseLoading, setCourseLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [courseNotFound, setCourseNotFound] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    duration: '',
    lessons: '',
    level: '',
    category: '',
    tags: [],
    status: 'Draft'
  });

  // Load the actual course data based on courseId
  useEffect(() => {
    const loadCourse = async () => {
      setCourseLoading(true);
      
      // Add debug logs
      console.log('CourseId from params:', courseId, 'Type:', typeof courseId);
      console.log('Available courses:', courses.map(c => c.id));
      
      // Simulate API call delay
      setTimeout(() => {
        // Use find() to search the array by id
        const course = courses.find(c => c.id === parseInt(courseId));
        
        console.log('Found course:', course);
        
        if (course) {
          setFormData({
            title: course.title || '',
            description: course.description || '',
            fullDescription: course.fullDescription || '',
            duration: course.duration || '',
            lessons: course.lessons || '',
            level: course.level || '',
            category: course.category || '',
            tags: course.tags || [],
            status: course.status || 'Draft'
          });
          setCourseNotFound(false);
        } else {
          setCourseNotFound(true);
        }
        
        setCourseLoading(false);
      }, 500);
    };

    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Short description is required';
    }
    
    if (!formData.level) {
      newErrors.level = 'Please select a difficulty level';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    
    // Simulate API call to update the course
    setTimeout(() => {
      setLoading(false);
      
      // In a real app, you would update the course in your database/state management
      console.log("Updating course:", courseId, formData);
      
      // Update the courses array (in a real app, this would be an API call)
      const courseIndex = courses.findIndex(c => c.id === parseInt(courseId));
      if (courseIndex !== -1) {
        courses[courseIndex] = {
          ...courses[courseIndex],
          ...formData,
          id: parseInt(courseId)
        };
      }
      
      alert('Course updated successfully!');
      navigate(`/courses/${courseId}`);
    }, 1000);
  };

  // Loading state
  if (courseLoading) {
    return (
      <div className="profile-root">
        <div className="card border-0 shadow-sm">
          <div className="container py-3">
            <div className="d-flex align-items-center">
              <div className="header-avatar me-2">
                <Edit3 size={20} />
              </div>
              <div>
                <span className="section-title mb-0">Edit Course</span>
                <p className="profile-role mb-0">Loading course data...</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body text-center">
                  <div className="loading-spinner mb-3 mx-auto w-fit" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="profile-joined">Loading course information...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Course not found state
  if (courseNotFound) {
    return (
      <div className="profile-root">
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
                    Sorry, we couldn't find the course you're trying to edit.
                  </p>
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
                <Edit3 size={20} />
              </div>
              <div>
                <span className="section-title mb-0">Edit Course</span>
                <p className="profile-role mb-0">Update course content and settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card">
              <div className="card-body">
                <div className="text-center mb-4">
                  <div className="avatar-circle mx-auto mb-3">
                    <Edit3 size={30} />
                  </div>
                  <h2 className="section-title mb-2">Edit Course Details</h2>
                  <p className="profile-role">Update your course information below</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    {/* Course Title */}
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center gap-2">
                        <LibraryBig size={16} />
                        Course Title *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter course title"
                        disabled={loading}
                      />
                      {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                    </div>

                    {/* Category */}
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center gap-2">
                        <Tag size={16} />
                        Category
                      </label>
                      <select
                        className="form-control"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <option value="">Select Category</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Business Intelligence">Business Intelligence</option>
                        <option value="Data Visualization">Data Visualization</option>
                        <option value="Machine Learning">Machine Learning</option>
                        <option value="Database">Database</option>
                        <option value="Programming">Programming</option>
                      </select>
                    </div>

                    {/* Short Description */}
                    <div className="col-12">
                      <label className="form-label d-flex align-items-center gap-2">
                        <FileText size={16} />
                        Short Description *
                      </label>
                      <textarea
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Enter a brief course description"
                        disabled={loading}
                      />
                      {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                    </div>

                    {/* Full Description */}
                    <div className="col-12">
                      <label className="form-label d-flex align-items-center gap-2">
                        <FileText size={16} />
                        Full Description
                      </label>
                      <textarea
                        className="form-control"
                        name="fullDescription"
                        value={formData.fullDescription}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Enter detailed course overview and objectives"
                        disabled={loading}
                      />
                    </div>

                    {/* Duration */}
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center gap-2">
                        <Clock size={16} />
                        Duration
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="e.g., 10 weeks"
                        disabled={loading}
                      />
                    </div>

                    {/* Number of Lessons */}
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center gap-2">
                        <Layers size={16} />
                        Number of Lessons
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="lessons"
                        value={formData.lessons}
                        onChange={handleChange}
                        placeholder="Enter number of lessons"
                        disabled={loading}
                        min="1"
                      />
                    </div>

                    {/* Level */}
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center gap-2">
                        <LibraryBig size={16} />
                        Difficulty Level *
                      </label>
                      <select
                        className={`form-control ${errors.level ? 'is-invalid' : ''}`}
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <option value="">Select Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                      {errors.level && <div className="invalid-feedback">{errors.level}</div>}
                    </div>

                    {/* Tags */}
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center gap-2">
                        <Tag size={16} />
                        Tags
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="tags"
                        value={Array.isArray(formData.tags) ? formData.tags.join(", ") : formData.tags}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            tags: e.target.value.split(",").map((tag) => tag.trim()),
                          }))
                        }
                        placeholder="Separate tags with commas"
                        disabled={loading}
                      />
                      <small className="profile-joined">Separate multiple tags with commas</small>
                    </div>

                    {/* Status */}
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center gap-2">
                        <i className="bi bi-circle-fill" size={16}></i>
                        Status
                      </label>
                      <select
                        className="form-control"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>

                    {/* Tags Preview */}
                    {Array.isArray(formData.tags) && formData.tags.length > 0 && formData.tags[0] !== '' && (
                      <div className="col-12">
                        <label className="form-label">Tags Preview</label>
                        <div className="d-flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            tag.trim() && (
                              <span key={index} className="about-bubble">
                                {tag.trim()}
                              </span>
                            )
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="col-12">
                      <div className="d-flex gap-2 justify-content-center">
                        <button 
                          type="submit" 
                          className="btn-edit-profile d-flex align-items-center"
                          disabled={loading}
                        >
                          {loading && (
                            <div className="loading-spinner me-2" style={{width: '1rem', height: '1rem', display: 'inline-block'}}></div>
                          )}
                          <i className="bi bi-check-circle me-2"></i>
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/courses/${courseId}`)}
                          className="btn-secondary-danger"
                          disabled={loading}
                        >
                          <i className="bi bi-x-circle me-2"></i>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
