import useSWR from "swr";
import { educatorEndpoints } from "../../endpoints/educatorApi";
import { swrFetcher } from "../../base";

export default function useEducatorProfileData() {

	const {isLoading ,error,data ,mutate} = useSWR(educatorEndpoints.profile ,swrFetcher())
    
	return {isLoading,error,data,mutate};
}