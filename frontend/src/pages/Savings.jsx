import React from "react";
import { Link } from "react-router-dom";
import { useBudget } from "../components/BudgetContext";

const Savings = () => {
  const { savingsGoal, setSavingsGoal, savings } = useBudget();

  const progress = (savings / savingsGoal) * 100;

  return (
    <div className="relative p-6 max-w-xl mx-auto space-y-6">
      {/* Top-left Budget Link */}
      <Link
        to="/budget"
        className="absolute top-4 left-4 text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
      >
        ← Go to Budget
      </Link>

      <h2 className="text-2xl font-bold text-center text-gray-800">🏦 Savings Goals</h2>

      {/* Savings Progress */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">Progress</h3>

        <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-4 bg-green-500 transition-all duration-300"
            style={{ width: `${progress > 100 ? 100 : progress}%` }}
          ></div>
        </div>

        <p className="text-sm text-gray-600 text-right">
          💰 {savings} / {savingsGoal} saved ({progress.toFixed(1)}%)
        </p>
      </div>

      {/* Set Goal */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-2">
        <label className="text-gray-700 font-medium">Set Savings Goal</label>
        <input
          type="number"
          value={savingsGoal}
          onChange={(e) => setSavingsGoal(Number(e.target.value))}
          className="p-2 border rounded-md w-full focus:ring-2 focus:ring-green-400"
        />
      </div>
    </div>
  );
};

export default Savings;
