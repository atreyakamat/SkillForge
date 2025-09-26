import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { SkillProvider } from './contexts/SkillContext.jsx'
import { PeerReviewProvider } from './contexts/PeerReviewContext.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <SkillProvider>
          <PeerReviewProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </PeerReviewProvider>
        </SkillProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
)

