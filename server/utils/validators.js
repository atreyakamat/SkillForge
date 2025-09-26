import Joi from 'joi'

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/[a-z]/)
    .pattern(/[A-Z]/)
    .pattern(/[0-9]/)
    .required()
})

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

export const forgotSchema = Joi.object({
  email: Joi.string().email().required()
})

export const resetSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string()
    .min(8)
    .pattern(/[a-z]/)
    .pattern(/[A-Z]/)
    .pattern(/[0-9]/)
    .required()
})

export function validate(schema, data) {
  const { error, value } = schema.validate(data)
  if (error) {
    const message = error.details?.[0]?.message || 'Validation error'
    const err = new Error(message)
    err.status = 400
    throw err
  }
  return value
}

