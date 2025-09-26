export const SKILL_CATEGORIES = {
  Programming: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go'],
  Frontend: ['React', 'CSS', 'HTML', 'Tailwind'],
  Backend: ['Node.js', 'Express', 'MongoDB'],
  DevOps: ['Docker', 'CI/CD']
}

export const PROFICIENCY_LEVELS = [
  { level: 1, label: 'Novice' },
  { level: 3, label: 'Beginner' },
  { level: 5, label: 'Intermediate' },
  { level: 7, label: 'Advanced' },
  { level: 9, label: 'Expert' }
]

export const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Education']

export const DEFAULT_PREFERENCES = {
  notifications: true,
  privacy: 'private'
}

export const ERRORS = {
  VALIDATION: 'Validation error',
  NOT_FOUND: 'Resource not found',
  SERVER: 'Server error'
}

export const EMAIL_TEMPLATES = {
  welcome: (name) => `Welcome to SkillForge, ${name}!`,
  verify: (url) => `Verify your email: ${url}`,
  reset: (url) => `Reset your password: ${url}`
}

