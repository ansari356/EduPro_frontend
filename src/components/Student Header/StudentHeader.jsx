import { Navbar, Nav, Dropdown, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./StudentHeader.css";

export default function StudentHeader() {
  return (
    <Navbar bg="white" expand="lg" className="custom-navbar shadow-sm">
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
              to="/student-profile"
              className="nav-link-custom"
            >
              <i className="bi bi-person-badge me-2"></i>
              My Profile
            </Nav.Link>
            <Nav.Link as={NavLink} to="/my-courses" className="nav-link-custom">
              <i className="bi bi-book me-2"></i>
              My Courses
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about" className="nav-link-custom">
              <i className="bi bi-info-circle me-2"></i>
              About
            </Nav.Link>
          </Nav>

          <div className="user-section">
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="outline-primary"
                id="dropdown-user"
                className="user-dropdown-toggle"
                aria-label="User menu"
              >
                <div className="user-avatar">
                  <i className="bi bi-person-circle"></i>
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
                  href="/student-profile"
                  className="dropdown-item-custom"
                >
                  <i className="bi bi-person me-2"></i>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item
                  href="#settings"
                  className="dropdown-item-custom"
                >
                  <i className="bi bi-gear me-2"></i>
                  Settings
                </Dropdown.Item>
                <Dropdown.Item
                  href="#notifications"
                  className="dropdown-item-custom"
                >
                  <i className="bi bi-bell me-2"></i>
                  Notifications
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  href="#signout"
                  className="dropdown-item-custom text-danger"
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
