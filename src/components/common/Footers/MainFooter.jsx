import React from "react";
import {
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Mail,
  Phone
} from "lucide-react";

export default function EducatorFooter() {
  return (
    <footer
      className="mt-auto py-4"
      style={{
        background: "var(--color-card-background)",
        borderTop: "1px solid var(--color-border)",
        color: "var(--color-primary-dark)",
        boxShadow: "var(--shadow-light)"
      }}
    >
      <div className="container">
        {/* Top row: Contact left, Social right */}
        <div className="row align-items-center mb-2">
          {/* Contact info left side with phone under email and centered */}
          <div className="col-12 col-md-6 mb-3 mb-md-0 d-flex flex-column align-items-center justify-content-center justify-content-md-start">
            <div className="d-flex align-items-center mb-2">
              <Mail style={{ width: 18, height: 18, color: "var(--color-primary-dark)" }} className="me-1" />
              <span className="fw-medium">contact@eduplatform.com</span>
            </div>
            <div className="d-flex align-items-center">
              <Phone style={{ width: 18, height: 18, color: "var(--color-primary-dark)" }} className="me-1" />
              <span className="fw-medium">+123 456 7890</span>
            </div>
          </div>

          {/* Social media links right side centered */}
          <div className="col-12 col-md-6 mb-3 mb-md-0 d-flex flex-column align-items-center justify-content-center text-center text-md-end">
            <div className="fw-bold mb-2" style={{ color: "var(--color-primary-dark)" }}>
              Connect with us:
            </div>
            <div className="d-flex gap-3 justify-content-center justify-content-md-end">
              <a
                href="https://linkedin.com"
                className="section-title"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin style={{ width: 23, height: 23 }} />
              </a>
              <a
                href="https://twitter.com"
                className="section-title"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter style={{ width: 23, height: 23 }} />
              </a>
              <a
                href="https://facebook.com"
                className="section-title"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook style={{ width: 23, height: 23 }} />
              </a>
              <a
                href="https://instagram.com"
                className="section-title"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram style={{ width: 23, height: 23 }} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom row: Copyright centered */}
        <div className="row">
          <div className="col-12">
            <div
              className="text-center mt-2"
              style={{
                fontSize: "var(--font-size-sm)",
                color: "var(--color-text-muted)"
              }}
            >
              &copy; {new Date().getFullYear()} EduPlatform. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
