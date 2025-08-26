import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

/**
 * Hook to fetch educator's students with comprehensive filtering and search
 * 
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number for pagination (default: 1)
 * @param {boolean} params.is_active - Filter by active status (optional)
 * @param {string} params.search - Search by username, email, or full name (optional)
 * @param {string} params.ordering - Sort results by specific fields (optional)
 */
export default function useEducatorStudentsListData(params = {}) {
	const {
		page = 1,
		is_active,
		search,
		ordering
	} = params;

	// Build query parameters
	const queryParams = new URLSearchParams();
	queryParams.append('page', page.toString());
	
	if (is_active !== undefined && is_active !== null) {
		queryParams.append('is_active', is_active.toString());
	}
	
	if (search && search.trim()) {
		queryParams.append('search', search.trim());
	}
	
	if (ordering) {
		queryParams.append('ordering', ordering);
	}

	const url = `${educatorEndpoints.students.list}?${queryParams.toString()}`;

	const { isLoading, error, data, mutate } = useSWR(
		url,
		swrFetcher()
	);

	// Debug logging to help troubleshoot errors
	if (error) {
		console.error('Students API Error:', error);
		console.error('Error details:', {
			status: error.response?.status,
			message: error.response?.data?.detail || error.message,
			data: error.response?.data,
			url: url,
			params: params
		});
	}

	// Process and enhance the data
	const processedData = data?.results?.map(student => ({
		...student,
		// Add computed fields for easier access
		fullName: student.student?.full_name || `${student.student?.user?.first_name || ''} ${student.student?.user?.last_name || ''}`.trim(),
		email: student.student?.user?.email,
		username: student.student?.user?.username,
		avatar: student.student?.user?.avatar || student.student?.profile_picture,
		isActive: student.is_active,
		enrollmentDate: student.enrollment_date,
		lastActivity: student.last_activity,
		completedLessons: student.completed_lessons || 0,
		completedCourses: student.number_of_completed_courses || 0
	}));

	return { 
		isLoading, 
		error, 
		data: processedData, 
		students: processedData, // Alias for backward compatibility
		studentsCount: data?.count,
		totalCount: data?.count,
		hasNext: !!data?.next,
		hasPrevious: !!data?.previous,
		nextPage: data?.next,
		previousPage: data?.previous,
		mutate 
	};
}