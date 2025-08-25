import { useState, useEffect } from "react";
import "./AddModulePopup.css";
import { X, PlusCircle, FileText, Image, Hash, DollarSign, Check } from "lucide-react";
import createCourseModule from "../../../apis/actions/educator/createCourseModule";
import editCourseModule from "../../../apis/actions/educator/editCourseModule";

export default function AddModulePopup({ courseId, onClose, onModuleCreated, nextOrder, moduleData }) {
  const isEditMode = !!moduleData;

  const [formData, setFormData] = useState({
		title: "",
		description: "",
		order: nextOrder || 1,
		is_published: false,
		price: 0,
		is_free: true,
	});

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        title: moduleData.title || "",
        description: moduleData.description || "",
        order: moduleData.order || "",
        is_published: moduleData.is_published || false,
        price: moduleData.price || 0,
        is_free: moduleData.is_free || false,
        image: null, // Image is handled separately
      });
    }
  }, [isEditMode, moduleData, nextOrder]);
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
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
    if (formData.price < 0) {
        newErrors.price = "Price cannot be negative";
    }
    if (!formData.is_free && formData.price <= 0) {
        newErrors.price = "Price must be greater than 0 for paid modules";
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
      dataToSubmit.append("is_published", formData.is_published);
      dataToSubmit.append("price", formData.price);
      dataToSubmit.append("is_free", formData.is_free);
      
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
        if (moduleData.is_published === formData.is_published) {
          dataToSubmit.delete("is_published");
        }
        if (moduleData.price === formData.price) {
          dataToSubmit.delete("price");
        }
        if (moduleData.is_free === formData.is_free) {
          dataToSubmit.delete("is_free");
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
						<h3 className="section-title mb-0">
							{isEditMode ? "Edit Module" : "Add New Module"}
						</h3>
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
								{errors.title && (
									<div className="invalid-feedback">{errors.title}</div>
								)}
							</div>

							{/* Order */}
							<div className="col-12">
								<label className="form-label d-flex align-items-center gap-2">
									<Hash size={16} />
									Order *
								</label>
								<input
									type="number"
									className={`form-control ${
										errors.order ? "is-invalid" : ""
									}`}
									name="order"
									value={formData.order}
									onChange={handleChange}
									placeholder="e.g., 1"
									min="1"
									disabled={isSubmitting}
								/>
								{errors.order && (
									<div className="invalid-feedback">{errors.order}</div>
								)}
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
										checked={formData.is_free}
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

							{/* Price - only show if not free */}
							{!formData.is_free && (
								<div className="col-12">
									<label className="form-label d-flex align-items-center gap-2">
										<DollarSign size={16} />
										Price *
									</label>
									<input
										type="number"
										className={`form-control ${errors.price ? "is-invalid" : ""}`}
										name="price"
										value={formData.price}
										onChange={handleChange}
										placeholder="0.00"
										step="0.01"
										min="0.01"
										disabled={isSubmitting}
									/>
									{errors.price && (
										<div className="invalid-feedback">{errors.price}</div>
									)}
								</div>
							)}

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
										checked={formData.is_published}
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
											<div
												className="loading-spinner me-2"
												style={{ width: "1rem", height: "1rem" }}
											></div>
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
