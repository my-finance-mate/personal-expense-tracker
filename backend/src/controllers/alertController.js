const mongoose = require("mongoose");
const connectSecondaryDB = require("../config/secondaryDB");

// Connect to secondary DB (for expenses)
const secondaryDB = connectSecondaryDB();
const Expense = require("../models/expense.model")(secondaryDB);

// Budget is in the primary DB
const Budget = require("../models/Budget");

exports.generateAlerts = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const expenses = await Expense.find({ userId });
    const budgets = await Budget.find({ userId });

    const alerts = [];
    const recommendations = [];
    const categoryTotals = {};

    expenses.forEach((e) => {
      if (!categoryTotals[e.category]) categoryTotals[e.category] = 0;
      categoryTotals[e.category] += e.amount;
    });

    budgets.forEach((budget) => {
      const spent = categoryTotals[budget.category] || 0;

      if (spent > budget.amount) {
        alerts.push({
          category: budget.category,
          message: `You have exceeded your budget limit of ${budget.amount} in ${budget.category}. Spent: ${spent}`,
        });
      }

      if (spent > budget.amount * 0.8 && spent <= budget.amount) {
        alerts.push({
          category: budget.category,
          message: `You are nearing your budget limit in ${budget.category}. Spent: ${spent} of ${budget.amount}.`,
        });
      }

      if (spent === 0) {
        recommendations.push({
          category: budget.category,
          message: `You have not spent anything in ${budget.category}, but you have allocated a budget of ${budget.amount}.`,
        });
      }

      if (spent > 0 && spent < budget.amount * 0.5) {
        alerts.push({
          category: budget.category,
          message: `You have only spent ${spent} in ${budget.category}, which is less than half of your budget (${budget.amount}).`,
        });
      }
    });

    const totalCategories = Object.keys(categoryTotals).length;
    const totalSpent = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
    const avgSpending = totalCategories ? totalSpent / totalCategories : 0;

    Object.entries(categoryTotals).forEach(([category, total]) => {
      if (total > avgSpending * 2 && avgSpending > 0) {
        alerts.push({
          category,
          message: `Unusually high spending in ${category}. Total spent: ${total}, which is well above your average of ${avgSpending.toFixed(2)}.`,
        });
      }
    });

    res.status(200).json({ alerts, recommendations });
  } catch (error) {
    console.error("Alert Generation Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
