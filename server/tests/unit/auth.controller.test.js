import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { register, login } from '../../controllers/auth.controller.js'
import User from '../../models/User.js'

// Mock dependencies
jest.mock('../../models/User.js')
jest.mock('../../models/Token.js')
jest.mock('../../models/ActionToken.js')
jest.mock('../../utils/email.js')

describe('Auth Controller', () => {
  let req, res

  beforeEach(() => {
    req = {
      body: {}
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    jest.clearAllMocks()
  })

  describe('register', () => {
    const validUserData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPassword123!'
    }

    it('should register a new user successfully', async () => {
      req.body = validUserData
      
      User.findOne.mockResolvedValue(null) // No existing user
      User.create.mockResolvedValue({
        _id: 'user123',
        name: validUserData.name,
        email: validUserData.email,
        role: 'user'
      })

      await register(req, res)

      expect(User.findOne).toHaveBeenCalledWith({ email: validUserData.email })
      expect(User.create).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'User registered successfully',
          user: expect.objectContaining({
            id: 'user123',
            name: validUserData.name,
            email: validUserData.email
          }),
          tokens: expect.objectContaining({
            access: expect.any(String),
            refresh: expect.any(String)
          })
        })
      )
    })

    it('should reject registration with existing email', async () => {
      req.body = validUserData
      
      User.findOne.mockResolvedValue({ email: validUserData.email }) // Existing user

      await register(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email already in use'
      })
    })

    it('should handle validation errors', async () => {
      req.body = {
        name: '',
        email: 'invalid-email',
        password: 'weak'
      }

      await expect(register(req, res)).rejects.toThrow()
    })
  })

  describe('login', () => {
    const validLoginData = {
      email: 'test@example.com',
      password: 'TestPassword123!'
    }

    it('should login user with valid credentials', async () => {
      req.body = validLoginData
      const hashedPassword = await bcrypt.hash(validLoginData.password, 10)
      
      User.findOne.mockResolvedValue({
        _id: 'user123',
        name: 'Test User',
        email: validLoginData.email,
        passwordHash: hashedPassword,
        role: 'user'
      })

      await login(req, res)

      expect(User.findOne).toHaveBeenCalledWith({ email: validLoginData.email })
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Login successful',
          user: expect.objectContaining({
            id: 'user123',
            email: validLoginData.email
          }),
          tokens: expect.objectContaining({
            access: expect.any(String),
            refresh: expect.any(String)
          })
        })
      )
    })

    it('should reject login with non-existent user', async () => {
      req.body = validLoginData
      User.findOne.mockResolvedValue(null)

      await login(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials'
      })
    })

    it('should reject login with invalid password', async () => {
      req.body = validLoginData
      User.findOne.mockResolvedValue({
        _id: 'user123',
        email: validLoginData.email,
        passwordHash: await bcrypt.hash('different-password', 10)
      })

      await login(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials'
      })
    })
  })
})