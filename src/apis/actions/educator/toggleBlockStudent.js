import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

export default function toggleBlockStudent(studentId) {
	return baseApi.post(educatorEndpoints.students.block(studentId));
}