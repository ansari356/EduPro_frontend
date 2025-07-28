import { Outlet } from "react-router-dom";
import StudentHeader from "../common/Headers/StudentHeader";

export default function NavbarLayout() {
	return (
		<div>
			<StudentHeader/>
			<Outlet/>
		</div>
	);
}