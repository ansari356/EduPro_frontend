import { useState, useEffect } from "react";
import useEducatorAssessmentsData from "./useEducatorAssessmentsData";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import baseApi from "../../base";

/**
 * Hook to fetch ALL attempts across ALL assessments for a teacher
 * This aggregates data from multiple assessment-specific endpoints
 * 
 * Note: This is a client-side aggregation approach since there's no single
 * endpoint to get all attempts. It fetches all assessments first, then
 * fetches attempts for each assessment.
 */
export default function useEducatorAllAttempts() {
	const [allAttempts, setAllAttempts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	
	// Get all assessments first
	const { data: assessments, isLoading: assessmentsLoading, error: assessmentsError } = useEducatorAssessmentsData();

	useEffect(() => {
		if (assessments && assessments.length > 0) {
			fetchAllAttempts();
		} else if (assessments && assessments.length === 0) {
			// No assessments, so no attempts
			setAllAttempts([]);
			setIsLoading(false);
		}
	}, [assessments]);

	const fetchAllAttempts = async () => {
		setIsLoading(true);
		setError(null);
		
		try {
			// Fetch attempts for each assessment in parallel
			const attemptPromises = assessments.map(async (assessment) => {
				try {
					const response = await baseApi.get(educatorEndpoints.assessment.attempts(assessment.id));
					// Add assessment info to each attempt
					return response.data.map(attempt => ({
						...attempt,
						assessment: {
							id: assessment.id,
							title: assessment.title,
							assessment_type: assessment.assessment_type,
							course: assessment.course,
							module: assessment.module,
							lesson: assessment.lesson
						}
					}));
				} catch (err) {
					console.warn(`Failed to fetch attempts for assessment ${assessment.id}:`, err);
					return []; // Return empty array for failed requests
				}
			});

			const results = await Promise.all(attemptPromises);
			const flattenedAttempts = results.flat();
			
			// Sort by most recent first
			const sortedAttempts = flattenedAttempts.sort((a, b) => 
				new Date(b.started_at || b.created_at) - new Date(a.started_at || a.created_at)
			);
			
			setAllAttempts(sortedAttempts);
		} catch (err) {
			setError(err);
			console.error('Error fetching all attempts:', err);
		} finally {
			setIsLoading(false);
		}
	};

	// Refresh function to manually refetch data
	const mutate = () => {
		if (assessments && assessments.length > 0) {
			fetchAllAttempts();
		}
	};

	// Compute summary statistics
	const summary = allAttempts.length > 0 ? {
		totalAttempts: allAttempts.length,
		uniqueStudents: new Set(allAttempts.map(attempt => attempt.student?.id)).size,
		uniqueAssessments: new Set(allAttempts.map(attempt => attempt.assessment?.id)).size,
		byStatus: allAttempts.reduce((acc, attempt) => {
			const status = attempt.status || 'unknown';
			acc[status] = (acc[status] || 0) + 1;
			return acc;
		}, {}),
		byAssessmentType: allAttempts.reduce((acc, attempt) => {
			const type = attempt.assessment?.assessment_type || 'unknown';
			acc[type] = (acc[type] || 0) + 1;
			return acc;
		}, {}),
		averageScore: allAttempts
			.filter(attempt => attempt.percentage !== null && attempt.percentage !== undefined)
			.reduce((sum, attempt, _, arr) => sum + attempt.percentage / arr.length, 0),
		passRate: allAttempts
			.filter(attempt => attempt.is_passed !== null && attempt.is_passed !== undefined)
			.reduce((sum, attempt, _, arr) => sum + (attempt.is_passed ? 1 : 0) / arr.length, 0) * 100
	} : null;

	return {
		attempts: allAttempts,
		summary,
		isLoading: isLoading || assessmentsLoading,
		error: error || assessmentsError,
		mutate
	};
}
