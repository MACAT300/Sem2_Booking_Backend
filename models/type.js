// models/type.js
const { Schema, model } = require("mongoose");

/*
    Type model
    - label: (Single, Double, Suite)
    - description
*/

const typeSchema = new Schema({
  label: {
    type: String,
    required: true,
  },
});

const Type = model("Type", typeSchema);
module.exports = Type;
