import React, { useState } from "react";
import Input from "../Inputs/input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const AddExpenseForm = ({ onAddExpense }) => {
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    date: "",
    icon: "",
  });

  const handleChange = (key, value) => {
    setExpense({ ...expense, [key]: value }); // ✅ Fix here
  };

  return (
    <div className="space-y-4">
      {/* Emoji Picker */}
      <EmojiPickerPopup
        icon={expense.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      {/* Category */}
      <Input
        value={expense.category}
        onChange={({ target }) => handleChange("category", target.value)}
        label="Category"
        placeholder="e.g. Food, Transport"
        type="text"
      />

      {/* Amount */}
      <Input
        value={expense.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Amount"
        placeholder="Enter amount"
        type="number"
      />

      {/* Date */}
      <Input
        value={expense.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Date"
        placeholder="dd/mm/yyyy"
        type="date"
      />

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onAddExpense(expense)} // ✅ Fix here
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
