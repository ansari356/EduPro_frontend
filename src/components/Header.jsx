import { Navbar, Nav, Form, Dropdown } from "react-bootstrap";
import "../components/EducatorDashboard/Dashboard.css";
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
		<Navbar bg="light" expand="lg" className="mb-3 border-bottom ps-4">
			<Navbar.Brand href="#" className="me-4 d-flex align-items-center fw-bold">
				<i className="bi bi-body-text me-2 fs-4" aria-hidden="true"></i>
				EduPlatform
			</Navbar.Brand>
			<Navbar.Toggle aria-controls="navbar-nav" />
			<Navbar.Collapse id="navbar-nav">
				<Nav className="flex-grow-1 justify-content-start">
					<Nav.Link
						as={NavLink}
						to="/"
						className="fw-bold text-dark"
					>
						Home
					</Nav.Link>
					<Nav.Link as={NavLink}
						to="/courses" className="fw-bold text-dark">
						My Courses
					</Nav.Link>
					<Nav.Link as={NavLink}
						to="/students" className="fw-bold text-dark">
						My Students
					</Nav.Link>
					<Nav.Link as={NavLink}
						to="/assignments" className="fw-bold text-dark">
						Asignments
					</Nav.Link>
				</Nav>
				<div className="search-bar-wrapper d-flex justify-content-center align-items-center mx-3">
					<div className="position-relative w-100" style={{ maxWidth: 320 }}>
						<span className="search-icon">
							<i className="bi bi-search"></i>
						</span>
						<Form.Control
							type="search"
							placeholder="Search"
							className="ps-5 py-2 rounded-pill shadow-sm custom-search-input"
							style={{ background: "#e3f0fd", color: "#1a3967" }}
						/>
					</div>
				</div>
				<Dropdown align="end">
					<Dropdown.Toggle variant="light" id="dropdown-user">
						<i className="bi bi-person-circle fs-4"></i>
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Item href="#profile">Profile</Dropdown.Item>
						<Dropdown.Item href="#settings">Settings</Dropdown.Item>
						<Dropdown.Divider />
						<Dropdown.Item href="#signout">Sign out</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</Navbar.Collapse>
		</Navbar>
	);
}
