import React, { useState } from 'react';
import Input from "../Inputs/input";
import EmojiPickerPopup from "../EmojiPickerPopup";

const AddIncomeForm = ({ onAddIncome }) => {
  const [income, setIncome] = useState({
    source: '',
    amount: '',
    date: '',
    icon: '',
  });

  const handleChange = (key, value) => {
    setIncome({ ...income, [key]: value });
  };

  const handleSubmit = () => {
    const { source, amount, date } = income;

    // Basic Validations
    if (!source.trim()) {
      alert("Income source is required.");
      return;
    }

    if (!amount || isNaN(amount)) {
      alert("Amount must be a valid number.");
      return;
    }

    if (Number(amount) <= 100) {
      alert("Amount should be greater than Rs. 100.");
      return;
    }

    if (!date) {
      alert("Date is required.");
      return;
    }

    onAddIncome(income); // Submit only if all validations pass
  };

  return (
    <div className="space-y-4">
      {/* Emoji Picker */}
      <EmojiPickerPopup
        icon={income.icon}
        onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
      />

      {/* Source */}
      <Input
        value={income.source}
        onChange={({ target }) => handleChange('source', target.value)}
        label="Income Source"
        placeholder="Freelance, Salary, etc"
        type="text"
      />

      {/* Amount */}
      <Input
        value={income.amount}
        onChange={({ target }) => handleChange('amount', target.value)}
        label="Amount"
        placeholder="Enter amount"
        type="number"
      />

      {/* Date */}
      <Input
        value={income.date}
        onChange={({ target }) => handleChange('date', target.value)}
        label="Date"
        placeholder="dd/mm/yyyy"
        type="date"
      />

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Add Income
        </button>
      </div>
    </div>
  );
};

export default AddIncomeForm;
