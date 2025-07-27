import { Badge, Card, Col, Row } from "react-bootstrap";
import SectionHeader from "../../common/sectionHeader";

export default function CourseDetails() {
	return (
		<div className="my-5">
			<Row
				className="mb-4 overflow-hidden rounded"
				style={{ maxHeight: "40vh" }}
			>
				<Col lg={8}>
					<Card.Img
						src="https://placehold.co/600x400?text=Course+Image"
						className="img-fluid rounded-start"
					/>
				</Col>
			</Row>
			<Row>
				<Col lg={8}>
					<h5 className="fw-bold mb-4 primary-text">
						Introduction to Data Analysis
					</h5>
				</Col>
			</Row>
			<Row className="g-4">
				<Col sm={6} lg={2}>
					<div>
						<Badge bg="success">Public</Badge>
					</div>
				</Col>
				<Col sm={6} lg={3}>
					<p className="text-muted">
						<i className="bi bi-star-fill me-2"></i>
						Rating: 4.5
					</p>
					<p className="text-muted">
						<i className="bi bi-camera-video-fill me-2"></i>
						Sessions: 12
					</p>

					<p className="text-muted">
						<i className="bi bi-people-fill me-2"></i>
						Students: 25
					</p>
					<p className="text-muted">
						<i className="bi bi-journal-text me-2"></i>
						Assignments: 5
					</p>
				</Col>
				<Col sm={6} lg={3}>
					<p className="text-muted">
						<i className="bi bi-calendar-plus me-2"></i>
						Creation Date: 2024-01-15
					</p>
					<p className="text-muted">
						<i className="bi bi-calendar-check me-2"></i>
						Last Edit Date: 2024-05-20
					</p>
				</Col>
			</Row>
		</div>
	);
}
