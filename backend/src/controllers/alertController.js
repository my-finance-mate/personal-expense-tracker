const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// Generate Alerts and Recommendations
exports.generateAlerts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch all transactions and budgets for the user
    const transactions = await Transaction.find({ userId });
    const budgets = await Budget.find({ userId });

    const alerts = [];
    const recommendations = [];

    // Analyze spending patterns
    const categoryTotals = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        if (!categoryTotals[t.category]) categoryTotals[t.category] = 0;
        categoryTotals[t.category] += t.amount;
      });

    // Loop through each budget
    budgets.forEach((budget) => {
      const spent = categoryTotals[budget.category] || 0;

      // 1. Overspending Alert
      if (spent > budget.amount) {
        alerts.push({
          category: budget.category,
          message: `You have exceeded your budget limit of ${budget.amount} in ${budget.category}. Spent: ${spent}`,
        });
      }

      // 2. Nearing Budget Limit Alert
      if (spent > budget.amount * 0.8 && spent <= budget.amount) {
        recommendations.push({
          category: budget.category,
          message: `You are nearing your budget limit in ${budget.category}. Consider reducing spending.`,
        });
      }

      // 3. Zero Spending Alert
      if (spent === 0) {
        recommendations.push({
          category: budget.category,
          message: `You have not spent anything in ${budget.category}, but you have allocated a budget of ${budget.amount}.`,
        });
      }

      // 4. Unused Budget Alert
      if (spent < budget.amount * 0.5) {
        recommendations.push({
          category: budget.category,
          message: `You have only spent ${spent} in ${budget.category}, which is less than half of your budget (${budget.amount}).`,
        });
      }
    });

    // 5. Unexpected High Spending Alert
    const averageSpendingPerCategory = Object.values(categoryTotals).reduce(
      (sum, total) => sum + total,
      0
    ) / Object.keys(categoryTotals).length;

    Object.entries(categoryTotals).forEach(([category, total]) => {
      if (total > averageSpendingPerCategory * 2) {
        alerts.push({
          category: category,
          message: `You have unusually high spending in ${category}. Total spent: ${total}. This is significantly above your average spending.`,
        });
      }
    });

    // Return both alerts and recommendations
    res.status(200).json({ alerts, recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};