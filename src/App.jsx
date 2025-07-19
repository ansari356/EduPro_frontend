import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/EducatorDashboard/Dashboard";
import NavbarLayout from "./components/layout/navbarLayout";
import CreateCoursePage from "./pages/createCoursePage";
import EducatorSignupPage from "./pages/educatorSignupPage";
import EducatorLoginPage from "./pages/educatorLoginPage";
import StudentSignupPage from "./pages/studentSignupPage";
import StudentLoginPage from "./pages/studentLoginPage";
import ManageCoursePage from "./pages/manageCoursePage";


function App() {
  return (
    <Routes>
      <Route element={<NavbarLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="courses" >

          <Route path="create" element={<CreateCoursePage />} />
          <Route path="details/:id" element={<ManageCoursePage />} />
        </Route>
      </Route>

      {/* Pages WITHOUT header */}
      <Route path="educator-signup" element={<EducatorSignupPage />} />
      <Route path="educator-login" element={<EducatorLoginPage />} />
      <Route path="/:teacher-name/student-login" element={<StudentLoginPage />} />
      <Route path="/:teacher-name/student-signup" element={<StudentSignupPage />} />
    </Routes>
  );
}

export default App;
