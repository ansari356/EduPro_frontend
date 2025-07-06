import { Card, Row, Col } from "react-bootstrap";

export default function ActiveCourses() {
  const courses = [
    {
      title: "Advanced Data Analysis",
      description: "Enrolled Students: 25",
      image: "https://placehold.co/600x400?text=Hello+World",
    },
    {
      title: "Creative Writing Workshop",
      description: "Enrolled Students: 50",
      image: "https://placehold.co/600x400?text=Hello+World",
    },
    {
      title: "Digital Marketing",
      description: "Enrolled Students: 42",
      image: "https://placehold.co/600x400?text=Hello+World",
    },
  ];
  return (
    <>
      <h4 className="fw-bold mb-4" style={{ color: "#1a3967" }}>Active Courses</h4>
      <Row className="g-4">
        {courses.map((course, idx) => (
          <Col md={4} key={idx}>
            <Card className="h-100 shadow-sm" style={{ borderRadius: "1.2rem" }}>
              <Card.Img
                variant="top"
                src={course.image}
                alt={course.title}
                style={{ borderTopLeftRadius: "1.2rem", borderTopRightRadius: "1.2rem" }}
              />
              <Card.Body>
                <Card.Title style={{ color: "#1a3967" }}>{course.title}</Card.Title>
                <Card.Text className="text-primary">
                  {course.description || "No description available."}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
