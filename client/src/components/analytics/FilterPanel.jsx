import React from 'react'

const FilterPanel = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    onFiltersChange({
      experienceLevel: '',
      location: '',
      remote: null,
      targetRole: '',
      timeframe: '6'
    })
  }

  const hasActiveFilters = () => {
    return filters.experienceLevel || filters.location || filters.remote !== null || filters.targetRole
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters & Settings</h3>
        {hasActiveFilters() && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 border border-gray-300 rounded-md"
          >
            Clear Filters
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level
          </label>
          <select
            value={filters.experienceLevel}
            onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Levels</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid-Level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            placeholder="City, State, or Country"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Remote Work
          </label>
          <select
            value={filters.remote || ''}
            onChange={(e) => handleFilterChange('remote', e.target.value === '' ? null : e.target.value === 'true')}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any</option>
            <option value="true">Remote Only</option>
            <option value="false">On-site Only</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Role
          </label>
          <input
            type="text"
            placeholder="e.g. Full Stack Developer"
            value={filters.targetRole}
            onChange={(e) => handleFilterChange('targetRole', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Learning Timeframe
          </label>
          <select
            value={filters.timeframe}
            onChange={(e) => handleFilterChange('timeframe', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="3">3 months</option>
            <option value="6">6 months</option>
            <option value="12">12 months</option>
            <option value="24">24 months</option>
          </select>
        </div>
      </div>

      {hasActiveFilters() && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Active Filters:</div>
          <div className="flex flex-wrap gap-2">
            {filters.experienceLevel && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                {filters.experienceLevel} level
              </span>
            )}
            {filters.location && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                📍 {filters.location}
              </span>
            )}
            {filters.remote !== null && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                {filters.remote ? '🏠 Remote' : '🏢 On-site'}
              </span>
            )}
            {filters.targetRole && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                🎯 {filters.targetRole}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterPanel