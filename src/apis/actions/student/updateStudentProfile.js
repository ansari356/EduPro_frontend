import { baseAuthApi } from "../../base";
import { studentEndpoints } from "../../endpoints/student_api";
// {
//     "full_name": "",
//     "bio": "",
//     "profile_picture": null,
//     "date_of_birth": null,
//     "address": "",
//     "country": "",
//     "city": "",
//     "gender": ""
// }
const updateStudentProfile = (profileData) =>
	baseAuthApi.put(studentEndpoints.updateProfile, profileData, {
		headers: {
			"Content-Type": "multipart/form-data", // Use multipart/form-data for file uploads
		},
	});

export default updateStudentProfile;
