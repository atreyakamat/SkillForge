import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Landing from './pages/Landing.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Assessment from './pages/Assessment.jsx'
import PeerReviewRequest from './pages/PeerReviewRequest.jsx'
import PeerReviewCompletion from './pages/PeerReviewCompletion.jsx'
import PeerReviewHistory from './pages/PeerReviewHistory.jsx'
import PeerReviewDashboard from './pages/PeerReviewDashboard.jsx'
import Profile from './pages/Profile.jsx'
import PublicProfile from './pages/PublicProfile.jsx'
import Layout from './components/layout/Layout.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Skills from './pages/Skills.jsx'
import GapAndJobs from './pages/GapAndJobs.jsx'
import TestPage from './pages/TestPage.jsx'
import ScheduleMaker from './components/schedule/ScheduleMaker.jsx'
import ProgressTracker from './components/progress/ProgressTracker.jsx'
import RecommendationEngine from './components/recommendations/RecommendationEngine.jsx'

export default function App() {
  return (
    <Routes>
      {/* Public routes without layout */}
      <Route path="/" element={<Landing />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected routes with layout */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/skills" element={
        <ProtectedRoute>
          <Layout>
            <Skills />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/assessment" element={
        <ProtectedRoute>
          <Layout>
            <Assessment />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/gap-jobs" element={
        <ProtectedRoute>
          <Layout>
            <GapAndJobs />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/schedule" element={
        <ProtectedRoute>
          <Layout>
            <ScheduleMaker />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/progress" element={
        <ProtectedRoute>
          <Layout>
            <ProgressTracker />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/recommendations" element={
        <ProtectedRoute>
          <Layout>
            <RecommendationEngine />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/peer/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <PeerReviewDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/peer/request" element={
        <ProtectedRoute>
          <Layout>
            <PeerReviewRequest />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/peerreviewrequest" element={
        <ProtectedRoute>
          <Layout>
            <PeerReviewRequest />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/peer/complete" element={
        <ProtectedRoute>
          <Layout>
            <PeerReviewCompletion />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/peer/history" element={
        <ProtectedRoute>
          <Layout>
            <PeerReviewHistory />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <Profile />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Public Profile Route - No authentication required */}
      <Route path="/profile/public/:userId" element={<PublicProfile />} />
    </Routes>
  )
}

