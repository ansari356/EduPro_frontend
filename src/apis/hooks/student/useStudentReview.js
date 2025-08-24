import useSWR from "swr";
import { studentEndpoints } from "../../endpoints/student_api";
import { swrFetcher } from "../../base";
import useStudentProfileData from "./useStudentProfileData";

export default function useStudentReview(courseId) {
	const endpoint = courseId && studentEndpoints.courses.courseRatings(courseId);
	const { data: studentProfile } = useStudentProfileData();
	
	const { isLoading, error, data, mutate } = useSWR(
		endpoint,
		swrFetcher()
	);
	
	// Find the current student's review from the list of ratings
	// Since the API returns an array directly (not paginated), we need to handle both cases
	const ratings = data?.results || data || [];
	
	// For now, if there's only one rating, assume it's the current student's
	// This is a temporary solution - ideally the backend should include student ID for proper matching
	const studentReview = ratings.length === 1 ? ratings[0] : null;
	
	return { 
		isLoading, 
		error, 
		data, 
		mutate,
		studentReview,
		hasReview: !!studentReview
	};
}
