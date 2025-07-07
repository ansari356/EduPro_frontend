import { Form } from "react-bootstrap";
import "./formCheckInput.css";


export default function FormCheckInput({
	type,
	label,
	className,
	name,
	helpText,
	isError,
	value
}) {
	return (
		<div
			className={`my-3 ${className}  `}
			onClick={(e) => e.currentTarget.getElementsByTagName("input")[0].click()}
		>
			<Form.Check
				className={` px-3 check-input-box `}
				id={`${name}-${value}`}
				label={
					<Form.Label className="m-0" id={`${name}-${value}`}>
						<p className="m-0">{label}</p>
						<Form.Text className={`${isError ? "text-danger" : "text-muted"}`}>
							{helpText}
						</Form.Text>
					</Form.Label>
				}
				value={value}
				name={name}
				type={type || "radio"}
			/>
		</div>
	);
}


