import { Navbar, Nav, Dropdown, Container } from "react-bootstrap";
import { NavLink, useParams } from "react-router-dom";
import { pagePaths } from "../../../pagePaths";
import logoutUser from "../../../apis/actions/logoutUser";
import useRefreshToken from "../../../apis/hooks/useRefreshToken";

export default function StudentHeader() {
  const { mutate } = useRefreshToken();
  const { educatorUsername } = useParams(); // get from URL params or provide otherwise

  if (!educatorUsername) {
    return null; // or a fallback UI if username is not ready yet
  }

  return (
    <Navbar expand="lg" className="custom-navbar shadow-sm">
      <Container fluid className="px-4">
        <Navbar.Brand className="brand-logo">
          <div className="logo-container">
            <i className="bi bi-mortarboard-fill logo-icon"></i>
            <span className="brand-text">EduPlatform</span>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" className="custom-toggler" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="mx-auto nav-links-container">
            <Nav.Link
              as={NavLink}
              to={pagePaths.student.about(educatorUsername)}
              className="nav-link-custom"
            >
              <i className="bi bi-house-door-fill me-2"></i>
              Home
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to={pagePaths.student.profile(educatorUsername)}
              className="nav-link-custom"
            >
              <i className="bi bi-person-badge me-2"></i>
              Dashboard
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to={pagePaths.student.courses(educatorUsername)}
              className="nav-link-custom"
            >
              <i className="bi bi-book me-2"></i>
              My Courses
            </Nav.Link>
          </Nav>

          <div className="user-section">
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="outline-primary"
                id="dropdown-user"
                className="custom-toggler"
                aria-label="User menu"
              >
                <div className="user-avatar">
                  <i className="bi bi-person-circle custom-toggler"></i>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="user-dropdown-menu">
                <Dropdown.Header className="dropdown-header">
                  <div className="user-info">
                    <i className="bi bi-person-circle me-2"></i>
                    <span>Mohamed Ali Hassan</span>
                  </div>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={() => {
                    logoutUser();
                    mutate();
                  }}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Sign out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
