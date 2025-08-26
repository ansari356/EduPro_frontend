import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function useCourseAssessments(courseId) {
  const { isLoading, error, data, mutate } = useSWR(
    courseId ? educatorEndpoints.assessment.courseAssessments(courseId) : null,
    swrFetcher()
  );

  return { 
    isLoading, 
    error, 
    assessments: data || [], 
    mutate 
  };
}
