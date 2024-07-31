const assert = require("assert");
const sinon = require("sinon");
const User = require("../models/user_model");
const { updateUserById } = require("../services/users_services");

// Test suite for updateUserById service function
describe("updateUserById", function () {
  let findByIdStub, saveStub;

  // Before each test, replace real methods with stubs
  beforeEach(function () {
    findByIdStub = sinon.stub(User, "findById");
    saveStub = sinon.stub().resolves();
  });

  // After each test, restore the original methods
  afterEach(function () {
    sinon.restore();
  });

  // Test case: Successfully update a user
  it("should update a user by ID successfully", async function () {
    // Create a fake user object with an initial state
    const fakeUser = {
      _id: "1",
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      save: saveStub, // Attach the stubbed save method
    };

    // Configure the stub to return the fake user object when findById is called with ID '1'
    findByIdStub.withArgs("1").resolves(fakeUser);

    // Data to update the user
    const updateData = {
      name: "Jane Doe",
      email: "jane@example.com",
    };

    // Call the updateUserById function with the user ID and update data
    const updatedUser = await updateUserById("1", updateData);

    // Assert that the user's name and email have been updated correctly
    assert.strictEqual(updatedUser.name, "Jane Doe");
    assert.strictEqual(updatedUser.email, "jane@example.com");
    // Assert that the password remains unchanged
    assert.strictEqual(updatedUser.password, "password123");

    // Verify that the save method was called once
    assert(saveStub.calledOnce);
  });

  // Test case: Handle user not found scenario
  it("should throw an error if the user is not found", async function () {
    // Configure the stub to return null when findById is called with ID '1'
    findByIdStub.withArgs("1").resolves(null);

    try {
      // Attempt to update the user with ID '1' and expect an error to be thrown
      await updateUserById("1", { name: "New Name" });
      assert.fail("Expected error not thrown"); // Fail the test if no error is thrown
    } catch (error) {
      // Assert that the error message is 'User not found'
      assert.strictEqual(error.message, "User not found");
    }
  });

  // Test case: Handle errors correctly
  it("should handle errors correctly", async function () {
    // Stub the findById method to throw an unexpected error
    findByIdStub.throws(new Error("Unexpected error"));

    try {
      // Attempt to update a user with an invalid ID and expect an error to be thrown
      await updateUserById("invalid-id", { name: "New Name" });
      assert.fail("Expected error not thrown"); // Fail the test if no error is thrown
    } catch (error) {
      // Assert that the error message matches the thrown error
      assert.strictEqual(error.message, "Unexpected error");
    }
  });
});
