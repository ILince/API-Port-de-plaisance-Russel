const express = require("express");
const router = express.Router();
const Catway = require("../models/catway_model");
const private = require("../middlewares/private");

router.get("/", private.checkJWT, async (req, res) => {
  try {
    const catways = await Catway.find();
    res.render("dashboard_view", { catways });
  } catch (error) {
    console.error("Error fetching catways:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
