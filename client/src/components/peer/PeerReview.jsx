import { useState, useEffect, useMemo } from 'react'
import { usePeerReview } from '../../contexts/PeerReviewContext.jsx'
import { useAssessmentContext } from '../../contexts/AssessmentContext.jsx'
import StarRating from '../ui/StarRating.jsx'
import ProgressBar from '../ui/ProgressBar.jsx'

export default function PeerReview({ requestId, onComplete, onCancel }) {
  const { 
    submitReview, 
    getReceivedRequests, 
    acceptRequest, 
    declineRequest,
    loading, 
    error 
  } = usePeerReview()
  
  const { fetchAssessments } = useAssessmentContext()
  
  const [currentRequest, setCurrentRequest] = useState(null)
  const [reviewStep, setReviewStep] = useState('request') // 'request', 'review', 'submitted'
  const [reviewData, setReviewData] = useState({
    rating: 5,
    feedback: '',
    strengths: [],
    improvements: [],
    skillEvaluation: {},
    anonymous: false,
    confidence: 5
  })
  const [validationErrors, setValidationErrors] = useState({})

  // Fetch request details
  useEffect(() => {
    const loadRequestData = async () => {
      try {
        const requests = await getReceivedRequests({ status: 'accepted' })
        const request = requests.find(r => r._id === requestId)
        if (request) {
          setCurrentRequest(request)
          // Initialize skill evaluation structure
          const skillEval = {}
          request.assessments?.forEach(assessment => {
            skillEval[assessment.skill._id] = {
              skillName: assessment.skill.name,
              selfRating: assessment.selfRating,
              peerRating: assessment.selfRating, // Start with self-rating
              justification: '',
              confidence: assessment.confidence || 5
            }
          })
          setReviewData(prev => ({ ...prev, skillEvaluation: skillEval }))
        }
      } catch (error) {
        console.error('Failed to load request:', error)
      }
    }

    if (requestId) {
      loadRequestData()
    }
  }, [requestId, getReceivedRequests])

  // Handle request acceptance
  const handleAcceptRequest = async () => {
    try {
      await acceptRequest(requestId)
      setReviewStep('review')
    } catch (error) {
      console.error('Failed to accept request:', error)
    }
  }

  // Handle request decline
  const handleDeclineRequest = async (reason = '') => {
    try {
      await declineRequest(requestId, { reason })
      onCancel?.()
    } catch (error) {
      console.error('Failed to decline request:', error)
    }
  }

  // Update skill evaluation
  const updateSkillEvaluation = (skillId, field, value) => {
    setReviewData(prev => ({
      ...prev,
      skillEvaluation: {
        ...prev.skillEvaluation,
        [skillId]: {
          ...prev.skillEvaluation[skillId],
          [field]: value
        }
      }
    }))
  }

  // Add strength or improvement
  const addFeedbackItem = (type, item) => {
    if (!item.trim()) return
    
    setReviewData(prev => ({
      ...prev,
      [type]: [...prev[type], item]
    }))
  }

  // Remove feedback item
  const removeFeedbackItem = (type, index) => {
    setReviewData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  // Validate review form
  const validateReview = () => {
    const errors = {}
    
    if (reviewData.rating < 1 || reviewData.rating > 10) {
      errors.rating = 'Rating must be between 1 and 10'
    }
    
    if (!reviewData.feedback.trim() || reviewData.feedback.length < 20) {
      errors.feedback = 'Please provide at least 20 characters of feedback'
    }
    
    // Validate skill evaluations
    Object.entries(reviewData.skillEvaluation).forEach(([skillId, evaluation]) => {
      const ratingDiff = Math.abs(evaluation.peerRating - evaluation.selfRating)
      if (ratingDiff >= 3 && !evaluation.justification.trim()) {
        errors[`skill_${skillId}`] = `Please justify the rating difference for ${evaluation.skillName}`
      }
    })
    
    if (reviewData.strengths.length === 0) {
      errors.strengths = 'Please identify at least one strength'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Submit review
  const handleSubmitReview = async () => {
    if (!validateReview()) {
      return
    }
    
    try {
      await submitReview(requestId, reviewData)
      setReviewStep('submitted')
      onComplete?.()
    } catch (error) {
      console.error('Failed to submit review:', error)
    }
  }

  // Calculate review progress
  const reviewProgress = useMemo(() => {
    let completed = 0
    let total = 6 // rating, feedback, strengths, improvements, skills, confidence
    
    if (reviewData.rating > 0) completed++
    if (reviewData.feedback.length >= 20) completed++
    if (reviewData.strengths.length > 0) completed++
    if (reviewData.improvements.length > 0) completed++
    if (reviewData.confidence > 0) completed++
    
    // Check skill evaluations
    const skillsComplete = Object.values(reviewData.skillEvaluation).every(evaluation => {
      const ratingDiff = Math.abs(evaluation.peerRating - evaluation.selfRating)
      return ratingDiff < 3 || evaluation.justification.trim().length > 0
    })
    if (skillsComplete) completed++
    
    return Math.round((completed / total) * 100)
  }, [reviewData])

  if (!currentRequest) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading review request...</p>
        </div>
      </div>
    )
  }

  // Request acceptance/decline step
  if (reviewStep === 'request') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Peer Review Request
            </h2>
            <p className="text-gray-600">
              {currentRequest.requester?.name} has requested your feedback
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Request Details</h3>
              <p className="text-gray-700 mb-3">{currentRequest.message}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Due: {new Date(currentRequest.dueDate).toLocaleDateString()}</span>
                <span>Skills: {currentRequest.assessments?.length || 0}</span>
              </div>
            </div>

            {currentRequest.assessments && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Skills to Review</h3>
                <div className="space-y-2">
                  {currentRequest.assessments.map(assessment => (
                    <div key={assessment._id} className="flex justify-between items-center">
                      <span className="font-medium">{assessment.skill.name}</span>
                      <span className="text-sm text-gray-600">
                        Self-rated: {assessment.selfRating}/10
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAcceptRequest}
              disabled={loading.accepting}
              className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
            >
              {loading.accepting ? 'Accepting...' : 'Accept Review Request'}
            </button>
            <button
              onClick={() => handleDeclineRequest()}
              disabled={loading.declining}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50"
            >
              {loading.declining ? 'Declining...' : 'Decline'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Review completion confirmation
  if (reviewStep === 'submitted') {
    return (
      <div className="max-w-lg mx-auto text-center">
        <div className="bg-white border rounded-xl p-8 shadow-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for providing valuable feedback to {currentRequest.requester?.name}.
          </p>
          <button
            onClick={() => onComplete?.()}
            className="bg-primary-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-primary-700"
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  // Main review interface
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white border rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Reviewing {currentRequest.requester?.name}
              </h2>
              <p className="text-gray-600">
                Provide constructive feedback on their skill assessments
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Progress</div>
              <ProgressBar progress={reviewProgress} className="w-24" />
              <div className="text-xs text-gray-500 mt-1">{reviewProgress}%</div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Overall Rating */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Overall Performance Rating</h3>
            <div className="flex items-center gap-4">
              <StarRating
                value={reviewData.rating}
                onChange={(rating) => setReviewData(prev => ({ ...prev, rating }))}
                size="lg"
                showLabels
              />
              <span className="text-lg font-medium">{reviewData.rating}/10</span>
            </div>
            {validationErrors.rating && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.rating}</p>
            )}
          </div>

          {/* Skill Evaluations */}
          <div className="space-y-4">
            <h3 className="font-semibold">Individual Skill Assessment</h3>
            {Object.entries(reviewData.skillEvaluation).map(([skillId, evaluation]) => (
              <div key={skillId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{evaluation.skillName}</h4>
                  <span className="text-sm text-gray-600">
                    Self-rated: {evaluation.selfRating}/10
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Rating</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={evaluation.peerRating}
                        onChange={(e) => updateSkillEvaluation(skillId, 'peerRating', Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-12">
                        {evaluation.peerRating}/10
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Beginner</span>
                      <span>Expert</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Confidence</label>
                    <StarRating
                      value={evaluation.confidence}
                      onChange={(confidence) => updateSkillEvaluation(skillId, 'confidence', confidence)}
                      size="sm"
                    />
                  </div>
                </div>

                {Math.abs(evaluation.peerRating - evaluation.selfRating) >= 3 && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2 text-amber-700">
                      🔍 Justification Required (Rating differs by 3+ points)
                    </label>
                    <textarea
                      value={evaluation.justification}
                      onChange={(e) => updateSkillEvaluation(skillId, 'justification', e.target.value)}
                      placeholder="Explain why your rating differs significantly from their self-assessment..."
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      rows={3}
                    />
                    {validationErrors[`skill_${skillId}`] && (
                      <p className="text-red-600 text-sm mt-1">{validationErrors[`skill_${skillId}`]}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Feedback Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="text-green-600">💪</span>
                Strengths
              </h3>
              <div className="space-y-2">
                {reviewData.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center gap-2 bg-green-50 rounded px-3 py-2">
                    <span className="flex-1 text-sm">{strength}</span>
                    <button
                      onClick={() => removeFeedbackItem('strengths', index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a strength..."
                    className="flex-1 border rounded px-3 py-2 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addFeedbackItem('strengths', e.target.value)
                        e.target.value = ''
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.previousElementSibling
                      addFeedbackItem('strengths', input.value)
                      input.value = ''
                    }}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                  >
                    Add
                  </button>
                </div>
              </div>
              {validationErrors.strengths && (
                <p className="text-red-600 text-sm">{validationErrors.strengths}</p>
              )}
            </div>

            {/* Areas for Improvement */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="text-amber-600">🎯</span>
                Areas for Improvement
              </h3>
              <div className="space-y-2">
                {reviewData.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-center gap-2 bg-amber-50 rounded px-3 py-2">
                    <span className="flex-1 text-sm">{improvement}</span>
                    <button
                      onClick={() => removeFeedbackItem('improvements', index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add an area for improvement..."
                    className="flex-1 border rounded px-3 py-2 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addFeedbackItem('improvements', e.target.value)
                        e.target.value = ''
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.previousElementSibling
                      addFeedbackItem('improvements', input.value)
                      input.value = ''
                    }}
                    className="px-3 py-2 bg-amber-100 text-amber-700 rounded text-sm hover:bg-amber-200"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Feedback */}
          <div>
            <h3 className="font-semibold mb-3">Detailed Feedback</h3>
            <textarea
              value={reviewData.feedback}
              onChange={(e) => setReviewData(prev => ({ ...prev, feedback: e.target.value }))}
              placeholder="Provide detailed, constructive feedback about their skills, work quality, collaboration, and areas for growth..."
              className="w-full border rounded-lg px-3 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={6}
            />
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-gray-600">
                {reviewData.feedback.length} characters (minimum 20)
              </div>
              {validationErrors.feedback && (
                <p className="text-red-600 text-sm">{validationErrors.feedback}</p>
              )}
            </div>
          </div>

          {/* Review Options */}
          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
            <div>
              <h3 className="font-semibold mb-3">Review Confidence</h3>
              <div className="space-y-2">
                <StarRating
                  value={reviewData.confidence}
                  onChange={(confidence) => setReviewData(prev => ({ ...prev, confidence }))}
                  size="md"
                />
                <p className="text-sm text-gray-600">
                  How confident are you in your assessment?
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Privacy Options</h3>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={reviewData.anonymous}
                  onChange={(e) => setReviewData(prev => ({ ...prev, anonymous: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">
                  Submit anonymously
                  <span className="block text-gray-600 text-xs">
                    Your identity will be hidden from the reviewee
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="p-6 border-t bg-gray-50 flex gap-3">
          <button
            onClick={() => onCancel?.()}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitReview}
            disabled={loading.submitting || reviewProgress < 70}
            className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading.submitting ? 'Submitting Review...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  )
}


