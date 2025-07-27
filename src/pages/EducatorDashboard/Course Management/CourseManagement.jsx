import { Card, Row, Col } from "react-bootstrap";
import { BsPlusSquare, BsPencilSquare, BsChatDots } from "react-icons/bs";
import "../Course Management/CourseManagement.css";

export default function CourseManagementTools() {
  const tools = [
    {
      icon: <BsPlusSquare className="tool-icon" />,
      title: "Create New Course",
      desc: "Start building a new course from scratch.",
      link: "#create",
    },
    {
      icon: <BsPencilSquare className="tool-icon" />,
      title: "Manage Existing Courses",
      desc: "Edit and update your current course materials.",
      link: "#manage",
    },
    {
      icon: <BsChatDots className="tool-icon" />,
      title: "View Student Feedback",
      desc: "Review and respond to student feedback.",
      link: "#feedback",
    },
  ];

  return (
    <div id="course-management" className="course-management-section">
      <h4 className="fw-bold mb-4" style={{ color: "#1a3967" }}>
        Course Management Tools
      </h4>
      <Row xs={1} md={3} className="g-4">
        {tools.map((tool, idx) => (
          <Col key={idx}>
            <Card className="tool-card h-100 shadow-sm">
              <div className="d-flex flex-column align-items-center py-4">
                {tool.icon}
                <Card.Title className="mt-3 mb-2 fw-bold" style={{ color: "#1a3967" }}>
                  {tool.title}
                </Card.Title>
                <Card.Text className="text-muted text-center" style={{ minHeight: 48 }}>
                  {tool.desc}
                </Card.Text>
                <a href={tool.link} className="stretched-link text-decoration-none" style={{ color: "#3390ec", fontWeight: 500 }}>
                  Learn more
                </a>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
