import { Link } from "react-router-dom";
import {pagePaths} from "../pagePaths";

export default function Home() {
	return (
		<div className="p-5">
			<h1 className="mx-auto">Home</h1>
			<div className="d-flex gap-3 justify-content-center">
				<Link to={pagePaths.educator.login}>Login as Educator</Link>
				<Link to={pagePaths.educator.signup}>Register a New Educator</Link>

			</div>
		</div>
	);
}