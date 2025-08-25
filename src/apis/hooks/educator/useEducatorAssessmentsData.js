import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function useEducatorAssessmentsData() {
  const { isLoading, error, data, mutate } = useSWR(
    educatorEndpoints.assessment.list,
    swrFetcher()
  );

  return { isLoading, error, data, mutate };
}

