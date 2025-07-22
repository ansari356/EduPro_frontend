import { Button } from "react-bootstrap";
import SectionTitle from "./sectionTitle";

export default function SectionHeader({
	title,
	className = "",
	buttonTitle,
	buttonActionFunction,
	id,
}) {
	return (
		<div
			className={
				"d-flex justify-content-between flex-wrap align-items-center mt-5 pt-5" +
				className
			}
		>
			<SectionTitle id={id || title.toLowerCase().replace(" ", "-")} title={title} />
			{buttonTitle && <Button
				onClick={buttonActionFunction}
				variant="outline-primary"
				className="fw-bold shadow-sm mb-4"
			>
				{buttonTitle}
			</Button>}
		</div>
	);
}
