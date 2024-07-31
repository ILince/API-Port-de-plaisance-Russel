const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Catway = new Schema(
  {
    catwayNumber: {
      type: Number,
      required: [true, "catwayNumber is required"],
      unique: true,
    },
    catwayState: {
      type: String,
      required: [true, "catwayState is required"],
      trim: true,
    },
    type: {
      type: Boolean,
      required: [true, "type is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Catway", Catway);
