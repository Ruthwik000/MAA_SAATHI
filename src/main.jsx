import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/design-system.css'
import './styles/auth.css'
import './styles/dashboard.css'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { FontSizeProvider } from './context/FontSizeContext'

import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW Registered', reg))
      .catch(err => console.log('SW Error', err))
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AppProvider>
        <ThemeProvider>
          <FontSizeProvider>
            <LanguageProvider>
              <App />
            </LanguageProvider>
          </FontSizeProvider>
        </ThemeProvider>
      </AppProvider>
    </AuthProvider>
  </StrictMode>
)
