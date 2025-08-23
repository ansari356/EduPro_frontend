import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

export default function createNewLesson(moduleId, lessonData) {

	/**
	 * lessonData: {
		"title": "",
		"description": "",
		"order": null,
		"is_published": false,
		"is_free": false,
		"video": null,
		"document": null,
		"thumbnail": null
		}
	 */

	return baseApi.post(educatorEndpoints.lesson.create(moduleId), lessonData,
		{
			headers: {
				"Content-Type": "multipart/form-data", // Use multipart/form-data for file uploads
			},
		}
	);

}