import { Navigate, Outlet, useParams } from "react-router-dom";
import useRefreshToken from "../../apis/hooks/useRefreshToken";
import { pagePaths } from "../../pagePaths";
import MainLoader from "../common/MainLoader";

export default function StudentRedirectIfLogedin() {
	const {isLoading ,error} = useRefreshToken()
	const { educatorUsername } = useParams();
	if (isLoading) return <MainLoader text="checking authentication ..."/>
	if (!isLoading && error) return <Outlet	 />

	return <Navigate to={pagePaths.student.profile(educatorUsername)} />
	
}