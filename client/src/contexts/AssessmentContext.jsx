import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import assessmentAPI from '../services/assessmentAPI.js'
import { useSkillContext } from './SkillContext.jsx'

const AssessmentContext = createContext(null)

// Action types for reducer
const ASSESSMENT_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_ASSESSMENTS: 'SET_ASSESSMENTS',
  ADD_ASSESSMENT: 'ADD_ASSESSMENT',
  UPDATE_ASSESSMENT: 'UPDATE_ASSESSMENT',
  DELETE_ASSESSMENT: 'DELETE_ASSESSMENT',
  SET_HISTORY: 'SET_HISTORY',
  SET_PROGRESSION: 'SET_PROGRESSION',
  SET_REPORT: 'SET_REPORT',
  
  // Multi-step form actions
  INIT_FORM: 'INIT_FORM',
  UPDATE_FORM_STEP: 'UPDATE_FORM_STEP',
  SET_FORM_DATA: 'SET_FORM_DATA',
  SET_FORM_VALIDATION: 'SET_FORM_VALIDATION',
  NEXT_STEP: 'NEXT_STEP',
  PREV_STEP: 'PREV_STEP',
  RESET_FORM: 'RESET_FORM',
  
  // Draft functionality
  SAVE_DRAFT: 'SAVE_DRAFT',
  LOAD_DRAFT: 'LOAD_DRAFT',
  DELETE_DRAFT: 'DELETE_DRAFT',
  
  // Optimistic updates
  OPTIMISTIC_CREATE: 'OPTIMISTIC_CREATE',
  OPTIMISTIC_UPDATE: 'OPTIMISTIC_UPDATE',
  REVERT_OPTIMISTIC: 'REVERT_OPTIMISTIC'
}

// Assessment form steps
const FORM_STEPS = {
  SKILL_SELECTION: 'skill_selection',
  SELF_RATING: 'self_rating',
  EVIDENCE: 'evidence',
  CONFIDENCE: 'confidence',
  REVIEW: 'review'
}

// Initial state
const initialState = {
  // Assessment data
  assessments: [],
  history: [],
  progression: [],
  report: null,
  
  // Multi-step form state
  currentForm: {
    isActive: false,
    currentStep: FORM_STEPS.SKILL_SELECTION,
    totalSteps: Object.keys(FORM_STEPS).length,
    data: {
      skillId: '',
      skillName: '',
      skillCategory: '',
      selfRating: 5,
      confidence: 5,
      evidence: '',
      experienceLevel: 'intermediate',
      learningGoals: [],
      practiceAreas: []
    },
    validation: {
      skillId: { isValid: true, message: '' },
      selfRating: { isValid: true, message: '' },
      evidence: { isValid: true, message: '' },
      confidence: { isValid: true, message: '' }
    },
    isValid: false,
    isDraft: false,
    draftId: null
  },
  
  // Draft management
  drafts: [],
  
  // Loading states
  loading: {
    assessments: false,
    history: false,
    progression: false,
    report: false,
    creating: false,
    updating: false,
    deleting: false,
    savingDraft: false
  },
  
  error: null,
  optimisticUpdates: [],
  
  // Cache management
  lastFetch: {
    assessments: null,
    history: null,
    progression: null
  }
}

// Form validation rules
const validateFormData = (stepData, step) => {
  const validation = {}
  
  switch (step) {
    case FORM_STEPS.SKILL_SELECTION:
      validation.skillId = {
        isValid: !!stepData.skillId,
        message: stepData.skillId ? '' : 'Please select a skill to assess'
      }
      break
      
    case FORM_STEPS.SELF_RATING:
      validation.selfRating = {
        isValid: stepData.selfRating >= 1 && stepData.selfRating <= 10,
        message: stepData.selfRating >= 1 && stepData.selfRating <= 10 ? '' : 'Rating must be between 1 and 10'
      }
      break
      
    case FORM_STEPS.EVIDENCE:
      validation.evidence = {
        isValid: stepData.evidence && stepData.evidence.trim().length >= 10,
        message: stepData.evidence && stepData.evidence.trim().length >= 10 ? '' : 'Please provide at least 10 characters of evidence'
      }
      break
      
    case FORM_STEPS.CONFIDENCE:
      validation.confidence = {
        isValid: stepData.confidence >= 1 && stepData.confidence <= 10,
        message: stepData.confidence >= 1 && stepData.confidence <= 10 ? '' : 'Confidence must be between 1 and 10'
      }
      break
      
    default:
      break
  }
  
  return validation
}

