import { Route, Routes } from "react-router-dom";
import NavbarLayout from "./components/layout/StudentnavbarLayout";
import CreateCoursePage from "./pages/createCoursePage";
import EducatorSignupPage from "./pages/educatorSignupPage";
import EducatorLoginPage from "./pages/educatorLoginPage";
import StudentSignupPage from "./pages/studentSignupPage";
import StudentLoginPage from "./pages/studentLoginPage";
import ManageCoursePage from "./pages/manageCoursePage";
import CoursesManagementPage from "./pages/coursesManagementPage";
import CourseDetailsSection from "./components/sections/course/courseDetailsSection";
import EducatorProfile from "./pages/EducatorProfile";
import StudentProfile from "./pages/StudentProfile";
import EducatorNavbarLayout from "./components/layout/EducatorNavbarLayout";

function App() {
  return (
    <Routes>
      {/* Main pages */}
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
				<Route path="courses" element={<CoursesManagementPage />}>
					<Route path="create" element={<CreateCoursePage />} />
					<Route path=":id" element={<CourseDetailsSection />} />
				</Route>
      <Route>
        {/* Educator User Section */}
        <Route element={<EducatorNavbarLayout />}>
        <Route path="educator-profile" element={<EducatorProfile />} />
        </Route>
        {/* Student User Section */}
        <Route element={<NavbarLayout />}>
          <Route path="student-profile" element={<StudentProfile />} />
        </Route>
      </Route>

      
    </Routes>
  );
}

export default App;
