const assert = require("assert");
const sinon = require("sinon");
const User = require("../models/user_model");
const { deleteUserById } = require("../services/users_services");

// Testing the deleteUserById function
describe("deleteUserById Service", function () {
  let findByIdStub;
  let deleteOneStub;

  // Before each test, replace real methods with stubs
  beforeEach(function () {
    findByIdStub = sinon.stub(User, "findById");
    deleteOneStub = sinon.stub(User, "deleteOne");
  });

  // After each test, restore original methods
  afterEach(function () {
    sinon.restore();
  });

  // Test case: Successfully delete a user
  it("should delete the user successfully if user is found", async function () {
    const userId = "validUserId"; // Mock user ID
    const user = { _id: userId, name: "John Doe" }; // Fake user data

    // Configure stubs to simulate finding the user and successful deletion
    findByIdStub.resolves(user); // Return the fake user when `findById` is called
    deleteOneStub.resolves({ deletedCount: 1 }); // Simulate successful deletion

    const result = await deleteUserById(userId); // Call the function
    // Check if the `findById` method was called with the correct user ID
    assert.strictEqual(findByIdStub.calledOnceWith(userId), true);
    // Check if the `deleteOne` method was called with the correct arguments
    assert.strictEqual(deleteOneStub.calledOnceWith({ _id: userId }), true);
    // Check if the result is as expected
    assert.deepStrictEqual(result, { message: "User deleted successfully" });
  });

  // Test case: Handle case when user is not found
  it("should throw an error if user is not found", async function () {
    const userId = "invalidUserId"; // Mock invalid user ID

    // Configure stub to simulate user not found
    findByIdStub.resolves(null); // Simulate `findById` returning null (user not found)

    try {
      // Call the function and expect it to throw an error
      await deleteUserById(userId);
      assert.fail("Expected error was not thrown"); // Fail the test if no error is thrown
    } catch (err) {
      // Verify that the error message is as expected
      assert.strictEqual(err.message, "User not found");
    }

    // Ensure `deleteOne` was not called
    assert.strictEqual(deleteOneStub.notCalled, true);
  });
});
