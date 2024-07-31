const assert = require("assert");
const sinon = require("sinon");
const mongoose = require("mongoose");
const Reservation = require("../models/reservation_model");
const { createReservation } = require("../services/reservations_services");

// Test suite for `createReservation` service function
describe("createReservation Service", function () {
  let saveStub;

  // Setup before each test replace reservation.prototype.save with a stub
  beforeEach(function () {
    saveStub = sinon.stub(Reservation.prototype, "save");
  });

  // After each test, restore the original method to ensure no side effects
  afterEach(function () {
    sinon.restore();
  });

  // Test case: Successfully create a reservation
  it("should create a reservation successfully", async function () {
    // Sample data for creating a reservation
    const reservationData = {
      catwayId: new mongoose.Types.ObjectId(), // Generate a new ObjectId for catwayId
      clientName: "John Doe",
      checking: new Date(), // Current date and time
      checkout: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours later
      boatName: "The Black Pearl",
    };

    // Expected reservation object, simulating what would be returned from MongoDB
    const expectedReservation = new Reservation({
      ...reservationData,
      _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId for _id
    });

    // Configure the stub to return the expected reservation when `save()` is called
    saveStub.resolves(expectedReservation);

    // Call the `createReservation` function with the test data
    const result = await createReservation(
      reservationData.catwayId,
      reservationData.clientName,
      reservationData.checking,
      reservationData.checkout,
      reservationData.boatName
    );

    // Assertions to verify that the `save` method was called once
    assert.strictEqual(saveStub.calledOnce, true);

    // Assertions to ensure that the returned data matches the expected data
    assert.strictEqual(
      result.catwayId.toString(),
      reservationData.catwayId.toString(),
      `Expected catwayId to be ${reservationData.catwayId}, but got ${result.catwayId}`
    );
    assert.strictEqual(
      result.clientName,
      reservationData.clientName,
      `Expected clientName to be ${reservationData.clientName}, but got ${result.clientName}`
    );
    assert.strictEqual(
      result.checking.toISOString(),
      reservationData.checking.toISOString(),
      `Expected checking to be ${reservationData.checking}, but got ${result.checking}`
    );
    assert.strictEqual(
      result.checkout.toISOString(),
      reservationData.checkout.toISOString(),
      `Expected checkout to be ${reservationData.checkout}, but got ${result.checkout}`
    );
    assert.strictEqual(
      result.boatName,
      reservationData.boatName,
      `Expected boatName to be ${reservationData.boatName}, but got ${result.boatName}`
    );
  });

  // Test case: Handle errors during reservation creation
  it("should throw an error when reservation creation fails", async function () {
    // Sample data for creating a reservation
    const reservationData = {
      catwayId: new mongoose.Types.ObjectId(),
      clientName: "John Doe",
      checking: new Date(),
      checkout: new Date(Date.now() + 24 * 60 * 60 * 1000),
      boatName: "The Black Pearl",
    };

    // Create an error to simulate a database failure
    const error = new Error("Database error");
    saveStub.rejects(error); // Configure the stub to reject with this error

    try {
      // Call the `createReservation` function and expect it to throw an error
      await createReservation(
        reservationData.catwayId,
        reservationData.clientName,
        reservationData.checking,
        reservationData.checkout,
        reservationData.boatName
      );
      // Fail the test if no error is thrown
      assert.fail("Expected error was not thrown");
    } catch (err) {
      // Verify that the error thrown has the correct message
      assert.strictEqual(err.message, "Failed to create reservation");
    }

    // Ensure that the save method was called once
    assert.strictEqual(saveStub.calledOnce, true);
  });
});
