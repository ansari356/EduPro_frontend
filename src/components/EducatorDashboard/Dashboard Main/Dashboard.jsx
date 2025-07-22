import { Container, Row, Col } from "react-bootstrap";
import CourseManagement from "../Course Management/CourseManagement.jsx";
import ActiveCourses from "../Active Courses/ActiveCourses.jsx";
import UpcomingSessions from "../Upcoming Sessions/UpcomingSessions.jsx";
import StudentetOverview from "../Student Overview/StudentetOverview.jsx";
// import SideBar from "../Sidebar/SideBar.jsx";
import "./Dashboard.css";
import SideBar from "../../common/Sidebar/SideBar.jsx";
import { BsBarChartLine, BsBook, BsCalendarEvent, BsGear } from "react-icons/bs";

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
							Welcome back, Mr. Educator! Here's a quick overview of your
							dashboard.
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
					
					<SideBar
						linkesInSideBar={[
							{
								id: "active-courses",
								children: (
									<>
										<BsBook className="me-2 sidebar-icon" />
                    Active Courses
                    </>
								),
							},
              {
                id: "upcoming-sessions",
                children: (
                  <>
                    <BsCalendarEvent className="me-2 sidebar-icon" />
                    Upcoming Sessions
                    </>
                ),
              },
              {
                id: "student-engagement",
                children: (
                  <>
                    <BsBarChartLine className="me-2 sidebar-icon" />
                    Student Engagement
                    </>
                ),
              },
              {
                id: "course-management",
                children: (
                  <>
                    <BsGear className="me-2 sidebar-icon" />
                    Course Management
                    </>
                ),
              }
						]}
					/>
				</Col>
			</Row>
		</Container>
	);
}
