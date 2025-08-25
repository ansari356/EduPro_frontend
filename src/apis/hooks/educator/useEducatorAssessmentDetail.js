import useSWR from "swr";
import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

const fetcher = (url) => baseApi.get(url).then((res) => res.data);

export default function useEducatorAssessmentDetail(assessmentId) {
  const { data, error, isLoading, mutate } = useSWR(
    assessmentId ? educatorEndpoints.assessment.detail(assessmentId) : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // Cache for 30 seconds
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
    // Helper getters for easier access
    assessment: data,
    questions: data?.questions || [],
    totalQuestions: data?.total_questions || 0,
    totalMarks: data?.total_marks || 0,
  };
}
