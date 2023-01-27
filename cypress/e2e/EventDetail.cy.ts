describe('Event detail spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.get('#login-link').click()

    cy.get('#password').type('password')
    cy.get('#email').type('albus@poudlard.com')
    cy.get('button[type=submit]').click()
  })

  function redirectToEvent1() {
    cy.get('[data-cy=event-1-options-links]').should('exist')
    cy.get('[data-cy=event-1-options-links]').click()
    cy.get('[data-cy=event-1-show-link]').should('exist')
    cy.get('[data-cy=event-1-show-link]').click()

    cy.get('h1').contains('Coupe du monde de Quiddich')
    cy.get('h4').contains('Description:')
    cy.get('h2').contains('Destinataires')
  }

  it('on click update event redirect on details page', () => {
    cy.get('h3>span').contains('Événements')
    redirectToEvent1()
  })

  it('on click update event redirect on details page and show list employee', () => {
    cy.get('h3>span').contains('Événements')
    redirectToEvent1()

    cy.get('[data-cy=event-details-employee-link-1]').should('exist')
    cy.get('[data-cy=event-details-employee-name-1]').should('exist')
  })
})
