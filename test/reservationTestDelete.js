const assert = require("assert");
const sinon = require("sinon");
const Reservation = require("../models/reservation_model");
const { deleteResByCatwayAndId } = require("../services/reservations_services");

// Test suite for `deleteResByCatwayAndId` service function
describe("deleteResByCatwayAndId Service", function () {
  let deleteStub;

  // Before each test, replace the real `deleteOne` method with a stub
  beforeEach(function () {
    deleteStub = sinon.stub(Reservation, "deleteOne");
  });

  // After each test, restore the original method to ensure no side effects
  afterEach(function () {
    sinon.restore();
  });

  // Test case: Successfully delete a reservation
  it("should delete a reservation successfully", async function () {
    const catwayId = "someCatwayId"; // Test catway ID
    const reservationId = "someReservationId"; // Test reservation ID
    const result = { deletedCount: 1 }; // Simulate a successful delete result

    // Configure the stub to return the simulated result
    deleteStub.resolves(result);

    // Call the service method to delete the reservation
    const response = await deleteResByCatwayAndId(catwayId, reservationId);

    // Verify that the stub was called once with the correct arguments
    assert.strictEqual(deleteStub.calledOnce, true); // Ensure the stub was called only once
    assert.deepStrictEqual(deleteStub.firstCall.args[0], {
      _id: reservationId,
      catwayId,
    }); // Verify arguments passed to `deleteOne`

    // Verify that the response from the service matches the simulated result
    assert.deepStrictEqual(response, result); // Ensure the response matches the simulated result
  });

  // Test case: Handle scenario where no reservation is found to delete
  it("should throw an error if no reservation is found to delete", async function () {
    const catwayId = "someCatwayId"; // Test catway ID
    const reservationId = "someReservationId"; // Test reservation ID
    const result = { deletedCount: 0 }; // Simulate a result where no deletion occurred

    // Configure the stub to return the simulated result
    deleteStub.resolves(result);

    try {
      // Attempt to delete the reservation and expect an error to be thrown
      await deleteResByCatwayAndId(catwayId, reservationId);
      assert.fail("Expected error was not thrown"); // Fail the test if no error is thrown
    } catch (error) {
      // Verify that the expected error message is thrown
      assert.strictEqual(
        error.message,
        "Failed to delete reservation by catway ID and reservation ID"
      );
    }

    // Verify that the stub was called once with the correct arguments
    assert.strictEqual(deleteStub.calledOnce, true); // Ensure the stub was called only once
    assert.deepStrictEqual(deleteStub.firstCall.args[0], {
      _id: reservationId,
      catwayId,
    }); // Verify arguments passed to `deleteOne`
  });
});
