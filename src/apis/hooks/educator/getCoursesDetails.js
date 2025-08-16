//getCoursesDetails.jsx
import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function getCoursesDetails(courseId) {
	
  const { isLoading, error, data, mutate } = useSWR(
    educatorEndpoints.course.detail(courseId), swrFetcher() );

  return { isLoading, error, data, mutate };
}


