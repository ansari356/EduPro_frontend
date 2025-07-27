import { Outlet } from "react-router-dom";
import StudentHeader from "../Student Header/StudentHeader";

export default function NavbarLayout() {
	return (
		<div>
			<StudentHeader/>
			<Outlet/>
		</div>
	);
}