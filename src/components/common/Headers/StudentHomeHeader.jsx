import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { pagePaths } from "../../../pagePaths";


export default function StudentHomeHeader() {
  const { educatorUsername } = useParams();
  return (
    <Navbar
      expand="lg"
      className="custom-navbar shadow-sm"
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      <Container fluid className="px-4">
        {/* Logo & Brand */}
        <Navbar.Brand
          as={Link}
          to={pagePaths.home}
          className="brand-logo d-flex align-items-center gap-2"
        >
          <div className="logo-container">
            <i className="bi bi-mortarboard-fill me-2 logo-icon"></i>
            <span className="brand-text">EduPlatform</span>
          </div>
        </Navbar.Brand>

        {/* Collapsible Navbar Toggle */}
        <Navbar.Toggle aria-controls="navbar-nav" className="custom-toggler" />

        <Navbar.Collapse id="navbar-nav">
          {/* Navigation buttons on the right */}
          <Nav className="ms-auto">
            <Link
              to={pagePaths.student.login(educatorUsername)}
              className="btn-edit-profile me-2"
              style={{ textDecoration: "none" }}
            >
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Login as Student
            </Link>
            <Link
              to={pagePaths.student.signup(educatorUsername)}
              className="btn-edit-profile"
              style={{ textDecoration: "none" }}
            >
              <i className="bi bi-person-plus me-2"></i>
              Register as Student
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
