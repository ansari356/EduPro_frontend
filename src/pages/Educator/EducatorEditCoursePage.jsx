
import {
  LibraryBig,
  FileText,
  Clock,
  Layers,
  Tag,
  Edit3,
  Edit,
  Trash2,
  Eye,
  TriangleAlert,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import AddModulePopup from "../../components/common/ModulePopup/AddModulePopup";
import getCoursesDetails from "../../apis/hooks/educator/getCoursesDetails";
import getModules from "../../apis/hooks/educator/getModules";
import useUpdateCourseDetails from "../../apis/hooks/educator/useUpdateCourseDetails";
import updateCourseDetailsRequest from "../../apis/actions/educator/updateCourse";
import ModuleItem from "../../components/common/ModuleItem";

export default function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  
  // Use the SWR hook to get course details
  const {
    data: courseData,
    error: courseError,
    isLoading: courseLoading,
    mutate
  } = getCoursesDetails(courseId);

  // Use the update hook
  const { updateCourse, error: updateError, isMutating } = useUpdateCourseDetails(courseId);

  // Use hooks for modules and lessons
  const {
    isLoading: moduleLoading,
    error: moduleError,
    data: moduleData,
    mutate: moduleMutate
  } = getModules(courseId);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    trailer_video: '',
    price: null,
    is_published: false,
    is_free: false,
    thumbnail: null
  });

  // Load course data when it's available
  useEffect(() => {
    if (courseData) {
      setFormData({
        title: courseData.title || '',
        description: courseData.description || '',
        trailer_video: courseData.trailer_video || '',
        price: courseData.price || null,
        is_published: courseData.is_published || false,
        is_free: courseData.is_free || false,
        thumbnail: null // Don't set existing thumbnail for file input
      });
    }
  }, [courseData]);

  // Auto-select first module when modules load
  useEffect(() => {
    if (moduleData && moduleData.length > 0 && !selectedModuleId) {
      setSelectedModuleId(moduleData[0].id);
    }
  }, [moduleData, selectedModuleId]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let newValue;

    if (type === 'checkbox') {
      newValue = checked;
    } else if (type === 'file') {
      const file = files[0];
      newValue = file || null;
      if (file) {
        setThumbnailPreview(URL.createObjectURL(file));
      } else {
        setThumbnailPreview(null);
      }
    } else if (name === 'price' && value === '') {
      newValue = null;
    } else {
      newValue = value;
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    
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
      newErrors.description = 'Description is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      // Prepare data for API - use JSON format instead of FormData since the hook uses application/json
      const dataToSubmit = {
        title: formData.title,
        description: formData.description,
        trailer_video: formData.trailer_video || '',
        is_published: formData.is_published,
        is_free: formData.is_free,
      };
      
      if (formData.price !== null && formData.price !== '') {
        dataToSubmit.price = parseFloat(formData.price);
      }
      
      if (formData.thumbnail) {
        dataToSubmit.thumbnail = formData.thumbnail;
      }
      
      // Update course using the hook
      await updateCourseDetailsRequest(courseId, dataToSubmit);
      
      // Refresh the data
      mutate();
      
      alert('Course updated successfully!');
      navigate(`/courses/${courseId}`);
      
    } catch (error) {
      console.error("Error updating course:", error);
      alert('Failed to update course. Please try again.');
    }
  };

  const handleEditClick = (module) => {
    setEditingModule(module);
    setIsPopupOpen(true);
  };

  const handleAddClick = () => {
    setEditingModule(null);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setEditingModule(null);
    setIsPopupOpen(false);
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

  // Error state
  if (courseError) {
    return (
      <div className="profile-root">
        <div className="card border-0 shadow-sm">
          <div className="container py-3">
            <div className="d-flex align-items-center">
              <div className="header-avatar me-2">
                <i className="bi bi-exclamation-triangle"></i>
              </div>
              <div>
                <span className="section-title mb-0">Error</span>
                <p className="profile-role mb-0">Failed to load course data</p>
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
                  <button
                    onClick={() => navigate('/educator')}
                    className="btn-edit-profile"
                  >
                    Back to Profile
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
        {isPopupOpen && (
          <AddModulePopup
            courseId={courseId}
            onClose={handleClosePopup}
            onModuleCreated={() => {
              moduleMutate(); // Refresh the module list
            }}
            moduleData={editingModule}
            nextOrder={moduleData ? moduleData.length + 2 : 1}
          />
        )}
        {moduleData && moduleData.length > 0 && (
                  <div className="card row justify-content-center mb-5 " >
                    <div className="card-body">
                      <div className="row text-center mt-3">
                        <div className="col-md-3 mb-3">
                          <div className="d-flex flex-column align-items-center">
                            <i className="bi bi-collection text-primary mb-2" style={{fontSize: '1.5rem'}}></i>
                            <small className="profile-joined">Total Modules</small>
                            <strong className="text-primary">{moduleData.length}</strong>
                          </div>
                        </div>
                        <div className="col-md-3 mb-3">
                          <div className="d-flex flex-column align-items-center">
                            <i className="bi bi-play-circle text-success mb-2" style={{fontSize: '1.5rem'}}></i>
                            <small className="profile-joined">Total Lessons</small>
                            <strong className="text-primary">
                              {moduleData.reduce((total, module) => total + module.total_lessons, 0)}
                            </strong>
                          </div>
                        </div>
                        <div className="col-md-3 mb-3">
                          <div className="d-flex flex-column align-items-center">
                            <Clock size={24} className="text-info mb-2" />
                            <small className="profile-joined">Total Duration</small>
                            <strong className="text-primary">
                              {(() => {
                                const totalSeconds = moduleData?.reduce((total, lesson) => total + lesson.duration, 0);
                                const hours = Math.floor(totalSeconds / 3600);
                                const minutes = Math.floor((totalSeconds % 3600) / 60);
                                return totalSeconds ? `${hours}h ${minutes}m` : '0h 0m';
                              })()}
                            </strong>
                          </div>
                        </div>
                        <div className="col-md-3 mb-3">
                          <div className="d-flex flex-column align-items-center">
                            <i className="bi bi-unlock text-warning mb-2" style={{fontSize: '1.5rem'}}></i>
                            <small className="profile-joined">Free Modules</small>
                            <strong className="text-primary">
                              {moduleData.filter(module => module.is_free).length} / {moduleData.length}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                        disabled={isMutating}
                      />
                      {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                    </div>

                    {/* Price */}
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center gap-2">
                        <Tag size={16} />
                        Price ($)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={formData.price || ''}
                        onChange={handleChange}
                        placeholder="Enter course price"
                        disabled={isMutating}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    {/* Description */}
                    <div className="col-12">
                      <label className="form-label d-flex align-items-center gap-2">
                        <FileText size={16} />
                        Description *
                      </label>
                      <textarea
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Enter course description"
                        disabled={isMutating}
                      />
                      {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                    </div>

                    {/* Trailer Video URL */}
                    <div className="col-12">
                      <label className="form-label d-flex align-items-center gap-2">
                        <i className="bi bi-camera-video" size={16}></i>
                        Trailer Video URL
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        name="trailer_video"
                        value={formData.trailer_video}
                        onChange={handleChange}
                        placeholder="Enter trailer video URL"
                        disabled={isMutating}
                      />
                    </div>

                    {/* Thumbnail */}
                    <div className="col-12">
                      <label className="form-label d-flex align-items-center gap-2">
                        <i className="bi bi-image" size={16}></i>
                        Course Thumbnail
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        name="thumbnail"
                        onChange={handleChange}
                        accept="image/*"
                        disabled={isMutating}
                      />
                      <small className="form-text text-muted">
                        Upload a new image to replace the current thumbnail
                      </small>
                       
                        <div className="mt-3">
                          <p className="mb-1">Thumbnail Preview:</p>
                          <img
                            src={thumbnailPreview || courseData.thumbnail || 'https://placehold.co/120x120?text=Course'}
                            alt="Thumbnail Preview"
                            className="img-fluid rounded"
                            style={{ maxHeight: '150px' }}
                          />
                        </div>
                      
                    </div>

                    {/* Checkboxes */}
                    <div className="col-md-6">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="is_published"
                          checked={formData.is_published}
                          onChange={handleChange}
                          disabled={isMutating}
                        />
                        <label className="form-check-label">
                          Published
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="is_free"
                          checked={formData.is_free}
                          onChange={handleChange}
                          disabled={isMutating}
                        />
                        <label className="form-check-label">
                          Free Course
                        </label>
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="col-12">
                      <div className="d-flex gap-2 justify-content-center">
                        <button 
                          type="submit" 
                          className="btn-edit-profile d-flex align-items-center"
                          disabled={isMutating}
                        >
                          {isMutating && (
                            <div className="loading-spinner me-2" style={{width: '1rem', height: '1rem', display: 'inline-block'}}></div>
                          )}
                          <i className="bi bi-check-circle me-2"></i>
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/courses/${courseId}`)}
                          className="btn-secondary-danger"
                          disabled={isMutating}
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

            {/* Curriculum Section */}
            <div className="card mt-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="section-title mb-0">Course Curriculum</h3>
                  <button
                    className="btn-edit-profile d-flex align-items-center"
                    onClick={handleAddClick}
                  >
                    <i className="bi bi-plus me-2"></i>
                    Add Module
                  </button>
                </div>

                {moduleLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading modules...</span>
                    </div>
                  </div>
                ) : moduleError || !moduleData ? (
                  <div className="card mb-3">
                    <div className="card-body text-center">
                      <TriangleAlert size={40} className="text-muted mb-3" />
                      <h5 className="section-title">No Modules Found</h5>
                      <p className="profile-joined">This course doesn't have any modules yet.</p>
                      <button
                        className="btn-edit-profile"
                        onClick={() => setIsPopupOpen(true)}
                      >
                        <i className="bi bi-plus me-2"></i>
                        Create First Module
                      </button>
                    </div>
                  </div>
                ) : (
                  moduleData?.map((module) => (
                    <ModuleItem
                      key={module.id}
                      module={module}
                      selectedModuleId={selectedModuleId}
                      setSelectedModuleId={setSelectedModuleId}
                      handleEditClick={handleEditClick}
                      onLessonAdded={moduleMutate}
                    />
                  ))
                )}

                {/* Course Summary */}
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
