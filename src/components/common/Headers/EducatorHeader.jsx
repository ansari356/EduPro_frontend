import { Navbar, Nav, Dropdown, Container } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";
import { pagePaths } from "../../../pagePaths";
import logoutUser from "../../../apis/actions/logoutUser";

export default function EducatorHeader() {
  return (
    <Navbar bg="white" expand="lg" className="custom-navbar shadow-sm">
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to={pagePaths.home} className="brand-logo">
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
              to={pagePaths.educator.profile}
              className="nav-link-custom"
            >
              <i className="bi bi-person-badge me-2"></i>
              My Profile
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to={pagePaths.educator.courses}
              className="nav-link-custom"
            >
              <i className="bi bi-book me-2"></i>
              My Courses
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to={pagePaths.educator.students}
              className="nav-link-custom"
            >
              <i className="bi bi-people me-2"></i>
              Students
            </Nav.Link>
            {/* New Coupons Link Added Below */}
            <Nav.Link
              as={NavLink}
              to={pagePaths.educator.coupons || "/coupons"}
              className="nav-link-custom"
            >
              <i className="bi bi-ticket-perforated me-2"></i>
              Coupons
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
                  as={Link}
                  to={pagePaths.educator.profile}
                  className="dropdown-item-custom"
                >
                  <i className="bi bi-person me-2"></i>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to={pagePaths.educator.settings || "#settings"}
                  className="dropdown-item-custom"
                >
                  <i className="bi bi-gear me-2"></i>
                  Settings
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to={pagePaths.educator.courseSettings || "#course-settings"}
                  className="dropdown-item-custom"
                >
                  <i className="bi bi-sliders me-2"></i>
                  Course Settings
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to={pagePaths.educator.notifications || "#notifications"}
                  className="dropdown-item-custom"
                >
                  <i className="bi bi-bell me-2"></i>
                  Notifications
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={() => logoutUser()}
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
