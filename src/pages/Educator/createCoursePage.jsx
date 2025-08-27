import {
  LibraryBig,
  FileText,
  Clock,
  Layers,
  Tag,
  Edit3,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import createCourse from "../../apis/actions/educator/createCoure"; // Import the createCourse API
import { pagePaths } from "../../pagePaths";
import useCategoryList from "../../apis/actions/educator/useCategoryList";
import { useTranslation } from "react-i18next";
import { useAutoTranslate } from "../../hooks/useAutoTranslate";

export default function CreateCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();
  const { translate } = useAutoTranslate();
  
  // Fetch categories using the hook
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategoryList();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    trailer_video: '',
    price: null,
    is_free: false,
    category: '', 
    thumbnail: null
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let newValue;

    if (type === 'checkbox') {
      newValue = checked;
    } else if (type === 'file') {
      newValue = files[0] || null;
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
      newErrors.title = t('courses.titleRequired');
    }
    
    if (!formData.description.trim()) {
      newErrors.description = t('courses.descriptionRequired');
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
    
    setLoading(true);
    
    try {
      const dataToSubmit = new FormData();
      dataToSubmit.append('title', formData.title);
      dataToSubmit.append('description', formData.description);
      dataToSubmit.append('trailer_video', formData.trailer_video || '');
      dataToSubmit.append('is_free', formData.is_free);
      dataToSubmit.append('category', formData.category || ''); // Ensure category is included
      
      if (formData.price !== null && formData.price !== '') {
        dataToSubmit.append('price', parseFloat(formData.price));
      }

      if (formData.thumbnail) {
        dataToSubmit.append('thumbnail', formData.thumbnail);
      }

      await createCourse(dataToSubmit); // Call the createCourse API
      
      alert(t('courses.courseCreatedSuccessfully'));
      navigate(pagePaths.educator.courses); // Navigate to courses list after creation
      
    } catch (error) {
      console.error("Error creating course:", error);
      alert(t('courses.failedToCreateCourse'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-root">
      {/* Header */}
      <div className="card border-0 shadow-sm">
        <div className="container py-3">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="header-avatar me-2">
                <BookOpen size={20} />
              </div>
              <div>
                <span className="section-title mb-0">{t('courses.createNewCourse')}</span>
                <p className="profile-role mb-0">{t('courses.addNewCourseContentAndSettings')}</p>
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
                    <BookOpen size={30} />
                  </div>
                  <h2 className="section-title mb-2">{t('courses.createCourse')} {t('courses.details')}</h2>
                                      <p className="profile-role">{t('courses.fillCourseInfo')}</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    {/* Course Title */}
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center gap-2">
                        <LibraryBig size={16} />
                        {t('courses.courseTitle')} *
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                                                  placeholder={t('courses.enterCourseTitle')}
                        disabled={loading}
                      />
                      {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                    </div>

                    {/* Category */}
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center gap-2">
                        <Tag size={16} />
                        {t('courses.category')}
                      </label>
                      <select
                        className="form-control"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        disabled={loading || categoriesLoading}
                      >
                        <option value="">{t('courses.selectCategory')}</option>
                        {categoriesLoading && <option disabled>{t('courses.loadingCategories')}</option>}
                        {categoriesError && <option disabled>{t('courses.errorLoadingCategories')}</option>}
                        {categories && categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price */}
                    <div className="col-md-6">
                      <label className="form-label d-flex align-items-center gap-2">
                        <Tag size={16} />
                        {t('courses.price')}
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={formData.price || ''}
                        onChange={handleChange}
                        placeholder={t('courses.enterCoursePrice')}
                        disabled={loading}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    {/* Description */}
                    <div className="col-12">
                      <label className="form-label d-flex align-items-center gap-2">
                        <FileText size={16} />
                        {t('courses.courseDescription')} *
                      </label>
                      <textarea
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                                                  placeholder={t('courses.enterCourseDescription')}
                        disabled={loading}
                      />
                      {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                    </div>

                    {/* Trailer Video URL */}
                    <div className="col-12">
                      <label className="form-label d-flex align-items-center gap-2">
                        <i className="bi bi-camera-video" size={16}></i>
                        {t('courses.trailerVideoURL')}
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        name="trailer_video"
                        value={formData.trailer_video}
                        onChange={handleChange}
                        placeholder={t('courses.enterTrailerVideoURL')}
                        disabled={loading}
                      />
                    </div>

                    {/* Thumbnail */}
                    <div className="col-12">
                      <label className="form-label d-flex align-items-center gap-2">
                        <i className="bi bi-image" size={16}></i>
                        {t('courses.courseThumbnail')}
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        name="thumbnail"
                        onChange={handleChange}
                        accept="image/*"
                        disabled={loading}
                      />
                      <small className="form-text text-muted">
                        {t('courses.uploadImageForThumbnail')}
                      </small>
                    </div>

                    {/* Checkbox for Free Course */}
                    <div className="col-md-6">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="is_free"
                          checked={formData.is_free}
                          onChange={handleChange}
                          disabled={loading}
                        />
                        <label className="form-check-label">
                          {t('courses.freeCourse')}
                        </label>
                      </div>
                    </div>

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
                          <i className="bi bi-plus-circle me-2"></i>
                          {t('courses.createCourse')}
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(pagePaths.educator.courses)}
                          className="btn-secondary-danger"
                          disabled={loading}
                        >
                          <i className="bi bi-x-circle me-2"></i>
                          {t('courses.cancel')}
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
