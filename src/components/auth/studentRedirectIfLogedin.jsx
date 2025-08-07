import { Navigate, Outlet } from "react-router-dom";
import useRefreshToken from "../../apis/hooks/useRefreshToken";
import { pagePaths } from "../../pagePaths";
import MainLoader from "../common/MainLoader";

export default function StudentRedirectIfLogedin() {
	const {isLoading ,error} = useRefreshToken()
	console.log(error)
	if (isLoading) return <MainLoader text="checking authentication ..."/>
	return !isLoading && error ? (
		<Outlet	 />
	) : (
		<Navigate to={pagePaths.student.profile} />
	);
	
}