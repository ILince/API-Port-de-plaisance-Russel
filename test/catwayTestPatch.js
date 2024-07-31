const assert = require("assert");
const sinon = require("sinon");
const Catway = require("../models/catway_model");
const services = require("../services/catways_services");

// Testing the patchCatwayById function
describe("patchCatwayById", function () {
  let findByIdAndUpdateStub;

  // Before each test, replace real `findByIdAndUpdate` method with a stub
  beforeEach(() => {
    findByIdAndUpdateStub = sinon.stub(Catway, "findByIdAndUpdate");
  });

  // After each test, restore the original method
  afterEach(() => {
    sinon.restore();
  });

  // Test case: Successfully patch a Catway by ID
  it("should patch a catway by ID", async () => {
    const id = "1"; // Test ID
    const catwayState = "inactive"; // New state to update
    const fakeCatway = {
      _id: id,
      catwayNumber: "123",
      catwayState: "active",
      type: "Long",
    }; // Fake Catway data
    const updatedCatway = { ...fakeCatway, catwayState }; // Expected updated Catway data

    // Configure the stub to return the updated Catway
    findByIdAndUpdateStub.resolves(updatedCatway);

    // Call the patchCatwayById function from the services module
    const result = await services.patchCatwayById(id, catwayState);

    // Assert that the result matches the expected output
    assert.deepStrictEqual(result, { data: updatedCatway });
  });

  // Test case: Handle invalid catwayState
  it("should handle invalid catwayState", async () => {
    // Call the patchCatwayById function with invalid data
    const result = await services.patchCatwayById("1", "");

    // Assert that the result matches the expected error output
    assert.deepStrictEqual(result, { error: "Invalid catwayState" });
  });

  // Test case: Handle catway not found
  it("should handle catway not found", async () => {
    // Configure the stub to return null (indicating no document found)
    findByIdAndUpdateStub.resolves(null);

    // Call the patchCatwayById function
    const result = await services.patchCatwayById("1", "inactive");

    // Assert that the result matches the expected error output
    assert.deepStrictEqual(result, { error: "Catway not found" });
  });

  // Test case: Handle errors
  it("should handle errors", async () => {
    // Configure the stub to throw an error
    findByIdAndUpdateStub.throws(new Error("Database error"));

    // Call the patchCatwayById function and expect it to handle the error
    const result = await services.patchCatwayById("1", "inactive");

    // Assert that the result matches the expected error output
    assert.deepStrictEqual(result, { error: "Error updating Catway" });
  });
});
