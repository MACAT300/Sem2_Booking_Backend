const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const roomSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // "Single", "Double", etc.
  description: { type: String },
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
  available: { type: Boolean, default: true },
  image: { type: String },
});

module.exports = model("Room", roomSchema);
