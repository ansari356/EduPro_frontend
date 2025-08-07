import React, { useState } from "react";
import { DollarSign, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const initialCoupons = [
  {
    id: 1,
    name: "SUMMER21",
    price: 49,
    count: 10,
    planDetails: "Full access to all courses for 1 month",
  },
  {
    id: 2,
    name: "VIP50",
    price: 99,
    count: 5,
    planDetails: "VIP access to premium content + 1-on-1 Coaching",
  },
  {
    id: 3,
    name: "TRIALFREE",
    price: 0,
    count: 20,
    planDetails: "Free trial for 7 days",
  },
];

export default function ManageCouponsPage() {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [modal, setModal] = useState({
    isOpen: false,
    coupon: null,
    action: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    count: "",
    planDetails: "",
  });
  

  const totalCoupons = coupons.reduce((sum, c) => sum + c.count, 0);
  const totalValue = coupons.reduce((sum, c) => sum + c.count * c.price, 0);

  const openModal = (coupon, action) =>
    setModal({ isOpen: true, coupon, action });
  const closeModal = () =>
    setModal({ isOpen: false, coupon: null, action: "" });

  // Handle input change for add coupon form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if ((name === "price" || name === "count") && value !== "") {
      if (!/^\d*$/.test(value)) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add coupon form submission
  const handleAddCoupon = (e) => {
    e.preventDefault();
    const { name, price, count, planDetails } = formData;
    if (!name || !planDetails || price === "" || count === "") {
      alert("Please fill out all fields.");
      return;
    }
    if (Number(count) <= 0 || Number(price) < 0) {
      alert("Count must be positive and price non-negative.");
      return;
    }
    if (coupons.find((c) => c.name.toLowerCase() === name.toLowerCase())) {
      alert("Coupon name already exists.");
      return;
    }
    const newCoupon = {
      id: Date.now(),
      name: name.trim(),
      price: Number(price),
      count: Number(count),
      planDetails: planDetails.trim(),
    };
    setCoupons((prev) => [...prev, newCoupon]);
    setFormData({ name: "", price: "", count: "", planDetails: "" });
    setShowAddForm(false);
  };

  // Confirm modal action
  const confirmAction = () => {
    if (!modal.coupon) return;

    if (modal.action === "add") {
      incrementCoupon(modal.coupon);
      return;
    }

    if (modal.action === "delete") {
      if (modal.coupon.count <= 1) {
        setCoupons((prev) => prev.filter((c) => c.id !== modal.coupon.id));
      } else {
        setCoupons((prev) =>
          prev.map((c) =>
            c.id === modal.coupon.id ? { ...c, count: c.count - 1 } : c
          )
        );
      }
    }

    if (modal.action === "expire") {
      setCoupons((prev) => prev.filter((c) => c.id !== modal.coupon.id));
    }

    closeModal();
  };

  // Increment coupon count
  const incrementCoupon = (coupon) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === coupon.id ? { ...c, count: c.count + 1 } : c))
    );
    closeModal();
  };

  return (
    <div
      className="min-vh-100 profile-root p-4"
    >
      <div className="container">
        {/* Header */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="container py-3">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <div className="header-avatar">
                  <DollarSign size={20} />
                </div>
                <div>
                  <span className="section-title">Manage Coupons</span>
                  <p className="profile-role">
                    Manage your active coupons and promotions
                  </p>
                </div>
              </div>

              <button
                className="btn btn-edit-profile"
                onClick={() => setShowAddForm((prev) => !prev)}
                aria-expanded={showAddForm}
                aria-controls="add-coupon-form"
              >
                {showAddForm ? "Cancel" : "Add Coupon"}
              </button>
            </div>
          </div>
        </div>

        {/* Add Coupon Form */}
        {showAddForm && (
          <div
            id="add-coupon-form"
            className="card shadow-sm p-4 mb-5"
            style={{ borderRadius: "var(--border-radius-lg)" }}
          >
            <form onSubmit={handleAddCoupon}>
              <div className="row g-3">
                <div className="col-md-3">
                  <label htmlFor="name" className="form-label fw-semibold">
                    Coupon Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    maxLength={20}
                    className="form-control"
                    value={formData.name}
                    onChange={handleInputChange}
                    autoFocus
                    required
                    aria-describedby="nameHelp"
                  />
                  <div id="nameHelp" className="form-text">
                    Unique coupon code.
                  </div>
                </div>
                <div className="col-md-2">
                  <label htmlFor="price" className="form-label fw-semibold">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    className="form-control"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label htmlFor="count" className="form-label fw-semibold">
                    Number of Coupons
                  </label>
                  <input
                    type="number"
                    id="count"
                    name="count"
                    min="1"
                    className="form-control"
                    value={formData.count}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-5">
                  <label
                    htmlFor="planDetails"
                    className="form-label fw-semibold"
                  >
                    Plan Details
                  </label>
                  <input
                    id="planDetails"
                    name="planDetails"
                    maxLength={100}
                    className="form-control"
                    value={formData.planDetails}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <button type="submit" className="btn btn-edit-profile">
                  Add Coupon
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats Overview */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body text-center">
                <div className="avatar-circle mx-auto">
                  <DollarSign size={24} />
                </div>
                <h4 className="profile-role mt-2">{coupons.length}</h4>
                <p className="profile-role">Coupon Types</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-body text-center">
                <div className="avatar-circle mx-auto">
                  <Plus size={24} />
                </div>
                <h4 className="profile-role mt-2">{totalCoupons}</h4>
                <p className="profile-role">Coupons Left</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-body text-center">
                <div className="avatar-circle mx-auto">
                  <DollarSign size={24} />
                </div>
                <h4 className="profile-role mt-2">${totalValue.toFixed(2)}</h4>
                <p className="profile-role">Total Value</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coupons Grid */}
        <section>
          <div className="d-flex align-items-center gap-2 mb-4">
            <DollarSign size={28} />
            <h2 className="main-title mb-0">Coupons Management</h2>
          </div>

          <div className="row g-4">
            {coupons.length === 0 ? (
              <div className="alert alert-info">
                No active coupons available.
              </div>
            ) : (
              coupons.map((coupon) => (
                <div key={coupon.id} className="col-md-6 col-xl-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body d-flex flex-column">
                      <h5 className="section-title">{coupon.name}</h5>
                      <p className="profile-role text-muted mb-2">
                        Price: ${coupon.price.toFixed(2)}
                      </p>
                      <p className="profile-role mb-2">
                        Coupons left: {coupon.count}
                      </p>
                      <p
                        className="profile-role mb-3 text-truncate"
                        title={coupon.planDetails}
                      >
                        Plan Details: {coupon.planDetails}
                      </p>

                      <div className="d-flex gap-2 mt-auto">
                        <button
                          className="btn btn-edit-profile"
                          aria-label={`Add one coupon to ${coupon.name}`}
                          onClick={() => openModal(coupon, "add")}
                        >
                          Add
                        </button>
                        <button
                          className="btn btn-secondary-danger"
                          aria-label={`Delete one coupon from ${coupon.name}`}
                          onClick={() => openModal(coupon, "delete")}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-secondary-danger"
                          aria-label={`Expire all coupons for ${coupon.name}`}
                          onClick={() => openModal(coupon, "expire")}
                        >
                          Expire
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Confirmation Modal */}
        {modal.isOpen && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-capitalize">
                    {modal.action === "add" && "Confirm Add"}
                    {modal.action === "delete" && "Confirm Delete"}
                    {modal.action === "expire" && "Confirm Expire"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() =>
                      setModal({ isOpen: false, coupon: null, action: "" })
                    }
                  />
                </div>
                <div className="modal-body">
                  {modal.action === "add" && (
                    <p>
                      {" "}
                      Add 1 coupon to <strong>{modal.coupon.name}</strong>?{" "}
                    </p>
                  )}
                  {modal.action === "delete" && (
                    <p>
                      {" "}
                      Delete 1 coupon from <strong>{modal.coupon.name}</strong>?
                      This action cannot be undone.{" "}
                    </p>
                  )}
                  {modal.action === "expire" && (
                    <p>
                      {" "}
                      Expire all coupons of <strong>{modal.coupon.name}</strong>
                      ? This action cannot be undone.{" "}
                    </p>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-edit-profile"
                    onClick={() =>
                      setModal({ isOpen: false, coupon: null, action: "" })
                    }
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-secondary-danger"
                    onClick={() => {
                      if (modal.action === "add") incrementCoupon(modal.coupon);
                      else confirmAction();
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
