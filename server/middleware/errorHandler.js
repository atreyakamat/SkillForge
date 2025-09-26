/* eslint-disable no-unused-vars */
export function notFound(req, res, next) {
  res.status(404)
  next(new Error(`Not Found - ${req.originalUrl}`))
}

export function errorHandler(err, req, res, next) {
  const isProd = (process.env.NODE_ENV || 'development') === 'production'
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500

  let message = err.message || 'Server error'
  let type = 'ServerError'

  // Validation errors (from express-validator or mongoose)
  if (err.name === 'ValidationError') {
    type = 'ValidationError'
  }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    type = 'AuthError'
  }

  const response = {
    message,
    type
  }

  if (!isProd) {
    response.stack = err.stack
  }

  res.status(statusCode).json(response)
}


