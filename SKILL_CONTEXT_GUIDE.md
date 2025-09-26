# SkillContext Integration Guide

## Overview
The SkillContext provides comprehensive state management for skills-related operations in the SkillForge application. It integrates with the backend API and provides optimistic updates, caching, and error handling.

## Features
- ✅ **Full API Integration** - Connected to backend skill endpoints
- ✅ **Optimistic Updates** - Immediate UI feedback with rollback on error
- ✅ **Smart Caching** - 5-minute cache duration with force refresh option
- ✅ **Error Handling** - Comprehensive error management with user feedback
- ✅ **Loading States** - Granular loading indicators for different operations
- ✅ **Real-time Updates** - Automatic state synchronization

## Usage Examples

### Basic Setup
```jsx
// App.jsx
import { SkillProvider } from './contexts/SkillContext'

function App() {
  return (
    <SkillProvider>
      <Router>
        <Routes>
          {/* Your routes */}
        </Routes>
      </Router>
    </SkillProvider>
  )
}
```

### Component Integration

#### SkillOverview Component
```jsx
// components/SkillOverview.jsx
import { useSkillContext } from '../contexts/SkillContext'

function SkillOverview() {
  const {
    userSkills,
    loading,
    error,
    fetchUserSkills,
    deleteSkill,
    clearError
  } = useSkillContext()

  useEffect(() => {
    fetchUserSkills()
  }, [fetchUserSkills])

  const handleDeleteSkill = async (skillId) => {
    try {
      await deleteSkill(skillId)
      // Optimistic update - skill already removed from UI
    } catch (error) {
      // Error handling - skill restored in UI
      console.error('Failed to delete skill:', error)
    }
  }

  if (loading.userSkills) return <div>Loading skills...</div>
  if (error) return <div>Error: {error} <button onClick={clearError}>Dismiss</button></div>

  return (
    <div>
      <h2>My Skills</h2>
      {userSkills.map(skill => (
        <div key={skill.skillId} className="skill-card">
          <h3>{skill.skillName}</h3>
          <p>Rating: {skill.selfRating}/10</p>
          <p>Status: {skill.validationStatus}</p>
          <button 
            onClick={() => handleDeleteSkill(skill.skillId)}
            disabled={loading.action}
          >
            {loading.action ? 'Removing...' : 'Remove'}
          </button>
        </div>
      ))}
    </div>
  )
}
```

#### SelfAssessment Component
```jsx
// components/SelfAssessment.jsx
import { useSkillContext } from '../contexts/SkillContext'

function SelfAssessment() {
  const {
    allSkills,
    categories,
    addSkill,
    searchSkills,
    loading,
    error,
    fetchAllSkills,
    fetchSkillCategories
  } = useSkillContext()

  const [searchResults, setSearchResults] = useState([])
  const [newSkill, setNewSkill] = useState({
    skillId: '',
    selfRating: 5,
    confidence: 5,
    evidence: ''
  })

  useEffect(() => {
    fetchAllSkills()
    fetchSkillCategories()
  }, [fetchAllSkills, fetchSkillCategories])

  const handleSearch = async (query) => {
    if (query.length > 2) {
      const results = await searchSkills(query)
      setSearchResults(results)
    }
  }

  const handleAddSkill = async (e) => {
    e.preventDefault()
    try {
      await addSkill(newSkill)
      setNewSkill({ skillId: '', selfRating: 5, confidence: 5, evidence: '' })
      // Optimistic update - skill already added to UI
    } catch (error) {
      // Error handling - skill removed from UI
      console.error('Failed to add skill:', error)
    }
  }

  return (
    <div>
      <h2>Add New Skill</h2>
      <form onSubmit={handleAddSkill}>
        <input
          type="text"
          placeholder="Search skills..."
          onChange={(e) => handleSearch(e.target.value)}
        />
        
        {searchResults.map(skill => (
          <div key={skill._id} onClick={() => setNewSkill({...newSkill, skillId: skill._id})}>
            {skill.name} - {skill.category}
          </div>
        ))}

        <input
          type="range"
          min="1"
          max="10"
          value={newSkill.selfRating}
          onChange={(e) => setNewSkill({...newSkill, selfRating: parseInt(e.target.value)})}
        />
        
        <textarea
          placeholder="Evidence/Experience"
          value={newSkill.evidence}
          onChange={(e) => setNewSkill({...newSkill, evidence: e.target.value})}
        />
        
        <button 
          type="submit" 
          disabled={loading.action || !newSkill.skillId}
        >
          {loading.action ? 'Adding...' : 'Add Skill'}
        </button>
      </form>
    </div>
  )
}
```

