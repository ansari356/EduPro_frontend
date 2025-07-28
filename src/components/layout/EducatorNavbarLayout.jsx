import { Outlet } from "react-router-dom";
import EducatorHeader from "../common/Headers/EducatorHeader";

export default function EducatorNavbarLayout() {
    return (
        <div>
            <EducatorHeader />
            <Outlet />
        </div>
    );
}