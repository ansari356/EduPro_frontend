import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/EducatorDashboard/Dashboard Main/Dashboard";
import NavbarLayout from "./components/layout/navbarLayout";
import CreateCoursePage from "./pages/createCoursePage";
import EducatorSignupPage from "./pages/educatorSignupPage";
import EducatorLoginPage from "./pages/educatorLoginPage";
import StudentSignupPage from "./pages/studentSignupPage";
import StudentLoginPage from "./pages/studentLoginPage";
import ManageCoursePage from "./pages/manageCoursePage";
import CoursesManagementPage from "./pages/coursesManagementPage";
import CourseDetailsSection from "./components/sections/course/courseDetailsSection";


function App() {
  return (
		<Routes>
			<Route element={<NavbarLayout />}>
				{/* educator dashboard pages */}
				<Route path="/" element={<Dashboard />} />
				<Route path="courses" element={<CoursesManagementPage />}>
					<Route path="create" element={<CreateCoursePage />} />
					<Route path=":id" element={<CourseDetailsSection />} />
				</Route>
			</Route>

			{/* Pages WITHOUT header */}
			<Route path="educator-signup" element={<EducatorSignupPage />} />
			<Route path="educator-login" element={<EducatorLoginPage />} />
			<Route
				path="/:teacher-name/student-login"
				element={<StudentLoginPage />}
			/>
			<Route
				path="/:teacher-name/student-signup"
				element={<StudentSignupPage />}
			/>
		</Routes>
	);
}

export default App;
