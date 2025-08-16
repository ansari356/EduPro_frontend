import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function useCategoryList() {
	const { isLoading, error, data, mutate } = useSWR(
		educatorEndpoints.courseCategory.list,
		swrFetcher()
	);
	/**
	 * [
    {
        "id": "2f08e28a-e252-40a4-b0da-e7c0a472b458",
        "name": "Programming",
        "icon": null
    },

]
	 */
	return { isLoading, error, data, mutate };
}