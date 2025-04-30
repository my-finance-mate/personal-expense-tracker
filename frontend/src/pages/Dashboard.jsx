import { useBudget } from "../components/BudgetContext"; // adjust path if needed
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const Dashboard = () => {
  const { totalBudget, categories, savingsAmount } = useBudget(); // 🔗 Using shared context

  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const income = totalBudget;
  const expenses = totalSpent;
  const savings = savingsAmount || income - expenses;

  const COLORS = ["#4CAF50", "#FF9800", "#F44336", "#3B82F6", "#A855F7", "#10B981"];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">💼 Dashboard</h2>

      {/* Income & Expenses Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-2">
        <h3 className="text-lg font-semibold text-gray-700">Income vs. Expenses</h3>
        <p className="text-gray-600">💰 <strong>Total Income:</strong> ${income}</p>
        <p className="text-gray-600">💸 <strong>Total Expenses:</strong> ${expenses}</p>
        <p className={`font-semibold ${income - expenses >= 0 ? "text-green-600" : "text-red-500"}`}>
          💼 Net Savings: ${income - expenses}
        </p>
      </div>

      {/* Spending by Category Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">📊 Spending by Category</h3>
        {categories.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categories}
                dataKey="spent"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {categories.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No spending data available yet.</p>
        )}
      </div>

      {/* Savings Overview */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">💵 Savings Overview</h3>
        <p className="text-gray-600 mt-2">🏦 <strong>Total Savings:</strong> ${savings}</p>
      </div>
    </div>
  );
};

export default Dashboard;
