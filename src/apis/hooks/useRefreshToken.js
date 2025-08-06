import useSWR from "swr";
import { authEndpoints } from "../endpoints/authApi";
import { swrPostFetcher } from "../base";


export default function useRefreshToken() {
	const {isLoading ,error,mutate} = useSWR(authEndpoints.refreshToken ,swrPostFetcher(),{
		refreshInterval: 5*60*1000,
		errorRetryInterval: 60*1000
	})

	return {isLoading,error,mutate}
}