import baseApi from "../../base";
import { studentEndpoints } from "../../endpoints/student_api";

export default function enrollStudentInCourse(courseId, couponCode) {
	// For free courses, send "FREE" as coupon code
	// For paid courses, send the actual coupon code
	const couponToSend = couponCode === "FREE" ? "FREE" : couponCode;
	
	return baseApi.post(studentEndpoints.courses.enrollIn, {
		"course_id": courseId,
		"coupon_code": couponToSend
	});
}