// Reducer function
function assessmentReducer(state, action) {
  switch (action.type) {
    case ASSESSMENT_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.type]: action.payload.loading
        }
      }

    case ASSESSMENT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: {
          ...state.loading,
          creating: false,
          updating: false,
          deleting: false
        }
      }

    case ASSESSMENT_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }

    case ASSESSMENT_ACTIONS.SET_ASSESSMENTS:
      return {
        ...state,
        assessments: action.payload,
        lastFetch: {
          ...state.lastFetch,
          assessments: Date.now()
        },
        loading: {
          ...state.loading,
          assessments: false
        }
      }

    case ASSESSMENT_ACTIONS.ADD_ASSESSMENT:
      return {
        ...state,
        assessments: [action.payload, ...state.assessments],
        loading: {
          ...state.loading,
          creating: false
        }
      }

    case ASSESSMENT_ACTIONS.UPDATE_ASSESSMENT:
      return {
        ...state,
        assessments: state.assessments.map(assessment =>
          assessment._id === action.payload._id ? action.payload : assessment
        ),
        loading: {
          ...state.loading,
          updating: false
        }
      }

    case ASSESSMENT_ACTIONS.DELETE_ASSESSMENT:
      return {
        ...state,
        assessments: state.assessments.filter(assessment => assessment._id !== action.payload),
        loading: {
          ...state.loading,
          deleting: false
        }
      }

    case ASSESSMENT_ACTIONS.SET_HISTORY:
      return {
        ...state,
        history: action.payload,
        lastFetch: {
          ...state.lastFetch,
          history: Date.now()
        },
        loading: {
          ...state.loading,
          history: false
        }
      }

    case ASSESSMENT_ACTIONS.SET_PROGRESSION:
      return {
        ...state,
        progression: action.payload,
        lastFetch: {
          ...state.lastFetch,
          progression: Date.now()
        },
        loading: {
          ...state.loading,
          progression: false
        }
      }

    case ASSESSMENT_ACTIONS.SET_REPORT:
      return {
        ...state,
        report: action.payload,
        loading: {
          ...state.loading,
          report: false
        }
      }

    // Multi-step form actions
    case ASSESSMENT_ACTIONS.INIT_FORM:
      return {
        ...state,
        currentForm: {
          ...initialState.currentForm,
          isActive: true,
          data: { ...initialState.currentForm.data, ...action.payload }
        }
      }

    case ASSESSMENT_ACTIONS.SET_FORM_DATA:
      const newFormData = { ...state.currentForm.data, ...action.payload }
      const validation = validateFormData(newFormData, state.currentForm.currentStep)
      const isStepValid = Object.values(validation).every(v => v.isValid)
      
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          data: newFormData,
          validation: { ...state.currentForm.validation, ...validation },
          isValid: isStepValid
        }
      }

    case ASSESSMENT_ACTIONS.SET_FORM_VALIDATION:
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          validation: action.payload
        }
      }

    case ASSESSMENT_ACTIONS.NEXT_STEP:
      const steps = Object.values(FORM_STEPS)
      const currentIndex = steps.indexOf(state.currentForm.currentStep)
      const nextStep = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : state.currentForm.currentStep
      
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          currentStep: nextStep,
          validation: initialState.currentForm.validation
        }
      }

    case ASSESSMENT_ACTIONS.PREV_STEP:
      const prevSteps = Object.values(FORM_STEPS)
      const prevCurrentIndex = prevSteps.indexOf(state.currentForm.currentStep)
      const prevStep = prevCurrentIndex > 0 ? prevSteps[prevCurrentIndex - 1] : state.currentForm.currentStep
      
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          currentStep: prevStep,
          validation: initialState.currentForm.validation
        }
      }

    case ASSESSMENT_ACTIONS.RESET_FORM:
      return {
        ...state,
        currentForm: initialState.currentForm
      }

    // Draft functionality
    case ASSESSMENT_ACTIONS.SAVE_DRAFT:
      const existingDraftIndex = state.drafts.findIndex(draft => draft.id === action.payload.id)
      const updatedDrafts = existingDraftIndex >= 0
        ? state.drafts.map((draft, index) => index === existingDraftIndex ? action.payload : draft)
        : [...state.drafts, action.payload]
        
      return {
        ...state,
        drafts: updatedDrafts,
        currentForm: {
          ...state.currentForm,
          isDraft: true,
          draftId: action.payload.id
        },
        loading: {
          ...state.loading,
          savingDraft: false
        }
      }

    case ASSESSMENT_ACTIONS.LOAD_DRAFT:
      const draft = state.drafts.find(d => d.id === action.payload)
      return {
        ...state,
        currentForm: {
          ...state.currentForm,
          isActive: true,
          data: draft?.data || initialState.currentForm.data,
          currentStep: draft?.currentStep || FORM_STEPS.SKILL_SELECTION,
          isDraft: true,
          draftId: action.payload
        }
      }

    case ASSESSMENT_ACTIONS.DELETE_DRAFT:
      return {
        ...state,
        drafts: state.drafts.filter(draft => draft.id !== action.payload),
        currentForm: state.currentForm.draftId === action.payload
          ? { ...state.currentForm, isDraft: false, draftId: null }
          : state.currentForm
      }

    // Optimistic updates
    case ASSESSMENT_ACTIONS.OPTIMISTIC_CREATE:
      return {
        ...state,
        assessments: [action.payload, ...state.assessments],
        optimisticUpdates: [...state.optimisticUpdates, { type: 'create', data: action.payload }],
        loading: {
          ...state.loading,
          creating: true
        }
      }

    case ASSESSMENT_ACTIONS.OPTIMISTIC_UPDATE:
      return {
        ...state,
        assessments: state.assessments.map(assessment =>
          assessment._id === action.payload._id ? action.payload : assessment
        ),
        optimisticUpdates: [...state.optimisticUpdates, { type: 'update', data: action.payload }],
        loading: {
          ...state.loading,
          updating: true
        }
      }

    case ASSESSMENT_ACTIONS.REVERT_OPTIMISTIC:
      // Revert optimistic updates
      let revertedState = { ...state }
      state.optimisticUpdates.reverse().forEach(update => {
        if (update.type === 'create') {
          revertedState.assessments = revertedState.assessments.filter(a => a._id !== update.data._id)
        } else if (update.type === 'update') {
          // Find and restore original data (this would need more sophisticated tracking)
        }
      })
      
      return {
        ...revertedState,
        optimisticUpdates: [],
        loading: {
          ...revertedState.loading,
          creating: false,
          updating: false
        }
      }

    default:
      return state
  }
}

