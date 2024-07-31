const assert = require("assert");
const sinon = require("sinon");
const Catway = require("../models/catway_model");
const services = require("../services/catways_services");

// Testing the getAllCatways function
describe("getAllCatways", function () {
  let findStub;

  // Before each test, replace the real `find` method with a stub
  beforeEach(() => {
    findStub = sinon.stub(Catway, "find");
  });

  // After each test, restore the original method
  afterEach(() => {
    sinon.restore();
  });

  // Test case: Successfully return catways data
  it("should return catways data", async () => {
    const fakeCatways = [
      { _id: "1", catwayNumber: "123", catwayState: "active", type: "Long" },
    ]; // Fake data
    findStub.resolves(fakeCatways); // Configure the stub to return fake data

    const result = await services.getAllCatways(); // Call the service function
    assert.deepStrictEqual(result, { data: fakeCatways }); // Check result
  });

  // Test case: Handle errors
  it("should handle errors", async () => {
    findStub.throws(new Error("Database error")); // Configure the stub to throw an error

    const result = await services.getAllCatways(); // Call the service function
    assert.deepStrictEqual(result, { error: "Internal server error" }); // Check result
  });
});
