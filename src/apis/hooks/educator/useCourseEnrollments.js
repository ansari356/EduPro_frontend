import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function useCourseEnrollments(courseId) {
  const { data, error, isLoading, mutate } = useSWR(
    courseId ? educatorEndpoints.course.enrollments(courseId) : null,
    swrFetcher()
  );

  return {
    enrollments: data || [],
    error,
    isLoading,
    mutate,
  };
}
