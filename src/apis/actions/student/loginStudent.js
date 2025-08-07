import baseApi from "../../base";
import { studentEndpoints } from "../../endpoints/student_api";

export default function loginStudent(data,educatorUsername) {
	// {
	// 	"username": "",
	// 	"password": ""
	// }
	return baseApi.post(studentEndpoints.login(educatorUsername), data);
}
