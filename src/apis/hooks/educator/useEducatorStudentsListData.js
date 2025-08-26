import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function useEducatorStudentsListData(pageNumber=1) {
	const { isLoading, error, data, mutate } = useSWR(
		educatorEndpoints.students.list + `?page=${pageNumber}`,
		swrFetcher()
	);

	// Debug logging to help troubleshoot the 401 error
	if (error) {
		console.error('Students API Error:', error);
		console.error('Error details:', {
			status: error.response?.status,
			message: error.response?.data?.detail || error.message,
			data: error.response?.data,
			url: educatorEndpoints.students.list + `?page=${pageNumber}`
		});
	}

	return { isLoading, error, data: data?.results, studentsCount: data?.count, mutate };
}