import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./AddLessonPopup.css";
import createNewLesson from "../../../apis/actions/educator/createNewLesson";

const AddLessonPopup = ({ module, onClose, onLessonAdded }) => {
  const [lessonData, setLessonData] = useState({
    title: "",
    description: "",
    order: "",
    is_published: false,
    is_free: false,
    video: null,
    document: null,
    thumbnail: null,
  });
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLessonData({
      ...lessonData,
      [name]: type === "checkbox" ? checked : value,
    });
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
    const formData = new FormData();
    Object.keys(lessonData).forEach((key) => {
      formData.append(key, lessonData[key]);
    });

    try {
      await createNewLesson(module.id, formData);
      onLessonAdded();
      onClose();
	  console.info("Lesson created successfully ", formData);
    } catch (error) {
      console.error("Failed to create new lesson:", error);
    }
  };

  return (
    <div className="add-lesson-popup-overlay">
      <div className="add-lesson-popup-content">
        <div className="add-lesson-popup-header">
          <h2>Add New Lesson</h2>
          <button onClick={onClose} className="add-lesson-popup-close-btn">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="add-lesson-popup-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={lessonData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={lessonData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="order">Order</label>
            <input
              type="number"
              id="order"
              name="order"
              value={lessonData.order}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group-checkbox">
            <label>
              <input
                type="checkbox"
                name="is_published"
                checked={lessonData.is_published}
                onChange={handleChange}
              />
              Published
            </label>
            <label>
              <input
                type="checkbox"
                name="is_free"
                checked={lessonData.is_free}
                onChange={handleChange}
              />
              Free
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="video">Video</label>
            <input
              type="file"
              id="video"
              name="video"
              onChange={handleFileChange}
              accept="video/*"
            />
          </div>
          <div className="form-group">
            <label htmlFor="document">Document</label>
            <input
              type="file"
              id="document"
              name="document"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
            />
          </div>
          <div className="form-group">
            <label htmlFor="thumbnail">Thumbnail</label>
            <input
              type="file"
              id="thumbnail"
              name="thumbnail"
              onChange={handleFileChange}
              accept="image/*"
            />
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                className="thumbnail-preview"
              />
            )}
          </div>
          <div className="add-lesson-popup-actions">
            <button type="submit" className="btn-primary">
              Add Lesson
            </button>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddLessonPopup.propTypes = {
  module: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onLessonAdded: PropTypes.func.isRequired,
};

export default AddLessonPopup;
