import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/EducatorDashboard/Dashboard Main/Dashboard";
import NavbarLayout from "./components/layout/navbarLayout";
import CreateCoursePage from "./pages/createCoursePage";
import EducatorSignupPage from "./pages/educatorSignupPage";
import EducatorLoginPage from "./pages/educatorLoginPage";
import StudentSignupPage from "./pages/studentSignupPage";
import StudentLoginPage from "./pages/studentLoginPage";
import ManageCoursePage from "./pages/manageCoursePage";
<<<<<<< HEAD
import EducatorProfile from "./pages/EducatorProfile/EducatorProfile";
import StudentProfile from "./pages/StudentProfile/StudentProfile";
import EducatorNavbarLayout from "./components/layout/EducatorNavbarLayout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="courses">
        <Route path="create" element={<CreateCoursePage />} />
        <Route path="details/:id" element={<ManageCoursePage />} />
      </Route>
      <Route>
        {/* Educator User Section */}
        <Route element={<EducatorNavbarLayout />}>
        <Route path="educator-profile" element={<EducatorProfile />} />
        </Route>
        {/* Syudent User Section */}
        <Route element={<NavbarLayout />}>
          <Route path="student-profile" element={<StudentProfile />} />
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
=======
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
>>>>>>> 0addb9c4fd3d721d17524092cd8da9b9126287f4
}

export default App;
