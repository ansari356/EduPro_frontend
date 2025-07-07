import Form from "react-bootstrap/Form";
export default function FormTextareaInput({
	type,
	id,
	placeholder,
	label,
	className,
	helpText,
	isError,
}) {
	const _id = id || label?.toLowerCase().replace(/\s/g, "");
	return (
		<div className={`my-3 ${className}`}>
			<Form.Label className="fw-bold" htmlFor={_id}>
				{label}
			</Form.Label>
			<Form.Control
				type={type || "text"}
				as="textarea"
				rows={3}
				placeholder={placeholder}
				id={_id}
				isInvalid={isError}
			/>
			<Form.Text
				className={`${isError ? "text-danger" : "text-muted"}`}
				id={`${_id}-help`}
			>
				{helpText}
			</Form.Text>
		</div>
	);
}
