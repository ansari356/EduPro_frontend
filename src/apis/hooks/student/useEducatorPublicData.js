import useSWR from "swr";
import { studentEndpoints } from "../../endpoints/student_api";
import { swrFetcher } from "../../base";
import { useParams } from "react-router-dom";

export default function useEducatorPublicData(educatorUsernameParam = null) {
	const params = useParams();
	const educatorUsername = educatorUsernameParam || params.educatorUsername;
	
	const {isLoading ,error,data ,mutate} = useSWR(
		educatorUsername && studentEndpoints.educatorPublicData(educatorUsername), 
		swrFetcher()
	);
	
	return {isLoading,error,data,mutate};
}