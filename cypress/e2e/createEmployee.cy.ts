describe('Employee spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.get('#login-link').click()

    cy.get('#password').type('password')
    cy.get('#email').type('albus@poudlard.com')
    cy.get('button[type=submit]').click()
  })

  function submitButtonIsDisabled() {
    cy.get('button[type=submit]').should('exist')
    cy.get('button[type=submit]').should('be.disabled')
  }

  function redirectToCreationEmployee() {
    cy.get('[data-cy=open-drawer-mobile]').click()
    cy.get('[data-cy=drawer-link-destinataire-create]').click()
    cy.get('[data-cy=close-drawer-button]').click()
  }

  it('button to submit form employee is disabled by default', () => {
    redirectToCreationEmployee()
    submitButtonIsDisabled()
  })

  it('form should hve correct values', () => {
    redirectToCreationEmployee()
    submitButtonIsDisabled()

    cy.get('#firstName').should('exist')
    cy.get('#firstName').type('Godrick')
    cy.get('#firstName').should('have.value', 'Godrick')

    cy.get('#lastName').should('exist')
    cy.get('#lastName').type('Grifondor')
    cy.get('#lastName').should('have.value', 'Grifondor')

    cy.get('#email').should('exist')
    cy.get('#email').type('godrick@poudlard.com')
    cy.get('#email').should('have.value', 'godrick@poudlard.com')

    cy.get('#phone').should('exist')
    cy.get('#phone').type('0202020202')
    cy.get('#phone').should('have.value', '0202020202')

    cy.get('#postalCode').should('exist')
    cy.get('#postalCode').type('44300')
    cy.get('#postalCode').should('have.value', '44300')

    cy.get('#addressLine').should('exist')
    cy.get('#addressLine').type('5 rue de la paix')
    cy.get('#addressLine').should('have.value', '5 rue de la paix')

    cy.get('#city').should('exist')
    cy.get('#city').type('Nantes')
    cy.get('#city').should('have.value', 'Nantes')

    cy.get('#country').should('exist')
    cy.get('#country').should('have.value', 'France')

    cy.get('button[type=submit]').should('exist')
    cy.get('button[type=submit]').should('be.enabled')
  })
})
