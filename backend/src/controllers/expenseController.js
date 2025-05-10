const connectSecondaryDB = require('../config/secondaryDB'); // your connection utility
const getExpenseModel = require('../models/expense.model'); // factory-style model

const secondaryConnection = connectSecondaryDB();
const Expense = getExpenseModel(secondaryConnection); // bind model to secondary DB

// @desc    Get all expense records
// @route   GET /api/expenses
// @access  Public
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllExpenses };
