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
import EditCoursePage from "./pages/Educator/EducatorEditCoursePage";
import Home from "./pages/home";
import EducatorProtectedRoutes from "./components/auth/educatorProtectedRoutes";
import EducatorRedirectIfLogedin from "./components/auth/educatorRedirectIfLogedin";
import StudentProtectedRoutes from "./components/auth/studentProtectedRoutes";
import StudentRedirectIfLogedin from "./components/auth/studentRedirectIfLogedin";
import StudentNavbarLayout from "./components/layout/StudentNavbarLayout";
import EducatorPageDataٌٌٌRoutes from "./components/layout/EducatorPageDataRoutes";
import NotFoundPage from "./pages/NotFoundPage";
import EducatorStudentsPage from "./pages/Educator/educatorStudentsPage";
import EducatorStudentDetails from "./pages/Educator/educatorStudentDetails";
import MainHeader from "./components/common/Headers/MainHeader.jsx";
import MainFooter from "./components/common/Footers/MainFooter.jsx";
import EducatorCouponsPage from "./pages/Educator/educatorCouponsPage.jsx";
function App() {
  return (
    <>
    <Routes>
      {/* Educator Pages */}
      <Route element={<MainHeader />}/>
      <Route path="/">
        <Route index element={<Home />} />

        {/* Unprotected Routes and redirects logged in educators */}
        <Route element={<EducatorRedirectIfLogedin />}>
          <Route path="signup" element={<EducatorSignupPage />} />
          <Route path="login" element={<EducatorLoginPage />} />
        </Route>

        {/* Protected Routes -> Only accessible when educator is logged in */}
        <Route element={<EducatorProtectedRoutes />}>
          <Route element={<EducatorNavbarLayout />}>
            <Route path="educator" element={<EducatorProfile />} />
            <Route path="coupons" element={<EducatorCouponsPage />} />
            <Route path="students" element={<EducatorStudentsPage />} />
            <Route path="students/:studentId" element={<EducatorStudentDetails />} />
            <Route path="courses">
              <Route index element={<CoursesList />} />
              <Route path=":id" element={<EducatorCourseDetailsPage />} />
              <Route path="create" element={<CreateCoursePage />} />
              <Route path="edit/:courseId" element={<EditCoursePage />} />
            </Route>
          </Route>
        </Route>
      </Route>

      {/* Educator Based Pages  [all student pages depend on educator username] */}
      <Route path=":educatorUsername" element={<EducatorPageDataٌٌٌRoutes />}>
        <Route index element={<h1> Educator Home Page Place Holder</h1>} />
        <Route element={<StudentRedirectIfLogedin />}>
          <Route path="login" element={<StudentLoginPage />} />
          <Route path="signup" element={<StudentSignupPage />} />
        </Route>

        <Route element={<StudentProtectedRoutes />}>
          <Route path="student" element={<StudentNavbarLayout />}>
            <Route path="profile" element={<StudentProfile />} />
            <Route path="courses">
              <Route path=":id" element={<StudentCourseDetailsPage />} />
            </Route>
          </Route>
        </Route>
      </Route>
      {/* Catch-all route for 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
      {/* Footer */}
      <MainFooter />
      </>
  );
}

export default App;
