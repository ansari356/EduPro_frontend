import useSWR from "swr";
import { studentEndpoints } from "../../endpoints/student_api";
import { swrFetcher } from "../../base";

export default function useGetCourseModules(courseId) {
	const endpoint = courseId && studentEndpoints.courses.courseModules(courseId);
	
	// Debug the endpoint construction
	console.log("🔍 useGetCourseModules Debug:");
	console.log("courseId:", courseId);
	console.log("endpoint:", endpoint);
	console.log("Full URL:", courseId ? `http://localhost:8000/api/v1${endpoint}` : 'No courseId');
	
	const { isLoading, error, data, mutate } = useSWR(
		endpoint,
		swrFetcher()
	);
	
	// Debug the response
	console.log("🔍 useGetCourseModules Response:");
	console.log("isLoading:", isLoading);
	console.log("error:", error);
	console.log("data:", data);
	
	return { isLoading, error, data, mutate };
}
