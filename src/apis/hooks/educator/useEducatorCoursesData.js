import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function useEducatorCoursesData(teacherUsername) {
	
  const { isLoading, error, data, mutate } = useSWR(
    educatorEndpoints.course.teacherList(teacherUsername), swrFetcher() );

  return { isLoading, error, data, mutate };
}
