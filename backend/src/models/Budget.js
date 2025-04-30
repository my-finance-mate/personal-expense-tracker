const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true },
  totalBudget: { type: Number, required: true },
  categories: [{
    name: String,
    limit: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Budget', BudgetSchema);
