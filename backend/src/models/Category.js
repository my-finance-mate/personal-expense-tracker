const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: String,
  spent: Number,
});

module.exports = mongoose.model("Category", CategorySchema);
