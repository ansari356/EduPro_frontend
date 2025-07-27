import { Button, Col, Row } from "react-bootstrap";
import FormTextareaInput from "../../common/formTextareaInput";
import FormTextInput from "../../common/formTextInput";
import FormUploadFilesInput from "../../common/uploadFilesInput/formUploadFilesInput";
import FormCheckInput from "../../common/checkInput/formCheckInput";
FormCheckInput

export default function CreateCourseForm({className}) {
	return (
		<form action="" method="post" className={className}>
			<Row>
				<Col md={8} lg={6} xl={4}>
					<FormTextInput
						type="text"
						label="Course Title"
						placeholder="Enter course name"
					/>
					<FormTextareaInput
						label="Course Description"
						placeholder="Enter course description"
					/>
					<FormTextInput
						type="text"
						label="Topic"
						placeholder="Enter cours topic"
					/>
					<FormTextInput
						label={"Price"}
						placeholder={"Enter course price"}
						type={"number"}
					/>
				</Col>
			</Row>
			<Row className="my-5">
				<Col lg={10} xl={8}>
					<FormUploadFilesInput
						placeholder={"Upload Course Image"}
						label="Course Image"
					/>
					<div>
						<h5 className="fw-bold mt-5">Course State</h5>
						<FormCheckInput
							type={"radio"}
							label={"Published Course"}
							name={"published"}
							value={true}
							helpText={"This course is published, All students can access it"}
						/>
						<FormCheckInput
							type={"radio"}
							label={"Hidden Course"}
							name={"published"}
							value={false}
							helpText={"This course is hidden, Only you can access it"}
						/>
					</div>
				</Col>
			</Row>
			<Row className="my-5">
				<Col lg={10} xl={8} className="d-flex gap-3 justify-content-end">
					{/* Buttons go here */}
					<Button className="fw-bold shadow-sm" variant="light">
						Save as Draft
					</Button>
					<Button className="fw-bold shadow-sm" variant="primary" type="submit">
						Create Course
					</Button>
				</Col>
			</Row>
		</form>
	);
}