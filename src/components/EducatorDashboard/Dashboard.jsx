import { Container, Row, Col } from "react-bootstrap";
import Header from "./Header.jsx";
import CourseManagement from "./CourseManagement.jsx";
import ActiveCourses from "./ActiveCourses.jsx";
import UpcomingSessions from "./UpcomingSessions.jsx";
import StudentetOverview from "./StudentetOverview.jsx";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <>
      <Header />
      <Container fluid>
        <div className="dashboard-container">
          <Row>
            <Col xs={12} md={8} className="ps-md-5 ps-3">
              <h2 className="fw-bold mb-2" style={{ color: "#1a3967" }}>
                Educator Dashboard
              </h2>
              <p className="text-muted mb-4">
                Welcome back, Mr. Educator! Here's a quick overview of your dashboard.
              </p>
            </Col>
          </Row>
          <Row className="mt-3 g-4">
            <Col xs={12} md={8} className="ps-md-5 ps-3">
              <ActiveCourses />
            </Col>
            <Col xs={12} md={8} className="ps-md-5 ps-3">
              <UpcomingSessions />
            </Col>
            <Col xs={12} md={8} className="ps-md-5 ps-3">
              <StudentetOverview />
            </Col>
            <Col xs={12} md={8} className="ps-md-5 ps-3">
              <CourseManagement />
            </Col>
          </Row>
          <br />
          <br />
        </div>
      </Container>
    </>
  );
}
