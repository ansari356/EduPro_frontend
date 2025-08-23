


import useSWR from "swr";
import { authEndpoints } from "../../endpoints/authApi";
import { useParams } from "react-router-dom";
import { swrPostFetcher } from "../../base";

export default function useStudentRefreshToken() {
	const { educatorUsername } = useParams();
	const { isLoading, error, mutate } = useSWR(
		educatorUsername && authEndpoints.studnetTokenRefresh(educatorUsername),
		swrPostFetcher(),
		{
			refreshInterval: 3 * 60 * 1000,
			errorRetryInterval: 10 * 60 * 1000,
			revalidateOnFocus: false,
		}
	);

	return { isLoading, error, mutate };
}