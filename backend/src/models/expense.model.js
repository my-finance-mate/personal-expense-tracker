// src/models/expense.model.js
module.exports = (connection) => {
  const mongoose = require("mongoose");

  const ExpenseSchema = new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      icon: { type: String },
      category: { type: String, required: true },
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
    { timestamps: true }
  );

  return connection.model("Expense", ExpenseSchema);
};
