import { Outlet } from "react-router-dom";
import EducatorHeader from "../Educator Header/EducatorHeader";

export default function EducatorNavbarLayout() {
    return (
        <div>
            <EducatorHeader />
            <Outlet />
        </div>
    );
}