import { useState, useEffect } from "react";
import "./AddModulePopup.css";
import { X, PlusCircle, FileText, Image, Hash } from "lucide-react";
import createCourseModule from "../../../apis/actions/educator/createCourseModule";
import editCourseModule from "../../../apis/actions/educator/editCourseModule";

export default function AddModulePopup({ courseId, onClose, onModuleCreated, nextOrder, moduleData }) {
  const isEditMode = !!moduleData;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: nextOrder || "",
    image: null,
  });

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        title: moduleData.title || "",
        description: moduleData.description || "",
        order: moduleData.order || "",
        image: null, // Image is handled separately
      });
    }
  }, [isEditMode, moduleData]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Module title is required";
    }
    if (!formData.order) {
        newErrors.order = "Module order is required";
    } else if (isNaN(formData.order) || formData.order <= 0) {
        newErrors.order = "Order must be a positive number";
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

    setIsSubmitting(true);
    setErrors({});

    try {
      const dataToSubmit = new FormData();
      dataToSubmit.append("title", formData.title);
      dataToSubmit.append("description", formData.description);
      dataToSubmit.append("order", formData.order);
      if (formData.image) {
        dataToSubmit.append("image", formData.image);
      }
      
      if (isEditMode) {
        if (moduleData.title === formData.title) {
          dataToSubmit.delete("title");
        }
        if (moduleData.description === formData.description) {
          dataToSubmit.delete("description");
        }
        if (moduleData.order === formData.order) {
          dataToSubmit.delete("order");
        }
        if ( !formData.image) {
          dataToSubmit.delete("image");
        }
        await editCourseModule(moduleData.id, dataToSubmit);
        alert("Module updated successfully!");
      } else {
        await createCourseModule(courseId, dataToSubmit);
        alert("Module created successfully!");
      }
      
      onModuleCreated(); // Callback to refresh the module list
      onClose(); // Close the popup
    } catch (error) {
      console.error(isEditMode ? "Error updating module:" : "Error creating module:", error);
      const apiErrors = error.response?.data || {};
      setErrors({ ...apiErrors, general: apiErrors?.non_field_errors?.[0] || `Failed to ${isEditMode ? "update" : "create"} module. Please try again.` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="section-title mb-0">{isEditMode ? "Edit Module" : "Add New Module"}</h3>
            <button onClick={onClose} className="btn-close"></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Title */}
              <div className="col-12">
                <label className="form-label d-flex align-items-center gap-2">
                  <FileText size={16} />
                  Module Title *
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Introduction to React"
                  disabled={isSubmitting}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              {/* Order */}
              <div className="col-12">
                <label className="form-label d-flex align-items-center gap-2">
                  <Hash size={16} />
                  Order *
                </label>
                <input
                  type="number"
                  className={`form-control ${errors.order ? "is-invalid" : ""}`}
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  placeholder="e.g., 1"
                  min="1"
                />
                {errors.order && <div className="invalid-feedback">{errors.order}</div>}
              </div>

              {/* Description */}
              <div className="col-12">
                <label className="form-label d-flex align-items-center gap-2">
                  <FileText size={16} />
                  Description
                </label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="A brief summary of the module"
                  disabled={isSubmitting}
                />
              </div>

              {/* Image */}
              <div className="col-12">
                <label className="form-label d-flex align-items-center gap-2">
                  <Image size={16} />
                  Module Image
                </label>
                <input
                  type="file"
                  className="form-control"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                  disabled={isSubmitting}
                />
                
                  <div className="mt-3">
                    <p className="mb-1">Image Preview:</p>
                    <img
                      src={imagePreview || moduleData?.image || 'https://placehold.co/120x120?text=Module'}
                      alt="Module Preview"
                      className="img-fluid rounded"
                      style={{ maxHeight: '100px' }}
                    />
                  </div>
                
              </div>

              {errors.general && (
                <div className="col-12">
                    <div className="alert alert-danger">{errors.general}</div>
                </div>
              )}

              {/* Submit Button */}
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
                    {isEditMode ? "Save Changes" : "Create Module"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
