import { useNavigate } from "react-router-dom";
import ListTable from "../../common/listTable/listTable";
import SectionHeader from "../../common/sectionHeader";

const coursesHeader = ["Title", "Description", "Progress", "Status"];
const coursesRows = [
	["Data Analysis", "Introduction to Data Analysis", "80%", "Active"],
	["Excel Techniques", "Advanced Excel Techniques", "65%", "Inactive"],
	["Data Visualization", "Data Visualization with Tableau", "92%", "Active"],
];

export default function CoursesListSection({id}){
	const navigate = useNavigate();
	return (
		<div id={id} className="my-5">
			<SectionHeader
				title="Courses List"
				buttonTitle={
					<>
						<i className="bi bi-plus-lg me-2"></i>
						Add Course
					</>
				}
				buttonActionFunction={() => {navigate("/courses/create")
					setTimeout(() => {
						window.scrollTo(0, 300);
					},300);
		}}
			/>
			<ListTable headerElements={coursesHeader} listOfRows={coursesRows} listOfLinks={["/courses/1", "/courses/2", "/courses/3"]} />
		</div>
	);
}