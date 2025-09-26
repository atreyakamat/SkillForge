describe('User Registration and Authentication', () => {
  beforeEach(() => {
    // Clear any existing user data
    cy.request('DELETE', `${Cypress.env('apiUrl')}/test/clear-users`)
    cy.visit('/register')
  })

  it('should complete user registration flow', () => {
    // Fill registration form
    cy.get('[data-testid="name-input"]').type('Cypress Test User')
    cy.get('[data-testid="email-input"]').type('cypress@example.com')
    cy.get('[data-testid="password-input"]').type('CypressTest123!')
    cy.get('[data-testid="confirm-password-input"]').type('CypressTest123!')
    cy.get('[data-testid="role-select"]').select('Developer')
    cy.get('[data-testid="terms-checkbox"]').check()

    // Submit form
    cy.get('[data-testid="register-button"]').click()

    // Should redirect to dashboard
    cy.url().should('include', '/dashboard')
    cy.get('[data-testid="welcome-message"]').should('contain', 'Welcome, Cypress Test User')
  })

  it('should show validation errors for invalid input', () => {
    // Try to submit without filling required fields
    cy.get('[data-testid="register-button"]').click()

    // Should show validation errors
    cy.get('[data-testid="name-error"]').should('contain', 'Name is required')
    cy.get('[data-testid="email-error"]').should('contain', 'Email is required')
    cy.get('[data-testid="password-error"]').should('contain', 'Password is required')
  })

  it('should validate password strength', () => {
    cy.get('[data-testid="password-input"]').type('weak')
    cy.get('[data-testid="password-strength"]').should('contain', 'Weak')
    
    cy.get('[data-testid="password-input"]').clear().type('StrongPassword123!')
    cy.get('[data-testid="password-strength"]').should('contain', 'Strong')
  })

  it('should prevent registration with existing email', () => {
    // First registration
    cy.get('[data-testid="name-input"]').type('First User')
    cy.get('[data-testid="email-input"]').type('existing@example.com')
    cy.get('[data-testid="password-input"]').type('Password123!')
    cy.get('[data-testid="confirm-password-input"]').type('Password123!')
    cy.get('[data-testid="role-select"]').select('Developer')
    cy.get('[data-testid="terms-checkbox"]').check()
    cy.get('[data-testid="register-button"]').click()

    // Wait for success and navigate back
    cy.url().should('include', '/dashboard')
    cy.visit('/register')

    // Try to register with same email
    cy.get('[data-testid="name-input"]').type('Second User')
    cy.get('[data-testid="email-input"]').type('existing@example.com')
    cy.get('[data-testid="password-input"]').type('Password123!')
    cy.get('[data-testid="confirm-password-input"]').type('Password123!')
    cy.get('[data-testid="role-select"]').select('Designer')
    cy.get('[data-testid="terms-checkbox"]').check()
    cy.get('[data-testid="register-button"]').click()

    // Should show error message
    cy.get('[data-testid="server-error"]').should('contain', 'Email already in use')
  })
})

describe('Login Flow', () => {
  beforeEach(() => {
    // Create a test user for login tests
    cy.request('POST', `${Cypress.env('apiUrl')}/auth/register`, {
      name: 'Login Test User',
      email: 'login@example.com',
      password: 'LoginTest123!',
      role: 'Developer'
    })
    cy.visit('/login')
  })

  it('should login with valid credentials', () => {
    cy.get('[data-testid="email-input"]').type('login@example.com')
    cy.get('[data-testid="password-input"]').type('LoginTest123!')
    cy.get('[data-testid="login-button"]').click()

    // Should redirect to dashboard
    cy.url().should('include', '/dashboard')
    cy.get('[data-testid="user-name"]').should('contain', 'Login Test User')
  })

  it('should show error for invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('login@example.com')
    cy.get('[data-testid="password-input"]').type('WrongPassword')
    cy.get('[data-testid="login-button"]').click()

    cy.get('[data-testid="login-error"]').should('contain', 'Invalid credentials')
    cy.url().should('include', '/login')
  })

  it('should validate email format', () => {
    cy.get('[data-testid="email-input"]').type('invalid-email')
    cy.get('[data-testid="password-input"]').type('Password123!')
    cy.get('[data-testid="login-button"]').click()

    cy.get('[data-testid="email-error"]').should('contain', 'valid email')
  })
})

describe('Dashboard and Navigation', () => {
  beforeEach(() => {
    // Login before each test
    cy.request('POST', `${Cypress.env('apiUrl')}/auth/login`, {
      email: 'login@example.com',
      password: 'LoginTest123!'
    }).then((response) => {
      window.localStorage.setItem('accessToken', response.body.tokens.access)
      window.localStorage.setItem('user', JSON.stringify(response.body.user))
    })
    cy.visit('/dashboard')
  })

  it('should display user dashboard', () => {
    cy.get('[data-testid="dashboard-header"]').should('be.visible')
    cy.get('[data-testid="skills-section"]').should('be.visible')
    cy.get('[data-testid="analytics-section"]').should('be.visible')
  })

  it('should navigate to skills page', () => {
    cy.get('[data-testid="nav-skills"]').click()
    cy.url().should('include', '/skills')
    cy.get('[data-testid="skills-list"]').should('be.visible')
  })

  it('should navigate to assessment page', () => {
    cy.get('[data-testid="nav-assessment"]').click()
    cy.url().should('include', '/assessment')
    cy.get('[data-testid="assessment-form"]').should('be.visible')
  })

  it('should logout successfully', () => {
    cy.get('[data-testid="user-menu"]').click()
    cy.get('[data-testid="logout-button"]').click()
    
    cy.url().should('include', '/login')
    cy.window().then((win) => {
      expect(win.localStorage.getItem('accessToken')).to.be.null
    })
  })
})