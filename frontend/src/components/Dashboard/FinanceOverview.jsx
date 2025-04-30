import React from "react";
import CustomPieChart from "../Charts/CustomPieChart";

const COLORS = ["#875CFF", "#FA2C37", "#FF6900"];

const FinanceOverview = ({
  totalBalance = 0,
  totalIncome = 0,
  totalExpense = 0,
}) => {
  console.log("Finance Overview Data:", { totalBalance, totalIncome, totalExpense });

  const balanceData = [
    
      { name: "Total Balance", amount: 5300 },
      { name: "Total Expenses", amount: 300 },
      { name: "Total Income", amount: 5600 },
    
    
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <div className="flex items-center justify-between mb-2">
        <h5 className="text-lg font-semibold text-gray-800">Financial Overview</h5>
      </div>

      <CustomPieChart
        data={balanceData}
        label="Total Balance"
        totalAmount={`$${totalBalance}`}
        colors={COLORS}
        showTextAnchor
      />
    </div>
  );
};

export default FinanceOverview;
