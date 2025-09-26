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
import NavBar from './components/common/NavBar.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <NavBar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
          <Route path="/peer/request" element={<PeerReviewRequest />} />
          <Route path="/peerreviewrequest" element={<PeerReviewRequest />} />
          <Route path="/peer/complete" element={<PeerReviewCompletion />} />
          <Route path="/peer/history" element={<PeerReviewHistory />} />
        </Routes>
      </main>
    </div>
  )
}

