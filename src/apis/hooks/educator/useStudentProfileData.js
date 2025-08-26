import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function useStudentProfileData(studentId) {
  const { data, error, isLoading, mutate } = useSWR(
    studentId ? educatorEndpoints.students.profile(studentId) : null,
    swrFetcher()
  );

  return { 
    studentData: data, 
    error, 
    isLoading, 
    mutate 
  };
}
