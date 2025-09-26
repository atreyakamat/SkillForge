import { useState, useEffect, useMemo } from 'react'
import { usePeerReview } from '../../contexts/PeerReviewContext.jsx'
import { useAssessmentContext } from '../../contexts/AssessmentContext.jsx'
import { useSkillContext } from '../../contexts/SkillContext.jsx'
import PeerMatch from './PeerMatch.jsx'

export default function ReviewRequest() {
  const { 
    requestReview, 
    getSuggestedReviewers, 
    getMyRequests,
    loading, 
    error 
  } = usePeerReview()
  
  const { assessments, fetchAssessments } = useAssessmentContext()
  const { searchSkills } = useSkillContext()
  
  const [step, setStep] = useState('select') // 'select', 'reviewers', 'compose', 'sent'
  const [selectedAssessments, setSelectedAssessments] = useState([])
  const [reviewers, setReviewers] = useState([])
  const [requestData, setRequestData] = useState({
    message: '',
    dueDate: '',
    priority: 'normal',
    anonymous: false,
    specificQuestions: []
  })
  const [suggestedReviewers, setSuggestedReviewers] = useState([])
  const [validationErrors, setValidationErrors] = useState({})

  // Load user assessments
  useEffect(() => {
    fetchAssessments()
  }, [fetchAssessments])

  // Get suggested reviewers when assessments are selected
  useEffect(() => {
    const loadSuggestedReviewers = async () => {
      if (selectedAssessments.length > 0) {
        try {
          const skills = selectedAssessments.map(a => a.skill.name)
          const suggestions = await getSuggestedReviewers({
            skillName: skills[0], // Use first skill for suggestions
            skillLevel: 'intermediate',
            minRating: 4.0,
            limit: 10
          })
          setSuggestedReviewers(suggestions.reviewers || [])
        } catch (error) {
          console.error('Failed to load suggested reviewers:', error)
        }
      }
    }
    
    loadSuggestedReviewers()
  }, [selectedAssessments, getSuggestedReviewers])

  // Set default due date (1 week from now)
  useEffect(() => {
    const defaultDate = new Date()
    defaultDate.setDate(defaultDate.getDate() + 7)
    setRequestData(prev => ({
      ...prev,
      dueDate: defaultDate.toISOString().split('T')[0]
    }))
  }, [])

  // Toggle assessment selection
  const toggleAssessment = (assessment) => {
    setSelectedAssessments(prev => {
      const exists = prev.find(a => a._id === assessment._id)
      if (exists) {
        return prev.filter(a => a._id !== assessment._id)
      } else {
        return [...prev, assessment]
      }
    })
  }

  // Add reviewer
  const addReviewer = (reviewer) => {
    setReviewers(prev => {
      const exists = prev.find(r => r._id === reviewer._id || r.email === reviewer.email)
      if (!exists) {
        return [...prev, reviewer]
      }
      return prev
    })
  }

  // Remove reviewer
  const removeReviewer = (reviewerId) => {
    setReviewers(prev => prev.filter(r => r._id !== reviewerId))
  }

  // Add custom question
  const addCustomQuestion = (question) => {
    if (!question.trim()) return
    setRequestData(prev => ({
      ...prev,
      specificQuestions: [...prev.specificQuestions, question]
    }))
  }

  // Remove custom question
  const removeCustomQuestion = (index) => {
    setRequestData(prev => ({
      ...prev,
      specificQuestions: prev.specificQuestions.filter((_, i) => i !== index)
    }))
  }

  // Validate request
  const validateRequest = () => {
    const errors = {}
    
    if (selectedAssessments.length === 0) {
      errors.assessments = 'Please select at least one skill assessment to review'
    }
    
    if (reviewers.length === 0) {
      errors.reviewers = 'Please select at least one reviewer'
    }
    
    if (!requestData.message.trim() || requestData.message.length < 20) {
      errors.message = 'Please provide at least 20 characters explaining what you need reviewed'
    }
    
    if (!requestData.dueDate) {
      errors.dueDate = 'Please set a due date for the review'
    } else {
      const dueDate = new Date(requestData.dueDate)
      const today = new Date()
      if (dueDate <= today) {
        errors.dueDate = 'Due date must be in the future'
      }
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Submit request
  const handleSubmit = async () => {
    if (!validateRequest()) {
      return
    }
    
    try {
      const requests = reviewers.map(reviewer => ({
        assessmentId: selectedAssessments[0]._id, // For now, one assessment per request
        reviewerId: reviewer._id,
        message: requestData.message,
        dueDate: new Date(requestData.dueDate)
      }))
      
      // Send requests to all selected reviewers
      await Promise.all(requests.map(req => requestReview(req)))
      
      setStep('sent')
    } catch (error) {
      console.error('Failed to send review requests:', error)
    }
  }

  // Recent assessments for quick selection
  const recentAssessments = useMemo(() => {
    return assessments
      .filter(a => a.validationStatus === 'pending') // Only unvalidated assessments
      .sort((a, b) => new Date(b.assessmentDate) - new Date(a.assessmentDate))
      .slice(0, 10)
  }, [assessments])

  // Step 1: Select assessments to review
  if (step === 'select') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Request Peer Review
            </h2>
            <p className="text-gray-600">
              Select which skill assessments you'd like colleagues to review
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-semibold">Your Recent Assessments</h3>
              
              {loading.assessments ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading assessments...</p>
                </div>
              ) : recentAssessments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No assessments available for review</p>
                  <p className="text-sm text-gray-500">
                    Complete some skill assessments first to request peer reviews
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {recentAssessments.map(assessment => (
                    <div
                      key={assessment._id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedAssessments.find(a => a._id === assessment._id)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleAssessment(assessment)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={!!selectedAssessments.find(a => a._id === assessment._id)}
                            onChange={() => toggleAssessment(assessment)}
                            className="rounded"
                          />
                          <div>
                            <h4 className="font-medium">{assessment.skill?.name}</h4>
                            <p className="text-sm text-gray-600">
                              {assessment.skill?.category} • Self-rated: {assessment.selfRating}/10
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            {new Date(assessment.assessmentDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-amber-600">
                            {assessment.validationStatus}
                          </div>
                        </div>
                      </div>
                      
                      {assessment.evidence && (
                        <div className="mt-3 text-sm text-gray-700">
                          <p className="line-clamp-2">{assessment.evidence}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {validationErrors.assessments && (
                <p className="text-red-600 text-sm">{validationErrors.assessments}</p>
              )}
            </div>
          </div>

          <div className="p-6 border-t bg-gray-50 flex justify-between">
            <div className="text-sm text-gray-600">
              {selectedAssessments.length} assessment(s) selected
            </div>
            <button
              onClick={() => setStep('reviewers')}
              disabled={selectedAssessments.length === 0}
              className="bg-primary-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Select Reviewers
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Select reviewers
  if (step === 'reviewers') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Select Reviewers
            </h2>
            <p className="text-gray-600">
              Choose colleagues who can provide valuable feedback
            </p>
          </div>

          <div className="p-6">
            <PeerMatch
              selectedSkills={selectedAssessments.map(a => a.skill.name)}
              onReviewerSelect={addReviewer}
              suggestedReviewers={suggestedReviewers}
            />
            
            {/* Selected Reviewers */}
            {reviewers.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Selected Reviewers ({reviewers.length})</h3>
                <div className="grid gap-3">
                  {reviewers.map(reviewer => (
                    <div key={reviewer._id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium">
                            {reviewer.name?.charAt(0) || reviewer.email?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{reviewer.name || 'Anonymous'}</div>
                          <div className="text-sm text-gray-600">{reviewer.email}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeReviewer(reviewer._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {validationErrors.reviewers && (
              <p className="text-red-600 text-sm mt-3">{validationErrors.reviewers}</p>
            )}
          </div>

          <div className="p-6 border-t bg-gray-50 flex justify-between">
            <button
              onClick={() => setStep('select')}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100"
            >
              Back
            </button>
            <button
              onClick={() => setStep('compose')}
              disabled={reviewers.length === 0}
              className="bg-primary-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Compose Message
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Step 3: Compose request message
  if (step === 'compose') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Compose Review Request
            </h2>
            <p className="text-gray-600">
              Provide context and specific questions for your reviewers
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Request Details Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Review Summary</h3>
              <div className="text-sm space-y-1">
                <div>Skills: {selectedAssessments.map(a => a.skill.name).join(', ')}</div>
                <div>Reviewers: {reviewers.length} selected</div>
              </div>
            </div>

            {/* Personal Message */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Personal Message *
              </label>
              <textarea
                value={requestData.message}
                onChange={(e) => setRequestData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Hi! I've been working on improving my skills and would really value your feedback on my recent assessments. Please focus on..."
                className="w-full border rounded-lg px-3 py-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={5}
              />
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-gray-600">
                  {requestData.message.length} characters (minimum 20)
                </div>
                {validationErrors.message && (
                  <p className="text-red-600 text-sm">{validationErrors.message}</p>
                )}
              </div>
            </div>

            {/* Specific Questions */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Specific Questions (Optional)
              </label>
              <div className="space-y-2">
                {requestData.specificQuestions.map((question, index) => (
                  <div key={index} className="flex items-center gap-2 bg-blue-50 rounded px-3 py-2">
                    <span className="flex-1 text-sm">{question}</span>
                    <button
                      onClick={() => removeCustomQuestion(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., How accurate is my self-assessment for React?"
                    className="flex-1 border rounded px-3 py-2 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addCustomQuestion(e.target.value)
                        e.target.value = ''
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.previousElementSibling
                      addCustomQuestion(input.value)
                      input.value = ''
                    }}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                  >
                    Add Question
                  </button>
                </div>
              </div>
            </div>

            {/* Request Settings */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={requestData.dueDate}
                  onChange={(e) => setRequestData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {validationErrors.dueDate && (
                  <p className="text-red-600 text-sm mt-1">{validationErrors.dueDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Priority Level
                </label>
                <select
                  value={requestData.priority}
                  onChange={(e) => setRequestData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="low">Low - When you have time</option>
                  <option value="normal">Normal - Within a week</option>
                  <option value="high">High - As soon as possible</option>
                  <option value="urgent">Urgent - Very time-sensitive</option>
                </select>
              </div>
            </div>

            {/* Privacy Options */}
            <div>
              <h3 className="font-semibold mb-3">Privacy Options</h3>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={requestData.anonymous}
                  onChange={(e) => setRequestData(prev => ({ ...prev, anonymous: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">
                  Allow anonymous reviews
                  <span className="block text-gray-600 text-xs">
                    Reviewers can choose to provide feedback anonymously
                  </span>
                </span>
              </label>
            </div>
          </div>

          <div className="p-6 border-t bg-gray-50 flex justify-between">
            <button
              onClick={() => setStep('reviewers')}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading.requesting}
              className="bg-primary-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
            >
              {loading.requesting ? 'Sending Requests...' : `Send Request to ${reviewers.length} Reviewer(s)`}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Step 4: Confirmation
  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="bg-white border rounded-xl shadow-sm p-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.5l-8-5 8-5 8 5-8 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12.5V18" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review Requests Sent!
        </h2>
        <p className="text-gray-600 mb-6">
          Your review requests have been sent to {reviewers.length} reviewer(s). 
          You'll receive notifications when they respond.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => {
              setStep('select')
              setSelectedAssessments([])
              setReviewers([])
              setRequestData({
                message: '',
                dueDate: '',
                priority: 'normal',
                anonymous: false,
                specificQuestions: []
              })
            }}
            className="w-full bg-primary-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-primary-700"
          >
            Send Another Request
          </button>
          <button
            className="w-full border border-gray-300 text-gray-700 py-2 px-6 rounded-lg font-medium hover:bg-gray-100"
          >
            View My Requests
          </button>
        </div>
      </div>
    </div>
  )
}


