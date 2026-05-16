import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { Analytics } from '@vercel/analytics/react'
import App from './App.jsx'
import './styles/global.css'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
history.replaceState(null, '', window.location.href);

if (window.location.pathname === '/') {
  window.scrollTo(0, 0);
  window.addEventListener('scroll', function fix() {
    window.scrollTo(0, 0);
    window.removeEventListener('scroll', fix);
  }, { once: true });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
        <Analytics />
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
