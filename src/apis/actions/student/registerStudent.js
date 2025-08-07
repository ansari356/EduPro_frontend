import baseApi from "../../base";
import { studentEndpoints } from "../../endpoints/student_api";

export default function registerEducator(data, educatorUsername) {
	// {
	// "first_name": "",
	// "last_name": "",
	// "email": "",
	// "username": "",
	// "phone": "",
	// "parent_phone": "",
	// "password1": "",
	// "password2": "",
	// "avatar": null
	// }
	return baseApi.post(studentEndpoints.register(educatorUsername), data);
}
