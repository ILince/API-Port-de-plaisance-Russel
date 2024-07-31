const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReservationSchema = new Schema(
  {
    catwayId: {
      type: Schema.Types.ObjectId,
      ref: "Catway",
      required: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    checking: {
      type: Date,
      required: true,
    },
    checkout: {
      type: Date,
      required: true,
    },
    boatName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reservation", ReservationSchema);
