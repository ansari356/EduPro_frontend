import useSWR from "swr";
import { swrFetcher } from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

export default function useEducatorTotalRevenue() {
	const { isLoading, error, data, mutate } = useSWR(
		educatorEndpoints.totalRevenue,
		swrFetcher()
	);
	return { isLoading, error, totalRevenue: data?.revenue, mutate };
}