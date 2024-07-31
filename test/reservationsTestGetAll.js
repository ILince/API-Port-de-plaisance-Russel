const sinon = require("sinon");
const assert = require("assert");
const Reservation = require("../models/reservation_model");
const { getResByCatwayId } = require("../services/reservations_services");

// Test suite for `getResByCatwayId` service function
describe("getResByCatwayId Service", function () {
  let findStub;

  // Before each test, replace the real `find` method with a stub
  beforeEach(function () {
    findStub = sinon.stub(Reservation, "find");
  });

  // After each test, restore the original method to ensure no side effects
  afterEach(function () {
    sinon.restore();
  });

  // Test case: Successfully retrieve reservations for a given catway ID
  it("should return reservations for a given catway ID", async function () {
    const catwayId = "catway123"; // Test ID
    const reservations = [
      // Mock reservations
      {
        _id: "reservation1",
        catwayId,
        clientName: "John Doe",
        checking: new Date(),
        checkout: new Date(),
        boatName: "Boat A",
      },
      {
        _id: "reservation2",
        catwayId,
        clientName: "Jane Doe",
        checking: new Date(),
        checkout: new Date(),
        boatName: "Boat B",
      },
    ];

    // Configure the stub to return the mock reservations
    findStub.resolves(reservations);

    // Call the service method with the test catway ID
    const result = await getResByCatwayId(catwayId);

    // Assert that the `find` method was called once with the correct ID
    assert(findStub.calledOnceWith({ catwayId }));

    // Assert that the result matches the expected reservations
    assert.deepStrictEqual(result, reservations);
  });

  // Test case: Handle errors when retrieving reservations
  it("should throw an error if there is a problem retrieving reservations", async function () {
    const catwayId = "catway123"; // Test ID

    // Configure the stub to throw an error
    findStub.rejects(new Error("Database error"));

    try {
      // Call the service method and expect it to throw an error
      await getResByCatwayId(catwayId);
      assert.fail("Expected error to be thrown"); // Fail the test if no error is thrown
    } catch (error) {
      // Assert that the error message is as expected
      assert.strictEqual(
        error.message,
        "Failed to get reservations by catway ID"
      );
    }
  });
});
