const assert = require("assert");
const sinon = require("sinon");
const Catway = require("../models/catway_model");
const services = require("../services/catways_services");

// Testing the getCatwayById function
describe("getCatwayById", function () {
  let findByIdStub;

  // Before each test, replace the real `findById` method with a stub
  beforeEach(() => {
    findByIdStub = sinon.stub(Catway, "findById");
  });

  // After each test, restore the original method
  afterEach(() => {
    sinon.restore();
  });

  // Test case: Successfully return a Catway by ID
  it("should return catway by ID", async () => {
    const fakeCatway = {
      _id: "1",
      catwayNumber: "123",
      catwayState: "active",
      type: "Long",
    }; // Fake data
    findByIdStub.resolves(fakeCatway); // Configure stub to return the fake catway

    const result = await services.getCatwayById("1"); // Call the service function
    assert.deepStrictEqual(result, { data: fakeCatway }); // Verify the result
  });

  // Test case: Handle catway not found
  it("should handle catway not found", async () => {
    findByIdStub.resolves(null); // Configure stub to return null (no document found)

    const result = await services.getCatwayById("1"); // Call the service function
    assert.deepStrictEqual(result, { error: "Catway not found" }); // Verify the result
  });

  // Test case: Handle errors
  it("should handle errors", async () => {
    findByIdStub.throws(new Error("Database error")); // Configure stub to throw an error

    const result = await services.getCatwayById("1"); // Call the service function
    assert.deepStrictEqual(result, { error: "Error fetching catway details" }); // Verify the result
  });
});
