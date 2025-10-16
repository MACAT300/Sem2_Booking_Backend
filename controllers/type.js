// controllers/type.js
const Type = require("../models/type");

// Get all types
const getTypes = async () => {
  return await Type.find().sort({ _id: -1 });
};

// Get one type
const getType = async (id) => {
  const type = await Type.findById(id);
  if (!type) throw new Error("Type not found");
  return type;
};

// Add new type
const addType = async (label) => {
  const newType = new Type({ label });
  return await newType.save();
};

// Update type
const updateType = async (id, label) => {
  return await Type.findByIdAndUpdate(id, { label }, { new: true });
};

// Delete type
const deleteType = async (id) => {
  return await Type.findByIdAndDelete(id);
};

module.exports = { getTypes, getType, addType, updateType, deleteType };
