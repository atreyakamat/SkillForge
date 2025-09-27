import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import './styles/magical.css'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { SkillProvider } from './contexts/SkillContext.jsx'
import { AssessmentProvider } from './contexts/AssessmentContext.jsx'
import { PeerReviewProvider } from './contexts/PeerReviewContext.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <SkillProvider>
          <AssessmentProvider>
            <PeerReviewProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </PeerReviewProvider>
          </AssessmentProvider>
        </SkillProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
)

