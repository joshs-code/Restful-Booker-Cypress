import bookinginfo from "./test-data/createdBooking.json";
import updatedinfo from "./test-data/updatedBooking.json";
import userdata from '../fixtures/userdata.json';

import 'cypress-ajv-schema-validator';
import 'cypress-plugin-api';

describe("API Testing", () => {
  before("Testing Token", () => {
    cy.api("POST", "auth", {
      username: userdata.name,
      password: userdata.password,
    }).then((response) => {
      // Saving Token in Cypress Env Variable instead of global variable
      Cypress.env("token", response.body.token);
    });
  });

  it("Should be able to create a booking", () => {
    cy.api({
      method: "POST",
      url: "booking",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${Cypress.env("token")}`,
      },
      // Passing booking info json instead of hardcode json
      body: bookinginfo,
    }).then((response) => {
      expect(response.status).eq(200);

      expect(response.body.booking.firstname).to.have.string("Joshua");
      Cypress.env("bookingID", response.body.bookingid);
    });
  });

  it("Should be able to get new booking", () => {
    cy.api({
      method: "GET",
      url: `booking/${Cypress.env("bookingID")}`,
    }).validateSchema(userdata)
  });

  it("Should be able to update booking", () => {
    cy.api({
      method: "PUT",
      url: `booking/${Cypress.env("bookingID")}`,
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${Cypress.env("token")}`,
      },
      body: updatedinfo,
    }).validateSchema(updatedinfo);

  });

  it("Should be able to delete new booking", () => {
    cy.api({
      method: "DELETE",
      url: `booking/${Cypress.env("bookingID")}`,
      headers: {
        Cookie: `token=${Cypress.env("token")}`,
      },
    }).then((response) => {
      // Expect 204 Status for deleted
      expect(response.status).eq(204);
    });
  });

  it("Should make sure booking is deleted", () => {
    cy.api({
      method: "GET",
      url: `booking/${Cypress.env("bookingID")}`,
      failOnStatusCode: false,
    }).as("booking");

    cy.get("@booking").its("status").should("eq", 404);
  });
});
