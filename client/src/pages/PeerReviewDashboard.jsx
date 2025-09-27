import { useState, useEffect } from 'react'
import { usePeerReview } from '../contexts/PeerReviewContext.jsx'
import { peerAPI } from '../services/api.js'
import ReviewRequest from '../components/peer/ReviewRequest.jsx'
import PeerReview from '../components/peer/PeerReview.jsx'

export default function PeerReviewDashboard() {
  const [activeTab, setActiveTab] = useState('received') // 'received' | 'sent' | 'new-request' | 'review'
  const [receivedRequests, setReceivedRequests] = useState([])
  const [sentRequests, setSentRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)

  // Load data on component mount
  useEffect(() => {
    loadPeerReviewData()
  }, [])

  const loadPeerReviewData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Load both received and sent requests
      const [receivedResponse, sentResponse] = await Promise.all([
        peerAPI.getReceived(),
        peerAPI.getPending()
      ])

      setReceivedRequests(receivedResponse.data?.received || receivedResponse.data || [])
      setSentRequests(sentResponse.data?.pending || sentResponse.data || [])
    } catch (err) {
      console.error('Failed to load peer review data:', err)
      setError('Failed to load peer review data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptRequest = async (requestId) => {
    try {
      // For now, just switch to review mode for this request
      // TODO: Add proper accept endpoint to server
      const request = receivedRequests.find(r => r._id === requestId)
      setSelectedRequest(request)
      setActiveTab('review')
    } catch (err) {
      console.error('Failed to accept request:', err)
      setError('Failed to accept review request. Please try again.')
    }
  }

  const handleDeclineRequest = async (requestId, reason = '') => {
    try {
      // For now, just simulate decline by removing from list
      // TODO: Add proper decline endpoint to server
      console.log('Declining request:', requestId, 'Reason:', reason)
      await loadPeerReviewData()
    } catch (err) {
      console.error('Failed to decline request:', err)
      setError('Failed to decline review request. Please try again.')
    }
  }

  const handleReviewComplete = async () => {
    setSelectedRequest(null)
    setActiveTab('received')
    await loadPeerReviewData()
  }

  const handleNewRequestComplete = async () => {
    setActiveTab('sent')
    await loadPeerReviewData()
  }

  // Tab navigation
  const tabs = [
    { id: 'received', name: 'Received Requests', icon: '📥', count: receivedRequests.filter(r => r.status === 'pending').length },
    { id: 'sent', name: 'My Requests', icon: '📤', count: sentRequests.length },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading peer reviews...</p>
        </div>
      </div>
    )
  }

  // Show ReviewRequest component when creating new request
  if (activeTab === 'new-request') {
    return <ReviewRequest onComplete={handleNewRequestComplete} />
  }

  // Show PeerReview component when reviewing
  if (activeTab === 'review' && selectedRequest) {
    return (
      <PeerReview 
        requestId={selectedRequest._id}
        onComplete={handleReviewComplete}
        onCancel={() => {
          setSelectedRequest(null)
          setActiveTab('received')
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Peer Reviews</h1>
          <p className="mt-2 text-gray-600">
            Manage your peer review requests and provide feedback to colleagues
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={loadPeerReviewData}
              className="mt-2 text-red-600 hover:text-red-800 font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.name}
                  {tab.count > 0 && (
                    <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm">
          {activeTab === 'received' && (
            <ReceivedRequestsSection 
              requests={receivedRequests}
              onAccept={handleAcceptRequest}
              onDecline={handleDeclineRequest}
              onReload={loadPeerReviewData}
            />
          )}
          
          {activeTab === 'sent' && (
            <MyRequestsSection 
              requests={sentRequests}
              onNewRequest={() => setActiveTab('new-request')}
              onReload={loadPeerReviewData}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Component for displaying received requests
function ReceivedRequestsSection({ requests, onAccept, onDecline, onReload }) {
  const [showDeclineModal, setShowDeclineModal] = useState(null)
  const [declineReason, setDeclineReason] = useState('')

  const pendingRequests = requests.filter(r => r.status === 'pending')
  const completedRequests = requests.filter(r => r.status === 'completed' || r.status === 'expired')

  const handleDeclineSubmit = (requestId) => {
    onDecline(requestId, declineReason)
    setShowDeclineModal(null)
    setDeclineReason('')
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Review Requests from Colleagues
          </h2>
          <p className="text-gray-600">
            People who have requested your feedback on their skills
          </p>
        </div>
        <button
          onClick={onReload}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <span className="material-symbols-outlined text-lg">refresh</span>
          Refresh
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-gray-400 text-2xl">inbox</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No review requests</h3>
          <p className="text-gray-500">
            When colleagues request your feedback on their skills, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
                Pending ({pendingRequests.length})
              </h3>
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <RequestCard 
                    key={request._id}
                    request={request}
                    onAccept={() => onAccept(request._id)}
                    onDecline={() => setShowDeclineModal(request._id)}
                    isPending={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Requests */}
          {completedRequests.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                Completed ({completedRequests.length})
              </h3>
              <div className="space-y-4">
                {completedRequests.map((request) => (
                  <RequestCard 
                    key={request._id}
                    request={request}
                    isPending={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Skip Review Request
            </h3>
            <p className="text-gray-600 mb-4">
              Why are you skipping this review? (optional):
            </p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="I'm not familiar with this skill area..."
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeclineModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeclineSubmit(showDeclineModal)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Skip for Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Component for displaying sent requests
function MyRequestsSection({ requests, onNewRequest, onReload }) {
  const pendingRequests = requests.filter(r => r.status === 'pending')
  const completedRequests = requests.filter(r => r.status === 'completed' || r.status === 'expired')

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Your Review Requests
          </h2>
          <p className="text-gray-600">
            Track requests you've sent and their status
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onReload}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
            Refresh
          </button>
          <button
            onClick={onNewRequest}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <span className="material-symbols-outlined">add</span>
            New Request
          </button>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-primary-600 text-2xl">send</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests sent yet</h3>
          <p className="text-gray-500 mb-6">
            Request feedback from colleagues to validate and improve your skills.
          </p>
          <button
            onClick={onNewRequest}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
          >
            Send Your First Request
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
                Awaiting Response ({pendingRequests.length})
              </h3>
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <SentRequestCard key={request._id} request={request} />
                ))}
              </div>
            </div>
          )}

          {/* Completed Requests */}
          {completedRequests.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                Completed ({completedRequests.length})
              </h3>
              <div className="space-y-4">
                {completedRequests.map((request) => (
                  <SentRequestCard key={request._id} request={request} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Component for individual request cards (received)
function RequestCard({ request, onAccept, onDecline, isPending }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-amber-600 bg-amber-50'
      case 'completed': return 'text-green-600 bg-green-50'
      case 'expired': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-gray-600">person</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                {request.reviewer?.name || request.reviewer?.email || 'Unknown User'}
              </h4>
              <p className="text-sm text-gray-500">
                Requested on {formatDate(request.createdAt)}
              </p>
            </div>
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request.status)}`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
          
          {request.message && (
            <p className="text-gray-700 mb-3 text-sm">{request.message}</p>
          )}
          
          {request.requestedSkills && request.requestedSkills.length > 0 && (
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">Skills to review:</p>
              <div className="flex flex-wrap gap-2">
                {request.requestedSkills.map((skill, index) => (
                  <span key={index} className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {request.deadline && (
            <p className="text-sm text-gray-500">
              <span className="material-symbols-outlined text-base mr-1">schedule</span>
              Due: {formatDate(request.deadline)}
            </p>
          )}
        </div>

        {isPending && (
          <div className="flex gap-2 ml-4">
            <button
              onClick={onDecline}
              className="px-3 py-1 text-sm border border-red-300 text-red-700 rounded hover:bg-red-50"
            >
              Skip
            </button>
            <button
              onClick={onAccept}
              className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              Start Review
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Component for individual sent request cards
function SentRequestCard({ request }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-amber-600 bg-amber-50'
      case 'completed': return 'text-green-600 bg-green-50'
      case 'expired': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-gray-600">person</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                {request.reviewee?.name || request.reviewee?.email || 'Unknown Reviewee'}
              </h4>
              <p className="text-sm text-gray-500">
                Sent on {formatDate(request.createdAt)}
              </p>
            </div>
          </div>
          
          {request.message && (
            <p className="text-gray-700 mb-3 text-sm">{request.message}</p>
          )}
          
          {request.requestedSkills && request.requestedSkills.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {request.requestedSkills.map((skill, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-500">
            {request.deadline && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">schedule</span>
                Due: {formatDate(request.deadline)}
              </span>
            )}
            
            {request.completedAt && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">check_circle</span>
                Completed: {formatDate(request.completedAt)}
              </span>
            )}
          </div>
        </div>

        <div className="ml-4">
          <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(request.status)}`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  )
}