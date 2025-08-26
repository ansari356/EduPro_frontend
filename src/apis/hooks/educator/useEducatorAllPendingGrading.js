import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

/**
 * Hook to fetch all pending grading across all assessments for a teacher
 * This gives us insight into all attempts that need grading
 * 
 * @param {Object} filters - Optional filters
 * @param {string} filters.assessmentId - Filter by specific assessment
 * @param {string} filters.courseId - Filter by specific course
 * @param {string} filters.assessmentType - Filter by assessment type (quiz, assignment, exam)
 * @param {string} filters.questionType - Filter by question type (essay, short_answer, etc.)
 */
export default function useEducatorAllPendingGrading(filters = {}) {
	// Determine which endpoint to use based on filters
	let endpoint = null;
	
	if (filters.courseId) {
		endpoint = educatorEndpoints.assessment.grading.courseGrading(filters.courseId);
	} else if (filters.assessmentId) {
		endpoint = educatorEndpoints.assessment.grading.assessmentGrading(filters.assessmentId);
	} else if (filters.assessmentType) {
		endpoint = educatorEndpoints.assessment.grading.typeGrading(filters.assessmentType);
	} else if (filters.questionType) {
		endpoint = educatorEndpoints.assessment.grading.questionTypeGrading(filters.questionType);
	} else {
		// Default: get all pending grading
		endpoint = educatorEndpoints.assessment.grading.pending;
	}

	const { isLoading, error, data, mutate } = useSWR(
		endpoint,
		swrFetcher()
	);

	// Transform the data to group by attempts and provide useful aggregations
	const processedData = data ? {
		// Raw pending grading data
		pendingGrading: data,
		
		// Group by attempt ID to get attempt-level view
		attemptGroups: data.reduce((groups, item) => {
			const attemptId = item.attempt;
			if (!groups[attemptId]) {
				groups[attemptId] = {
					attemptId,
					student: item.student,
					assessment: item.assessment,
					answers: [],
					totalQuestions: 0,
					gradedQuestions: 0,
					pendingQuestions: 0
				};
			}
			
			groups[attemptId].answers.push(item);
			groups[attemptId].totalQuestions++;
			
			if (item.is_graded) {
				groups[attemptId].gradedQuestions++;
			} else {
				groups[attemptId].pendingQuestions++;
			}
			
			return groups;
		}, {}),
		
		// Summary statistics
		summary: {
			totalPendingAnswers: data.length,
			uniqueAttempts: new Set(data.map(item => item.attempt)).size,
			uniqueStudents: new Set(data.map(item => item.student?.id)).size,
			uniqueAssessments: new Set(data.map(item => item.assessment?.id)).size,
			byAssessmentType: data.reduce((acc, item) => {
				const type = item.assessment?.assessment_type || 'unknown';
				acc[type] = (acc[type] || 0) + 1;
				return acc;
			}, {}),
			byQuestionType: data.reduce((acc, item) => {
				const type = item.question?.question_type || 'unknown';
				acc[type] = (acc[type] || 0) + 1;
				return acc;
			}, {})
		}
	} : null;

	return { 
		pendingGrading: processedData,
		isLoading, 
		error, 
		mutate 
	};
}
