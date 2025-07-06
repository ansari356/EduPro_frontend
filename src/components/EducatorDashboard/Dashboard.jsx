import { Container, Row, Col } from "react-bootstrap";
import CourseManagement from "./CourseManagement.jsx";
import ActiveCourses from "./ActiveCourses.jsx";
import UpcomingSessions from "./UpcomingSessions.jsx";
import StudentetOverview from "./StudentetOverview.jsx";
import SideBar from "./SideBar.jsx";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <Container fluid>
      <Row>
        {/* Main content on the left */}
        <Col xs={12} md={9} lg={10} className="ps-md-5 ps-3">
          <div className="dashboard-container">
            <h2 className="fw-bold mb-2" style={{ color: "#1a3967" }}>
              Educator Dashboard
            </h2>
            <p className="text-muted mb-4">
              Welcome back, Mr. Educator! Here's a quick overview of your dashboard.
            </p>
            <div className="mb-5" id="active-courses">
              <ActiveCourses />
            </div>
            <div className="mb-5" id="upcoming-sessions">
              <UpcomingSessions />
            </div>
            <div className="mb-5" id="student-engagement">
              <StudentetOverview />
            </div>
            <div className="mb-5" id="course-management">
              <CourseManagement />
            </div>
          </div>
        </Col>
        {/* Sidebar on the right */}
        <Col xs={12} md={3} lg={2} className="p-0">
          <SideBar />
        </Col>
      </Row>
    </Container>
  );
}
