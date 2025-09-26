# AssessmentContext Integration Guide

## Overview
The AssessmentContext provides comprehensive state management for skill assessments with multi-step form functionality, draft management, and backend API integration.

## Features
- ✅ **Multi-Step Form Management** - 5-step assessment process with validation
- ✅ **Draft Functionality** - Auto-save and manual draft management  
- ✅ **Full API Integration** - Connected to assessment endpoints
- ✅ **Optimistic Updates** - Immediate UI feedback with rollback
- ✅ **Assessment History** - Track skill progression over time
- ✅ **Report Generation** - Comprehensive assessment reports
- ✅ **Form Validation** - Step-by-step validation with error messages
- ✅ **Auto-Save** - Automatic draft saving every 30 seconds

## Assessment Form Steps

1. **SKILL_SELECTION** - Choose skill to assess
2. **SELF_RATING** - Rate proficiency (1-10)
3. **EVIDENCE** - Provide experience evidence
4. **CONFIDENCE** - Rate confidence level (1-10)
5. **REVIEW** - Review and submit assessment

## Usage Examples

### Basic Setup
```jsx
// App.jsx
import { AssessmentProvider } from './contexts/AssessmentContext'
import { SkillProvider } from './contexts/SkillContext'

function App() {
  return (
    <SkillProvider>
      <AssessmentProvider>
        <Router>
          <Routes>
            {/* Your routes */}
          </Routes>
        </Router>
      </AssessmentProvider>
    </SkillProvider>
  )
}
```

