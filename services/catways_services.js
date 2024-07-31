const Catway = require("../models/catway_model");

/**
 * Retrieves all catways from the database.
 * @async
 * @returns {Promise<{data: Array<Object>} | {error: string}>} A promise that resolves to an object containing an array of catways or an error message.
 */
exports.getAllCatways = async () => {
  try {
    const catways = await Catway.find();
    return { data: catways };
  } catch (error) {
    console.error("Error in getAllCatways:", error);
    return { error: "Internal server error" };
  }
};

/**
 * Retrieves only the catway numbers and their IDs from the database.
 * @async
 * @returns {Promise<{data: Array<Object>} | {error: string}>} A promise that resolves to an object containing an array of catway numbers or an error message.
 */
exports.getCatwayNumbers = async () => {
  try {
    const catways = await Catway.find({}, "catwayNumber _id");
    return { data: catways };
  } catch (error) {
    console.error("Error fetching catway numbers:", error);
    return { error: "Error fetching catway numbers" };
  }
};

/**
 * Retrieves a single catway by its ID.
 * @async
 * @param {string} id - The ID of the catway to retrieve.
 * @returns {Promise<{data: Object} | {error: string}>} A promise that resolves to an object containing the catway data if found, or an error message if not found.
 */
exports.getCatwayById = async (id) => {
  try {
    const catway = await Catway.findById(id);
    if (!catway) {
      return { error: "Catway not found" };
    }
    return { data: catway };
  } catch (error) {
    console.error(`Error fetching catway ${id}:`, error);
    return { error: "Error fetching catway details" };
  }
};

/**
 * Adds a new catway to the database.
 * @async
 * @param {Object} catwayData - The data for the new catway.
 * @returns {Promise<{data: Object} | {error: string}>} A promise that resolves to an object containing the newly created catway data, or an error message if creation fails.
 */
exports.addCatway = async (catwayData) => {
  try {
    const newCatway = await Catway.create(catwayData);
    return { data: newCatway };
  } catch (error) {
    console.error("Error in addCatway:", error);
    return { error: "Error creating catway" };
  }
};

/**
 * Updates an existing catway by its ID.
 * @async
 * @param {string} id - The ID of the catway to update.
 * @param {Object} updateData - The data to update the catway with.
 * @returns {Promise<{data: Object} | {error: string}>} A promise that resolves to an object containing the updated catway data if the update is successful, or an error message if the catway is not found or update fails.
 */
exports.updateCatwayById = async (id, updateData) => {
  try {
    const catway = await Catway.findById(id);
    if (!catway) {
      return { error: "Catway not found" };
    }

    Object.assign(catway, updateData);
    await catway.save();
    return { data: catway };
  } catch (error) {
    console.error("Error in updateCatwayById:", error);
    return { error: "Error updating catway" };
  }
};

/**
 * Deletes a catway by its ID.
 * @async
 * @param {string} id - The ID of the catway to delete.
 * @returns {Promise<{data: Object} | {error: string}>} A promise that resolves to an object containing a success message if deletion is successful, or an error message if the catway is not found or deletion fails.
 */
exports.deleteCatwayById = async (id) => {
  try {
    const catway = await Catway.findById(id);
    if (!catway) {
      return { error: "Catway not found" };
    }

    await Catway.deleteOne({ _id: id });
    return { data: { message: "Catway deleted successfully" } };
  } catch (error) {
    console.error("Error in deleteCatwayById:", error);
    return { error: "Error deleting catway" };
  }
};

/**
 * Partially updates a catway's state by its ID.
 * @async
 * @param {string} id - The ID of the catway to update.
 * @param {string} catwayState - The new state of the catway.
 * @returns {Promise<{data: Object} | {error: string}>} A promise that resolves to an object containing the updated catway data if the update is successful, or an error message if the catway is not found or update fails.
 */
exports.patchCatwayById = async (id, catwayState) => {
  if (
    !catwayState ||
    typeof catwayState !== "string" ||
    catwayState.trim() === ""
  ) {
    return { error: "Invalid catwayState" };
  }

  try {
    const catway = await Catway.findByIdAndUpdate(
      id,
      { catwayState: catwayState.trim() },
      { new: true }
    );
    if (!catway) {
      return { error: "Catway not found" };
    }
    return { data: catway };
  } catch (error) {
    console.error("Error updating Catway:", error);
    return { error: "Error updating Catway" };
  }
};
