import request from 'supertest'
import express from 'express'
import authRoutes from '../../routes/auth.routes.js'
import User from '../../models/User.js'

const app = express()
app.use(express.json())
app.use('/api/auth', authRoutes)

describe('Auth Routes Integration', () => {
  beforeEach(async () => {
    // Clean up users before each test
    await User.deleteMany({})
  })

  describe('POST /api/auth/register', () => {
    const validUserData = {
      name: 'Integration Test User',
      email: 'integration@example.com',
      password: 'TestPassword123!',
      role: 'Developer'
    }

    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUserData)
        .expect(201)

      expect(response.body).toMatchObject({
        success: true,
        message: 'User registered successfully',
        user: {
          name: validUserData.name,
          email: validUserData.email,
          role: validUserData.role
        }
      })

      expect(response.body.tokens.access).toBeDefined()
      expect(response.body.tokens.refresh).toBeDefined()

      // Verify user was created in database
      const user = await User.findOne({ email: validUserData.email })
      expect(user).toBeTruthy()
      expect(user.name).toBe(validUserData.name)
    })

    it('should reject duplicate email registration', async () => {
      // Create initial user
      await request(app)
        .post('/api/auth/register')
        .send(validUserData)
        .expect(201)

      // Try to register again with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...validUserData,
          name: 'Different Name'
        })
        .expect(400)

      expect(response.body.message).toBe('Email already in use')
    })

    it('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...validUserData,
          email: 'invalid-email'
        })
        .expect(422)

      expect(response.body.message).toContain('email')
    })

    it('should reject weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...validUserData,
          password: 'weak'
        })
        .expect(422)

      expect(response.body.message).toContain('password')
    })
  })

  describe('POST /api/auth/login', () => {
    const userData = {
      name: 'Login Test User',
      email: 'login@example.com',
      password: 'LoginPassword123!'
    }

    beforeEach(async () => {
      // Create a user for login tests
      await request(app)
        .post('/api/auth/register')
        .send(userData)
    })

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200)

      expect(response.body).toMatchObject({
        success: true,
        message: 'Login successful',
        user: {
          email: userData.email,
          name: userData.name
        }
      })

      expect(response.body.tokens.access).toBeDefined()
      expect(response.body.tokens.refresh).toBeDefined()
    })

    it('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: userData.password
        })
        .expect(401)

      expect(response.body.message).toBe('Invalid credentials')
    })

    it('should reject invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'wrong-password'
        })
        .expect(401)

      expect(response.body.message).toBe('Invalid credentials')
    })

    it('should reject malformed email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: userData.password
        })
        .expect(422)

      expect(response.body.message).toContain('email')
    })
  })
})