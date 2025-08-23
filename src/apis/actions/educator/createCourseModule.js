import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

export default function createCourseModule(courseId, moduleData) {
	/**
		moduleData: {
			"title": "",
			"description": "",
			"order": null,
			"image": null
		}
	 */
	return baseApi.post(educatorEndpoints.module.create(courseId), moduleData, {
		headers: {
			"Content-Type": "multipart/form-data", // Use multipart/form-data for file uploads
		},
	});
}