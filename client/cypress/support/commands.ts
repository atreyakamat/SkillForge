// ***********************************************
// Custom commands for SkillForge E2E tests
// ***********************************************

// Login command
Cypress.Commands.add('login', (email, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/auth/login`,
    body: {
      email,
      password
    }
  }).then((response) => {
    expect(response.status).to.eq(200)
    window.localStorage.setItem('accessToken', response.body.tokens.access)
    window.localStorage.setItem('user', JSON.stringify(response.body.user))
  })
})

// Clear test data command
Cypress.Commands.add('clearTestData', () => {
  cy.request({
    method: 'DELETE',
    url: `${Cypress.env('apiUrl')}/test/clear-users`,
    failOnStatusCode: false
  })
})

// Seed test data command
Cypress.Commands.add('seedTestData', () => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/test/seed-data`,
    failOnStatusCode: false
  })
})