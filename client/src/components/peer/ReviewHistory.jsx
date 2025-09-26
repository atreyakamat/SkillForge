import { useState, useEffect } from 'react'
import { peerAPI } from '../../services/peerAPI'

export default function ReviewHistory({ className = '' }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, given, received, pending
  const [sortBy, setSortBy] = useState('newest') // newest, oldest, status

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const data = await peerAPI.getReviewHistory()
        setReviews(data.reviews || [])
      } catch (error) {
        console.error('Failed to fetch review history:', error)
        // Fallback to mock data for development
        setReviews([
          {
            id: '1',
            type: 'received',
            status: 'completed',
            reviewer: {
              name: 'Alex Chen',
              avatar: null
            },
            reviewee: null,
            skillsAssessed: ['React', 'JavaScript'],
            overallRating: 4.2,
            createdAt: '2024-01-10T14:30:00Z',
            completedAt: '2024-01-12T10:15:00Z',
            feedback: 'Strong React fundamentals with room for improvement in advanced patterns.',
            ratings: {
              'React': 4.5,
              'JavaScript': 3.8
            }
          },
          {
            id: '2',
            type: 'given',
            status: 'completed',
            reviewer: null,
            reviewee: {
              name: 'Sarah Johnson',
              avatar: null
            },
            skillsAssessed: ['UX Design', 'Figma'],
            overallRating: 4.7,
            createdAt: '2024-01-08T09:20:00Z',
            completedAt: '2024-01-09T16:45:00Z',
            feedback: 'Excellent design skills with great attention to user experience.',
            ratings: {
              'UX Design': 4.8,
              'Figma': 4.5
            }
          },
          {
            id: '3',
            type: 'received',
            status: 'pending',
            reviewer: {
              name: 'Jamie Rodriguez',
              avatar: null
            },
            reviewee: null,
            skillsAssessed: ['Python', 'Data Analysis'],
            overallRating: null,
            createdAt: '2024-01-14T11:00:00Z',
            completedAt: null,
            feedback: null,
            ratings: {}
          },
          {
            id: '4',
            type: 'given',
            status: 'in_progress',
            reviewer: null,
            reviewee: {
              name: 'Mike Wilson',
              avatar: null
            },
            skillsAssessed: ['Node.js', 'MongoDB'],
            overallRating: null,
            createdAt: '2024-01-13T15:30:00Z',
            completedAt: null,
            feedback: null,
            ratings: {}
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const filteredAndSortedReviews = reviews
    .filter(review => {
      if (filter === 'all') return true
      if (filter === 'given') return review.type === 'given'
      if (filter === 'received') return review.type === 'received'
      if (filter === 'pending') return review.status === 'pending' || review.status === 'in_progress'
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt)
      }
      if (sortBy === 'status') {
        const statusOrder = { 'pending': 0, 'in_progress': 1, 'completed': 2 }
        return statusOrder[a.status] - statusOrder[b.status]
      }
      return 0
    })

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
      day: 'numeric'
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

    return <div className="flex">{stars}</div>
  }

  if (loading) {
    return (
      <div className={`bg-white border rounded-xl p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white border rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Review History
        </h3>
        <div className="text-sm text-gray-500">
          {reviews.length} total reviews
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Reviews</option>
            <option value="received">Reviews Received</option>
            <option value="given">Reviews Given</option>
            <option value="pending">Pending/In Progress</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="status">By Status</option>
          </select>
        </div>
      </div>

      {/* Reviews Timeline */}
      <div className="space-y-4">
        {filteredAndSortedReviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No reviews found matching your criteria.</p>
          </div>
        ) : (
          filteredAndSortedReviews.map(review => (
            <div
              key={review.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    {review.type === 'received' && review.reviewer?.avatar ? (
                      <img 
                        src={review.reviewer.avatar} 
                        alt={review.reviewer.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : review.type === 'given' && review.reviewee?.avatar ? (
                      <img 
                        src={review.reviewee.avatar} 
                        alt={review.reviewee.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-medium">
                        {review.type === 'received' 
                          ? review.reviewer?.name.split(' ').map(n => n[0]).join('')
                          : review.reviewee?.name.split(' ').map(n => n[0]).join('')
                        }
                      </span>
                    )}
                  </div>

                  {/* Review Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {review.type === 'received' 
                          ? `Review from ${review.reviewer?.name}`
                          : `Review for ${review.reviewee?.name}`
                        }
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(review.status)}`}>
                        {getStatusText(review.status)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(review.createdAt)}
                      {review.completedAt && review.status === 'completed' && (
                        <span> • Completed {formatDate(review.completedAt)}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Overall Rating */}
                {review.overallRating && (
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {renderRatingStars(review.overallRating)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {review.overallRating.toFixed(1)}
                    </div>
                  </div>
                )}
              </div>

              {/* Skills Assessed */}
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700 mb-2">Skills Assessed:</div>
                <div className="flex flex-wrap gap-2">
                  {review.skillsAssessed.map(skill => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                    >
                      {skill}
                      {review.ratings[skill] && (
                        <span className="ml-1 font-medium">
                          {review.ratings[skill].toFixed(1)}★
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              {review.feedback && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="text-sm font-medium text-gray-700 mb-1">Feedback:</div>
                  <p className="text-sm text-gray-600">{review.feedback}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                {review.status === 'pending' && review.type === 'given' && (
                  <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                    Complete Review
                  </button>
                )}
                {review.status === 'completed' && (
                  <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">
                    View Details
                  </button>
                )}
                {review.type === 'received' && review.status === 'completed' && (
                  <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm">
                    Thank Reviewer
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Summary */}
      {reviews.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {reviews.filter(r => r.type === 'received' && r.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Reviews Received</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {reviews.filter(r => r.type === 'given' && r.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Reviews Given</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {reviews.filter(r => r.status === 'pending' || r.status === 'in_progress').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {reviews.filter(r => r.type === 'received' && r.status === 'completed')
                  .reduce((acc, r) => acc + (r.overallRating || 0), 0) /
                  Math.max(reviews.filter(r => r.type === 'received' && r.status === 'completed').length, 1) || 0
                }.toFixed(1)
              </div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


