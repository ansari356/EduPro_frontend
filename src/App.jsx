import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/EducatorDashboard/Dashboard";
import Header from "./components/Header";
import NavbarLayout from "./components/layout/navbarLayout";
import CreateCoursePage from "./pages/createCoursePage";
function App() {
  return (
    <Routes>
      
      <Route element={<NavbarLayout />} >
        <Route path="/" element={<Dashboard />} />
        <Route path="course" element={<CreateCoursePage />} />
      </Route>


    </Routes>
  );
}

export default App;
