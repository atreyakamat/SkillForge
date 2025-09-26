import React, { useState, useMemo } from 'react'

const JobMatches = ({ matches = [], onJobSelect, selectedJob }) => {
  const [filters, setFilters] = useState({
    matchScore: 0,
    experienceLevel: '',
    location: '',
    remote: 'all'
  })
  const [sortBy, setSortBy] = useState('matchScore') // matchScore, salary, relevance
  const [sortOrder, setSortOrder] = useState('desc')

  // Filter and sort matches
  const filteredMatches = useMemo(() => {
    let filtered = matches.filter(match => {
      const meetsScore = match.matchScore >= filters.matchScore
      const meetsExperience = !filters.experienceLevel || 
        match.job.experienceLevel === filters.experienceLevel
      const meetsLocation = !filters.location || 
        match.job.location.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
        match.job.location.state?.toLowerCase().includes(filters.location.toLowerCase())
      const meetsRemote = filters.remote === 'all' ||
        (filters.remote === 'yes' && match.job.location.remote) ||
        (filters.remote === 'no' && !match.job.location.remote)

      return meetsScore && meetsExperience && meetsLocation && meetsRemote
    })

    // Sort results
    filtered.sort((a, b) => {
      let valueA, valueB
      
      switch (sortBy) {
        case 'matchScore':
          valueA = a.matchScore
          valueB = b.matchScore
          break
        case 'salary':
          valueA = a.job.salary?.max || 0
          valueB = b.job.salary?.max || 0
          break
        case 'relevance':
          valueA = a.skillMatch?.score || 0
          valueB = b.skillMatch?.score || 0
          break
        default:
          valueA = a.matchScore
          valueB = b.matchScore
      }

      return sortOrder === 'desc' ? valueB - valueA : valueA - valueB
    })

    return filtered
  }, [matches, filters, sortBy, sortOrder])

  const getMatchScoreColor = (score) => {
    if (score >= 85) return 'text-green-600 bg-green-100'
    if (score >= 70) return 'text-blue-600 bg-blue-100'
    if (score >= 55) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getMatchScoreLabel = (score) => {
    if (score >= 85) return 'Excellent Match'
    if (score >= 70) return 'Good Match'
    if (score >= 55) return 'Fair Match'
    return 'Poor Match'
  }

  const getExperienceLevelIcon = (level) => {
    switch (level) {
      case 'junior': return '🌱'
      case 'mid': return '🌿'
      case 'senior': return '🌳'
      default: return '💼'
    }
  }

  const JobCard = ({ match, isSelected }) => {
    const { job, matchScore, skillMatch } = match

    return (
      <div
        className={`bg-white border rounded-xl p-6 cursor-pointer transition-all hover:shadow-md ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
        }`}
        onClick={() => onJobSelect(match)}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {job.company.logo ? (
                <img 
                  src={job.company.logo} 
                  alt={job.company.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {job.company.name.charAt(0)}
                  </span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {job.title}
              </h3>
            </div>
            <p className="text-gray-600 font-medium">{job.company.name}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
              <span className="flex items-center space-x-1">
                <span>📍</span>
                <span>
                  {job.location.remote && job.location.hybrid ? 'Hybrid' :
                   job.location.remote ? 'Remote' :
                   `${job.location.city}, ${job.location.state}`}
                </span>
              </span>
              <span className="flex items-center space-x-1">
                <span>{getExperienceLevelIcon(job.experienceLevel)}</span>
                <span className="capitalize">{job.experienceLevel}</span>
              </span>
            </div>
          </div>
          
          {/* Match Score */}
          <div className="text-center">
            <div className={`px-3 py-2 rounded-full font-semibold ${getMatchScoreColor(matchScore)}`}>
              {Math.round(matchScore)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {getMatchScoreLabel(matchScore)}
            </div>
          </div>
        </div>

        {/* Salary */}
        {job.salary && (
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Salary Range</span>
              <span className="font-medium text-gray-900">
                ${job.salary.min?.toLocaleString()} - ${job.salary.max?.toLocaleString()}
                {job.salary.equity?.offered && (
                  <span className="text-xs text-blue-600 ml-2">+ Equity</span>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Skill Match Breakdown */}
        {skillMatch && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Skill Alignment</span>
              <span className="text-sm text-gray-600">{skillMatch.score}%</span>
            </div>
            
            {/* Matched Skills */}
            {skillMatch.matched && skillMatch.matched.length > 0 && (
              <div className="mb-2">
                <div className="text-xs text-green-700 mb-1">Matched Skills</div>
                <div className="flex flex-wrap gap-1">
                  {skillMatch.matched.slice(0, 4).map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {skillMatch.matched.length > 4 && (
                    <span className="text-xs text-green-600">
                      +{skillMatch.matched.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {skillMatch.missing && skillMatch.missing.length > 0 && (
              <div>
                <div className="text-xs text-red-700 mb-1">Skills Needed</div>
                <div className="flex flex-wrap gap-1">
                  {skillMatch.missing.slice(0, 3).map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {skillMatch.missing.length > 3 && (
                    <span className="text-xs text-red-600">
                      +{skillMatch.missing.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Job Description Preview */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-600 line-clamp-2">
            {job.description}
          </p>
        </div>

        {/* Action Footer */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View Details
            </button>
            <button className="text-gray-600 hover:text-gray-700 text-sm">
              Save Job
            </button>
          </div>
          {job.application?.url && (
            <a 
              href={job.application.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              onClick={(e) => e.stopPropagation()}
            >
              Apply Now
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Job Matches ({filteredMatches.length})</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Match Score
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={filters.matchScore}
              onChange={(e) => setFilters(prev => ({ ...prev, matchScore: parseInt(e.target.value) }))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">{filters.matchScore}%+</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience Level
            </label>
            <select
              value={filters.experienceLevel}
              onChange={(e) => setFilters(prev => ({ ...prev, experienceLevel: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Levels</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid-Level</option>
              <option value="senior">Senior</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="City or state..."
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remote Work
            </label>
            <select
              value={filters.remote}
              onChange={(e) => setFilters(prev => ({ ...prev, remote: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Jobs</option>
              <option value="yes">Remote Only</option>
              <option value="no">On-site Only</option>
            </select>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="matchScore">Match Score</option>
                <option value="salary">Salary</option>
                <option value="relevance">Skill Relevance</option>
              </select>
            </div>
            
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="mt-6 p-2 border border-gray-300 rounded-md hover:bg-gray-50"
              title="Toggle sort order"
            >
              {sortOrder === 'desc' ? '↓' : '↑'}
            </button>
          </div>

          <button
            onClick={() => setFilters({ matchScore: 0, experienceLevel: '', location: '', remote: 'all' })}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Match Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Excellent Match', count: filteredMatches.filter(m => m.matchScore >= 85).length, color: 'text-green-600' },
          { label: 'Good Match', count: filteredMatches.filter(m => m.matchScore >= 70 && m.matchScore < 85).length, color: 'text-blue-600' },
          { label: 'Fair Match', count: filteredMatches.filter(m => m.matchScore >= 55 && m.matchScore < 70).length, color: 'text-yellow-600' },
          { label: 'Poor Match', count: filteredMatches.filter(m => m.matchScore < 55).length, color: 'text-red-600' }
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Job Cards */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMatches.map((match) => (
            <JobCard
              key={match.job.id}
              match={match}
              isSelected={selectedJob?.job.id === match.job.id}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Matching Jobs Found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or improving your skills to see more opportunities.
          </p>
          <button 
            onClick={() => setFilters({ matchScore: 0, experienceLevel: '', location: '', remote: 'all' })}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Load More Button */}
      {filteredMatches.length > 0 && filteredMatches.length >= 20 && (
        <div className="text-center">
          <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200">
            Load More Jobs
          </button>
        </div>
      )}
    </div>
  )
}

export default JobMatches


