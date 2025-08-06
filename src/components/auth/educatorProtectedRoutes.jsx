import { Navigate, Outlet } from "react-router-dom";
import useRefreshToken from "../../apis/hooks/useRefreshToken";
import MainLoader from "../common/MainLoader";
import { pagePaths } from "../../pagePaths";

export default function EducatorProtectedRoutes() {
	const{isLoading,error}=useRefreshToken()
	if (!isLoading) {
		return error? <Navigate to={pagePaths.educator.login} /> : <Outlet/>;
	}
	return <MainLoader text="checking authentication ..."/>;
}