import SectionHeader from "../../common/sectionHeader";
import CreateCourseForm from "../../forms/createCourseForm/createCourseForm";

export default function CourseCreateSection({id}){
	return(
		<div className="my-5" id={id}>
			<SectionHeader
				title="Create Course"
				/>
			<CreateCourseForm/>
		</div>
	)
}