import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi"
import { swrFetcher } from "../../base";

export default function useEducatorUsedCouponsListData(pageNumber=1) {
	const { isLoading, error, data, mutate } = useSWR(
		 `${educatorEndpoints.coupon.used}?page=${pageNumber}`,
		swrFetcher()
	);
	return { isLoading, error, data: data?.results, usedCouponsCount: data?.count, mutate };
}