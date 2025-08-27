import React from 'react';
import { Dropdown, Button } from 'react-bootstrap';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Moon, Sun, Globe, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SettingsDropdown() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { currentLanguage, changeLanguage, t } = useLanguage();
  
  // Determine dropdown alignment based on language direction
  const dropdownAlign = currentLanguage === 'ar' ? 'start' : 'end';

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <Dropdown align={dropdownAlign}>
      <Dropdown.Toggle
        variant="outline-secondary"
        id="settings-dropdown"
        className="settings-toggle"
        aria-label="Settings"
      >
        <Settings size={18} />
      </Dropdown.Toggle>

      <Dropdown.Menu className="settings-dropdown-menu">
        <Dropdown.Header className="dropdown-header">
          <Settings size={16} className="me-2" />
          {t('settings.preferences')}
        </Dropdown.Header>
        
        <Dropdown.Divider />
        
        {/* Dark Mode Toggle */}
        <Dropdown.Item
          onClick={toggleDarkMode}
          className="dropdown-item d-flex align-items-center"
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
        
        <Dropdown.Divider />
        
        {/* Language Selection */}
        <Dropdown.Header className="dropdown-header">
          <Globe size={16} className="me-2" />
          {t('settings.language')}
        </Dropdown.Header>
        
        {languages.map((language) => (
          <Dropdown.Item
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`dropdown-item d-flex align-items-center ${
              currentLanguage === language.code ? 'active' : ''
            }`}
          >
            <span className="me-2">{language.flag}</span>
            <span className="me-2">{language.name}</span>
            {currentLanguage === language.code && (
              <span className="ms-auto">✓</span>
            )}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
