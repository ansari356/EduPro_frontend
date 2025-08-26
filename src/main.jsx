import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'; // Import i18n configuration
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {BrowserRouter} from "react-router"; 
import { DarkModeProvider } from './contexts/DarkModeContext';
import { LanguageProvider } from './contexts/LanguageContext';

createRoot(document.getElementById("root")).render(
	<StrictMode>
    <BrowserRouter>
      <DarkModeProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </DarkModeProvider>
    </BrowserRouter>
	</StrictMode>
);
