describe('Login spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.get('#login-link').click()
  })

  it('button to submit form login is disabled by default', () => {
    cy.get('button[type=submit]').should('exist')
    cy.get('button[type=submit]').should('be.disabled')
  })

  it('links redirect on register page', () => {
    cy.get('#register-link').contains('S\'inscrire')
    cy.get('#register-link').click()
    cy.url().should('include', '/register')
  })

  it('links redirect on mot-de-passe-oublie page', () => {
    cy.get('#mot-de-passe-oublie-link').contains('Mot de passe oublié')
    cy.get('#mot-de-passe-oublie-link').click()
    cy.url().should('include', '/mot-de-passe-oublie')
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
    cy.get('button[type=submit]').click()

    cy.get('h3>span').contains('Événements')

    cy.get('[data-cy=user-menu-in-header]').within(() => {
      cy.get('[data-cy=user-menu-button]').click()
      cy.get('[data-cy=user-menu-logout-link]').click()
    })
  })
})
