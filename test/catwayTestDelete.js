const assert = require("assert");
const sinon = require("sinon");
const Catway = require("../models/catway_model");
const services = require("../services/catways_services");

// Testing the deleteCatwayById function
describe("deleteCatwayById", function () {
  let findByIdStub;
  let deleteOneStub;

  // Before each test, replace real methods with stubs
  beforeEach(() => {
    findByIdStub = sinon.stub(Catway, "findById");
    deleteOneStub = sinon.stub(Catway, "deleteOne");
  });

  // After each test, restore original methods
  afterEach(() => {
    sinon.restore();
  });

  // Test case: Successfully delete a Catway
  it("should delete a catway by ID", async () => {
    const fakeCatway = {
      _id: "1",
      catwayNumber: "123",
      catwayState: "active",
      type: "Long",
    }; // Fake data
    findByIdStub.resolves(fakeCatway); // Return fake Catway when findById is called
    deleteOneStub.resolves({ deletedCount: 1 }); // Simulate successful deletion

    const result = await services.deleteCatwayById("1"); // Call the function
    assert.deepStrictEqual(result, {
      data: { message: "Catway deleted successfully" },
    }); // Check result
  });

  // Test case: Catway not found
  it("should handle catway not found", async () => {
    findByIdStub.resolves(null); // Simulate Catway not found

    const result = await services.deleteCatwayById("1"); // Call the function
    assert.deepStrictEqual(result, { error: "Catway not found" }); // Check result
  });

  // Test case: Error during deletion
  it("should handle errors", async () => {
    findByIdStub.throws(new Error("Database error")); // Simulate an error

    const result = await services.deleteCatwayById("1"); // Call the function
    assert.deepStrictEqual(result, { error: "Error deleting catway" }); // Check result
  });
});
