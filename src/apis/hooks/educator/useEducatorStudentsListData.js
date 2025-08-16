import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function useEducatorStudentsListData(pageNumber=1) {
	const { isLoading, error, data, mutate } = useSWR(
		 `${educatorEndpoints.students.list}?page=${pageNumber}`,
		swrFetcher()
	);

	return { isLoading, error, data: data?.results, studentsCount: data?.count, mutate };
}