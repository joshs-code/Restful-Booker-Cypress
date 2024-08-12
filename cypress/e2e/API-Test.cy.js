let token, bookingID;

describe("API Testing", () => {
  before("Testing Token", () => {
    cy.request("POST", "https://restful-booker.herokuapp.com/auth", {
      username: "admin",
      password: "password123",
    }).then((response) => {
      token = response.body.token;
    });
  });

  it("Should be able to create a booking", () => {
    cy.request({
      method: "POST",
      url: "https://restful-booker.herokuapp.com/booking",
      headers: {
        "Content-Type": "application/json",
        // "Cookie": `token=${token}`
      },
      body: {
        firstname: "Joshua",
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
      expect(response.status).eq(200);
      expect(response.body.booking.firstname).to.have.string("Joshua");
      bookingID = response.body.bookingid;
    });
  });

  it("Should be able to delete new booking", () => {

    cy.request({
      method: 'DELETE',
      url: `https://restful-booker.herokuapp.com/booking/${bookingID}`,
      headers: {
        'Cookie': `token=${token}`
      }
    }).then( (response) => {
      expect(response.status).eq(204);
    })

  });

});
