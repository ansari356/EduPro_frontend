import { Badge } from "react-bootstrap";
import ListTable from "../../common/listTable/listTable";
import SectionHeader from "../../common/sectionHeader";
const sessions = [
	["Introduction to Data Analysis", 2, 1, "2024-01-15", 120, 4.8],
	["Advanced Excel Techniques", 3, 2, "2024-01-22", 105, 4.7],
	["Data Visualization with Tableau", 4, 1, "2024-02-01", 98, 4.9],
];
const headerElements = [
	"Title",
	"Hours",
	"Assignments",
	"Creation Date",
	"Views",
	"Rate",
];

export default function SessionsListSection() {
	return (
		<div className="my-5">
			<SectionHeader
				title="Sessions"
				buttonTitle={
					<>
						<i className="bi bi-plus-lg me-2"></i>
						Add Session
					</>
				}
				buttonActionFunction={() => console.log("add session")}
			/>
			<ListTable
				headerElements={headerElements}
				listOfRows={sessions.map((session) => [
					...session.slice(0, session.length - 1),
					<Badge bg="light-warning" text="dark">
						<i className="bi bi-star-fill me-1"></i>
						{session[session.length - 1]}
					</Badge>,
				])}
			/>
		</div>
	);
}
