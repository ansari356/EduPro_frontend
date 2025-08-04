import { Route, Routes } from "react-router-dom";
import CreateCoursePage from "./pages/Educator/createCoursePage";
import EducatorSignupPage from "./pages/Educator/educatorSignupPage";
import EducatorLoginPage from "./pages/Educator/educatorLoginPage";
import StudentSignupPage from "./pages/Student/studentSignupPage";
import StudentLoginPage from "./pages/Student/studentLoginPage";
import EducatorProfile from "./pages/Educator/EducatorProfile";
import StudentProfile from "./pages/Student/StudentProfile";
import CoursesList from "./pages/Educator/CoursesList";
import EducatorNavbarLayout from "./components/layout/EducatorNavbarLayout";
import StudentnavbarLayout from "./components/layout/StudentnavbarLayout";
import EducatorCourseDetailsPage from "./pages/Educator/EducatorCourseDetails";
import StudentCourseDetailsPage from "./pages/Student/StudentCourseDetails";
import EditCoursePage from "./pages/Educator/EducatorEditCoursePage";
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
      <Route>
        {/* Educator User Section */}
        <Route element={<EducatorNavbarLayout />}>
          <Route path="educator-profile" element={<EducatorProfile />} />
          <Route path="courses">
            <Route index element={<CoursesList />} />
            <Route path=":id" element={<EducatorCourseDetailsPage />} />
            <Route path="create" element={<CreateCoursePage />} />
            <Route path="edit/:courseId" element={<EditCoursePage />} />
          </Route>
        </Route>
        {/* Student User Section */}
        <Route element={<StudentnavbarLayout />}>
          <Route path="student-profile" element={<StudentProfile />} />
          <Route path="student-courses">
            <Route path=":id" element={<StudentCourseDetailsPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
