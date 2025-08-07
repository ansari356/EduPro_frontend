import { Outlet } from "react-router-dom";
import useEducatorProfileData from "../../apis/hooks/educator/useEducatorProfileData";
import { useEffect } from "react";
import MainLoader from "../common/MainLoader";
import NotFoundPage from "../../pages/NotFoundPage";
export default function EducatorPageDataٌٌٌRoutes() {
	const {isLoading ,data,error}= useEducatorProfileData()
	useEffect(() => {
		console.log(data || error)
	}, [data])

	if (data) return <Outlet/>
	if (isLoading) return <MainLoader text="loading data ..."/>
	return <NotFoundPage/>
}
