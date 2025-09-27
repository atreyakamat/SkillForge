import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { validate, commonRules } from '../middleware/validation.js'
import {
  getAllSkills,
  getCategories,
  getUserSkills,
  addUserSkill,
  updateSkillRating,
  deleteUserSkill,
  suggestSkills,
  getSkillDetails,
  createSkill
} from '../controllers/skill.controller.js'

const router = Router()

router.get('/', getAllSkills)
router.get('/categories', getCategories)
router.get('/details/:id', getSkillDetails)
router.post('/', createSkill) // Create new skill
router.get('/me', requireAuth, (req, res) => getUserSkills(req, res)) // Get current user's skills
router.get('/user/:userId', requireAuth, getUserSkills)
router.post('/me', requireAuth, validate([
  commonRules.email.optional({ nullable: true }), // placeholder rule to keep validate in use; can be removed
]), addUserSkill) // Add skill to current user
router.post('/user', requireAuth, validate([
  commonRules.email.optional({ nullable: true }), // placeholder rule to keep validate in use; can be removed
]), addUserSkill)
router.put('/me/:skillId', requireAuth, updateSkillRating) // Update current user's skill
router.put('/user/:skillId', requireAuth, updateSkillRating)
router.delete('/me/:skillId', requireAuth, deleteUserSkill) // Delete current user's skill
router.delete('/user/:skillId', requireAuth, deleteUserSkill)
router.get('/suggestions/:userId', requireAuth, suggestSkills)

export default router


