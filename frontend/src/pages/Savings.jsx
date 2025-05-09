import React from "react";
import { Link } from "react-router-dom";
import { useBudget } from "../components/BudgetContext";

const Savings = () => {
  const { savingsGoal, setSavingsGoal, savings } = useBudget();

  const progress = (savings / savingsGoal) * 100;

  const handleNumericInput = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setSavingsGoal(Number(value));
    }
  };

  return (
    <div className="relative p-6 max-w-xl mx-auto space-y-6" style={{ backgroundColor: "#F3E8FF" }}>
      {/* Top-left Budget Link */}
      <Link
        to="/budget"
        className="absolute top-4 left-4 text-sm px-3 py-1 rounded hover:brightness-90 transition"
        style={{ backgroundColor: "#5FAF6D", color: "#fff" }}
      >
        ← Go to Budget
      </Link>

      <h2 className="text-2xl font-bold text-center text-gray-800"> Savings Goals</h2>

      {/* Savings Progress */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Progress</h3>

        <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-4 transition-all duration-300"
            style={{
              width: `${progress > 100 ? 100 : progress}%`,
              backgroundColor: "#5FAF6D"
            }}
          ></div>
        </div>

        <p className="text-sm text-gray-600 text-right">
          💰 {savings} / {savingsGoal} saved ({isNaN(progress) ? 0 : progress.toFixed(1)}%)
        </p>
      </div>

      {/* Set Goal */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-2">
        <label className="text-gray-700 font-medium">Set Savings Goal</label>
        <input
          type="text"
          value={savingsGoal}
          onChange={handleNumericInput}
          className="p-2 border rounded-md w-full focus:ring-2 focus:ring-purple-400"
          placeholder="Enter your goal (numbers only)"
        />
      </div>
    </div>
  );
};

export default Savings;
