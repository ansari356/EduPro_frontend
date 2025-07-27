import { Col, Container, Row } from "react-bootstrap";
import MainTitle from "../components/common/mainTitle";
import CoursesListSection from "../components/sections/course/coursesListSection";
import { Outlet } from "react-router-dom";

export default  function CoursesManagementPage() {
	return (
		<Container>
			<Row className="flex-nowrap">
				<Col className="px-sm-5 px-3 ">
					<MainTitle title="Courses Management" />
					<CoursesListSection id="list" />
					<hr />
					<Outlet/>

				</Col>
			</Row>
		</Container>
	);
}