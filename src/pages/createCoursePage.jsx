import { Container } from "react-bootstrap";
import MainTitle from "../components/common/mainTitle";
import CreateCourseForm from "../components/forms/createCourseForm/createCourseForm";

export default function CreateCoursePage() {
	return (
		<Container className="my-5" >
			<MainTitle title="Create Course" />
			
					<CreateCourseForm/>
		</Container >
	);
}