import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

export default function createCourse(data) {
	// {
	// 	"title": "",
	// 	"description": "",
	// 	"trailer_video": "",
	// 	"price": null,
	// 	"is_free": false,
	// 	"category": null,
	// 	"thumbnail": null
	// }
	return baseApi.post(educatorEndpoints.course.create, data, {
		headers: {
			"Content-Type": "multipart/form-data", // Use multipart/form-data for file uploads
		},
	});
}
