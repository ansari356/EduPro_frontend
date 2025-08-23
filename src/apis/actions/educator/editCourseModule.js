import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";
export default async function editCourseModule( moduleId, dataToSubmit) {

  return baseApi.patch(educatorEndpoints.module.update(moduleId), dataToSubmit, {
		headers: {
			"Content-Type": "multipart/form-data", // Use multipart/form-data for file uploads
		},
	});
}