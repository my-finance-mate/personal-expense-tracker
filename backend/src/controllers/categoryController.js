const Category = require("../models/Category");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.saveCategories = async (req, res) => {
  try {
    await Category.deleteMany(); // Clear previous
    const saved = await Category.insertMany(req.body); // Bulk insert
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
