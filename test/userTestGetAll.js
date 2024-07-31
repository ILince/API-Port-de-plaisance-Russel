const sinon = require("sinon");
const assert = require("assert");
const User = require("../models/user_model");
const { getAllUsers } = require("../services/users_services");

// Testing the getAllUsers function
describe("getAllUsers Service", function () {
  let findStub;

  // Before each test, replace the real `find` method with a stub
  beforeEach(function () {
    findStub = sinon.stub(User, "find");
  });

  // After each test, restore the original methods
  afterEach(function () {
    sinon.restore();
  });

  // Test case: Successfully return all users without passwords
  it("should return all users without passwords", async function () {
    // Mock data for users, including passwords
    const users = [
      { _id: "user1", name: "Alice", password: "password1" },
      { _id: "user2", name: "Bob", password: "password2" },
    ];

    // Configure the stub to return users without passwords when `find` is called
    findStub.withArgs({}, "-password").resolves([
      { _id: "user1", name: "Alice" },
      { _id: "user2", name: "Bob" },
    ]);

    // Call the service function to get all users
    const result = await getAllUsers();

    // Verify that `find` was called once with the correct arguments: an empty query object and projection to exclude passwords
    assert(findStub.calledOnceWith({}, "-password"));

    // Verify that the result matches the expected output with passwords excluded
    assert.deepStrictEqual(result, [
      { _id: "user1", name: "Alice" },
      { _id: "user2", name: "Bob" },
    ]);
  });

  // Test case: Handle errors during user retrieval
  it("should throw an error if there is a problem retrieving users", async function () {
    // Configure the stub to simulate a database error
    findStub.withArgs({}, "-password").rejects(new Error("Database error"));

    try {
      // Call the service function and expect it to throw an error
      await getAllUsers();
      assert.fail("Expected error was not thrown"); // Fail the test if no error is thrown
    } catch (error) {
      // Verify that the error message is as expected
      assert.strictEqual(error.message, "Error retrieving users");
    }
  });
});
