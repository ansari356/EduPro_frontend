import useSWR from "swr";
import { studentEndpoints } from "../../endpoints/student_api";

export default function useGetCourseDetails(courseId) {
	const { isLoading, error, data, mutate } = useSWR(
		courseId && studentEndpoints.courses.courseDetails(courseId),
		swrFetcher()
	);
/*	
	{
			"id": "f2d0ab98-481e-4bb0-905c-807cc51108e6",
			"title": "Module 1 for Course 4 by teacher1",
			"course": "Course 4 by teacher1",
			"order": 1,
			"price": "24.99",
			"is_free": false,
			"total_lessons": 0,
			"total_duration": 0,
			"image_url": null
	}
*/
	return { isLoading, error, data, mutate };
}