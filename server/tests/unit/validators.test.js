import { validate, registerSchema, loginSchema } from '../../utils/validators.js'

describe('Validators', () => {
  describe('registerSchema', () => {
    it('should validate valid registration data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        role: 'Developer'
      }

      const result = validate(registerSchema, validData)
      expect(result).toEqual(validData)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'Password123!',
        role: 'Developer'
      }

      expect(() => validate(registerSchema, invalidData)).toThrow()
    })

    it('should reject weak password', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'weak',
        role: 'Developer'
      }

      expect(() => validate(registerSchema, invalidData)).toThrow()
    })

    it('should reject missing name', () => {
      const invalidData = {
        name: '',
        email: 'john@example.com',
        password: 'Password123!',
        role: 'Developer'
      }

      expect(() => validate(registerSchema, invalidData)).toThrow()
    })

    it('should accept optional fields', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        industry: 'Technology',
        experience: 5
      }

      const result = validate(registerSchema, validData)
      expect(result).toEqual(validData)
    })
  })

  describe('loginSchema', () => {
    it('should validate valid login data', () => {
      const validData = {
        email: 'john@example.com',
        password: 'anypassword'
      }

      const result = validate(loginSchema, validData)
      expect(result).toEqual(validData)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'anypassword'
      }

      expect(() => validate(loginSchema, invalidData)).toThrow()
    })

    it('should reject missing password', () => {
      const invalidData = {
        email: 'john@example.com'
      }

      expect(() => validate(loginSchema, invalidData)).toThrow()
    })
  })
})