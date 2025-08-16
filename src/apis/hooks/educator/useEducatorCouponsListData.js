import useSWR from "swr";
import { swrFetcher } from "../../base";
import { educatorEndpoints } from "../../endpoints/educatorApi";

export default function useEducatorCouponsListData(pageNumber=1) {
	const { isLoading, error, data, mutate } = useSWR(
		 `${educatorEndpoints.coupon.list}?page=${pageNumber}`,
		swrFetcher()
	);
	[
		{
			id: "0088cabe-693f-4d32-aa0a-c0255a96aaf0",
			teacher: "0ff9c7af-2255-4e86-baf7-c2ee09d4b159",
			code: "DEMOTEACHER22",
			status: "full_accessed",
			max_uses: 15,
			used_count: 0,
			expiration_date: "2025-09-19T13:18:43.958986Z",
			price: 18,
			is_active: true,
			date: "2025-08-15T13:18:43.959869Z",
		},
	];
	return { isLoading, error, data: data?.results, couponsCount: data?.count, mutate };
}