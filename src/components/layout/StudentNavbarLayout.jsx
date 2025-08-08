import { Outlet } from "react-router-dom";
import StudentHeader from "../common/Headers/StudentHeader";
import MainFooter from "../common/Footers/MainFooter";

export default function StudentNavbarLayout() {
  return (
    <div>
      <StudentHeader />
      <main>
        <Outlet />
      </main>
      <MainFooter />
    </div>
  );
}
