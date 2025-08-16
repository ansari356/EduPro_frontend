import { Outlet,  } from "react-router-dom";
import { useEffect } from "react";
import MainLoader from "../common/MainLoader";
import useEducatorPublicData from "../../apis/hooks/student/useEducatorPublicData";
export default function EducatorPageDataٌٌٌRoutes() {
	
	const { isLoading, data, error } = useEducatorPublicData();
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

	if (data) return <Outlet/>
	if (isLoading) return <MainLoader text="loading data ..."/>
	return (<div className="profile-root min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="display-1 mb-4">❌</div>
          <h1 className="main-title mb-4">Teacher Not Found</h1>
          <p className="profile-joined mb-4">
            Sorry, we couldn't find this teacher's page. 
            Please check the link or contact platform administration.
          </p>
          <button 
            className="btn-edit-profile"
            onClick={() => switchTeacher('ahmed-alansari')}
          >
            Back to Homepage
          </button>
        </div>
      </div>)
}
