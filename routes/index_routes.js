const express = require("express");
const router = express.Router();
const userRoute = require("./users_routes");
const catwaysRoute = require("./catways_routes");
const reservationsRoute = require("./reservations_routes");
const dashboardRoute = require("./dashboard_routes");
const private = require("../middlewares/private");

// Route to render the main landing page
router.get("/", (req, res) => {
  res.render("index_view");
});

// Use imported route handlers for various paths
router.use("/users", userRoute);
router.use("/catways", private.checkJWT, catwaysRoute);
router.use("/reservations", private.checkJWT, reservationsRoute);
router.use("/dashboard", private.checkJWT, dashboardRoute);

module.exports = router;
