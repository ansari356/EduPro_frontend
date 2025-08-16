import { Navigate, Outlet } from "react-router-dom";
import useRefreshToken from "../../apis/hooks/useRefreshToken";
import MainLoader from "../common/MainLoader";
import { pagePaths } from "../../pagePaths";
import useEducatorProfileData from "../../apis/hooks/educator/useEducatorProfileData";
import { useEffect } from "react";

export default function EducatorProtectedRoutes() {
	const{isLoading,error}=useRefreshToken()
	const {data}=useEducatorProfileData()
	useEffect(() => {
			if (data) {
				document.documentElement.style.setProperty(
					"--color-primary-light",
					data.primary_color_light
				);
				document.documentElement.style.setProperty(
					"--color-primary-dark",
					data.primary_color_dark
				);
				document.documentElement.style.setProperty(
					"--color-secondary",
					data.secondary_color
				);
				document.documentElement.style.setProperty(
					"--color-background",
					data.background_color
				);
			}
	}, [data]);
	if (!isLoading) {
		return error? <Navigate to={pagePaths.educator.login} /> : <Outlet/>;
	}
	return <MainLoader text="checking authentication ..."/>;
}