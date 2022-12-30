describe('Login spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.get('#login-link').click()
  })

  it('load login page', () => {
    cy.get('h1').should('exist')
    cy.get('h1').contains('Connectez vous sur')
    cy.get('header').should('exist')
    cy.get('footer').should('exist')
  })

  it('button to submit form newsletter is disabled by default', () => {
    cy.get('button[type=submit]').should('exist')
    cy.get('button[type=submit]').should('be.disabled')
  })

  it('form login render correct data', () => {
    cy.get('button[type=submit]').should('exist')
    cy.get('button[type=submit]').should('be.disabled')

    cy.get('#email').should('exist')
    cy.get('#email').type('albus@poudlard.com')
    cy.get('#email').should('have.value', 'albus@poudlard.com')

    cy.get('#password').should('exist')
    cy.get('#password').type('password')
    cy.get('#password').should('have.value', 'password')

    cy.get('button[type=submit]').should('be.enabled')
  })

  it('links redirect on register page', () => {
    cy.get('#register-link').contains('S\'inscrire')
    cy.get('#register-link').click()
    cy.url().should('include', '/register')
  })

  it('links redirect on forgot-password page', () => {
    cy.get('#forgot-password-link').contains('Mot de passe oublié')
    cy.get('#forgot-password-link').click()
    cy.url().should('include', '/forgot-password')
  })

  // TODO test submission
})
