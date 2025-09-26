import { useState } from 'react'
import { peerAPI } from '../../services/peerAPI'

export default function ReviewCard({ 
  review, 
  showActions = true, 
  compact = false,
  onClick = null,
  className = '' 
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [submittingFeedback, setSubmittingFeedback] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'in_progress':
        return 'bg-blue-100 text-blue-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'in_progress':
        return 'In Progress'
      case 'pending':
        return 'Pending'
      default:
        return 'Unknown'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderRatingStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>)
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>)
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} className="text-gray-300">★</span>)
    }

    return <div className="flex items-center">{stars}</div>
  }

  const handleFeedback = async (helpful) => {
    try {
      setSubmittingFeedback(true)
      await peerAPI.submitReviewFeedback(review.id, { helpful })
      setFeedbackSubmitted(true)
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      // Could show error toast here
    } finally {
      setSubmittingFeedback(false)
    }
  }

  const handleThankReviewer = async () => {
    try {
      await peerAPI.thankReviewer(review.id)
      // Could show success toast here
      alert('Thank you message sent!')
    } catch (error) {
      console.error('Failed to thank reviewer:', error)
      alert('Failed to send thank you message')
    }
  }

  const displayName = review.type === 'received' 
    ? (review.anonymous ? 'Anonymous Reviewer' : review.reviewer?.name)
    : review.reviewee?.name

  const avatar = review.type === 'received' 
    ? review.reviewer?.avatar 
    : review.reviewee?.avatar

  return (
    <div 
      className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            {avatar ? (
              <img 
                src={avatar} 
                alt={displayName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-gray-600 font-medium text-sm">
                {displayName?.split(' ').map(n => n[0]).join('') || '?'}
              </span>
            )}
          </div>

          {/* Review Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-gray-900 text-sm truncate">
                {displayName || 'Unknown User'}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ${getStatusColor(review.status)}`}>
                {getStatusText(review.status)}
              </span>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {review.type === 'received' ? 'Reviewed you' : 'You reviewed'}
              {!compact && (
                <span> • {formatDate(review.createdAt)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Overall Rating */}
        {review.overallRating && (
          <div className="text-right flex-shrink-0">
            {compact ? (
              <div className="text-sm font-medium text-gray-900">
                {review.overallRating.toFixed(1)}★
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1">
                  {renderRatingStars(review.overallRating)}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {review.overallRating.toFixed(1)}/5
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Skills Summary */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-1">
          {review.skillsAssessed?.slice(0, compact ? 2 : 4).map(skill => (
            <span
              key={skill}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
            >
              {skill}
              {review.ratings?.[skill] && (
                <span className="ml-1 font-medium">
                  {review.ratings[skill].toFixed(1)}
                </span>
              )}
            </span>
          ))}
          {review.skillsAssessed?.length > (compact ? 2 : 4) && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              +{review.skillsAssessed.length - (compact ? 2 : 4)} more
            </span>
          )}
        </div>
      </div>

      {/* Feedback Preview */}
      {review.feedback && (
        <div className="mb-3">
          <p className={`text-sm text-gray-600 ${
            compact && !isExpanded ? 'line-clamp-2' : ''
          }`}>
            {isExpanded || !compact || review.feedback.length <= 100
              ? review.feedback
              : `${review.feedback.substring(0, 100)}...`
            }
          </p>
          {compact && review.feedback.length > 100 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
              className="text-xs text-blue-600 hover:text-blue-700 mt-1"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}

      {/* Detailed Skills (Non-compact mode) */}
      {!compact && review.ratings && Object.keys(review.ratings).length > 0 && (
        <div className="mb-3 bg-gray-50 p-3 rounded-md">
          <div className="text-sm font-medium text-gray-700 mb-2">Skill Ratings:</div>
          <div className="space-y-2">
            {Object.entries(review.ratings).map(([skill, rating]) => (
              <div key={skill} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{skill}</span>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {renderRatingStars(rating)}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {rating.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && review.status === 'completed' && (
        <div className="flex gap-2 pt-3 border-t border-gray-200">
          {review.type === 'received' && !feedbackSubmitted && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleFeedback(true)
                }}
                disabled={submittingFeedback}
                className="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Helpful
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleFeedback(false)
                }}
                disabled={submittingFeedback}
                className="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Not Helpful
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleThankReviewer()
                }}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Thank Reviewer
              </button>
            </>
          )}
          
          {review.type === 'given' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                // Navigate to review details or edit
              }}
              className="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              View Details
            </button>
          )}

          {feedbackSubmitted && (
            <span className="px-3 py-1 text-xs text-green-600 bg-green-50 rounded">
              Feedback submitted
            </span>
          )}
        </div>
      )}

      {/* Pending Actions */}
      {review.status === 'pending' && review.type === 'given' && (
        <div className="pt-3 border-t border-gray-200">
          <button
            onClick={(e) => {
              e.stopPropagation()
              // Navigate to complete review
            }}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Complete Review
          </button>
        </div>
      )}
    </div>
  )
}


