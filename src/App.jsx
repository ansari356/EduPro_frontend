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
import EducatorCourseDetailsPage from "./pages/Educator/EducatorCourseDetails";
import StudentCourseDetailsPage from "./pages/Student/studentCourseDetails";
import StudentCourses from "./pages/Student/StudentCourses";
import EditCoursePage from "./pages/Educator/EducatorEditCoursePage";
import Home from "./pages/home";
import EducatorProtectedRoutes from "./components/auth/educatorProtectedRoutes";
import EducatorRedirectIfLogedin from "./components/auth/educatorRedirectIfLogedin";
import StudentProtectedRoutes from "./components/auth/studentProtectedRoutes";
import StudentRedirectIfLogedin from "./components/auth/studentRedirectIfLogedin";
import StudentNavbarLayout from "./components/layout/StudentNavbarLayout";
import EducatorPageDataRoutes from "./components/layout/EducatorPageDataRoutes";
import NotFoundPage from "./pages/NotFoundPage";
import EducatorStudentsPage from "./pages/Educator/educatorStudentsPage";
import EducatorStudentDetails from "./pages/Educator/educatorStudentDetails";
import MainNavbarLayout from "./components/layout/MainNavbarLayout";
import EducatorCouponsPage from "./pages/Educator/educatorCouponsPage";
import StudentHome from "./pages/Student/StudentHome";
import StudentMainNavbarLayout from "./components/layout/StudentMainNavbarLayout";

function App() {
  return (
    <Routes>
      {/* Public Home and Auth Pages with Main Header/Footer */}
      <Route path="/" element={<MainNavbarLayout />}>
        <Route index element={<Home />} />

        <Route element={<EducatorRedirectIfLogedin />}>
          <Route path="signup" element={<EducatorSignupPage />} />
          <Route path="login" element={<EducatorLoginPage />} />
        </Route>
      </Route>

      {/* Educator Protected Routes */}
      <Route element={<EducatorProtectedRoutes />}>
        <Route element={<EducatorNavbarLayout />}>
          <Route path="/educator" element={<EducatorProfile />} />
          <Route path="/coupons" element={<EducatorCouponsPage />} />
          <Route path="/students" element={<EducatorStudentsPage />} />
          <Route
            path="/students/:studentId"
            element={<EducatorStudentDetails />}
          />
          <Route path="/courses">
            <Route index element={<CoursesList />} />
            <Route path=":id" element={<EducatorCourseDetailsPage />} />
            <Route path="create" element={<CreateCoursePage />} />
            <Route path="edit/:courseId" element={<EditCoursePage />} />
          </Route>
        </Route>
      </Route>

      {/* Student Pages (based on educator username) */}
      <Route path=":educatorUsername" element={<EducatorPageDataRoutes />}>
        {/* Public StudentHome - shows at /:educatorUsername (index) with public header */}
        <Route element={<StudentMainNavbarLayout />}>
          <Route index element={<StudentHome />} />
        </Route>

        <Route element={<StudentRedirectIfLogedin />}>
          <Route path="login" element={<StudentLoginPage />} />
          <Route path="signup" element={<StudentSignupPage />} />
        </Route>

        {/* Protected Student Routes */}
        <Route element={<StudentProtectedRoutes />}>
          <Route path="student" element={<StudentNavbarLayout />}>
            <Route path="profile" element={<StudentProfile />} />
            <Route path="about" element={<StudentHome />} />
            <Route path="courses">
              <Route index element={<StudentCourses />} />
              <Route path=":id" element={<StudentCourseDetailsPage />} />
            </Route>
          </Route>
        </Route>
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
