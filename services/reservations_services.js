const Reservation = require("../models/reservation_model");

/**
 * Get all reservations for a specific catway by its ID.
 *
 * @param {string} catwayId - The ID of the catway.
 * @returns {Promise<Array>} - A promise that resolves to an array of reservations.
 */
exports.getResByCatwayId = async (catwayId) => {
  try {
    const reservations = await Reservation.find({ catwayId });
    return reservations;
  } catch (error) {
    console.error("Error in getResByCatwayId:", error);
    throw new Error("Failed to get reservations by catway ID");
  }
};

/**
 * Get a single reservation by its ID and catway ID.
 *
 * @param {string} catwayId - The ID of the catway.
 * @param {string} reservationId - The ID of the reservation.
 * @returns {Promise<Object|null>} - A promise that resolves to the reservation or null if not found.
 */
exports.getResByCatwayAndId = async (catwayId, reservationId) => {
  try {
    const reservation = await Reservation.findOne({
      _id: reservationId,
      catwayId,
    });
    return reservation;
  } catch (error) {
    console.error("Error in getResByCatwayAndId:", error);
    throw new Error("Failed to get reservation by catway ID and reservation ID");
  }
};

/**
 * Create a new reservation for a specific catway.
 *
 * @param {string} catwayId - The ID of the catway.
 * @param {string} clientName - The name of the client.
 * @param {Date} checking - The check-in date.
 * @param {Date} checkout - The check-out date.
 * @param {string} boatName - The name of the client's boat.
 * @returns {Promise<Object>} - A promise that resolves to the newly created reservation.
 */
exports.createReservation = async (
  catwayId,
  clientName,
  checking,
  checkout,
  boatName
) => {
  try {
    const newReservation = new Reservation({
      catwayId,
      clientName,
      checking,
      checkout,
      boatName,
    });
    await newReservation.save();
    return newReservation;
  } catch (error) {
    console.error("Error in createReservation:", error);
    throw new Error("Failed to create reservation");
  }
};

/**
 * Delete a reservation by its ID and catway ID.
 *
 * @param {string} catwayId - The ID of the catway.
 * @param {string} reservationId - The ID of the reservation.
 * @returns {Promise<Object>} - A promise that resolves to the result of the deletion.
 */
exports.deleteResByCatwayAndId = async (catwayId, reservationId) => {
  try {
    const result = await Reservation.deleteOne({
      _id: reservationId,
      catwayId,
    });
    if (result.deletedCount === 0) {
      throw new Error("No reservation found to delete");
    }
    return result;
  } catch (error) {
    console.error("Error in deleteResByCatwayAndId:", error);
    throw new Error("Failed to delete reservation by catway ID and reservation ID");
  }
};
