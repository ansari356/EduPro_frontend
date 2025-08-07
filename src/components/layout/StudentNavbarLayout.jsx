import { Outlet } from "react-router-dom";
import StudentHeader from "../common/Headers/StudentHeader";

export default function StudentNavbarLayout() {
	return (
		<div>
			<StudentHeader/>
			<Outlet/>
		</div>
	);
}