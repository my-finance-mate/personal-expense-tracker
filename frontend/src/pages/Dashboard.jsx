import { useBudget } from "../components/BudgetContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const Dashboard = () => {
  const { totalBudget, categories, savingsAmount } = useBudget();

  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const income = totalBudget;
  const expenses = totalSpent;
  const savings = savingsAmount || income - expenses;

  const COLORS = ["#A8D5BA", "#C8B6FF", "#F4978E", "#BFA2DB", "#9FD9B6", "#DCD0FF"];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6" style={{ backgroundColor: "#F7F5FF", minHeight: "100vh" }}>
      <h2 className="text-3xl font-bold text-center text-[#6D597A]"> Dashboard</h2>

      {/* Income & Expenses Summary */}
      <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: "#E3F9E5" }}>
        <h3 className="text-lg font-semibold text-[#386641]">Income vs. Expenses</h3>
        <p className="text-[#22577A]">💰 <strong>Total Income:</strong> ${income}</p>
        <p className="text-[#22577A]">💸 <strong>Total Expenses:</strong> ${expenses}</p>
        <p className={`font-semibold ${income - expenses >= 0 ? "text-[#2A9D8F]" : "text-[#E76F51]"}`}>
          💼 Net Savings: ${income - expenses}
        </p>
      </div>

      {/* Spending by Category Chart */}
      <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: "#F3E8FF" }}>
        <h3 className="text-lg font-semibold text-[#6D597A] mb-4">🗂️ Spending by Category</h3>
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
              <Tooltip
                contentStyle={{ backgroundColor: "#F4F1FF", border: "none", color: "#4A4A4A" }}
              />
              <Legend wrapperStyle={{ color: "#4A4A4A" }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-[#888]">No spending data available yet.</p>
        )}
      </div>

      {/* Savings Overview */}
      <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: "#DFF5E1" }}>
        <h3 className="text-lg font-semibold text-[#386641]">💵 Savings Overview</h3>
        <p className="text-[#22577A] mt-2">🏦 <strong>Total Savings:</strong> ${savings}</p>
      </div>
    </div>
  );
};

export default Dashboard;
