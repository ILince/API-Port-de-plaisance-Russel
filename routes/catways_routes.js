const express = require("express");
const router = express.Router();
const Catway = require("../models/catway_model");
const services = require("../services/catways_services");

// Route to render the view of all catways
router.get("/view", async (req, res) => {
  try {
    // Retrieve all catways from the service
    const result = await services.getAllCatways();
    if (result.error) {
      console.error("Error in getAllCatways:", result.error);
      return res.status(500).json({ error: "Internal server error" });
    }
    // Render the catways view template with the retrieved catways
    res.render("catways_view", { catways: result.data });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get the numbers of all catways in JSON
router.get("/catwayNumbers", async (req, res) => {
  try {
    // Retrieve catway numbers from the service
    const result = await services.getCatwayNumbers();
    if (result.error) {
      console.error("Error fetching catway numbers:", result.error);
      return res.status(500).json({ error: "Error fetching catway numbers" });
    }
    // Send the retrieved catway numbers as JSON
    res.json(result.data);
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to render the details of a specific catway
router.get("/view/:id", async (req, res) => {
  const catwayId = req.params.id;

  try {
    // Retrieve a specific catway by ID from the service
    const result = await services.getCatwayById(catwayId);
    if (result.error) {
      if (result.error === "Catway not found") {
        return res.status(404).json({ error: "Catway not found" });
      }
      console.error("Error in getCatwayDetails:", result.error);
      return res.status(500).json({ error: "Internal server error" });
    }
    // Render the catway detail view template with the retrieved catway
    res.render("catway_detail_view", { catway: result.data });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get the details of a specific catway in JSON format
router.get("/detail/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Retrieve a specific catway by ID from the service
    const result = await services.getCatwayById(id);
    if (result.error) {
      if (result.error === "Catway not found") {
        return res.status(404).json({ error: "Catway not found" });
      }
      console.error(`Error fetching catway ${id}:`, result.error);
      return res.status(500).json({ error: "Error fetching catway details" });
    }
    // Send the retrieved catway details as JSON
    res.json(result.data);
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to update a specific catway's state
router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const { catwayState } = req.body;

  try {
    // Update the catway's state by ID from the service
    const result = await services.patchCatwayById(id, catwayState);
    if (result.error) {
      if (result.error === "Catway not found") {
        return res.status(404).json({ error: "Catway not found" });
      }
      console.error("Error updating Catway:", result.error);
      return res.status(500).json({ error: "Error updating Catway" });
    }
    // Send a success response with the updated catway details
    res
      .status(200)
      .json({ message: "Catway updated successfully", catway: result.data });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get all catways in JSON format
router.get("/", async (req, res) => {
  try {
    // Retrieve all catways from the service
    const result = await services.getAllCatways();
    if (result.error) {
      console.error("Error in getAllCatways:", result.error);
      return res.status(500).json({ error: "Internal server error" });
    }
    // Send the retrieved catways as JSON
    res.json(result.data);
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get a specific catway by ID in JSON format
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Retrieve a specific catway by ID from the service
    const result = await services.getCatwayById(id);
    if (result.error) {
      if (result.error === "Catway not found") {
        return res.status(404).json({ error: "Catway not found" });
      }
      console.error("Error fetching catway:", result.error);
      return res.status(500).json({ error: "Error fetching catway details" });
    }
    // Send the retrieved catway details as JSON
    res.json(result.data);
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to create a new catway
router.post("/", async (req, res) => {
  const { catwayNumber, catwayState, type } = req.body;
  try {
    // Create a new catway using the service
    const result = await services.addCatway({
      catwayNumber,
      catwayState,
      type,
    });
    if (result.error) {
      console.error("Error creating catway:", result.error);
      return res.status(500).json({ error: "Error creating catway" });
    }
    // Send a success response with the newly created catway details
    res.status(201).json(result.data);
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to update an existing catway
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { catwayNumber, catwayState, type } = req.body;

  try {
    // Update an existing catway by ID using the service
    const result = await services.updateCatwayById(id, {
      catwayNumber,
      catwayState,
      type,
    });
    if (result.error) {
      if (result.error === "Catway not found") {
        return res.status(404).json({ error: "Catway not found" });
      }
      console.error("Error updating catway:", result.error);
      return res.status(500).json({ error: "Error updating catway" });
    }
    // Send a success response with the updated catway details
    res.status(200).json(result.data);
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to delete a specific catway
router.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    // Delete a specific catway by ID using the service layer
    const result = await services.deleteCatwayById(id);
    if (result.error) {
      if (result.error === "Catway not found") {
        return res.status(404).json({ error: "Catway not found" });
      }
      console.error("Error deleting catway:", result.error);
      return res.status(500).json({ error: "Error deleting catway" });
    }
    // Send a success response indicating the catway was deleted
    res.status(200).json({ message: "Catway deleted successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
