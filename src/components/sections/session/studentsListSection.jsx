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
			/>
			<ListTable headerElements={studentsHeader} listOfRows={studentsRows} />
		</div>
	);
}
