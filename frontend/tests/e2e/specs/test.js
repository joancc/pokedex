// https://docs.cypress.io/api/introduction/api.html
import {
  getByRole,
  findByText,
  getByPlaceholderText
} from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

describe("My First Test", () => {
  it("Visits the app root url", async () => {
    cy.visit("http://localhost:8080");
    getByPlaceholderText(document, "Search");
    expect(await findByText(document, "All")).toBeVisible();
  });
});
