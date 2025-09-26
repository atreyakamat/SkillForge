const TOKEN_KEY = 'skillforge_token'

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setStoredToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {}
}

export function removeStoredToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {}
}

