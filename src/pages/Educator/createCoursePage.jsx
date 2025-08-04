import { BookOpen } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateCourseForm({ setShowCourseForm }) {
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    progress: '',
    status: '',
    link: '',
    image: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleCancel = () => {
    if (setShowCourseForm) {
      setShowCourseForm(false);
    } else {
      navigate(-1);
    }
  };
  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourseForm(prev => ({
      ...prev,
      [name]: value
    }));
    
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
    
    if (!courseForm.title.trim()) {
      newErrors.title = 'Course title is required';
    }
    
    if (!courseForm.status) {
      newErrors.status = 'Please select a status';
    }
    
    if (courseForm.link && !/^https?:\/\/.+/.test(courseForm.link)) {
      newErrors.link = 'Please enter a valid URL';
    }
    
    if (courseForm.image && !/^https?:\/\/.+/.test(courseForm.image)) {
      newErrors.image = 'Please enter a valid image URL';
    }
    
    return newErrors;
  };

  const handleCourseSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Course created successfully!');
      
      // Reset form
      setCourseForm({
        title: '',
        description: '',
        progress: '',
        status: '',
        link: '',
        image: ''
      });
      setErrors({});
      
      // Close form or navigate
      if (setShowCourseForm) {
        setShowCourseForm(false);
      } else {
        navigate('/courses');
      }
    }, 1000);
  };

  return (
    <div className="profile-root">

      {/* Main Content */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <div className="card">
              <div className="card-body">
                <div className="text-center mb-4">
                  <div className="avatar-circle mx-auto mb-3">
                    <BookOpen size={30} style={{ color: "var(--color-primary-dark)" }} />
                  </div>
                  <h2 className="section-title mb-2">Create New Course</h2>
                  <p className="profile-role">Fill in the course details below</p>
                </div>

                <form onSubmit={handleCourseSubmit}>
                  {/* Course Title */}
                  <div className="mb-3">
                    <label className="form-label">Course Title *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                      name="title"
                      value={courseForm.title}
                      onChange={handleCourseChange}
                      placeholder="Enter course title"
                      disabled={loading}
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="3"
                      value={courseForm.description}
                      onChange={handleCourseChange}
                      placeholder="Enter course description"
                      disabled={loading}
                    />
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <label className="form-label">Progress</label>
                    <input
                      type="text"
                      className="form-control"
                      name="progress"
                      placeholder="e.g., 80%"
                      value={courseForm.progress}
                      onChange={handleCourseChange}
                      disabled={loading}
                    />
                  </div>

                  {/* Status */}
                  <div className="mb-3">
                    <label className="form-label">Status *</label>
                    <select
                      className={`form-control ${errors.status ? 'is-invalid' : ''}`}
                      name="status"
                      value={courseForm.status}
                      onChange={handleCourseChange}
                      disabled={loading}
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                    </select>
                    {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                  </div>

                  {/* Link */}
                  <div className="mb-3">
                    <label className="form-label">Course Link</label>
                    <input
                      type="url"
                      className={`form-control ${errors.link ? 'is-invalid' : ''}`}
                      name="link"
                      value={courseForm.link}
                      onChange={handleCourseChange}
                      placeholder="https://example.com/course"
                      disabled={loading}
                    />
                    {errors.link && <div className="invalid-feedback">{errors.link}</div>}
                  </div>

                  {/* Course Image */}
                  <div className="mb-4">
                    <label className="form-label">Course Image</label>
                    <input
                      type="url"
                      className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                      name="image"
                      value={courseForm.image}
                      onChange={handleCourseChange}
                      placeholder="https://example.com/image.jpg"
                      disabled={loading}
                    />
                    {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                    
                    {courseForm.image && (
                      <div className="mt-3">
                        <small className="profile-joined">Preview:</small>
                        <div className="mt-2">
                          <img
                            src={courseForm.image}
                            alt="Course preview"
                            className="course-preview-image"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Buttons */}
                  <div className="d-flex gap-2">
                    <button 
                      type="submit" 
                      className="btn-edit-profile d-flex align-items-center"
                      disabled={loading}
                    >
                      {loading && (
                        <div className="loading-spinner me-2" style={{width: '1rem', height: '1rem', display: 'inline-block'}}></div>
                      )}
                      <i className="bi bi-plus-circle me-2"></i>
                      Create Course
                    </button>
                    <button
      type="button"
      onClick={handleCancel}
      className="btn-secondary-danger"
      disabled={loading}
    >
      Cancel
    </button>
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
