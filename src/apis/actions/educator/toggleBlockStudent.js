import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

export default function toggleBlockStudent(studentId) {
	return baseApi.patch(educatorEndpoints.students.block(studentId));
}