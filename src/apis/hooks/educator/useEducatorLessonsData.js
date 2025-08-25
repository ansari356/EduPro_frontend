import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function useEducatorLessonsData(moduleId) {
  const { isLoading, error, data, mutate } = useSWR(
    moduleId ? educatorEndpoints.lesson.list(moduleId) : null,
    swrFetcher()
  );

  return { isLoading, error, data, mutate };
}
