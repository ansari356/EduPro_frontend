import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function useEducatorAssessmentQuestionsData(assessmentId) {
  const { isLoading, error, data, mutate } = useSWR(
    assessmentId ? educatorEndpoints.assessment.questions(assessmentId) : null,
    swrFetcher()
  );

  return { isLoading, error, data, mutate };
}

