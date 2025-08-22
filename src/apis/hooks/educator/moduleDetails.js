//moduleDetails.js
import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function moduleDetails(moduleId) {
	
  const { isLoading, error, data, mutate } = useSWR(
    educatorEndpoints.module.detail(moduleId), swrFetcher() );

  return { isLoading, error, data, mutate };
}


