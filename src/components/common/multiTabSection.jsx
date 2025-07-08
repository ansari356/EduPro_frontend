import { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";

// const sections_list = [
// 	{
// 		title: "Sessions",
// 		component: <SessionsTable />,
// 	},
// 	{
// 		title: "Students",
// 		component: <StudentsTable />,
// 	},
// ];

export default function TabSections({ sections }) {
	const [activeTab, setActiveTab] = useState(
		sections[0]?.title.replace(" ", "")
	);
	return (
		<div>
			<Tabs
				id={`${sections[0].title.replace(" ", "-")}}-tabs`}
				activeKey={activeTab}
				onSelect={(k) => setActiveTab(k)}
				className="mb-3"
			>
				{sections.map((section) => (
					<Tab
						eventKey={section.title.replace(" ", "")}
						key={section.title}
						title={section.title}
					>
						{section.component}
					</Tab>
				))}
			</Tabs>
		</div>
	);
}
