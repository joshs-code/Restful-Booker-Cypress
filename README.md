# Restful-Booker API Testing - Cypress

This project implements API testing for a booking system using Cypress. It includes both positive and negative test cases to ensure the functionality and robustness of the API.

## Getting Started

### Prerequisites

- Node.js
- Cypress
- cypress-plugin-api

### Installation

1. Clone the repository:

```git clone https://github.com/yourusername/yourproject.git```


1. Navigate to the project directory:

```cd yourproject```


1. Install the dependencies:

```npm install```


### Running Tests

To run the tests, use the following command:

```npx cypress open```


## Test Cases

### Positive API Testing

- **Create a booking**: Should be able to create a booking and verify the response.
- **Get new booking**: Should retrieve the newly created booking using the booking ID.
- **Update booking**: Should be able to update the booking details.
- **Delete new booking**: Should delete the booking and expect a 204 status code.
- **Ensure booking is deleted**: Should verify that the booking no longer exists and expect a 404 status code.

### Negative API Testing

- **Create booking with invalid first name**: Should return code 400 when first name is not a string.
- **Create booking with empty last name**: Should return code 400 when last name is empty.
- **Booking date in the past**: Should return code 400 when the check-in date is in the past.

## Code Snippet

Here’s an overview of the API testing implementation:

```javascript
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
    Cypress.env("token", response.body.token);
  });
});

describe("Positive API Testing", () => {
  // Test cases for positive scenarios
});

describe("Negative API Testing", () => {
  // Test cases for negative scenarios
});

License
This project is licensed under the MIT License - see the LICENSE file for details.