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
  getSkillDetails
} from '../controllers/skill.controller.js'

const router = Router()

router.get('/', getAllSkills)
router.get('/categories', getCategories)
router.get('/details/:id', getSkillDetails)
router.get('/user/:userId', requireAuth, getUserSkills)
router.post('/user', requireAuth, validate([
  commonRules.email.optional({ nullable: true }), // placeholder rule to keep validate in use; can be removed
]), addUserSkill)
router.put('/user/:skillId', requireAuth, updateSkillRating)
router.delete('/user/:skillId', requireAuth, deleteUserSkill)
router.get('/suggestions/:userId', requireAuth, suggestSkills)

export default router


