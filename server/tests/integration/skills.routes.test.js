import request from 'supertest'
import express from 'express'
import skillRoutes from '../../routes/skill.routes.js'
import { requireAuth } from '../../middleware/auth.js'
import jwt from 'jsonwebtoken'

// Mock auth middleware for testing
jest.mock('../../middleware/auth.js', () => ({
  requireAuth: (req, res, next) => {
    req.user = { id: 'test-user-id', email: 'test@example.com' }
    next()
  }
}))

const app = express()
app.use(express.json())
app.use('/api/skills', skillRoutes)

describe('Skills Routes Integration', () => {
  describe('GET /api/skills', () => {
    it('should return list of skills', async () => {
      const response = await request(app)
        .get('/api/skills')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.skills)).toBe(true)
      expect(response.body.categories).toBeDefined()
    })

    it('should filter skills by category when provided', async () => {
      const response = await request(app)
        .get('/api/skills?category=Programming')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.skills)).toBe(true)
    })
  })

  describe('GET /api/skills/categories', () => {
    it('should return list of skill categories', async () => {
      const response = await request(app)
        .get('/api/skills/categories')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.categories)).toBe(true)
    })
  })

  describe('POST /api/skills', () => {
    const validSkillData = {
      name: 'Integration Test Skill',
      category: 'Testing',
      description: 'A skill for integration testing'
    }

    it('should create a new skill', async () => {
      const response = await request(app)
        .post('/api/skills')
        .send(validSkillData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.skill).toMatchObject({
        name: validSkillData.name,
        category: validSkillData.category,
        description: validSkillData.description
      })
    })

    it('should reject skill creation without name', async () => {
      const response = await request(app)
        .post('/api/skills')
        .send({
          category: 'Testing',
          description: 'Missing name'
        })
        .expect(400)

      expect(response.body.success).toBe(false)
    })

    it('should reject duplicate skill name', async () => {
      // Create first skill
      await request(app)
        .post('/api/skills')
        .send(validSkillData)
        .expect(201)

      // Try to create duplicate
      const response = await request(app)
        .post('/api/skills')
        .send({
          ...validSkillData,
          description: 'Different description'
        })
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('already exists')
    })
  })
})