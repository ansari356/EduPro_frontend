import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

export default function createCoupon({
	n=1,price
}) {

	return baseApi.post(educatorEndpoints.coupon.create, {
		number_of_coupons: n,
		price,
	});
}