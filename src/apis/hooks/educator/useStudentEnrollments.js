import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function useStudentEnrollments(studentId) {
	// Debug logging
	console.log('🔍 useStudentEnrollments Debug:', {
		studentId,
		educatorEndpoints,
		studentEnrollments: educatorEndpoints?.students?.enrollments,
		endpoint: studentId ? educatorEndpoints?.students?.enrollments?.(studentId) : null
	});
	
	const { isLoading, error, data, mutate } = useSWR(
		studentId ? educatorEndpoints?.students?.enrollments?.(studentId) : null,
		swrFetcher()
	);
	
	return { 
		isLoading, 
		error, 
		data, 
		mutate,
		enrollments: data?.results || [],
		count: data?.count || 0
	};
}
