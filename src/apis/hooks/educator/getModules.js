//getModules.js
import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function getModules(courseId) {
	
  const { isLoading, error, data, mutate } = useSWR(
    educatorEndpoints.module.list(courseId), swrFetcher() );

  return { isLoading, error, data, mutate };
}


