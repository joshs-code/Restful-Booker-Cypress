import bookinginfo from "./test-data/createdBooking.json";
import updatedinfo from "./test-data/updatedBooking.json";
import userdata from "../fixtures/userdata.json";

import "cypress-plugin-api";


/** 
 * Get token before each and store it
 */
beforeEach("Testing Token", () => {
  cy.api("POST", "auth", {
    username: userdata.name,
    password: userdata.password,
  }).then((response) => {
    // Saving Token in Cypress Env Variable instead of global variable
    Cypress.env("token", response.body.token);
  });
});

describe("Positive API Testing", () => {

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
    }).then((response) => {
      expect(response.body.firstname).eq(bookinginfo.firstname);
      expect(response.status).eq(200);
    });
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
    }).then((response) => {
      expect(response.status).eq(200);
      expect(response.body.firstname).eq(updatedinfo.firstname);
    });
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

describe("Negative API Testing", () => {

  it("Should not be able to create booking with invalid first name field. Should return code 400", () => {
    cy.api({
      method: "POST",
      url: "booking",
      failOnStatusCode: false,
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${Cypress.env("token")}`,
      },
      body: {
        firstname: 111,
        lastname: "Brown",
        totalprice: 111,
        depositpaid: true,
        bookingdates: {
          checkin: "2018-01-01",
          checkout: "2019-01-01",
        },
        additionalneeds: "Breakfast",
      },
    }).then((response) => {
      // Should return 400 bad request since it is incorrect data type
      expect(response.status).eq(400);
    });
  });

  it("Should not be able to create booking with empty last name field. Should return code 400", () => {
    cy.api({
      url: "booking",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `token=${Cypress.env("token")}`,
      },
      failOnStatusCode: false,
      body: {
        firstname: "Bob",
        lastname: "",
        totalprice: 111,
        depositpaid: true,
        bookingdates: {
          checkin: "2018-01-01",
          checkout: "2019-01-01",
        },
        additionalneeds: "Breakfast",
      },
    }).then((response) => {
      expect(response.status).eq(400);
    });
  });

  it("Should be not allow booking date from paste today date. Should return code 400", () => {
    cy.api({
      method: 'POST',
      url: 'booking',
      headers: {
        "Content-Type":"application/json",
        "Cookie": `token=${Cypress.env('token')}`
      },
      body: {
        firstname: "Bob",
        lastname: "",
        totalprice: 111,
        depositpaid: true,
        bookingdates: {
          checkin: "2000-01-01",
          checkout: "2019-01-01",
        },
        additionalneeds: "Breakfast",
      }
    }).then( (response) => {
      expect(response.status).eq(400)
    })
  })

});
