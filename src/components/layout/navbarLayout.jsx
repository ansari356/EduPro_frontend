import { Outlet } from "react-router-dom";
import Header from "../Header";

export default function NavbarLayout() {
	return (
		<div>
			<Header/>
			<Outlet/>
		</div>
	);
}