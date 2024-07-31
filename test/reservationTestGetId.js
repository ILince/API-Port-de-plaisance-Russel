const sinon = require("sinon");
const assert = require("assert");
const Reservation = require("../models/reservation_model");
const { getResByCatwayAndId } = require("../services/reservations_services");

// Test suite for `getResByCatwayAndId` service function
describe("getResByCatwayAndId Service", function () {
  let findOneStub;

  // Before each test, replace the real `findOne` method with a stub
  beforeEach(function () {
    findOneStub = sinon.stub(Reservation, "findOne");
  });

  // After each test, restore the original method to ensure no side effects
  afterEach(function () {
    sinon.restore();
  });

  // Test case: Successfully retrieve a reservation by catway ID and reservation ID
  it("should return the reservation for given catway ID and reservation ID", async function () {
    const catwayId = "catway123"; // Test catway ID
    const reservationId = "reservation456"; // Test reservation ID

    // Mock reservation data
    const reservation = {
      _id: reservationId,
      catwayId,
      clientName: "John Doe",
      checking: new Date(),
      checkout: new Date(),
      boatName: "Boat A",
    };

    // Configure the stub to simulate the `findOne` method returning the mock reservation
    findOneStub.resolves(reservation);

    // Call the service method with the mocked catway ID and reservation ID
    const result = await getResByCatwayAndId(catwayId, reservationId);

    // Verify that `findOne` was called with the correct arguments
    assert(findOneStub.calledOnceWith({ _id: reservationId, catwayId }));

    // Verify that the result matches the mock reservation
    assert.deepStrictEqual(result, reservation);
  });

  // Test case: Handle errors when retrieving a reservation
  it("should throw an error if there is a problem retrieving the reservation", async function () {
    const catwayId = "catway123"; // Test catway ID
    const reservationId = "reservation456"; // Test reservation ID

    // Configure the stub to simulate an error when calling the `findOne` method
    findOneStub.rejects(new Error("Database error"));

    try {
      // Attempt to get the reservation and expect an error to be thrown
      await getResByCatwayAndId(catwayId, reservationId);
      assert.fail("Expected error to be thrown"); // Fail the test if no error is thrown
    } catch (error) {
      // Verify that the expected error message is thrown
      assert.strictEqual(
        error.message,
        "Failed to get reservation by catway ID and reservation ID"
      );
    }
  });
});
