import useSWR from "swr";
import { studentEndpoints } from "../../endpoints/student_api";
import { swrFetcher } from "../../base";

export default function useGetCourseDetails(courseId) {
	const endpoint = courseId && studentEndpoints.courses.courseDetails(courseId);
	
	// Debug the endpoint construction
	console.log("🔍 useGetCourseDetails Debug:");
	console.log("courseId:", courseId);
	console.log("endpoint:", endpoint);
	console.log("studentEndpoints.courses.courseDetails:", studentEndpoints.courses.courseDetails);
	
	const { isLoading, error, data, mutate } = useSWR(
		endpoint,
		swrFetcher()
	);
	
	return { isLoading, error, data, mutate };
}