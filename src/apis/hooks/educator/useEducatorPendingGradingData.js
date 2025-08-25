import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function useEducatorPendingGradingData() {
  const { isLoading, error, data, mutate } = useSWR(
    educatorEndpoints.assessment.grading.pending,
    swrFetcher()
  );

  return { isLoading, error, data, mutate };
}

