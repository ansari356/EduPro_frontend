import { useNavigate } from "react-router-dom";
import SectionHeader from "../../common/sectionHeader";
import SessionsAndStudentsTabs from "../sessionsStudentsTabList";
import CourseDetails from "./courseDetails";
import { set } from "react-hook-form";

export default function CourseDetailsSection({id}) {
	const navigate = useNavigate();
	return (
		<div className="my-5" id={id}>
			<SectionHeader
				title="Course Details"
				buttonTitle={
					<>
						<i className="bi bi-pencil-square me-2"></i>
						Edit Course
					</>
				}
				buttonActionFunction={() => {
					navigate("/courses/create");
					setTimeout(() => {
						window.scrollTo(0, 300);
					}, 300);
				}}
			/>
			<CourseDetails/>
			<SessionsAndStudentsTabs />

		</div>
	);
}