const assert = require("assert");
const sinon = require("sinon");
const Catway = require("../models/catway_model");
const services = require("../services/catways_services");

// Testing the addCatway function
describe("addCatway", function () {
  let createStub;

  // Before each test, replace real `create` method with a stub
  beforeEach(() => {
    createStub = sinon.createSandbox();
  });

  // After each test, restore the original method
  afterEach(() => {
    createStub.restore();
  });

  // Test case: Successfully add a new Catway
  it("should add a new catway", async () => {
    const catwayData = {
      catwayNumber: "123",
      catwayState: "active",
      type: "Long",
    }; // Test data
    const fakeCatway = { ...catwayData, _id: "1" }; // Fake Catway data with an ID

    // Configure the stub to return the fake Catway
    createStub.stub(Catway, "create").resolves(fakeCatway);

    // Call the addCatway function from the services module
    const result = await services.addCatway(catwayData);

    // Assert that the result matches the expected output
    assert.deepStrictEqual(result, { data: fakeCatway });
  });

  // Test case: Handle errors during Catway creation
  it("should handle errors", async () => {
    const catwayData = {
      catwayNumber: "123",
      catwayState: "active",
      type: "Long",
    }; // Test data

    // Configure the stub to throw an error
    createStub.stub(Catway, "create").throws(new Error("Database error"));

    // Call the addCatway function and expect it to handle the error
    const result = await services.addCatway(catwayData);

    // Assert that the result matches the expected error output
    assert.deepStrictEqual(result, { error: "Error creating catway" });
  });
});
