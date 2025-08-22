//getLessonList.js
import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function getLessonList(moduleId) {
	
  const { isLoading, error, data, mutate } = useSWR(
    educatorEndpoints.lesson.list(moduleId), swrFetcher() );

  return { isLoading, error, data, mutate };
}


