const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// Generate Recommendations
exports.generateRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all transactions and budgets for the user
    const transactions = await Transaction.find({ userId });
    const budgets = await Budget.find({ userId });

    const recommendations = [];

    // Analyze spending patterns
    const categoryTotals = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        if (!categoryTotals[t.category]) categoryTotals[t.category] = 0;
        categoryTotals[t.category] += t.amount;
      });

    budgets.forEach((budget) => {
      const spent = categoryTotals[budget.category] || 0;
      if (spent > budget.amount * 0.8) {
        recommendations.push({
          category: budget.category,
          message: `You are nearing your budget limit in ${budget.category}. Consider reducing spending.`,
        });
      }
    });

    res.status(200).json({ recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};