#### Dashboard Component
```jsx
// components/Dashboard.jsx
import { useSkillContext } from '../contexts/SkillContext'

function Dashboard() {
  const {
    userSkills,
    recommendations,
    trendingSkills,
    getRecommendations,
    fetchTrendingSkills,
    loading,
    isLoading
  } = useSkillContext()

  useEffect(() => {
    getRecommendations()
    fetchTrendingSkills()
  }, [getRecommendations, fetchTrendingSkills])

  const skillStats = useMemo(() => ({
    totalSkills: userSkills.length,
    averageRating: userSkills.reduce((sum, skill) => sum + skill.selfRating, 0) / userSkills.length || 0,
    validatedSkills: userSkills.filter(skill => skill.validationStatus === 'validated').length
  }), [userSkills])

  return (
    <div>
      <h1>Skills Dashboard</h1>
      
      {isLoading && <div>Loading dashboard data...</div>}
      
      <div className="stats">
        <div>Total Skills: {skillStats.totalSkills}</div>
        <div>Average Rating: {skillStats.averageRating.toFixed(1)}/10</div>
        <div>Validated Skills: {skillStats.validatedSkills}</div>
      </div>

      <div className="recommendations">
        <h2>Recommended Skills</h2>
        {loading.recommendations ? (
          <div>Loading recommendations...</div>
        ) : (
          recommendations.map(skill => (
            <div key={skill._id} className="recommendation-card">
              <h3>{skill.name}</h3>
              <p>Match Score: {skill.score}</p>
              <p>{skill.description}</p>
            </div>
          ))
        )}
      </div>

      <div className="trending">
        <h2>Trending Skills</h2>
        {trendingSkills.map(skill => (
          <div key={skill._id} className="trending-skill">
            <span>{skill.name}</span>
            <span className="trend">📈 {skill.demandGrowth}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## API Methods

### Data Fetching
- `fetchUserSkills(forceRefresh)` - Get user's skills with caching
- `fetchAllSkills(forceRefresh)` - Get master skills taxonomy
- `fetchSkillCategories(forceRefresh)` - Get skill categories
- `getRecommendations(userId, forceRefresh)` - Get AI recommendations
- `fetchTrendingSkills()` - Get market trending skills

### Skill Management
- `addSkill(skillData)` - Add skill to user profile (optimistic)
- `updateSkill(skillId, updateData)` - Update skill rating/evidence (optimistic)
- `deleteSkill(skillId)` - Remove skill from profile (optimistic)

### Search & Discovery
- `searchSkills(query, filters)` - Search available skills
- `getSkillDetails(skillId)` - Get detailed skill information

### Utilities
- `clearError()` - Clear current error state
- `isLoading` - Boolean indicating any loading operation
- `hasOptimisticUpdates` - Boolean indicating pending optimistic updates

## State Structure

```javascript
{
  // User's skill profile
  userSkills: [
    {
      skillId: '...',
      skillName: 'JavaScript',
      category: 'Programming',
      selfRating: 8,
      averageRating: 7.5,
      validationStatus: 'validated',
      confidence: 9,
      evidence: 'Built 5 production apps...'
    }
  ],
  
  // Master skills taxonomy
  allSkills: [...],
  
  // Available categories
  categories: ['Programming', 'Design', 'Marketing', ...],
  
  // AI recommendations
  recommendations: [...],
  
  // Market trending skills
  trendingSkills: [...],
  
  // Loading states
  loading: {
    userSkills: boolean,
    allSkills: boolean,
    categories: boolean,
    recommendations: boolean,
    action: boolean
  },
  
  // Current error
  error: string | null
}
```

## Error Handling

The context provides comprehensive error handling:
- Network errors are caught and displayed
- API errors are formatted consistently  
- Optimistic updates are reverted on failure
- Users can dismiss errors with `clearError()`

## Caching Strategy

- **5-minute cache duration** for frequently accessed data
- **Force refresh option** for all fetch methods
- **Automatic cache invalidation** after mutations
- **Optimistic updates** for immediate feedback

## Performance Optimizations

- **Optimistic updates** for instant UI feedback
- **Smart caching** reduces API calls
- **Batch operations** where possible
- **Loading states** prevent duplicate requests
- **Memoized calculations** for derived data

## Integration with Backend

The context integrates with these backend endpoints:
- `GET /api/skills` - Get all skills
- `GET /api/skills/categories` - Get categories  
- `GET /api/skills/details/:id` - Get skill details
- `GET /api/skills/user/:userId` - Get user skills
- `POST /api/skills/user` - Add user skill
- `PUT /api/skills/user/:skillId` - Update user skill
- `DELETE /api/skills/user/:skillId` - Remove user skill
- `GET /api/skills/suggestions/:userId` - Get recommendations