import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function useEducatorModulesData(courseId) {
  const { isLoading, error, data, mutate } = useSWR(
    courseId ? educatorEndpoints.module.list(courseId) : null,
    swrFetcher()
  );

  return { isLoading, error, data, mutate };
}
