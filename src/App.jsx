import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/EducatorDashboard/Dashboard";
import Header from "./components/Header";
import NavbarLayout from "./components/layout/navbarLayout";
import CreateCoursePage from "./pages/createCoursePage";
import EducatorSignupPage from "./pages/educatorSignupPage";
import EducatorLoginPage from "./pages/educatorLoginPage";
import StudentSignupPage from "./pages/studentSignupPage";
import StudentLoginPage from "./pages/studentLoginPage";


function App() {
  return (
    <Routes>
      <Route element={<NavbarLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="course" element={<CreateCoursePage />} />
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
