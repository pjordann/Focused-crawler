/*
 * Modelo de datos en MongoDB del usuario.
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  signupDate: {
    type: Date,
    default: Date.now(),
    required: false,
  },
  lastLogin: {
    type: Date,
    default: Date.now(),
    required: false,
  },
  rol: {
    type: String,
    enum: ["editor1", "editor2", "admin", "lector"],
    default: "editor1",
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
