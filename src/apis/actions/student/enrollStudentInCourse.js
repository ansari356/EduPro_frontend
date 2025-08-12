import { studentEndpoints } from "../../endpoints/student_api";

export default function enrollStudentInCourse(courseId, couponCode) {
	
	return baseApi.post(studentEndpoints.courses.enrollIn,{
    "course_id": courseId,
    "coupon_code": couponCode
	});
}