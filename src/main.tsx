import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import ScrollToTop from './components/ScrollToTop'; 
import { HelmetProvider } from 'react-helmet-async'; // Import HelmetProvider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop /> 
      <LanguageProvider>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
