const assert = require("assert");
const sinon = require("sinon");
const Catway = require("../models/catway_model");
const services = require("../services/catways_services");

// Test suite for the updateCatwayById service function
describe("updateCatwayById", function () {
  let findByIdStub;

  // Before each test, replace the real methods with stubs
  beforeEach(() => {
    findByIdStub = sinon.stub(Catway, "findById");
  });

  // After each test, restore the original methods
  afterEach(() => {
    findByIdStub.restore();
  });

  // Test case: Successfully update a catway by ID
  it("should update a catway by ID", async () => {
    const id = "1"; // ID of the catway to be updated
    const updateData = { catwayState: "inactive" }; // Data to update the catway

    // Create a fake instance of the Catway model with an initial state and a stubbed save method
    const fakeCatway = {
      _id: id,
      catwayNumber: "123",
      catwayState: "active",
      type: "Long",
      save: sinon.stub().resolves({
        _id: id,
        catwayNumber: "123",
        catwayState: "inactive", // Updated value
        type: "Long",
      }),
    };

    // Configure the stub to return the fake catway instance when `findById` is called with the specified ID
    findByIdStub.resolves(fakeCatway);

    // Call the service method to update the catway
    const result = await services.updateCatwayById(id, updateData);

    // Expected result after the update, excluding the `save` method
    const expectedResult = {
      data: {
        _id: id,
        catwayNumber: "123",
        catwayState: "inactive", // Updated value
        type: "Long",
      },
    };

    // Exclude `save` from the returned object for comparison
    const resultWithoutSave = {
      data: {
        _id: result.data._id,
        catwayNumber: result.data.catwayNumber,
        catwayState: result.data.catwayState,
        type: result.data.type,
      },
    };

    // Verify that the result matches the expected result
    assert.deepStrictEqual(resultWithoutSave, expectedResult);
  });

  // Test case: Handle scenario where the catway is not found
  it("should handle catway not found", async () => {
    // Configure the stub to return null to simulate a situation where the catway does not exist
    findByIdStub.resolves(null);

    // Call the service method with a non-existent ID
    const result = await services.updateCatwayById("1", {
      catwayState: "inactive",
    });

    // Verify that the result indicates the catway was not found
    assert.deepStrictEqual(result, { error: "Catway not found" });
  });

  // Test case: Handle unexpected errors during the update operation
  it("should handle errors", async () => {
    // Configure the stub to throw an unexpected error to simulate a failure in the database operation
    findByIdStub.throws(new Error("Database error"));

    // Call the service method and expect it to handle the thrown error
    const result = await services.updateCatwayById("1", {
      catwayState: "inactive",
    });

    // Verify that the result indicates an error occurred during the update
    assert.deepStrictEqual(result, { error: "Error updating catway" });
  });
});
