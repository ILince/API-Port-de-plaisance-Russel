const express = require("express");
const router = express.Router();
const reservationService = require("../services/reservations_services");
const Reservations = require("../models/reservation_model");
const private = require("../middlewares/private");

// Route to render all reservations in a view
router.get("/view", private.checkJWT, async (req, res) => {
  try {
    // Fetch all reservations from the database
    const reservations = await Reservations.find();
    // Render the 'reservations_view' template with the reservations data
    res.render("reservations_view", { reservations });
  } catch (err) {
    console.error("Error in getAllReservations:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get all reservations as JSON
router.get("/", private.checkJWT, async (req, res) => {
  try {
    // Fetch all reservations from the database
    const reservations = await Reservations.find();
    // Send the reservations data as JSON
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get a reservation by ID
router.get("/:id", private.checkJWT, async (req, res) => {
  const reservationId = req.params.id;

  try {
    // Fetch a specific reservation by its ID from the database
    const reservation = await Reservations.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    // Send the reservation data as JSON
    res.json(reservation);
  } catch (error) {
    console.error("Error fetching reservation details:", error.message);
    res.status(500).json({ error: "Error fetching reservation details" });
  }
});

// Route to get all reservations for a specific catway
router.get("/:id/reservations", private.checkJWT, async (req, res) => {
  const catwayId = req.params.id;

  try {
    // Fetch reservations for a specific catway using the service layer
    const reservations = await reservationService.getResByCatwayId(catwayId);
    // Send the reservations data as JSON
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get a specific reservation for a specific catway
router.get(
  "/:id/reservations/:idReservation",
  private.checkJWT,
  async (req, res) => {
    const catwayId = req.params.id;
    const reservationId = req.params.idReservation;

    try {
      // Fetch a specific reservation for a specific catway using the service layer
      const reservation = await reservationService.getResByCatwayAndId(
        catwayId,
        reservationId
      );

      if (reservation) {
        // Send the reservation data as JSON
        res.status(200).json(reservation);
      } else {
        res
          .status(404)
          .json({ error: "Reservation not found for this catway" });
      }
    } catch (error) {
      console.error("Error fetching reservation:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Route to create a new reservation for a specific catway
router.post("/:id/reservations", private.checkJWT, async (req, res) => {
  const catwayId = req.params.id;
  const { clientName, checking, checkout, boatName } = req.body;

  try {
    // Create a new reservation using the service layer
    const newReservation = await reservationService.createReservation(
      catwayId,
      clientName,
      checking,
      checkout,
      boatName
    );
    // Send the newly created reservation as JSON
    res.status(201).json(newReservation);
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to delete a specific reservation for a specific catway
router.delete(
  "/:id/reservations/:idReservation",
  private.checkJWT,
  async (req, res) => {
    const catwayId = req.params.id;
    const reservationId = req.params.idReservation;

    try {
      // Delete a specific reservation for a specific catway using the service layer
      const result = await reservationService.deleteResByCatwayAndId(
        catwayId,
        reservationId
      );

      if (result.deletedCount === 1) {
        // Send a success message if the reservation was deleted
        res.status(200).json({ message: "Reservation deleted successfully" });
      } else {
        res
          .status(404)
          .json({ error: "Reservation not found for this catway" });
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Route to render reservation details in a view
router.get("/view/:id", async (req, res) => {
  const reservationId = req.params.id;

  try {
    // Fetch reservation details by ID from the database
    const reservation = await Reservations.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // Render the 'reservation_detail_view' template with the reservation data
    res.render("reservation_detail_view", { reservation });
  } catch (err) {
    console.error("Error in getReservationDetails:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
