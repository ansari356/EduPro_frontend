import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { pagePaths } from "../../../pagePaths.js";
import SettingsDropdown from "../SettingsDropdown";
import { useLanguage } from "../../../contexts/LanguageContext";

export default function HomeHeader() {
  const { currentLanguage } = useLanguage();
  
  return (
    <Navbar
      bg="white"
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
            <i className="bi bi-mortarboard-fill logo-icon"></i>
            <span className="brand-text">EduPlatform</span>
          </div>
        </Navbar.Brand>

        {/* Collapsible Navbar Toggle */}
        <Navbar.Toggle aria-controls="navbar-nav" className="custom-toggler" />

        <Navbar.Collapse id="navbar-nav">
          {/* Push buttons to the right */}
          <Nav className="ms-auto">
            <Link
              to={pagePaths.educator.login}
              className="btn-edit-profile px-4 me-2"
              style={{ textDecoration: "none" }}
            >
              <i className="bi bi-person me-2"></i>
                              Login as Educator
            </Link>
            <Link
              to={pagePaths.educator.signup}
              className="btn-edit-profile px-4 me-2"
              style={{ textDecoration: "none" }}
            >
              <i className="bi bi-person-plus me-2"></i>
                              Register as Educator
            </Link>
            <SettingsDropdown />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
