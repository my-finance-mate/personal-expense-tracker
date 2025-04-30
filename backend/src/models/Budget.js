const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  month: { type: Number, required: true }, // Month as a number (1-12)
  year: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  appendedAmount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Budget', budgetSchema);