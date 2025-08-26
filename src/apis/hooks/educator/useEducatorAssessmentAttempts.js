import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function useEducatorAssessmentAttempts(assessmentId) {
	const { isLoading, error, data, mutate } = useSWR(
		assessmentId ? educatorEndpoints.assessment.attempts(assessmentId) : null,
		swrFetcher()
	);

	return { 
		attempts: data || [], 
		isLoading, 
		error, 
		mutate 
	};
}
