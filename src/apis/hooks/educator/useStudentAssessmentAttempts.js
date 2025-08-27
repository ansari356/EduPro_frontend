import useSWR from 'swr';
import { swrFetcher } from '../../base';

export default function useStudentAssessmentAttempts(studentUsername) {
  const { data, error, isLoading, mutate } = useSWR(
    studentUsername 
      ? `/teacher/assessments/attempts/${studentUsername}/`
      : null,
    swrFetcher(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    data: data?.results || [],
    count: data?.count || 0,
    isLoading,
    error,
    mutate,
  };
}
