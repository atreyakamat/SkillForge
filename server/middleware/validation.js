import { body, validationResult } from 'express-validator'

export const validate = (rules) => [
  ...rules,
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400)
      return res.json({
        type: 'ValidationError',
        message: 'Invalid request payload',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg }))
      })
    }
    next()
  }
]

export const commonRules = {
  email: body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  password: body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  name: body('name').trim().isLength({ min: 2 }).withMessage('Name is required')
}


