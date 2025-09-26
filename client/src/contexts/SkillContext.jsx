import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import skillsAPI from '../services/skillsAPI.js'

const SkillContext = createContext(null)

export { SkillContext }

// Action types for reducer
const SKILL_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER_SKILLS: 'SET_USER_SKILLS',
  ADD_USER_SKILL: 'ADD_USER_SKILL',
  UPDATE_USER_SKILL: 'UPDATE_USER_SKILL',
  REMOVE_USER_SKILL: 'REMOVE_USER_SKILL',
  SET_ALL_SKILLS: 'SET_ALL_SKILLS',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_RECOMMENDATIONS: 'SET_RECOMMENDATIONS',
  SET_TRENDING_SKILLS: 'SET_TRENDING_SKILLS',
  OPTIMISTIC_ADD: 'OPTIMISTIC_ADD',
  OPTIMISTIC_UPDATE: 'OPTIMISTIC_UPDATE',
  OPTIMISTIC_REMOVE: 'OPTIMISTIC_REMOVE',
  REVERT_OPTIMISTIC: 'REVERT_OPTIMISTIC'
}

// Initial state
const initialState = {
  userSkills: [],
  allSkills: [],
  categories: [],
  recommendations: [],
  trendingSkills: [],
  loading: {
    userSkills: false,
    allSkills: false,
    categories: false,
    recommendations: false,
    action: false
  },
  error: null,
  lastFetch: {
    userSkills: null,
    allSkills: null,
    categories: null,
    recommendations: null
  },
  optimisticUpdates: []
}

// Reducer function
function skillReducer(state, action) {
  switch (action.type) {
    case SKILL_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.type]: action.payload.loading
        }
      }

    case SKILL_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: {
          ...state.loading,
          action: false
        }
      }

    case SKILL_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }

    case SKILL_ACTIONS.SET_USER_SKILLS:
      return {
        ...state,
        userSkills: action.payload,
        lastFetch: {
          ...state.lastFetch,
          userSkills: Date.now()
        },
        loading: {
          ...state.loading,
          userSkills: false
        },
        optimisticUpdates: []
      }

    case SKILL_ACTIONS.ADD_USER_SKILL:
      return {
        ...state,
        userSkills: [...state.userSkills, action.payload],
        loading: {
          ...state.loading,
          action: false
        }
      }

    case SKILL_ACTIONS.UPDATE_USER_SKILL:
      return {
        ...state,
        userSkills: state.userSkills.map(skill =>
          skill.skillId === action.payload.skillId ? { ...skill, ...action.payload } : skill
        ),
        loading: {
          ...state.loading,
          action: false
        }
      }

    case SKILL_ACTIONS.REMOVE_USER_SKILL:
      return {
        ...state,
        userSkills: state.userSkills.filter(skill => skill.skillId !== action.payload),
        loading: {
          ...state.loading,
          action: false
        }
      }

    case SKILL_ACTIONS.SET_ALL_SKILLS:
      return {
        ...state,
        allSkills: action.payload,
        lastFetch: {
          ...state.lastFetch,
          allSkills: Date.now()
        },
        loading: {
          ...state.loading,
          allSkills: false
        }
      }

    case SKILL_ACTIONS.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
        lastFetch: {
          ...state.lastFetch,
          categories: Date.now()
        },
        loading: {
          ...state.loading,
          categories: false
        }
      }

    case SKILL_ACTIONS.SET_RECOMMENDATIONS:
      return {
        ...state,
        recommendations: action.payload,
        lastFetch: {
          ...state.lastFetch,
          recommendations: Date.now()
        },
        loading: {
          ...state.loading,
          recommendations: false
        }
      }

    case SKILL_ACTIONS.SET_TRENDING_SKILLS:
      return {
        ...state,
        trendingSkills: action.payload
      }

    case SKILL_ACTIONS.OPTIMISTIC_ADD:
      return {
        ...state,
        userSkills: [...state.userSkills, action.payload.skill],
        optimisticUpdates: [...state.optimisticUpdates, { type: 'add', id: action.payload.tempId }],
        loading: {
          ...state.loading,
          action: true
        }
      }

    case SKILL_ACTIONS.OPTIMISTIC_UPDATE:
      return {
        ...state,
        userSkills: state.userSkills.map(skill =>
          skill.skillId === action.payload.skillId ? { ...skill, ...action.payload.updates } : skill
        ),
        optimisticUpdates: [...state.optimisticUpdates, { type: 'update', skillId: action.payload.skillId, original: action.payload.original }],
        loading: {
          ...state.loading,
          action: true
        }
      }

    case SKILL_ACTIONS.OPTIMISTIC_REMOVE:
      return {
        ...state,
        userSkills: state.userSkills.filter(skill => skill.skillId !== action.payload.skillId),
        optimisticUpdates: [...state.optimisticUpdates, { type: 'remove', skill: action.payload.skill }],
        loading: {
          ...state.loading,
          action: true
        }
      }

    case SKILL_ACTIONS.REVERT_OPTIMISTIC:
      // Revert all optimistic updates
      let revertedState = { ...state }
      state.optimisticUpdates.reverse().forEach(update => {
        switch (update.type) {
          case 'add':
            revertedState.userSkills = revertedState.userSkills.filter(skill => !skill.tempId || skill.tempId !== update.id)
            break
          case 'update':
            revertedState.userSkills = revertedState.userSkills.map(skill =>
              skill.skillId === update.skillId ? update.original : skill
            )
            break
          case 'remove':
            revertedState.userSkills = [...revertedState.userSkills, update.skill]
            break
        }
      })
      return {
        ...revertedState,
        optimisticUpdates: [],
        loading: {
          ...revertedState.loading,
          action: false
        }
      }

    default:
      return state
  }
}

