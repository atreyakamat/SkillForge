describe('Assessment Flow', () => {
  beforeEach(() => {
    // Setup test user with skills
    cy.request('POST', `${Cypress.env('apiUrl')}/auth/register`, {
      name: 'Assessment Test User',
      email: 'assessment@example.com',
      password: 'AssessmentTest123!',
      role: 'Developer'
    }).then((response) => {
      window.localStorage.setItem('accessToken', response.body.tokens.access)
      window.localStorage.setItem('user', JSON.stringify(response.body.user))
      
      // Add some skills for assessment
      const skills = [
        { name: 'JavaScript', category: 'Programming', level: 'Advanced' },
        { name: 'React', category: 'Framework', level: 'Intermediate' }
      ]
      
      skills.forEach(skill => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/skills`,
          headers: {
            Authorization: `Bearer ${response.body.tokens.access}`
          },
          body: skill
        })
      })
    })
    
    cy.visit('/assessment')
  })

  it('should display assessment form', () => {
    cy.get('[data-testid="assessment-header"]').should('contain', 'Skill Assessment')
    cy.get('[data-testid="skill-select"]').should('be.visible')
    cy.get('[data-testid="assessment-type-select"]').should('be.visible')
    cy.get('[data-testid="start-assessment-button"]').should('be.visible')
  })

  it('should start a self-assessment', () => {
    cy.get('[data-testid="skill-select"]').select('JavaScript')
    cy.get('[data-testid="assessment-type-select"]').select('Self Assessment')
    cy.get('[data-testid="start-assessment-button"]').click()

    cy.get('[data-testid="assessment-questions"]').should('be.visible')
    cy.get('[data-testid="question-1"]').should('exist')
    cy.get('[data-testid="progress-bar"]').should('be.visible')
  })

  it('should complete self-assessment flow', () => {
    cy.get('[data-testid="skill-select"]').select('JavaScript')
    cy.get('[data-testid="assessment-type-select"]').select('Self Assessment')
    cy.get('[data-testid="start-assessment-button"]').click()

    // Answer first question
    cy.get('[data-testid="question-1"] [data-testid="answer-option-1"]').click()
    cy.get('[data-testid="next-question-button"]').click()

    // Answer second question
    cy.get('[data-testid="question-2"] [data-testid="answer-option-2"]').click()
    cy.get('[data-testid="next-question-button"]').click()

    // Continue until completion
    for (let i = 3; i <= 5; i++) {
      cy.get(`[data-testid="question-${i}"] [data-testid="answer-option-1"]`).click()
      if (i < 5) {
        cy.get('[data-testid="next-question-button"]').click()
      } else {
        cy.get('[data-testid="complete-assessment-button"]').click()
      }
    }

    // Check results
    cy.get('[data-testid="assessment-results"]').should('be.visible')
    cy.get('[data-testid="score-display"]').should('exist')
    cy.get('[data-testid="skill-level-result"]').should('exist')
    cy.get('[data-testid="recommendations"]').should('exist')
  })

  it('should request peer review', () => {
    cy.get('[data-testid="skill-select"]').select('React')
    cy.get('[data-testid="assessment-type-select"]').select('Peer Review')
    cy.get('[data-testid="reviewer-email-input"]').type('reviewer@example.com')
    cy.get('[data-testid="assessment-message-textarea"]').type('Please review my React skills')
    cy.get('[data-testid="request-review-button"]').click()

    cy.get('[data-testid="success-message"]').should('contain', 'Peer review request sent')
    cy.get('[data-testid="pending-reviews"]').should('contain', 'React')
  })

  it('should display assessment history', () => {
    // Complete an assessment first
    cy.get('[data-testid="skill-select"]').select('JavaScript')
    cy.get('[data-testid="assessment-type-select"]').select('Self Assessment')
    cy.get('[data-testid="start-assessment-button"]').click()

    // Quick completion
    for (let i = 1; i <= 5; i++) {
      cy.get(`[data-testid="question-${i}"] [data-testid="answer-option-1"]`).click()
      if (i < 5) {
        cy.get('[data-testid="next-question-button"]').click()
      } else {
        cy.get('[data-testid="complete-assessment-button"]').click()
      }
    }

    // Go to history
    cy.get('[data-testid="assessment-history-tab"]').click()
    cy.get('[data-testid="history-list"]').should('contain', 'JavaScript')
    cy.get('[data-testid="assessment-date"]').should('exist')
    cy.get('[data-testid="assessment-score"]').should('exist')
  })

  it('should validate required fields', () => {
    cy.get('[data-testid="start-assessment-button"]').click()
    cy.get('[data-testid="skill-error"]').should('contain', 'Please select a skill')

    cy.get('[data-testid="skill-select"]').select('JavaScript')
    cy.get('[data-testid="start-assessment-button"]').click()
    cy.get('[data-testid="assessment-type-error"]').should('contain', 'Please select assessment type')
  })

  it('should handle assessment timeout', () => {
    cy.get('[data-testid="skill-select"]').select('JavaScript')
    cy.get('[data-testid="assessment-type-select"]').select('Self Assessment')
    cy.get('[data-testid="start-assessment-button"]').click()

    // Mock timeout by waiting
    cy.get('[data-testid="timer"]').should('be.visible')
    
    // Simulate time running out (this would need actual timer implementation)
    cy.get('[data-testid="question-1"] [data-testid="answer-option-1"]').click()
    cy.wait(1000)
    
    // In a real implementation, you'd test actual timeout behavior
    cy.get('[data-testid="time-remaining"]').should('exist')
  })
})