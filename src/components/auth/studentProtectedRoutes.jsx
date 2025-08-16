import { Navigate, Outlet, useParams } from "react-router-dom";
import useStudentRefreshToken from "../../apis/hooks/student/useStudentRefreshToken";
import MainLoader from "../common/MainLoader";
import { pagePaths } from "../../pagePaths";

export default function StudentProtectedRoutes() {
	const { educatorUsername } = useParams();
	const { isLoading, error } = useStudentRefreshToken();
	if (error && error.status === 403) {
		return (
			<div className="d-flex flex-column justify-content-center align-items-center">
				<h1 className="text-danger">403</h1>
				<h2 className="text-danger">Forbidden</h2>
				<p className="text-danger">Access Denied: your account already logged in from another device.</p>
			</div>
		);
	}
	if (error) {
		return <Navigate to={pagePaths.student.login(educatorUsername)} />;
	}
	if (isLoading) return <MainLoader text="checking authentication ..." />;

	return <Outlet />;
}