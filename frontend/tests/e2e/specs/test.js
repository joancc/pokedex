// https://docs.cypress.io/api/introduction/api.html
import {
  getByRole,
  findByText,
  getByPlaceholderText
} from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

describe("shows and filters pokemons", () => {
  it("Visits the app root url", async () => {
    cy.visit("http://localhost:8080");
    
    // Can filter by name
    cy.findByText('Bulbasaur').should('exist')
    cy.findByLabelText(/Search/i).type('Charmeleon')
    cy.findByText('Bulbasaur').should('not.exist')
    cy.findByText('Flame Pokémon').should('exist')
    cy.findByPlaceholderText(/Search/i).clear()

    // Can filter by type
    cy.findByLabelText(/Type/i).select('Fire');
    cy.findByLabelText(/Type/i).select('Type...');
    
    // Can filter by favorite
    cy.findByText('Bulbasaur').should('exist')
    cy.findByRole('button', { name: /Favorites/i }).click();
    cy.findByText('Bulbasaur').should('not.exist')
    cy.findByText('No results found').should('exist')
    cy.findByRole('button', { name: /All/i }).click();
    cy.findByTestId('like-Bulbasaur').click({force: true});
    cy.findByRole('button', { name: /Favorites/i }).click();
    cy.findByText('Bulbasaur').should('exist')
    cy.findByTestId('like-Bulbasaur').click({force: true});
    cy.findByText('Bulbasaur').should('not.exist')
    cy.findByRole('button', { name: /All/i }).click();
    
    // Can switch between grid and list view
    cy.findByRole('button', { name: /Toggle List/i }).click();
    cy.findByRole('button', { name: /Toggle Grid/i }).click();
    
    // Can flip a card to see more info
    cy.findByTestId('flipback-Bulbasaur').click({force: true});
    // cy.findByTestId('flipfront-Bulbasaur').click({force: true});
    
  });
});
