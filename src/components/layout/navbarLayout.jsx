import { Outlet } from "react-router-dom";
import Header from "../Header/Header";

export default function NavbarLayout() {
	return (
		<div>
			<Header/>
			<Outlet/>
		</div>
	);
}