export function AssessmentProvider({ children }) {
  const [state, dispatch] = useReducer(assessmentReducer, initialState)
  const { fetchUserSkills } = useSkillContext()

  // Cache duration (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000

  // Helper functions
  const isStale = useCallback((lastFetch) => {
    return !lastFetch || (Date.now() - lastFetch) > CACHE_DURATION
  }, [])

  const handleError = useCallback((error, operation) => {
    console.error(`Error in ${operation}:`, error)
    const errorMessage = error.message || `Failed to ${operation.toLowerCase()}`
    dispatch({ type: ASSESSMENT_ACTIONS.SET_ERROR, payload: errorMessage })
    
    if (state.optimisticUpdates.length > 0) {
      dispatch({ type: ASSESSMENT_ACTIONS.REVERT_OPTIMISTIC })
    }
  }, [state.optimisticUpdates])

  const clearError = useCallback(() => {
    dispatch({ type: ASSESSMENT_ACTIONS.CLEAR_ERROR })
  }, [])

  // Assessment CRUD operations
  const fetchAssessments = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && !isStale(state.lastFetch.assessments)) {
      return state.assessments
    }

    dispatch({ type: ASSESSMENT_ACTIONS.SET_LOADING, payload: { type: 'assessments', loading: true } })
    dispatch({ type: ASSESSMENT_ACTIONS.CLEAR_ERROR })

    try {
      const result = await assessmentAPI.getMyAssessments()
      if (result.success) {
        dispatch({ type: ASSESSMENT_ACTIONS.SET_ASSESSMENTS, payload: result.assessments })
        return result.assessments
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      handleError(error, 'Fetch assessments')
      return []
    }
  }, [state.lastFetch.assessments, state.assessments, isStale, handleError])

  const createAssessment = useCallback(async (assessmentData) => {
    const tempId = `temp_${Date.now()}`
    const optimisticAssessment = {
      _id: tempId,
      ...assessmentData,
      assessmentDate: new Date(),
      validationStatus: 'pending'
    }

    // Optimistic update
    dispatch({ type: ASSESSMENT_ACTIONS.OPTIMISTIC_CREATE, payload: optimisticAssessment })
    dispatch({ type: ASSESSMENT_ACTIONS.CLEAR_ERROR })

    try {
      const result = await assessmentAPI.createAssessment(assessmentData)
      if (result.success) {
        // Replace optimistic update with real data
        await fetchAssessments(true)
        // Update skill context
        await fetchUserSkills(true)
        return result.assessment
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      handleError(error, 'Create assessment')
      throw error
    }
  }, [fetchAssessments, fetchUserSkills, handleError])

  const updateAssessment = useCallback(async (assessmentId, updateData) => {
    const originalAssessment = state.assessments.find(a => a._id === assessmentId)
    if (!originalAssessment) {
      throw new Error('Assessment not found')
    }

    const optimisticAssessment = { ...originalAssessment, ...updateData }
    dispatch({ type: ASSESSMENT_ACTIONS.OPTIMISTIC_UPDATE, payload: optimisticAssessment })
    dispatch({ type: ASSESSMENT_ACTIONS.CLEAR_ERROR })

    try {
      const result = await assessmentAPI.updateAssessment(assessmentId, updateData)
      if (result.success) {
        dispatch({ type: ASSESSMENT_ACTIONS.UPDATE_ASSESSMENT, payload: result.assessment })
        // Update skill context
        await fetchUserSkills(true)
        return result.assessment
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      handleError(error, 'Update assessment')
      throw error
    }
  }, [state.assessments, fetchUserSkills, handleError])

  const deleteAssessment = useCallback(async (assessmentId) => {
    dispatch({ type: ASSESSMENT_ACTIONS.SET_LOADING, payload: { type: 'deleting', loading: true } })
    dispatch({ type: ASSESSMENT_ACTIONS.CLEAR_ERROR })

    try {
      const result = await assessmentAPI.deleteAssessment(assessmentId)
      if (result.success) {
        dispatch({ type: ASSESSMENT_ACTIONS.DELETE_ASSESSMENT, payload: assessmentId })
        // Update skill context
        await fetchUserSkills(true)
        return true
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      handleError(error, 'Delete assessment')
      throw error
    }
  }, [fetchUserSkills, handleError])

  // History and progression
  const fetchHistory = useCallback(async (userId = null, forceRefresh = false) => {
    if (!forceRefresh && !isStale(state.lastFetch.history)) {
      return state.history
    }

    dispatch({ type: ASSESSMENT_ACTIONS.SET_LOADING, payload: { type: 'history', loading: true } })
    dispatch({ type: ASSESSMENT_ACTIONS.CLEAR_ERROR })

    try {
      const result = await assessmentAPI.getAssessmentHistory(userId)
      if (result.success) {
        dispatch({ type: ASSESSMENT_ACTIONS.SET_HISTORY, payload: result.history })
        return result.history
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      handleError(error, 'Fetch assessment history')
      return []
    }
  }, [state.lastFetch.history, state.history, isStale, handleError])

  const fetchProgression = useCallback(async (userId = null, options = {}, forceRefresh = false) => {
    if (!forceRefresh && !isStale(state.lastFetch.progression)) {
      return state.progression
    }

    dispatch({ type: ASSESSMENT_ACTIONS.SET_LOADING, payload: { type: 'progression', loading: true } })
    dispatch({ type: ASSESSMENT_ACTIONS.CLEAR_ERROR })

    try {
      const result = await assessmentAPI.getSkillProgression(userId, options)
      if (result.success) {
        dispatch({ type: ASSESSMENT_ACTIONS.SET_PROGRESSION, payload: result.progression })
        return result.progression
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      handleError(error, 'Fetch skill progression')
      return []
    }
  }, [state.lastFetch.progression, state.progression, isStale, handleError])

  const generateReport = useCallback(async (userId = null, options = {}) => {
    dispatch({ type: ASSESSMENT_ACTIONS.SET_LOADING, payload: { type: 'report', loading: true } })
    dispatch({ type: ASSESSMENT_ACTIONS.CLEAR_ERROR })

    try {
      const result = await assessmentAPI.generateAssessmentReport(userId, options)
      if (result.success) {
        dispatch({ type: ASSESSMENT_ACTIONS.SET_REPORT, payload: result.report })
        return result.report
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      handleError(error, 'Generate assessment report')
      return null
    }
  }, [handleError])

  // Multi-step form management
  const initializeForm = useCallback((initialData = {}) => {
    dispatch({ type: ASSESSMENT_ACTIONS.INIT_FORM, payload: initialData })
  }, [])

  const updateFormData = useCallback((data) => {
    dispatch({ type: ASSESSMENT_ACTIONS.SET_FORM_DATA, payload: data })
  }, [])

  const nextStep = useCallback(() => {
    if (state.currentForm.isValid) {
      dispatch({ type: ASSESSMENT_ACTIONS.NEXT_STEP })
    }
  }, [state.currentForm.isValid])

  const prevStep = useCallback(() => {
    dispatch({ type: ASSESSMENT_ACTIONS.PREV_STEP })
  }, [])

  const resetForm = useCallback(() => {
    dispatch({ type: ASSESSMENT_ACTIONS.RESET_FORM })
  }, [])

  const submitForm = useCallback(async () => {
    const { data } = state.currentForm
    
    try {
      const assessmentData = {
        skillId: data.skillId,
        selfRating: data.selfRating,
        confidence: data.confidence,
        evidence: data.evidence
      }
      
      const result = await createAssessment(assessmentData)
      
      // Clear draft if exists
      if (state.currentForm.draftId) {
        dispatch({ type: ASSESSMENT_ACTIONS.DELETE_DRAFT, payload: state.currentForm.draftId })
      }
      
      // Reset form
      dispatch({ type: ASSESSMENT_ACTIONS.RESET_FORM })
      
      return result
    } catch (error) {
      throw error
    }
  }, [state.currentForm, createAssessment])

  // Draft management
  const saveDraft = useCallback(() => {
    dispatch({ type: ASSESSMENT_ACTIONS.SET_LOADING, payload: { type: 'savingDraft', loading: true } })
    
    const draftId = state.currentForm.draftId || `draft_${Date.now()}`
    const draft = {
      id: draftId,
      data: state.currentForm.data,
      currentStep: state.currentForm.currentStep,
      savedAt: new Date().toISOString()
    }
    
    // Save to localStorage
    try {
      const existingDrafts = JSON.parse(localStorage.getItem('assessmentDrafts') || '[]')
      const updatedDrafts = existingDrafts.filter(d => d.id !== draftId)
      updatedDrafts.push(draft)
      localStorage.setItem('assessmentDrafts', JSON.stringify(updatedDrafts))
      
      dispatch({ type: ASSESSMENT_ACTIONS.SAVE_DRAFT, payload: draft })
    } catch (error) {
      console.error('Failed to save draft:', error)
    }
  }, [state.currentForm])

  const loadDraft = useCallback((draftId) => {
    dispatch({ type: ASSESSMENT_ACTIONS.LOAD_DRAFT, payload: draftId })
  }, [])

  const deleteDraft = useCallback((draftId) => {
    try {
      const existingDrafts = JSON.parse(localStorage.getItem('assessmentDrafts') || '[]')
      const updatedDrafts = existingDrafts.filter(d => d.id !== draftId)
      localStorage.setItem('assessmentDrafts', JSON.stringify(updatedDrafts))
      
      dispatch({ type: ASSESSMENT_ACTIONS.DELETE_DRAFT, payload: draftId })
    } catch (error) {
      console.error('Failed to delete draft:', error)
    }
  }, [])

  // Load drafts on mount
  useEffect(() => {
    try {
      const savedDrafts = JSON.parse(localStorage.getItem('assessmentDrafts') || '[]')
      savedDrafts.forEach(draft => {
        dispatch({ type: ASSESSMENT_ACTIONS.SAVE_DRAFT, payload: draft })
      })
    } catch (error) {
      console.error('Failed to load drafts:', error)
    }
  }, [])

  // Auto-save draft functionality
  useEffect(() => {
    if (state.currentForm.isActive && state.currentForm.data.skillId) {
      const timer = setTimeout(() => {
        saveDraft()
      }, 30000) // Auto-save every 30 seconds

      return () => clearTimeout(timer)
    }
  }, [state.currentForm, saveDraft])

  // Context value
  const contextValue = {
    // State
    assessments: state.assessments,
    history: state.history,
    progression: state.progression,
    report: state.report,
    currentForm: state.currentForm,
    drafts: state.drafts,
    loading: state.loading,
    error: state.error,
    
    // Assessment CRUD
    fetchAssessments,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    
    // History and progression
    fetchHistory,
    fetchProgression,
    generateReport,
    
    // Multi-step form
    initializeForm,
    updateFormData,
    nextStep,
    prevStep,
    resetForm,
    submitForm,
    
    // Draft management
    saveDraft,
    loadDraft,
    deleteDraft,
    
    // Utilities
    clearError,
    isLoading: Object.values(state.loading).some(loading => loading),
    FORM_STEPS,
    
    // Form helpers
    isFormValid: state.currentForm.isValid,
    canGoNext: state.currentForm.isValid,
    canGoPrev: state.currentForm.currentStep !== FORM_STEPS.SKILL_SELECTION,
    isLastStep: state.currentForm.currentStep === FORM_STEPS.REVIEW,
    getCurrentStepIndex: () => Object.values(FORM_STEPS).indexOf(state.currentForm.currentStep) + 1
  }

  return (
    <AssessmentContext.Provider value={contextValue}>
      {children}
    </AssessmentContext.Provider>
  )
}

export function useAssessmentContext() {
  const ctx = useContext(AssessmentContext)
  if (!ctx) {
    throw new Error('useAssessmentContext must be used within AssessmentProvider')
  }
  return ctx
}