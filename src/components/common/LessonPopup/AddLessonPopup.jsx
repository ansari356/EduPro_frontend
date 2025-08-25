import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./AddLessonPopup.css";
import createNewLesson from "../../../apis/actions/educator/createNewLesson";
import updateLesson from "../../../apis/actions/educator/updateLesson";
import { X, PlusCircle, FileText, Image, Hash, Video, BookOpen, Check } from "lucide-react";

const AddLessonPopup = ({ module, onClose, onLessonAdded, lesson, lessonsCount }) => {
  const isEditMode = !!lesson;
  const [lessonData, setLessonData] = useState({
    title: "",
    description: "",
    order: lessonsCount + 1,
    is_published: false,
    is_free: false,
    video: null,
    document: null,
    thumbnail: null,
  });
  const [thumbnailPreview, setThumbnailPreview] = useState(lesson?.thumbnail_url || null);
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setLessonData({
        title: lesson.title || "",
        description: lesson.description || "",
        order: lesson.order || "",
        is_published: lesson.is_published || false,
        is_free: lesson.is_free || false,
        video: null,
        document: null,
        thumbnail: null,
      });
      if (lesson.thumbnail) {
        setThumbnailPreview(lesson.thumbnail);
      }
    }
  }, [isEditMode, lesson]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setLessonData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setLessonData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setLessonData({
      ...lessonData,
      [name]: file,
    });

    if (name === "thumbnail" && file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        const dataToSubmit = new FormData();
        if (lessonData.thumbnail) {
          dataToSubmit.append("thumbnail", lessonData.thumbnail);
        }
        if (lessonData.video) {
          dataToSubmit.append("video", lessonData.video);
        }
        if (lessonData.document) {
          dataToSubmit.append("document", lessonData.document);
        }
        if (lessonData.title !== lesson.title) {
          dataToSubmit.append("title", lessonData.title);
        }
        if (lessonData.description !== lesson.description) {
          dataToSubmit.append("description", lessonData.description);
        }
        if (lessonData.order !== lesson.order) {
          dataToSubmit.append("order", lessonData.order);
        }
        if (lessonData.is_published !== lesson.is_published) {
          dataToSubmit.append("is_published", lessonData.is_published);
        }
        if (lessonData.is_free !== lesson.is_free) {
          dataToSubmit.append("is_free", lessonData.is_free);
        }
        await updateLesson(lesson.id, dataToSubmit);
        alert("Lesson updated successfully!");
      } else {
        const formData = new FormData();
        Object.keys(lessonData).forEach((key) => {
            if (lessonData[key] !== null) {
                formData.append(key, lessonData[key]);
            }
        });
        await createNewLesson(module.id, formData);
        alert("Lesson created successfully!");
      }
      onLessonAdded();
      onClose();
    } catch (error) {
      console.error("Failed to create/update new lesson:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="section-title mb-0">{isEditMode ? "Edit Lesson" : "Add New Lesson"}</h3>
            <button onClick={onClose} className="btn-close"></button>
          </div>
          <form onSubmit={handleSubmit} className="add-lesson-popup-form">
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label d-flex align-items-center gap-2">
                  <FileText size={16} />
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  value={lessonData.title}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <div className="invalid-feedback">{errors.title}</div>
                )}
              </div>
              <div className="col-12">
                <label className="form-label d-flex align-items-center gap-2">
                  <FileText size={16} />
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  value={lessonData.description}
                  onChange={handleChange}
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
              <div className="col-12">
                <label className="form-label d-flex align-items-center gap-2">
                  <Hash size={16} />
                  Order *
                </label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  className={`form-control ${errors.order ? "is-invalid" : ""}`}
                  value={lessonData.order}
                  onChange={handleChange}
                  required
                  min="1"
                  disabled={isSubmitting}
                />
                {errors.order && (
                  <div className="invalid-feedback">{errors.order}</div>
                )}
              </div>

              {/* Is Free */}
              <div className="col-12">
                <div className="form-check">
                  <input
                    id="is_free"
                    type="checkbox"
                    className={`form-check-input ${
                      errors.is_free ? "is-invalid" : ""
                    }`}
                    name="is_free"
                    checked={lessonData.is_free}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <label
                    className="form-check-label d-flex align-items-center gap-2"
                    htmlFor="is_free"
                  >
                    <Check size={16} />
                    Is Free
                  </label>
                </div>
                {errors.is_free && (
                  <div className="invalid-feedback">{errors.is_free}</div>
                )}
              </div>

              {/* Is Published */}
              <div className="col-12">
                <div className="form-check">
                  <input
                    id="is_published"
                    type="checkbox"
                    className={`form-check-input ${
                      errors.is_published ? "is-invalid" : ""
                    }`}
                    name="is_published"
                    checked={lessonData.is_published}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <label
                    className="form-check-label d-flex align-items-center gap-2"
                    htmlFor="is_published"
                  >
                    <Check size={16} />
                    Is Published
                  </label>
                </div>
                {errors.is_published && (
                  <div className="invalid-feedback">{errors.is_published}</div>
                )}
              </div>

              <div className="col-12">
                <label className="form-label d-flex align-items-center gap-2">
                  <Video size={16} />
                  Video
                </label>
                <input
                  type="file"
                  id="video"
                  name="video"
                  className="form-control"
                  onChange={handleFileChange}
                  accept="video/*"
                  disabled={isSubmitting}
                />
              </div>
              <div className="col-12">
                <label className="form-label d-flex align-items-center gap-2">
                  <BookOpen size={16} />
                  Document
                </label>
                <input
                  type="file"
                  id="document"
                  name="document"
                  className="form-control"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  disabled={isSubmitting}
                />
                {lesson?.document_url && (
                  <div className="mt-1">
                    <a href={lesson.document_url} target="_blank" rel="noopener noreferrer">
                      <FileText size={16} />
                      View Document
                    </a>
                  </div>
                )}
              </div>
              <div className="col-12">
                <label className="form-label d-flex align-items-center gap-2">
                  <Image size={16} />
                  Thumbnail
                </label>
                <input
                  type="file"
                  id="thumbnail"
                  name="thumbnail"
                  className="form-control"
                  onChange={handleFileChange}
                  accept="image/*"
                  disabled={isSubmitting}
                />
                {thumbnailPreview && (
                  <div className="mt-3">
                    <p className="mb-1">Thumbnail Preview:</p>
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      className="img-fluid rounded"
                      style={{ maxHeight: '100px' }}
                    />
                  </div>
                )}
              </div>
              <div className="col-12 mt-4">
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn-secondary-danger"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    <X size={16} className="me-1" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-edit-profile d-flex align-items-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="loading-spinner me-2" style={{width: '1rem', height: '1rem'}}></div>
                    ) : (
                      <PlusCircle size={16} className="me-1" />
                    )}
                    {isEditMode ? "Save Changes" : "Create Lesson"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

AddLessonPopup.propTypes = {
  module: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onLessonAdded: PropTypes.func.isRequired,
  lesson: PropTypes.object,
  lessonsCount: PropTypes.number.isRequired,
};

export default AddLessonPopup;
