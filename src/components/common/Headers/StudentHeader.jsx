import { Navbar, Nav, Dropdown, Container } from "react-bootstrap";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { pagePaths } from "../../../pagePaths";
import logoutUser from "../../../apis/actions/logoutUser";
import useStudentProfileData from "../../../apis/hooks/student/useStudentProfileData";
import useStudentRefreshToken from "../../../apis/hooks/student/useStudentRefreshToken";

export default function StudentHeader() {
  const { mutate } = useStudentRefreshToken();
  const navigate = useNavigate();
  const { educatorUsername } = useParams();
  const { data: studentData, isLoading, error } = useStudentProfileData();

  if (!educatorUsername) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await logoutUser();
      mutate();
      // Redirect to login page after successful logout
      navigate(pagePaths.student.login(educatorUsername));
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, redirect to login page
      navigate(pagePaths.student.login(educatorUsername));
    }
  };

  // Get student name from data or show loading/fallback
  const getStudentName = () => {
    if (isLoading) return "Loading...";
    if (error || !studentData?.student?.full_name) return "Student";
    return studentData.student.full_name;
  };

  // Get student avatar or use default icon
  const getStudentAvatar = () => {
    if (studentData?.student?.profile_picture) {
      return (
        <img 
          src={studentData.student.profile_picture} 
          alt="Student Avatar" 
          className="user-avatar-img"
        />
      );
    }
    return <i className="bi bi-person-circle custom-toggler"></i>;
  };

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
              Courses
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
                  {getStudentAvatar()}
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="user-dropdown-menu">
                <Dropdown.Header className="dropdown-header">
                  <div className="user-info">
                    <i className="bi bi-person-circle me-2"></i>
                    <span>{getStudentName()}</span>
                  </div>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleSignOut}>
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
