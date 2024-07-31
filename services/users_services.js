const User = require("../models/user_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

/**
 * Get all users, excluding their passwords.
 *
 * @returns {Promise<Array>} - A promise that resolves to an array of user objects.
 */
exports.getAllUsers = async () => {
  try {
    return await User.find({}, "-password");
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    throw new Error("Error retrieving users");
  }
};

/**
 * Get a user by their ID.
 *
 * @param {string} id - The ID of the user.
 * @returns {Promise<Object|null>} - A promise that resolves to the user object or null if not found.
 */
exports.getUserById = async (id) => {
  try {
    return await User.findById(id);
  } catch (error) {
    console.error("Error in getUserById:", error);
    throw new Error("Error retrieving user");
  }
};

/**
 * Create a new user.
 *
 * @param {Object} userData - The data for the new user.
 * @returns {Promise<Object>} - A promise that resolves to the created user object.
 */
exports.addUser = async (userData) => {
  try {
    return await User.create(userData);
  } catch (error) {
    console.error("Error in addUser:", error);
    throw new Error("Error creating user");
  }
};

/**
 * Update a user by their ID.
 *
 * @param {string} id - The ID of the user.
 * @param {Object} userData - The updated data for the user.
 * @returns {Promise<Object>} - A promise that resolves to the updated user object.
 */
exports.updateUserById = async (id, userData) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    Object.keys(userData).forEach((key) => {
      if (userData[key]) {
        user[key] = userData[key];
      }
    });

    await user.save();
    return user;
  } catch (error) {
    console.error("Error in updateUserById:", error);
    throw error;
  }
};

/**
 * Delete a user by their ID.
 *
 * @param {string} id - The ID of the user.
 * @returns {Promise<Object>} - A promise that resolves to a message confirming deletion.
 */
exports.deleteUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    await User.deleteOne({ _id: id });
    return { message: "User deleted successfully" };
  } catch (error) {
    console.error("Error in deleteUserById:", error);
    throw error;
  }
};

/**
 * Authenticate a user by their email and password.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} - A promise that resolves to an object containing a JWT token.
 */
exports.authenticateUser = async (email, password) => {
  try {
    const user = await User.findOne({ email }).select(
      "-__v -createdAt -updatedAt"
    );
    if (!user) {
      throw new Error("User not found");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Wrong credentials");
    }

    const { password: userPassword, ...userWithoutPassword } = user.toObject();
    const expiresIn = 24 * 60 * 60;
    const token = jwt.sign({ user: userWithoutPassword }, SECRET_KEY, {
      expiresIn,
    });

    return { token };
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};
