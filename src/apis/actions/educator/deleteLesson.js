import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

export default function deleteLesson(lessonId) {
	return baseApi.delete(educatorEndpoints.lesson.delete(lessonId));
}