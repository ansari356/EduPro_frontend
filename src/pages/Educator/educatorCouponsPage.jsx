import React, { useState } from "react";
import { DollarSign, Plus, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useEducatorCouponsListData from "../../apis/hooks/educator/useEducatorCouponsListData";
import useEducatorUsedCouponsListData from "../../apis/hooks/educator/useEducatorUsedCouponsListData";
import useEducatorTotalRevenue from "../../apis/hooks/educator/useEducatorTotalRevenue";
import createCoupon from "../../apis/actions/educator/createCoupon"; 
const COUPONS_PER_PAGE = 5; 

export default function ManageCouponsPage() {
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);
  const { totalRevenue } = useEducatorTotalRevenue();
  const { data: coupons, isLoading, error, couponsCount, mutate } = useEducatorCouponsListData(pageNumber);
  const { usedCouponsCount } = useEducatorUsedCouponsListData(pageNumber);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    price: 10,
    numberOfCoupons: 1,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if ((name === "price" || name === "numberOfCoupons") && value !== "") {
      if (!/^\d*$/.test(value)) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCouponSubmit = async (e) => {
    e.preventDefault();
    const { price, numberOfCoupons } = formData;
    if (price === "" || numberOfCoupons === "") {
      alert("Please fill out all fields.");
      return;
    }
    if (Number(numberOfCoupons) <= 0 || Number(price) < 0) {
      alert("Number of coupons must be positive and price non-negative.");
      return;
    }
    try {
      await createCoupon({ n: Number(numberOfCoupons), price: Number(price) });
      mutate(); // Revalidate SWR cache
      alert("Coupon created successfully!");
      setFormData({ price: "", numberOfCoupons: "" });
      setShowAddForm(false);
    } catch (err) {
      alert(`Error creating coupon: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-vh-100 profile-root p-4 d-flex justify-content-center align-items-center">
        <p>Loading coupons data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 profile-root p-4 d-flex justify-content-center align-items-center">
        <p>Error loading coupons: {error.message}</p>
      </div>
    );
  }


  return (
		<div className="min-vh-100 profile-root p-4">
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
								className=" btn-edit-profile"
								onClick={() => setShowAddForm((prev) => !prev)}
								aria-expanded={showAddForm}
								aria-controls="add-coupon-form"
							>
								{showAddForm ? (
									"Cancel"
								) : (
									<>
										<Plus size={16} /> Add Coupon
									</>
								)}
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
						<form onSubmit={handleAddCouponSubmit}>
							<div className="row g-3">
								<div className="col-md-6">
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
								<div className="col-md-6">
									<label
										htmlFor="numberOfCoupons"
										className="form-label fw-semibold"
									>
										Number of Coupons
									</label>
									<input
										type="number"
										id="numberOfCoupons"
										name="numberOfCoupons"
										min="1"
										className="form-control"
										value={formData.numberOfCoupons}
										onChange={handleInputChange}
										required
									/>
								</div>
							</div>
							<div className="mt-4">
								<button
									type="submit"
									className="btn btn-edit-profile"
									disabled={isLoading}
								>
									{isLoading ? "Creating..." : "Create Coupon"}
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
								<h4 className="profile-role mt-2">{couponsCount}</h4>
								<p className="profile-role">Total Coupons</p>
							</div>
						</div>
					</div>

					<div className="col-md-4">
						<div className="card">
							<div className="card-body text-center">
								<div className="avatar-circle mx-auto">
									<Plus size={24} />
								</div>
								<h4 className="profile-role mt-2">{usedCouponsCount}</h4>
								<p className="profile-role">Used Coupons</p>
							</div>
						</div>
					</div>

					<div className="col-md-4">
						<div className="card">
							<div className="card-body text-center">
								<div className="avatar-circle mx-auto">
									<DollarSign size={24} />
								</div>
								<h4 className="profile-role mt-2">${totalRevenue}</h4>
								<p className="profile-role">Total Value</p>
							</div>
						</div>
					</div>
				</div>

				{/* Coupons Grid */}
				<section>
					<div className="row g-4">
						{coupons.length === 0 ? (
							<div className="alert alert-primary">
								No active coupons available.
							</div>
						) : (
							coupons.map((coupon) => (
								<div key={coupon.id} className="col-md-6 col-xl-4">
									<div className="card h-100 shadow-sm">
										<div className="card-body d-flex flex-column">
											<div className="d-flex justify-content-between align-items-start mb-2">
												<h5 className="section-title mb-0">{coupon.code}</h5>
												<div className="d-flex align-items-center gap-2">
													<span
														className={`badge ${
															coupon.is_active
																? "badge-success-custom"
																: "badge-warning-custom"
														}`}
													>
														{coupon.is_active ? "Active" : "Inactive"}
													</span>
													<button
														className="btn btn-edit-profile p-1"
														onClick={() => {
															navigator.clipboard.writeText(coupon.code);
															alert("Coupon code copied!");
														}}
														aria-label={`Copy coupon code ${coupon.code}`}
													>
														<Copy size={16} />
													</button>
												</div>
											</div>

											<p className="profile-role mb-1">
												Value: {coupon.price.toFixed(2)}
											</p>
											<p className="profile-joined mb-1">
												Status: {coupon.used_count ? "Used" : "Available"}
											</p>

											<div className="d-flex justify-content-between align-items-center mb-3">
												<p className="profile-joined mb-0">
													Created: {new Date(coupon.date).toLocaleDateString()}
												</p>
												<p className="profile-joined mb-0">
													Expires:{" "}
													{coupon.expiration_date
														? new Date(
																coupon.expiration_date
														  ).toLocaleDateString()
														: "N/A"}
												</p>
											</div>

											{/* <div className="d-flex gap-2 mt-auto pt-3 border-top">
												<button
													className="btn btn-edit-profile"

												>
													View
												</button>
											</div> */}
										</div>
									</div>
								</div>
							))
						)}
					</div>

					{/* Pagination */}
					{couponsCount > COUPONS_PER_PAGE && (
						<nav aria-label="Page navigation">
							<ul className="pagination justify-content-center mt-4">
								<li
									className={`page-item ${pageNumber === 1 ? "disabled" : ""}`}
								>
									<button
										className="page-link"
										onClick={() =>
											setPageNumber((prev) => Math.max(1, prev - 1))
										}
									>
										Previous
									</button>
								</li>
								{Array.from(
									{ length: Math.ceil(couponsCount / COUPONS_PER_PAGE) },
									(_, i) => (
										<li
											key={i + 1}
											className={`page-item ${
												pageNumber === i + 1 ? "active" : ""
											}`}
										>
											<button
												className="page-link"
												onClick={() => setPageNumber(i + 1)}
											>
												{i + 1}
											</button>
										</li>
									)
								)}
								<li
									className={`page-item ${
										pageNumber === Math.ceil(couponsCount / COUPONS_PER_PAGE)
											? "disabled"
											: ""
									}`}
								>
									<button
										className="page-link"
										onClick={() =>
											setPageNumber((prev) =>
												Math.min(
													Math.ceil(couponsCount / COUPONS_PER_PAGE),
													prev + 1
												)
											)
										}
									>
										Next
									</button>
								</li>
							</ul>
						</nav>
					)}
				</section>
				{/* Removed Confirmation Modal as functionality is not implemented yet */}
			</div>
		</div>
	);
}
