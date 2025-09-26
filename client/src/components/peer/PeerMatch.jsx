import { useState, useMemo, useEffect } from 'react'
import { peerAPI } from '../../services/peerAPI'

export default function PeerMatch({ 
  targetSkills = [], 
  onSelectReviewer, 
  selectedReviewers = [],
  className = '' 
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    minRating: 0,
    availability: 'all',
    skillMatch: 'any'
  })
  const [reviewers, setReviewers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showManualInvite, setShowManualInvite] = useState(false)
  const [manualEmail, setManualEmail] = useState('')
  const [manualMessage, setManualMessage] = useState('')

  // Fetch potential reviewers
  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        setLoading(true)
        const data = await peerAPI.findReviewers({ skills: targetSkills })
        setReviewers(data.reviewers || [])
      } catch (error) {
        console.error('Failed to fetch reviewers:', error)
        // Fallback to mock data for development
        setReviewers([
          {
            id: '1',
            name: 'Alex Chen',
            email: 'alex@example.com',
            avatar: null,
            skills: ['React', 'Node.js', 'TypeScript'],
            rating: 4.8,
            reviewCount: 23,
            availability: 'available',
            lastActive: '2024-01-15T10:30:00Z',
            bio: 'Senior Full-Stack Developer with 5+ years experience'
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            avatar: null,
            skills: ['UX Design', 'JavaScript', 'Figma'],
            rating: 4.9,
            reviewCount: 31,
            availability: 'busy',
            lastActive: '2024-01-14T15:20:00Z',
            bio: 'UX/UI Designer specializing in web applications'
          },
          {
            id: '3',
            name: 'Jamie Rodriguez',
            email: 'jamie@example.com',
            avatar: null,
            skills: ['Python', 'Data Science', 'Machine Learning'],
            rating: 4.7,
            reviewCount: 18,
            availability: 'available',
            lastActive: '2024-01-15T09:45:00Z',
            bio: 'Data Scientist with expertise in ML algorithms'
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchReviewers()
  }, [targetSkills])

  // Calculate match score for each reviewer
  const processedReviewers = useMemo(() => {
    return reviewers.map(reviewer => {
      const skillOverlap = reviewer.skills.filter(skill => 
        targetSkills.some(target => 
          skill.toLowerCase().includes(target.toLowerCase()) ||
          target.toLowerCase().includes(skill.toLowerCase())
        )
      )
      
      const matchScore = targetSkills.length > 0 
        ? (skillOverlap.length / targetSkills.length) * 100
        : 0

      return {
        ...reviewer,
        skillOverlap,
        matchScore: Math.round(matchScore)
      }
    })
  }, [reviewers, targetSkills])

  // Filter and sort reviewers
  const filteredReviewers = useMemo(() => {
    return processedReviewers
      .filter(reviewer => {
        // Search filter
        if (searchTerm) {
          const search = searchTerm.toLowerCase()
          const matchesSearch = 
            reviewer.name.toLowerCase().includes(search) ||
            reviewer.email.toLowerCase().includes(search) ||
            reviewer.skills.some(skill => skill.toLowerCase().includes(search)) ||
            reviewer.bio?.toLowerCase().includes(search)
          
          if (!matchesSearch) return false
        }

        // Rating filter
        if (filters.minRating > 0 && reviewer.rating < filters.minRating) {
          return false
        }

        // Availability filter
        if (filters.availability !== 'all' && reviewer.availability !== filters.availability) {
          return false
        }

        // Skill match filter
        if (filters.skillMatch === 'exact' && reviewer.matchScore < 100) {
          return false
        } else if (filters.skillMatch === 'high' && reviewer.matchScore < 50) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        // Sort by match score first, then by rating
        if (a.matchScore !== b.matchScore) {
          return b.matchScore - a.matchScore
        }
        return b.rating - a.rating
      })
  }, [processedReviewers, searchTerm, filters])

  const handleSelectReviewer = (reviewer) => {
    if (onSelectReviewer) {
      onSelectReviewer(reviewer)
    }
  }

  const handleManualInvite = async () => {
    if (!manualEmail.trim()) return

    try {
      await peerAPI.inviteReviewer({
        email: manualEmail,
        message: manualMessage,
        skills: targetSkills
      })
      
      setManualEmail('')
      setManualMessage('')
      setShowManualInvite(false)
      
      // Could show success toast here
      alert('Invitation sent successfully!')
    } catch (error) {
      console.error('Failed to send invitation:', error)
      alert('Failed to send invitation. Please try again.')
    }
  }

  const isSelected = (reviewerId) => {
    return selectedReviewers.some(r => r.id === reviewerId)
  }

  if (loading) {
    return (
      <div className={`bg-white border rounded-xl p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
          Find Reviewers
        </h3>
        <button
          onClick={() => setShowManualInvite(!showManualInvite)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Invite by Email
        </button>
      </div>

      {/* Manual Invite Section */}
      {showManualInvite && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Invite External Reviewer</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={manualEmail}
                onChange={(e) => setManualEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="reviewer@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Personal Message (Optional)
              </label>
              <textarea
                value={manualMessage}
                onChange={(e) => setManualMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Hi! I'd like you to review my skills in..."
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleManualInvite}
                disabled={!manualEmail.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Invitation
              </button>
              <button
                onClick={() => setShowManualInvite(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, skills, or bio..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Rating
            </label>
            <select
              value={filters.minRating}
              onChange={(e) => setFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Any Rating</option>
              <option value={4.5}>4.5+ Stars</option>
              <option value={4.0}>4.0+ Stars</option>
              <option value={3.5}>3.5+ Stars</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability
            </label>
            <select
              value={filters.availability}
              onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skill Match
            </label>
            <select
              value={filters.skillMatch}
              onChange={(e) => setFilters(prev => ({ ...prev, skillMatch: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="any">Any Match</option>
              <option value="high">High Match (50%+)</option>
              <option value="exact">Exact Match (100%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredReviewers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No reviewers found matching your criteria.</p>
            <p className="text-sm mt-1">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          filteredReviewers.map(reviewer => (
            <div
              key={reviewer.id}
              className={`border rounded-lg p-4 transition-colors ${
                isSelected(reviewer.id) 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      {reviewer.avatar ? (
                        <img 
                          src={reviewer.avatar} 
                          alt={reviewer.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 font-medium">
                          {reviewer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{reviewer.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>★ {reviewer.rating.toFixed(1)}</span>
                        <span>•</span>
                        <span>{reviewer.reviewCount} reviews</span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          reviewer.availability === 'available' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {reviewer.availability}
                        </span>
                      </div>
                    </div>
                  </div>

                  {reviewer.bio && (
                    <p className="text-sm text-gray-600 mb-3">{reviewer.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-3">
                    {reviewer.skills.map(skill => (
                      <span
                        key={skill}
                        className={`px-2 py-1 rounded-full text-xs ${
                          reviewer.skillOverlap.includes(skill)
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {reviewer.matchScore > 0 && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-blue-600">
                        {reviewer.matchScore}% skill match
                      </span>
                      {reviewer.skillOverlap.length > 0 && (
                        <span className="ml-2">
                          ({reviewer.skillOverlap.join(', ')})
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleSelectReviewer(reviewer)}
                  disabled={isSelected(reviewer.id)}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                    isSelected(reviewer.id)
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isSelected(reviewer.id) ? 'Selected' : 'Select'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {selectedReviewers.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {selectedReviewers.length} reviewer{selectedReviewers.length > 1 ? 's' : ''} selected
          </p>
        </div>
      )}
    </div>
  )
}


