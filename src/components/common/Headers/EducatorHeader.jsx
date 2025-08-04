import { Navbar, Nav, Dropdown, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function EducatorHeader() {
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
              to="/educator-profile"
              className="nav-link-custom"
            >
              <i className="bi bi-person-badge me-2"></i>
              My Profile
            </Nav.Link>
            <Nav.Link as={NavLink} to="/courses" className="nav-link-custom">
              <i className="bi bi-book me-2"></i>
              My Courses
            </Nav.Link>
            <Nav.Link as={NavLink} to="/courses-list/create" className="nav-link-custom">
              <i className="bi bi-plus-circle me-2"></i>
              Create Course
            </Nav.Link>
            <Nav.Link as={NavLink} to="/student-management" className="nav-link-custom">
              <i className="bi bi-people me-2"></i>
              Students
            </Nav.Link>
            <Nav.Link as={NavLink} to="/analytics" className="nav-link-custom">
              <i className="bi bi-bar-chart me-2"></i>
              Analytics
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
                    <span>Dr. Amelia Carter</span>
                  </div>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item
                  href="/educator-profile"
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
                  href="#course-settings"
                  className="dropdown-item-custom"
                >
                  <i className="bi bi-sliders me-2"></i>
                  Course Settings
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
