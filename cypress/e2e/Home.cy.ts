describe('empty spec', () => {
  it('load landing page', () => {
    cy.visit('http://localhost:3000/')
    cy.get('h1').should('exist')
    cy.get('h1').contains('comment ça marche')
  })

  it('button to submit form newsletter is disabled by default', () => {
    cy.visit('http://localhost:3000/')
    cy.get('button[type=submit]').should('exist')
    cy.get('button[type=submit]').should('be.disabled')
  })

  it('form newsletter render correct data', () => {
    cy.visit('http://localhost:3000/')

    cy.get('button[type=submit]').should('exist')
    cy.get('button[type=submit]').should('be.disabled')

    cy.get('#email').should('exist')
    cy.get('#email').type('albus@poudlard.com')
    cy.get('#email').should('have.value', 'albus@poudlard.com')

    cy.get('button[type=submit]').should('be.enabled')
  })

  // TODO test submission
})
