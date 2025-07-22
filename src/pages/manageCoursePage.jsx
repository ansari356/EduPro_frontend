import { Container } from "react-bootstrap";
import MainTitle from "../components/common/mainTitle";
import SessionsAndStudentsTabs from "../components/sections/sessionsStudentsTabList";
import CourseDetails from "../components/sections/course/courseDetails";

export default function ManageCoursePage() {
	return (
		<Container className="my-5">
			<MainTitle title="Manage Course" />
			<CourseDetails />
			<SessionsAndStudentsTabs />
		</Container>
	);
}
