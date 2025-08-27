import { Navbar, Nav, Dropdown, Container } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";
import { pagePaths } from "../../../pagePaths";
import logoutUser from "../../../apis/actions/logoutUser";
import useRefreshToken from "../../../apis/hooks/useRefreshToken";
import useEducatorProfileData from "../../../apis/hooks/educator/useEducatorProfileData";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useDarkMode } from "../../../contexts/DarkModeContext";
import { Moon, Sun, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function EducatorHeader() {
  const { mutate } = useRefreshToken();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { data: educatorData, isLoading, error } = useEducatorProfileData();
  const { t } = useTranslation();
  
  // Get educator name from data or show loading/fallback
  const getEducatorName = () => {
    if (isLoading) return t('header.loading');
    if (error || !educatorData?.full_name) return t('header.educator');
    return educatorData.full_name;
  };

  // Get educator avatar or use default icon
  const getEducatorAvatar = () => {
    if (educatorData?.profile_picture) {
      return (
        <img 
          src={educatorData.profile_picture} 
          alt={`${t('header.educator')} Avatar`}
          className="user-avatar-img"
        />
      );
    }
    return <i className="bi bi-person-circle"></i>;
  };
  
  return (
    <Navbar bg="white" expand="lg" className="custom-navbar shadow-sm">
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to={pagePaths.home} className="brand-logo">
          <div className="logo-container">
            <i className="bi bi-mortarboard-fill logo-icon"></i>
            <span className="brand-text">{t('header.brandName')}</span>
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
              {t('nav.profile')}
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to={pagePaths.educator.courses}
              className="nav-link-custom"
            >
              <i className="bi bi-book me-2"></i>
              {t('nav.courses')}
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to={pagePaths.educator.assessments}
              className="nav-link-custom"
            >
              <i className="bi bi-file-text me-2"></i>
              {t('nav.assessments')}
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to={pagePaths.educator.students}
              className="nav-link-custom"
            >
              <i className="bi bi-people me-2"></i>
              {t('nav.students')}
            </Nav.Link>
            {/* New Coupons Link Added Below */}
            <Nav.Link
              as={NavLink}
              to={pagePaths.educator.coupons || "/coupons"}
              className="nav-link-custom"
            >
              <i className="bi bi-ticket-perforated me-2"></i>
              {t('nav.coupons')}
            </Nav.Link>
          </Nav>

          <div className="user-section d-flex align-items-center gap-2">
            <Dropdown align={currentLanguage === 'ar' ? 'start' : 'end'}>
              <Dropdown.Toggle
                variant="outline-primary"
                id="dropdown-user"
                className="user-dropdown-toggle"
                aria-label={t('header.userMenu')}
              >
                <div className="user-avatar">
                  {getEducatorAvatar()}
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="user-dropdown-menu">
                <Dropdown.Header className="dropdown-header">
                  <div className="user-info">
                    {getEducatorAvatar()}
                    <span className="ms-2">{getEducatorName()}</span>
                  </div>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item
                  as={Link}
                  to={pagePaths.educator.profile}
                  className="dropdown-item-custom"
                >
                  <i className="bi bi-person me-2"></i>
                  {t('nav.profile')}
                </Dropdown.Item>
                <Dropdown.Divider />
                
                {/* Dark Mode Toggle */}
                <Dropdown.Item
                  onClick={toggleDarkMode}
                  className="dropdown-item-custom d-flex align-items-center"
                >
                  {isDarkMode ? (
                    <>
                      <Sun size={16} className="me-2" />
                      {t('settings.lightMode')}
                    </>
                  ) : (
                    <>
                      <Moon size={16} className="me-2" />
                      {t('settings.darkMode')}
                    </>
                  )}
                </Dropdown.Item>
                
                {/* Language Selection */}
                <Dropdown.Header className="dropdown-header">
                  <Globe size={16} className="me-2" />
                  {t('settings.language')}
                </Dropdown.Header>
                
                <Dropdown.Item
                  onClick={() => changeLanguage('en')}
                  className={`dropdown-item-custom d-flex align-items-center ${
                    currentLanguage === 'en' ? 'active' : ''
                  }`}
                >
                  <span className="me-2">🇺🇸</span>
                  <span className="me-2">English</span>
                  {currentLanguage === 'en' && (
                    <span className="ms-auto">✓</span>
                  )}
                </Dropdown.Item>
                
                <Dropdown.Item
                  onClick={() => changeLanguage('ar')}
                  className={`dropdown-item-custom d-flex align-items-center ${
                    currentLanguage === 'ar' ? 'active' : ''
                  }`}
                >
                  <span className="me-2">🇸🇦</span>
                  <span className="me-2">العربية</span>
                  {currentLanguage === 'ar' && (
                    <span className="ms-auto">✓</span>
                  )}
                </Dropdown.Item>
                
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={() => logoutUser()
                    .then(() => {
                      mutate();
                    })
                  }
                  className="dropdown-item-custom text-danger"
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  {t('action.logout')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
