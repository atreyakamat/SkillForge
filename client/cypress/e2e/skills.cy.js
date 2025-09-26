describe('Skills Management', () => {
  beforeEach(() => {
    // Setup test user
    cy.request('POST', `${Cypress.env('apiUrl')}/auth/register`, {
      name: 'Skills Test User',
      email: 'skills@example.com',
      password: 'SkillsTest123!',
      role: 'Developer'
    }).then((response) => {
      window.localStorage.setItem('accessToken', response.body.tokens.access)
      window.localStorage.setItem('user', JSON.stringify(response.body.user))
    })
    
    cy.visit('/skills')
  })

  it('should display skills dashboard', () => {
    cy.get('[data-testid="skills-header"]').should('contain', 'My Skills')
    cy.get('[data-testid="add-skill-button"]').should('be.visible')
    cy.get('[data-testid="skills-list"]').should('exist')
  })

  it('should add a new skill', () => {
    cy.get('[data-testid="add-skill-button"]').click()
    cy.get('[data-testid="skill-name-input"]').type('JavaScript')
    cy.get('[data-testid="skill-category-select"]').select('Programming')
    cy.get('[data-testid="skill-level-select"]').select('Advanced')
    cy.get('[data-testid="skill-description-textarea"]').type('Experienced with modern JavaScript, ES6+, async/await')
    
    cy.get('[data-testid="save-skill-button"]').click()
    
    cy.get('[data-testid="skills-list"]').should('contain', 'JavaScript')
    cy.get('[data-testid="success-message"]').should('contain', 'Skill added successfully')
  })

  it('should edit an existing skill', () => {
    // First add a skill
    cy.get('[data-testid="add-skill-button"]').click()
    cy.get('[data-testid="skill-name-input"]').type('React')
    cy.get('[data-testid="skill-category-select"]').select('Framework')
    cy.get('[data-testid="skill-level-select"]').select('Intermediate')
    cy.get('[data-testid="save-skill-button"]').click()

    // Edit the skill
    cy.get('[data-testid="skill-item-React"] [data-testid="edit-skill-button"]').click()
    cy.get('[data-testid="skill-level-select"]').select('Advanced')
    cy.get('[data-testid="skill-description-textarea"]').clear().type('Expert in React hooks, context, and performance optimization')
    cy.get('[data-testid="save-skill-button"]').click()

    cy.get('[data-testid="skill-item-React"]').should('contain', 'Advanced')
    cy.get('[data-testid="success-message"]').should('contain', 'Skill updated successfully')
  })

  it('should delete a skill', () => {
    // First add a skill
    cy.get('[data-testid="add-skill-button"]').click()
    cy.get('[data-testid="skill-name-input"]').type('Vue.js')
    cy.get('[data-testid="skill-category-select"]').select('Framework')
    cy.get('[data-testid="skill-level-select"]').select('Beginner')
    cy.get('[data-testid="save-skill-button"]').click()

    // Delete the skill
    cy.get('[data-testid="skill-item-Vue.js"] [data-testid="delete-skill-button"]').click()
    cy.get('[data-testid="confirm-delete-button"]').click()

    cy.get('[data-testid="skills-list"]').should('not.contain', 'Vue.js')
    cy.get('[data-testid="success-message"]').should('contain', 'Skill deleted successfully')
  })

  it('should filter skills by category', () => {
    // Add multiple skills
    const skills = [
      { name: 'Python', category: 'Programming', level: 'Advanced' },
      { name: 'Docker', category: 'DevOps', level: 'Intermediate' },
      { name: 'Figma', category: 'Design', level: 'Beginner' }
    ]

    skills.forEach(skill => {
      cy.get('[data-testid="add-skill-button"]').click()
      cy.get('[data-testid="skill-name-input"]').type(skill.name)
      cy.get('[data-testid="skill-category-select"]').select(skill.category)
      cy.get('[data-testid="skill-level-select"]').select(skill.level)
      cy.get('[data-testid="save-skill-button"]').click()
      cy.wait(500) // Wait between additions
    })

    // Filter by Programming
    cy.get('[data-testid="category-filter"]').select('Programming')
    cy.get('[data-testid="skills-list"]').should('contain', 'Python')
    cy.get('[data-testid="skills-list"]').should('not.contain', 'Docker')
    cy.get('[data-testid="skills-list"]').should('not.contain', 'Figma')

    // Clear filter
    cy.get('[data-testid="category-filter"]').select('All')
    cy.get('[data-testid="skills-list"]').should('contain', 'Python')
    cy.get('[data-testid="skills-list"]').should('contain', 'Docker')
    cy.get('[data-testid="skills-list"]').should('contain', 'Figma')
  })

  it('should search skills by name', () => {
    // Add test skills
    cy.get('[data-testid="add-skill-button"]').click()
    cy.get('[data-testid="skill-name-input"]').type('Node.js')
    cy.get('[data-testid="skill-category-select"]').select('Backend')
    cy.get('[data-testid="skill-level-select"]').select('Advanced')
    cy.get('[data-testid="save-skill-button"]').click()

    cy.get('[data-testid="add-skill-button"]').click()
    cy.get('[data-testid="skill-name-input"]').type('MongoDB')
    cy.get('[data-testid="skill-category-select"]').select('Database')
    cy.get('[data-testid="skill-level-select"]').select('Intermediate')
    cy.get('[data-testid="save-skill-button"]').click()

    // Search functionality
    cy.get('[data-testid="skill-search-input"]').type('Node')
    cy.get('[data-testid="skills-list"]').should('contain', 'Node.js')
    cy.get('[data-testid="skills-list"]').should('not.contain', 'MongoDB')

    // Clear search
    cy.get('[data-testid="skill-search-input"]').clear()
    cy.get('[data-testid="skills-list"]').should('contain', 'Node.js')
    cy.get('[data-testid="skills-list"]').should('contain', 'MongoDB')
  })
})