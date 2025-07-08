import ListTable from "../../common/listTable/listTable";
import SectionHeader from "../../common/sectionHeader";

const studentsHeader = ["Name", "Email", "Progress", "Status"];
const studentsRows = [
	["Alice Smith", "alice@example.com", "80%", "Active"],
	["Bob Johnson", "bob@example.com", "65%", "Inactive"],
	["Charlie Lee", "charlie@example.com", "92%", "Active"],
];

export default function StudentsListSection() {
	return (
		<div className="my-5">
			<SectionHeader
				title="Students"
				buttonTitle={
					<>
						<i className="bi bi-plus-lg me-2"></i>
						Add Student
					</>
				}
				buttonActionFunction={() => console.log("add Student")}
			/>
			<ListTable headerElements={studentsHeader} listOfRows={studentsRows} />
		</div>
	);
}
