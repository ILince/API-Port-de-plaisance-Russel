const assert = require("assert");
const sinon = require("sinon");
const { addUser } = require("../services/users_services");
const User = require("../models/user_model");

// Test suite for addUser service function
describe("addUser Service without DB", function () {
  let createStub;

  // Before each test, replace the real User.create method with a stub
  beforeEach(function () {
    createStub = sinon.stub(User, "create");
  });

  // After each test, restore the original method
  afterEach(function () {
    sinon.restore();
  });

  // Test case: Successfully create a user
  it("should create a user successfully", async function () {
    // Sample user data for creating a user
    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
    };
    // Fake user object to simulate a successful creation
    const fakeUser = { ...userData, _id: "fakeid" };

    // Configure the stub to return the fake user when create() is called
    createStub.resolves(fakeUser);

    // Call the addUser function with the user data
    const result = await addUser(userData);

    // Verify that the stub was called once with the correct arguments
    assert.strictEqual(createStub.calledOnce, true);
    assert.deepStrictEqual(createStub.firstCall.args[0], userData);
    // Verify that the result matches the fake user data
    assert.strictEqual(result.name, fakeUser.name);
    assert.strictEqual(result.email, fakeUser.email);
    assert.strictEqual(result._id, fakeUser._id);
  });

  // Test case: Handle errors during user creation
  it("should throw an error when user creation fails", async function () {
    // Sample user data
    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
    };
    // Error to simulate a failure in user creation
    const error = new Error("Database error");

    // Configure the stub to throw an error when create() is called
    createStub.rejects(error);

    try {
      // Attempt to call addUser and expect it to throw an error
      await addUser(userData);
      assert.fail("Expected error was not thrown"); // Fail the test if no error is thrown
    } catch (err) {
      // Verify that the error message is as expected
      assert.strictEqual(err.message, "Error creating user");
    }

    // Verify that the stub was called once with the correct arguments
    assert.strictEqual(createStub.calledOnce, true);
    assert.deepStrictEqual(createStub.firstCall.args[0], userData);
  });
});
