import { Navigate, Outlet, useParams } from "react-router-dom";
import useStudentRefreshToken from "../../apis/hooks/student/useStudentRefreshToken";
import MainLoader from "../common/MainLoader";
import { pagePaths } from "../../pagePaths";

export default function StudentProtectedRoutes() {
	const { educatorUsername } = useParams();
	const{isLoading,error}=useStudentRefreshToken()
	if (error) {
		return <Navigate to={pagePaths.student.login(educatorUsername)} /> ;
	}
	if (isLoading) return <MainLoader text="checking authentication ..."/>;

	return <Outlet	 />
}