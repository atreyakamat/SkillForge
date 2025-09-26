/* eslint-disable no-unused-vars */
export function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
}

export function errorHandler(err, req, res, next) {
  const isProd = (process.env.NODE_ENV || 'development') === 'production'
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500

  let message = err.message || 'Server error'

  const response = {
    success: false,
    message
  }

  if (!isProd) {
    response.stack = err.stack
  }

  res.status(statusCode).json(response)
}


