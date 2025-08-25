import useSWR from "swr";
import { studentEndpoints } from "../../endpoints/student_api";
import { swrFetcher } from "../../base";

export default function useGetCourseDetails(courseId) {
	const endpoint = courseId && studentEndpoints.courses.courseDetails(courseId);
	
	const { isLoading, error, data, mutate } = useSWR(
		endpoint,
		swrFetcher()
	);
	
	return { isLoading, error, data, mutate };
}