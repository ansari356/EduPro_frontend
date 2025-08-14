import useSWR from "swr";
import { swrFetcher } from "../../base";
import { studentEndpoints } from "../../endpoints/student_api";

export default function useListCourseModules(courseId) {
	const endpoint = courseId && studentEndpoints.courses.courseModules(courseId);
	
	// Debug the endpoint construction
	console.log("🔍 useListCourseModules Debug:");
	console.log("courseId:", courseId);
	console.log("endpoint:", endpoint);
	console.log("studentEndpoints.courses.courseModules:", studentEndpoints.courses.courseModules);
	console.log("Full API URL:", endpoint ? `http://127.0.0.1:8000/api/v1${endpoint}` : "No endpoint");
	
	const { isLoading, error, data, mutate } = useSWR(
		endpoint,
		swrFetcher()
	);
	
	// Debug the API response
	console.log("🔍 useListCourseModules API Response:");
	console.log("isLoading:", isLoading);
	console.log("error:", error);
	console.log("data:", data);
	console.log("data type:", typeof data);
	console.log("data length:", Array.isArray(data) ? data.length : "Not an array");
	
	return { isLoading, error, courseModules: data, mutate };
}

// Hook to fetch lessons for a specific module
export function useModuleLessons(moduleId) {
	const endpoint = moduleId && studentEndpoints.courses.moduleLessons(moduleId);
	
	// Debug the endpoint construction
	console.log("🔍 useModuleLessons Debug:");
	console.log("moduleId:", moduleId);
	console.log("endpoint:", endpoint);
	console.log("Full API URL:", endpoint ? `http://127.0.0.1:8000/api/v1${endpoint}` : "No endpoint");
	
	const { isLoading, error, data, mutate } = useSWR(
		endpoint,
		swrFetcher()
	);
	
	// Debug the API response
	console.log("🔍 useModuleLessons API Response:");
	console.log("isLoading:", isLoading);
	console.log("error:", error);
	console.log("data:", data);
	console.log("data type:", typeof data);
	console.log("data length:", Array.isArray(data) ? data.length : "Not an array");
	
	return { isLoading, error, lessons: data, mutate };
}