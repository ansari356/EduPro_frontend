import { Navigate, Outlet, useParams } from "react-router-dom";
import { pagePaths } from "../../pagePaths";
import MainLoader from "../common/MainLoader";
import useStudentRefreshToken from "../../apis/hooks/student/useStudentRefreshToken";

export default function StudentRedirectIfLogedin() {
	const {isLoading ,error} = useStudentRefreshToken()
	const { educatorUsername } = useParams();
	if (isLoading) return <MainLoader text="checking authentication ..."/>
	if (!isLoading && error) return <Outlet	 />
	
	return <Navigate to={pagePaths.student.profile(educatorUsername)} />
	
}