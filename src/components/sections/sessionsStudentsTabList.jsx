import SessionsTable from "./student/sessionsListSection";
import StudentsTable from "./session/studentsListSection";
import TabSections from "../common/multiTabSection";

const sections_list = [
	{
		title: "Sessions",
		component: <SessionsTable />,
	},
	{
		title: "Students",
		component: <StudentsTable />,
	},
];

export default function SessionsAndStudentsTabs() {
	return <TabSections sections={sections_list} />;
}
