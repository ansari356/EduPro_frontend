import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/EducatorDashboard/Dashboard";
import NavbarLayout from "./components/layout/navbarLayout";
import CreateCoursePage from "./pages/createCoursePage";
import ManageCoursePage from "./pages/manageCoursePage";
function App() {
  return (
    <Routes>
      
      <Route element={<NavbarLayout />} >
        <Route path="/" element={<Dashboard />} />
        <Route path="courses" >

          <Route path="create" element={<CreateCoursePage />} />
          <Route path="details/:id" element={<ManageCoursePage />} />
        </Route>
      </Route>


    </Routes>
  );
}

export default App;
