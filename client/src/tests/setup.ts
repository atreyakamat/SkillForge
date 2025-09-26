import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Mock API server for testing
export const server = setupServer(
  // Mock authentication endpoints
  http.post('http://localhost:5000/api/auth/login', () => {
    return HttpResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      },
      tokens: {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token'
      }
    })
  }),
  
  http.post('http://localhost:5000/api/auth/register', () => {
    return HttpResponse.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      },
      tokens: {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token'
      }
    })
  }),

  // Mock skills endpoint
  http.get('http://localhost:5000/api/skills', () => {
    return HttpResponse.json({
      success: true,
      skills: [
        { _id: '1', name: 'JavaScript', category: 'Programming', description: 'JS programming' },
        { _id: '2', name: 'React', category: 'Frontend', description: 'React framework' }
      ]
    })
  })
)

// Start mock server before tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

// Reset handlers after each test
afterEach(() => {
  cleanup()
  server.resetHandlers()
})

// Close server after all tests
afterAll(() => {
  server.close()
})

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})