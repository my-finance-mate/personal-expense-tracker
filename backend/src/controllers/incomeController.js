// src/controllers/income.controller.js
const connectSecondaryDB = require('../config/secondaryDB');
const getIncomeModel = require('../models/income.model');

const connection = connectSecondaryDB();
const Income = getIncomeModel(connection);

const getAllIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({});
    res.status(200).json(incomes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching incomes', error: err });
  }
};

module.exports = { getAllIncomes };
