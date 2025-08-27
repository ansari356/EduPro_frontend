import React, { useState } from "react";
import { DollarSign, Plus, Copy, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useEducatorCouponsListData from "../../apis/hooks/educator/useEducatorCouponsListData";
import useEducatorUsedCouponsListData from "../../apis/hooks/educator/useEducatorUsedCouponsListData";
import useEducatorTotalRevenue from "../../apis/hooks/educator/useEducatorTotalRevenue";
import createCoupon from "../../apis/actions/educator/createCoupon";
const COUPONS_PER_PAGE = 5;

export default function ManageCouponsPage() {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [pageNumber, setPageNumber] = useState(1);
	const [viewMode, setViewMode] = useState('active'); // 'active' or 'used'
	const { totalRevenue } = useEducatorTotalRevenue();
	const { data: activeCoupons, isLoading: activeLoading, error: activeError, couponsCount: activeCouponsCount, mutate: mutateActive } = useEducatorCouponsListData(pageNumber);
	const { data: usedCoupons, isLoading: usedLoading, error: usedError, usedCouponsCount, mutate: mutateUsed } = useEducatorUsedCouponsListData(pageNumber);

	// Determine current data based on view mode
	const currentCoupons = viewMode === 'active' ? activeCoupons : usedCoupons;
	const currentLoading = viewMode === 'active' ? activeLoading : usedLoading;
	const currentError = viewMode === 'active' ? activeError : usedError;
	const currentCount = viewMode === 'active' ? activeCouponsCount : usedCouponsCount;
	const currentMutate = viewMode === 'active' ? mutateActive : mutateUsed;

	const [showAddForm, setShowAddForm] = useState(false);
	  const [formData, setFormData] = useState({
    price: 10,
    numberOfCoupons: 1,
  });
  const [isLoading, setIsLoading] = useState(false);

	  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if ((name === "price" || name === "numberOfCoupons") && value !== "") {
      if (!/^\d*$/.test(value)) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ price: 10, numberOfCoupons: 1 });
    setShowAddForm(false);
  };

	const handleViewModeChange = (mode) => {
		setViewMode(mode);
		setPageNumber(1); // Reset to first page when switching views
	};

	  const handleAddCouponSubmit = async (e) => {
    e.preventDefault();
    const { price, numberOfCoupons } = formData;
    if (price === "" || numberOfCoupons === "") {
      alert(t('educatorCoupons.pleaseFillAllFields'));
      return;
    }
    if (Number(numberOfCoupons) <= 0 || Number(price) < 0) {
      alert(t('educatorCoupons.numberOfCouponsMustBePositive'));
      return;
    }
    try {
      setIsLoading(true);
      await createCoupon({ n: Number(numberOfCoupons), price: Number(price) });
      mutateActive(); // Revalidate active coupons cache
      alert(t('educatorCoupons.couponCreatedSuccessfully'));
      resetForm();
    } catch (err) {
      alert(t('educatorCoupons.errorCreatingCoupon', { error: err.message }));
    } finally {
      setIsLoading(false);
    }
  };

	if (currentLoading) {
		return (
			<div className="min-vh-100 profile-root p-4 d-flex justify-content-center align-items-center">
				<p>{t('educatorCoupons.loadingCouponsData')}</p>
			</div>
		);
	}

	if (currentError) {
		return (
			<div className="min-vh-100 profile-root p-4 d-flex justify-content-center align-items-center">
				<p>{t('educatorCoupons.errorLoadingCoupons', { error: currentError.message })}</p>
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
								<div className="header-avatar me-2">
									<DollarSign size={20} />
								</div>
								<div>
									<span className="section-title">{t('educatorCoupons.manageCoupons')}</span>
									<p className="profile-role">
										{t('educatorCoupons.manageActiveCouponsAndPromotions')}
									</p>
								</div>
							</div>

							<button
								className=" btn-edit-profile"
								onClick={() => showAddForm ? resetForm() : setShowAddForm(true)}
								aria-expanded={showAddForm}
								aria-controls="add-coupon-form"
							>
								{showAddForm ? (
									t('educatorCoupons.cancel')
								) : (
									<>
										<Plus size={16} /> {t('educatorCoupons.addCoupon')}
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
										{t('educatorCoupons.price')}
									</label>
									<input
										type="number"
										id="price"
										name="price"
										min="0"
										step="1"
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
										{t('educatorCoupons.numberOfCoupons')}
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
									{isLoading ? t('educatorCoupons.creating') : t('educatorCoupons.createCoupon')}
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
								<div className="avatar-circle mb-4 d-flex justify-content-center w-fit">
									<DollarSign size={24} />
								</div>
								<h4 className="profile-role mt-2">{activeCouponsCount || 0}</h4>
								<p className="profile-role">{t('educatorCoupons.activeCoupons')}</p>
							</div>
						</div>
					</div>

					<div className="col-md-4">
						<div className="card">
							<div className="card-body text-center">
								<div className="avatar-circle mb-4 d-flex justify-content-center w-fit">
									<Plus size={24} />
								</div>
								<h4 className="profile-role mt-2">{usedCouponsCount || 0}</h4>
								<p className="profile-role">{t('educatorCoupons.usedCoupons')}</p>
							</div>
						</div>
					</div>

					<div className="col-md-4">
						<div className="card">
							<div className="card-body text-center">
								<div className="avatar-circle mb-4 d-flex justify-content-center w-fit">
									<DollarSign size={24} />
								</div>
								<h4 className="profile-role mt-2">${totalRevenue}</h4>
								<p className="profile-role">{t('educatorCoupons.totalValue')}</p>
							</div>
						</div>
					</div>
				</div>

				{/* View Toggle */}
				<div className="card border-0 shadow-sm mb-4">
					<div className="card-body">
						<div className="d-flex justify-content-center">
							<div className="btn-group" role="group" aria-label="Coupon view toggle">
								<button
									type="button"
									className={`btn ${viewMode === 'active' ? 'btn-edit-profile' : 'btn-outline-secondary'}`}
									onClick={() => handleViewModeChange('active')}
								>
									<Eye size={16} className="me-2" />
									{t('educatorCoupons.activeCoupons')} : {( activeCouponsCount || 0)}
								</button>
								<button
									type="button"
									className={`btn ${viewMode === 'used' ? 'btn-edit-profile' : 'btn-outline-secondary'}`}
									onClick={() => handleViewModeChange('used')}
								>
									<EyeOff size={16} className="me-2" />
									{t('educatorCoupons.usedCoupons')} : {( usedCouponsCount || 0)}
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Coupons Grid */}
				<section>
					<div className="row g-4">
						{!currentCoupons || currentCoupons.length === 0 ? (
													<div className="alert alert-primary">
							{viewMode === 'active' ? t('educatorCoupons.noActiveCouponsAvailable') : t('educatorCoupons.noUsedCouponsAvailable')}
						</div>
						) : (
							currentCoupons.map((coupon) => (
								<div key={coupon.id} className="col-md-6 col-xl-4">
									<div className="card h-100 shadow-sm">
										<div className="card-body d-flex flex-column">
											<div className="d-flex justify-content-between align-items-start mb-2">
												<h5 className="section-title mb-0">
													{viewMode === 'used' ? coupon.coupon?.code : coupon.code}
												</h5>
												<div className="d-flex align-items-center gap-2">
													<span
														className={`badge ${viewMode === 'used'
																? "badge-warning-custom"
																: coupon.is_active
																	? "badge-success-custom"
																	: "badge-warning-custom"
															}`}
													>
														{viewMode === 'used' ? t('common.used') : (coupon.is_active ? t('common.active') : t('common.inactive'))}
													</span>
													<button
														className=" btn-edit-profile p-0"
														onClick={() => {
															const code = viewMode === 'used' ? coupon.coupon?.code : coupon.code;
															navigator.clipboard.writeText(code);
															alert(t('educatorCoupons.couponCodeCopied'));
														}}
														aria-label={t('educatorCoupons.copyCouponCode', { code: viewMode === 'used' ? coupon.coupon?.code : coupon.code })}
													>
														<Copy size={16} />
													</button>
												</div>
											</div>

											<p className="profile-role mb-1">
												{t('educatorCoupons.value')} {viewMode === 'used' ? (coupon.coupon?.price ? coupon.coupon.price.toFixed(2) : '0.00') : (coupon.price ? coupon.price.toFixed(2) : '0.00')}
											</p>
											{viewMode === 'used' && coupon.student && (
												<p className="profile-joined mb-1">
													{t('educatorCoupons.usedBy')} {coupon.student}
												</p>
											)}
											{viewMode === 'used' && coupon.course && (
												<p className="profile-joined mb-1">
													{t('educatorCoupons.course')} {coupon.course}
												</p>
											)}
											{viewMode === 'used' && coupon.used_at && (
												<p className="profile-joined mb-1">
													{t('educatorCoupons.usedOn')} {new Date(coupon.used_at).toLocaleDateString()}
												</p>
											)}

											<div className="d-flex justify-content-between align-items-center mb-3">
												<p className="profile-joined mb-0">
													{t('educatorCoupons.created')} {new Date(viewMode === 'used' ? coupon.coupon?.date : coupon.date).toLocaleDateString()}
												</p>
												<p className="profile-joined mb-0">
													{t('educatorCoupons.expires')} {" "}
													{viewMode === 'used'
														? (coupon.coupon?.expiration_date
															? new Date(coupon.coupon.expiration_date).toLocaleDateString()
															: t('educatorCoupons.notApplicable'))
														: (coupon.expiration_date
															? new Date(coupon.expiration_date).toLocaleDateString()
															: t('educatorCoupons.notApplicable'))
													}
												</p>
											</div>
										</div>
									</div>
								</div>
							))
						)}
					</div>

					{/* Pagination */}
					{currentCount > COUPONS_PER_PAGE && (
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
										{t('educatorCoupons.previous')}
									</button>
								</li>
								{Array.from(
									{ length: Math.ceil(currentCount / COUPONS_PER_PAGE) },
									(_, i) => (
										<li
											key={i + 1}
											className={`page-item ${pageNumber === i + 1 ? "active" : ""
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
									className={`page-item ${pageNumber === Math.ceil(currentCount / COUPONS_PER_PAGE)
											? "disabled"
											: ""
										}`}
								>
									<button
										className="page-link"
										onClick={() =>
											setPageNumber((prev) =>
												Math.min(
													Math.ceil(currentCount / COUPONS_PER_PAGE),
													prev + 1
												)
											)
										}
									>
										{t('educatorCoupons.next')}
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
