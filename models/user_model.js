const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcrypt");

const User = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware executed before saving (pre-save) a user
User.pre("save", function (next) {
  // If the password has not been modified, move to the next middleware
  if (!this.isModified("password")) {
    return next();
  }

  // Hash the password with a cost factor of 10
  this.password = bcrypt.hashSync(this.password, 10);

  next();
});

module.exports = mongoose.model("User", User);
