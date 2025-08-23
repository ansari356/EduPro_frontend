import { educatorEndpoints } from "../../endpoints/educatorApi";

export const useLessonStatus = (lessonId) => {
	const { data, isLoading } = useSWR(educatorEndpoints.lesson.videoStatus(lessonId));

	return { data, isLoading };
};