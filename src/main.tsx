import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext'; // Import LanguageProvider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider> {/* Wrap the entire App with LanguageProvider */}
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
