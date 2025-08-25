import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";


export default function updateLesson(lessonId, dataToSubmit) {
	return baseApi.patch(educatorEndpoints.lesson.update(lessonId), dataToSubmit,{
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
}