export function SkillProvider({ children }) {
  const [state, dispatch] = useReducer(skillReducer, initialState)

  // Cache duration in milliseconds (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000

  // Helper function to check if data is stale
  const isStale = useCallback((lastFetch) => {
    return !lastFetch || (Date.now() - lastFetch) > CACHE_DURATION
  }, [])

  // Error handling helper
  const handleError = useCallback((error, operation) => {
    console.error(`Error in ${operation}:`, error)
    const errorMessage = error.message || `Failed to ${operation.toLowerCase()}`
    dispatch({ type: SKILL_ACTIONS.SET_ERROR, payload: errorMessage })
    
    // Revert optimistic updates on error
    if (state.optimisticUpdates.length > 0) {
      dispatch({ type: SKILL_ACTIONS.REVERT_OPTIMISTIC })
    }
  }, [state.optimisticUpdates])

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: SKILL_ACTIONS.CLEAR_ERROR })
  }, [])

  // Fetch user's skills
  const fetchUserSkills = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && !isStale(state.lastFetch.userSkills)) {
      return state.userSkills
    }

    dispatch({ type: SKILL_ACTIONS.SET_LOADING, payload: { type: 'userSkills', loading: true } })
    dispatch({ type: SKILL_ACTIONS.CLEAR_ERROR })

    try {
      const result = await skillsAPI.getUserSkills()
      if (result.success) {
        dispatch({ type: SKILL_ACTIONS.SET_USER_SKILLS, payload: result.skills })
        return result.skills
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      handleError(error, 'Fetch user skills')
      return []
    }
  }, [state.lastFetch.userSkills, state.userSkills, isStale, handleError])

  // Add skill to user profile
  const addSkill = useCallback(async (skillData) => {
    const tempId = Date.now().toString()
    const optimisticSkill = {
      ...skillData,
      tempId,
      skillId: skillData.skillId || tempId,
      skillName: skillData.skillName || 'New Skill',
      validationStatus: 'pending'
    }

    // Optimistic update
    dispatch({ type: SKILL_ACTIONS.OPTIMISTIC_ADD, payload: { skill: optimisticSkill, tempId } })
    dispatch({ type: SKILL_ACTIONS.CLEAR_ERROR })

    try {
      const result = await skillsAPI.addUserSkill(skillData)
      if (result.success) {
        // Replace optimistic update with real data
        await fetchUserSkills(true)
        return result.assessment
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      handleError(error, 'Add skill')
      throw error
    }
  }, [fetchUserSkills, handleError])

  // Update skill rating/evidence
  const updateSkill = useCallback(async (skillId, updateData) => {
    const originalSkill = state.userSkills.find(skill => skill.skillId === skillId)
    if (!originalSkill) {
      throw new Error('Skill not found')
    }

    // Optimistic update
    dispatch({
      type: SKILL_ACTIONS.OPTIMISTIC_UPDATE,
      payload: { skillId, updates: updateData, original: originalSkill }
    })
    dispatch({ type: SKILL_ACTIONS.CLEAR_ERROR })

    try {
      const result = await skillsAPI.updateUserSkill(skillId, updateData)
      if (result.success) {
        // Update with real data
        dispatch({ type: SKILL_ACTIONS.UPDATE_USER_SKILL, payload: { skillId, ...result.assessment } })
        return result.assessment
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      handleError(error, 'Update skill')
      throw error
    }
  }, [state.userSkills, handleError])

  // Delete skill from user profile
  const deleteSkill = useCallback(async (skillId) => {
    const skillToRemove = state.userSkills.find(skill => skill.skillId === skillId)
    if (!skillToRemove) {
      throw new Error('Skill not found')
    }

    // Optimistic update
    dispatch({
      type: SKILL_ACTIONS.OPTIMISTIC_REMOVE,
      payload: { skillId, skill: skillToRemove }
    })
    dispatch({ type: SKILL_ACTIONS.CLEAR_ERROR })

    try {
      const result = await skillsAPI.removeUserSkill(skillId)
      if (result.success) {
        dispatch({ type: SKILL_ACTIONS.REMOVE_USER_SKILL, payload: skillId })
        return true
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      handleError(error, 'Delete skill')
      throw error
    }
  }, [state.userSkills, handleError])

  // Fetch all available skills (master taxonomy)
  const fetchAllSkills = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && !isStale(state.lastFetch.allSkills)) {
      return state.allSkills
    }

    dispatch({ type: SKILL_ACTIONS.SET_LOADING, payload: { type: 'allSkills', loading: true } })
    dispatch({ type: SKILL_ACTIONS.CLEAR_ERROR })

    try {
      const result = await skillsAPI.getAllSkills()
      if (result.success) {
        dispatch({ type: SKILL_ACTIONS.SET_ALL_SKILLS, payload: result.skills })
        return result.skills
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      handleError(error, 'Fetch all skills')
      return []
    }
  }, [state.lastFetch.allSkills, state.allSkills, isStale, handleError])

  // Fetch skill categories
  const fetchSkillCategories = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && !isStale(state.lastFetch.categories)) {
      return state.categories
    }

    dispatch({ type: SKILL_ACTIONS.SET_LOADING, payload: { type: 'categories', loading: true } })
    dispatch({ type: SKILL_ACTIONS.CLEAR_ERROR })

    try {
      const result = await skillsAPI.getSkillCategories()
      if (result.success) {
        dispatch({ type: SKILL_ACTIONS.SET_CATEGORIES, payload: result.categories })
        return result.categories
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      handleError(error, 'Fetch skill categories')
      return []
    }
  }, [state.lastFetch.categories, state.categories, isStale, handleError])

  // Get AI skill recommendations
  const getRecommendations = useCallback(async (userId = null, forceRefresh = false) => {
    if (!forceRefresh && !isStale(state.lastFetch.recommendations)) {
      return state.recommendations
    }

    dispatch({ type: SKILL_ACTIONS.SET_LOADING, payload: { type: 'recommendations', loading: true } })
    dispatch({ type: SKILL_ACTIONS.CLEAR_ERROR })

    try {
      // Note: This would need to be implemented in skillsAPI.js to match backend endpoint
      // For now, using a placeholder that would call the suggestions endpoint
      const result = await skillsAPI.getSkillSuggestions({ userId, limit: 10 })
      if (result.success) {
        dispatch({ type: SKILL_ACTIONS.SET_RECOMMENDATIONS, payload: result.suggestions })
        return result.suggestions
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      handleError(error, 'Get skill recommendations')
      return []
    }
  }, [state.lastFetch.recommendations, state.recommendations, isStale, handleError])

  // Fetch trending skills
  const fetchTrendingSkills = useCallback(async () => {
    try {
      const result = await skillsAPI.getTrendingSkills({ limit: 20 })
      if (result.success) {
        dispatch({ type: SKILL_ACTIONS.SET_TRENDING_SKILLS, payload: result.skills })
        return result.skills
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      handleError(error, 'Fetch trending skills')
      return []
    }
  }, [handleError])

  // Search skills
  const searchSkills = useCallback(async (query, filters = {}) => {
    try {
      const result = await skillsAPI.searchSkills(query, filters)
      if (result.success) {
        return result.skills
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      handleError(error, 'Search skills')
      return []
    }
  }, [handleError])

  // Get skill details
  const getSkillDetails = useCallback(async (skillId) => {
    try {
      // This would need to be added to skillsAPI.js
      const result = await skillsAPI.getSkillById(skillId)
      if (result.success) {
        return result.skill
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      handleError(error, 'Get skill details')
      return null
    }
  }, [handleError])

  // Auto-load initial data
  useEffect(() => {
    fetchUserSkills()
    fetchSkillCategories()
    fetchTrendingSkills()
  }, []) // Only run once on mount

  // Context value
  const contextValue = {
    // State
    userSkills: state.userSkills,
    allSkills: state.allSkills,
    categories: state.categories,
    recommendations: state.recommendations,
    trendingSkills: state.trendingSkills,
    loading: state.loading,
    error: state.error,
    
    // Actions
    fetchUserSkills,
    addSkill,
    updateSkill,
    deleteSkill,
    fetchAllSkills,
    fetchSkillCategories,
    getRecommendations,
    fetchTrendingSkills,
    searchSkills,
    getSkillDetails,
    clearError,
    
    // Utilities
    isLoading: Object.values(state.loading).some(loading => loading),
    hasOptimisticUpdates: state.optimisticUpdates.length > 0
  }

  return (
    <SkillContext.Provider value={contextValue}>
      {children}
    </SkillContext.Provider>
  )
}

export function useSkillContext() {
  const ctx = useContext(SkillContext)
  if (!ctx) {
    throw new Error('useSkillContext must be used within SkillProvider')
  }
  return ctx
}