### SelfAssessment Component (Multi-Step Form)
```jsx
// components/SelfAssessment.jsx
import { useAssessmentContext } from '../contexts/AssessmentContext'
import { useSkillContext } from '../contexts/SkillContext'

function SelfAssessment() {
  const {
    currentForm,
    initializeForm,
    updateFormData,
    nextStep,
    prevStep,
    resetForm,
    submitForm,
    saveDraft,
    loading,
    error,
    clearError,
    FORM_STEPS,
    canGoNext,
    canGoPrev,
    isLastStep,
    getCurrentStepIndex
  } = useAssessmentContext()

  const { allSkills, searchSkills } = useSkillContext()
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    if (!currentForm.isActive) {
      initializeForm()
    }
  }, [currentForm.isActive, initializeForm])

  const handleSkillSearch = async (query) => {
    if (query.length > 2) {
      const results = await searchSkills(query)
      setSearchResults(results)
    }
  }

  const handleSkillSelect = (skill) => {
    updateFormData({
      skillId: skill._id,
      skillName: skill.name,
      skillCategory: skill.category
    })
    setSearchResults([])
  }

  const handleFormSubmit = async () => {
    try {
      await submitForm()
      alert('Assessment submitted successfully!')
    } catch (error) {
      console.error('Failed to submit assessment:', error)
    }
  }

  const renderCurrentStep = () => {
    switch (currentForm.currentStep) {
      case FORM_STEPS.SKILL_SELECTION:
        return (
          <div className="form-step">
            <h2>Select Skill to Assess</h2>
            <input
              type="text"
              placeholder="Search for a skill..."
              onChange={(e) => handleSkillSearch(e.target.value)}
              className="skill-search"
            />
            
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map(skill => (
                  <div 
                    key={skill._id} 
                    className="skill-option"
                    onClick={() => handleSkillSelect(skill)}
                  >
                    <strong>{skill.name}</strong>
                    <span className="category">{skill.category}</span>
                    <p>{skill.description}</p>
                  </div>
                ))}
              </div>
            )}
            
            {currentForm.data.skillName && (
              <div className="selected-skill">
                <strong>Selected: {currentForm.data.skillName}</strong>
                <span>({currentForm.data.skillCategory})</span>
              </div>
            )}
            
            {currentForm.validation.skillId && !currentForm.validation.skillId.isValid && (
              <div className="error">{currentForm.validation.skillId.message}</div>
            )}
          </div>
        )

      case FORM_STEPS.SELF_RATING:
        return (
          <div className="form-step">
            <h2>Rate Your Proficiency</h2>
            <p>How would you rate your current skill level in <strong>{currentForm.data.skillName}</strong>?</p>
            
            <div className="rating-container">
              <input
                type="range"
                min="1"
                max="10"
                value={currentForm.data.selfRating}
                onChange={(e) => updateFormData({ selfRating: parseInt(e.target.value) })}
                className="rating-slider"
              />
              <div className="rating-display">
                <span className="rating-value">{currentForm.data.selfRating}/10</span>
                <div className="rating-labels">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Expert</span>
                </div>
              </div>
            </div>
            
            {currentForm.validation.selfRating && !currentForm.validation.selfRating.isValid && (
              <div className="error">{currentForm.validation.selfRating.message}</div>
            )}
          </div>
        )

      case FORM_STEPS.EVIDENCE:
        return (
          <div className="form-step">
            <h2>Provide Evidence</h2>
            <p>Describe your experience and achievements with <strong>{currentForm.data.skillName}</strong></p>
            
            <textarea
              placeholder="Describe your projects, accomplishments, training, certifications, or work experience related to this skill..."
              value={currentForm.data.evidence}
              onChange={(e) => updateFormData({ evidence: e.target.value })}
              className="evidence-textarea"
              rows={8}
            />
            
            <div className="character-count">
              {currentForm.data.evidence.length} characters
            </div>
            
            {currentForm.validation.evidence && !currentForm.validation.evidence.isValid && (
              <div className="error">{currentForm.validation.evidence.message}</div>
            )}
          </div>
        )

      case FORM_STEPS.CONFIDENCE:
        return (
          <div className="form-step">
            <h2>Confidence Level</h2>
            <p>How confident are you in your self-assessment of <strong>{currentForm.data.skillName}</strong>?</p>
            
            <div className="confidence-container">
              <input
                type="range"
                min="1"
                max="10"
                value={currentForm.data.confidence}
                onChange={(e) => updateFormData({ confidence: parseInt(e.target.value) })}
                className="confidence-slider"
              />
              <div className="confidence-display">
                <span className="confidence-value">{currentForm.data.confidence}/10</span>
                <div className="confidence-labels">
                  <span>Uncertain</span>
                  <span>Somewhat Sure</span>
                  <span>Very Confident</span>
                </div>
              </div>
            </div>
            
            {currentForm.validation.confidence && !currentForm.validation.confidence.isValid && (
              <div className="error">{currentForm.validation.confidence.message}</div>
            )}
          </div>
        )

      case FORM_STEPS.REVIEW:
        return (
          <div className="form-step">
            <h2>Review Your Assessment</h2>
            
            <div className="assessment-summary">
              <div className="summary-item">
                <label>Skill:</label>
                <span>{currentForm.data.skillName} ({currentForm.data.skillCategory})</span>
              </div>
              
              <div className="summary-item">
                <label>Self Rating:</label>
                <span>{currentForm.data.selfRating}/10</span>
              </div>
              
              <div className="summary-item">
                <label>Confidence:</label>
                <span>{currentForm.data.confidence}/10</span>
              </div>
              
              <div className="summary-item">
                <label>Evidence:</label>
                <div className="evidence-preview">
                  {currentForm.data.evidence}
                </div>
              </div>
            </div>
            
            <div className="review-actions">
              <p>Please review your assessment above. You can go back to make changes or submit to complete.</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!currentForm.isActive) {
    return <div>Loading assessment form...</div>
  }

  return (
    <div className="self-assessment">
      <div className="assessment-header">
        <div className="progress-indicator">
          <span>Step {getCurrentStepIndex()} of {currentForm.totalSteps}</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(getCurrentStepIndex() / currentForm.totalSteps) * 100}%` }}
            />
          </div>
        </div>
        
        {currentForm.isDraft && (
          <div className="draft-indicator">
            <span>📝 Draft saved</span>
          </div>
        )}
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={clearError}>✕</button>
        </div>
      )}

      <div className="form-content">
        {renderCurrentStep()}
      </div>

      <div className="form-navigation">
        <div className="nav-left">
          {canGoPrev && (
            <button 
              onClick={prevStep}
              className="btn-secondary"
              disabled={loading.creating}
            >
              ← Previous
            </button>
          )}
        </div>

        <div className="nav-center">
          <button 
            onClick={saveDraft}
            className="btn-draft"
            disabled={loading.savingDraft}
          >
            {loading.savingDraft ? 'Saving...' : '💾 Save Draft'}
          </button>
        </div>

        <div className="nav-right">
          {isLastStep ? (
            <button 
              onClick={handleFormSubmit}
              className="btn-primary"
              disabled={!canGoNext || loading.creating}
            >
              {loading.creating ? 'Submitting...' : 'Submit Assessment'}
            </button>
          ) : (
            <button 
              onClick={nextStep}
              className="btn-primary"
              disabled={!canGoNext}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
```

### AssessmentHistory Component
```jsx
// components/AssessmentHistory.jsx
import { useAssessmentContext } from '../contexts/AssessmentContext'

function AssessmentHistory() {
  const {
    history,
    progression,
    fetchHistory,
    fetchProgression,
    loading,
    error,
    clearError
  } = useAssessmentContext()

  const [selectedSkill, setSelectedSkill] = useState(null)
  const [timeframe, setTimeframe] = useState('year')

  useEffect(() => {
    fetchHistory()
    fetchProgression(null, { timeframe })
  }, [fetchHistory, fetchProgression, timeframe])

  const groupedHistory = useMemo(() => {
    return history.reduce((groups, assessment) => {
      const skillName = assessment.skill?.name || 'Unknown Skill'
      if (!groups[skillName]) {
        groups[skillName] = []
      }
      groups[skillName].push(assessment)
      return groups
    }, {})
  }, [history])

  const getProgressionChart = (skillName) => {
    const skillProgression = progression.find(p => p._id === selectedSkill)
    if (!skillProgression) return null

    return skillProgression.points.map(point => ({
      date: new Date(point.date).toLocaleDateString(),
      selfRating: point.selfRating,
      averageRating: point.avg || 0
    }))
  }

  if (loading.history) return <div>Loading assessment history...</div>
  if (error) return <div>Error: {error} <button onClick={clearError}>Dismiss</button></div>

  return (
    <div className="assessment-history">
      <div className="history-header">
        <h2>Assessment History</h2>
        <div className="timeframe-selector">
          <select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      <div className="history-content">
        <div className="skills-list">
          {Object.entries(groupedHistory).map(([skillName, assessments]) => (
            <div 
              key={skillName}
              className={`skill-history-item ${selectedSkill === skillName ? 'selected' : ''}`}
              onClick={() => setSelectedSkill(skillName)}
            >
              <div className="skill-info">
                <h3>{skillName}</h3>
                <span className="assessment-count">{assessments.length} assessments</span>
              </div>
              
              <div className="latest-rating">
                <span>Latest: {assessments[0]?.selfRating}/10</span>
                <span className="assessment-date">
                  {new Date(assessments[0]?.assessmentDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {selectedSkill && (
          <div className="skill-detail">
            <h3>{selectedSkill} Progression</h3>
            
            {loading.progression ? (
              <div>Loading progression data...</div>
            ) : (
              <div className="progression-chart">
                {/* Chart implementation would go here */}
                <div className="chart-placeholder">
                  📈 Progression Chart for {selectedSkill}
                </div>
              </div>
            )}

            <div className="assessment-timeline">
              <h4>Assessment Timeline</h4>
              {groupedHistory[selectedSkill]?.map(assessment => (
                <div key={assessment._id} className="timeline-item">
                  <div className="timeline-date">
                    {new Date(assessment.assessmentDate).toLocaleDateString()}
                  </div>
                  <div className="timeline-content">
                    <div className="rating">Rating: {assessment.selfRating}/10</div>
                    <div className="confidence">Confidence: {assessment.confidence}/10</div>
                    <div className="status">Status: {assessment.validationStatus}</div>
                    {assessment.evidence && (
                      <div className="evidence">{assessment.evidence.substring(0, 100)}...</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

### Dashboard Integration
```jsx
// components/Dashboard.jsx
import { useAssessmentContext } from '../contexts/AssessmentContext'

function Dashboard() {
  const {
    assessments,
    report,
    fetchAssessments,
    generateReport,
    loading
  } = useAssessmentContext()

  useEffect(() => {
    fetchAssessments()
    generateReport()
  }, [fetchAssessments, generateReport])

  const assessmentStats = useMemo(() => {
    const total = assessments.length
    const validated = assessments.filter(a => a.validationStatus === 'validated').length
    const pending = assessments.filter(a => a.validationStatus === 'pending').length
    const averageRating = assessments.reduce((sum, a) => sum + a.selfRating, 0) / total || 0

    return { total, validated, pending, averageRating }
  }, [assessments])

  const recentAssessments = useMemo(() => {
    return assessments
      .sort((a, b) => new Date(b.assessmentDate) - new Date(a.assessmentDate))
      .slice(0, 5)
  }, [assessments])

  return (
    <div className="dashboard">
      <div className="assessment-stats">
        <div className="stat-card">
          <h3>Total Assessments</h3>
          <span className="stat-value">{assessmentStats.total}</span>
        </div>
        
        <div className="stat-card">
          <h3>Validated Skills</h3>
          <span className="stat-value">{assessmentStats.validated}</span>
        </div>
        
        <div className="stat-card">
          <h3>Pending Validation</h3>
          <span className="stat-value">{assessmentStats.pending}</span>
        </div>
        
        <div className="stat-card">
          <h3>Average Rating</h3>
          <span className="stat-value">{assessmentStats.averageRating.toFixed(1)}/10</span>
        </div>
      </div>

      <div className="recent-assessments">
        <h2>Recent Assessments</h2>
        {loading.assessments ? (
          <div>Loading assessments...</div>
        ) : (
          <div className="assessment-list">
            {recentAssessments.map(assessment => (
              <div key={assessment._id} className="assessment-card">
                <div className="skill-name">{assessment.skill?.name}</div>
                <div className="rating">{assessment.selfRating}/10</div>
                <div className="status">{assessment.validationStatus}</div>
                <div className="date">
                  {new Date(assessment.assessmentDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {report && (
        <div className="assessment-report">
          <h2>Assessment Report</h2>
          <div className="report-summary">
            <p>Total Skills Assessed: {report.count}</p>
            {report.gaps?.length > 0 && (
              <div className="skill-gaps">
                <h3>Skill Gaps</h3>
                <ul>
                  {report.gaps.map((gap, index) => (
                    <li key={index}>{gap}</li>
                  ))}
                </ul>
              </div>
            )}
            {report.recommendations?.length > 0 && (
              <div className="recommendations">
                <h3>Recommendations</h3>
                <ul>
                  {report.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
```

## API Integration

The context integrates with these backend endpoints:
- `POST /api/assessment` - Create new assessment
- `GET /api/assessment/me` - Get user's assessments
- `PUT /api/assessment/:id` - Update assessment
- `GET /api/assessment/history/:userId` - Get assessment history
- `GET /api/assessment/progression/:userId` - Get skill progression
- `GET /api/assessment/report/:userId` - Generate assessment report

## Draft Management

- **Auto-save**: Drafts are automatically saved every 30 seconds
- **Manual save**: Users can manually save drafts at any time
- **LocalStorage**: Drafts are persisted in browser localStorage
- **Recovery**: Users can recover and continue incomplete assessments

## State Structure

```javascript
{
  assessments: [...],           // User's completed assessments
  history: [...],              // Assessment history timeline
  progression: [...],          // Skill progression data
  report: {...},              // Generated assessment report
  
  currentForm: {
    isActive: boolean,         // Whether form is currently active
    currentStep: string,       // Current step in form
    totalSteps: number,        // Total number of steps
    data: {...},              // Form data
    validation: {...},        // Validation state
    isValid: boolean,         // Whether current step is valid
    isDraft: boolean,         // Whether form is saved as draft
    draftId: string          // Draft identifier
  },
  
  drafts: [...],              // Saved drafts
  loading: {...},             // Loading states for different operations
  error: string              // Current error message
}
```

## Performance Features

- **Optimistic Updates** - Immediate UI feedback
- **Smart Caching** - 5-minute cache duration
- **Auto-save** - Prevent data loss
- **Step Validation** - Real-time validation
- **Draft Management** - Resume incomplete assessments