const express = require("express");
const router = express.Router();
const userService = require("../services/users_services");

// Route to get all users
router.get("/", async (req, res) => {
  try {
    // Fetch all users using the service layer
    const users = await userService.getAllUsers();
    // Send the users data as JSON
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get a user by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Fetch a specific user by ID using the service layer
    const user = await userService.getUserById(id);
    if (user) {
      // Send the user data as JSON
      res.status(200).json(user);
    } else {
      res.status(404).json("user_not_found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to create a new user
router.post("/add", async (req, res) => {
  const userData = {
    name: req.body.name,
    firstname: req.body.firstname,
    email: req.body.email,
    password: req.body.password,
  };

  try {
    // Create a new user using the service layer
    const user = await userService.addUser(userData);
    // Send the newly created user as JSON with a 201 status code
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to update a user by ID
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const userData = {
    name: req.body.name,
    firstname: req.body.firstname,
    email: req.body.email,
    password: req.body.password,
  };

  try {
    // Update the user by ID using the service layer
    const user = await userService.updateUserById(id, userData);
    // Send the updated user data as JSON
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to delete a user by ID
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Delete the user by ID using the service layer
    const result = await userService.deleteUserById(id);
    // Send the result of the delete operation as JSON
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to authenticate a user
router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Authenticate the user using the service layer
    const result = await userService.authenticateUser(email, password);
    // Send the authentication result as JSON
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
