import { Navigate, Outlet, useParams } from "react-router-dom";
import useRefreshToken from "../../apis/hooks/useRefreshToken";
import MainLoader from "../common/MainLoader";
import { pagePaths } from "../../pagePaths";

export default function StudentProtectedRoutes() {
	const { educatorUsername } = useParams();
	const{isLoading,error}=useRefreshToken()
	if (!isLoading) {
		return error ? <Navigate to={pagePaths.student.login(educatorUsername)} /> : <Outlet />;
	}
	return <MainLoader text="checking authentication ..."/>;
}