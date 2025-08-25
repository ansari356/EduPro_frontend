import useSWR from "swr";
import baseApi from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

const fetcher = (url) => baseApi.get(url).then((res) => res.data);

export default function useEducatorQuestionDetail(questionId) {
  const { data, error, isLoading, mutate } = useSWR(
    questionId ? educatorEndpoints.assessment.questionDetail(questionId) : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // Cache for 1 minute
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}
