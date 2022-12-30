describe('register spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/register')
  })

  it('load register page', () => {
    cy.get('h1').should('exist')
    cy.get('h1').contains('Bienvenue sur')
    cy.get('header').should('exist')
    cy.get('footer').should('exist')
  })

  it('button to submit form register is disabled by default', () => {
    cy.get('button[type=submit]').should('exist')
    cy.get('button[type=submit]').should('be.disabled')
  })

  it('form login render correct data', () => {
    cy.get('button[type=submit]').should('exist')
    cy.get('button[type=submit]').should('be.disabled')

    cy.get('#companyName').should('exist')
    cy.get('#companyName').type('Poudlard')
    cy.get('#companyName').should('have.value', 'Poudlard')

    cy.get('#firstName').should('exist')
    cy.get('#firstName').type('Argus')
    cy.get('#firstName').should('have.value', 'Argus')

    cy.get('#lastName').should('exist')
    cy.get('#lastName').type('Rusard')
    cy.get('#lastName').should('have.value', 'Rusard')

    cy.get('#email').should('exist')
    cy.get('#email').type('argus@poudlard.com')
    cy.get('#email').should('have.value', 'argus@poudlard.com')

    cy.get('#password').should('exist')
    cy.get('#password').type('password')
    cy.get('#password').should('have.value', 'password')

    cy.get('button[type=submit]').should('be.enabled')
  })

  it('links redirect on register page', () => {
    cy.get('#already-account-link').contains('J\'ai déjà un compte')
    cy.get('#already-account-link').click()
    cy.url().should('include', '/login')
  })

  // TODO test submission
})
