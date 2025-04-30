import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Link } from "react-router-dom";
import { useBudget } from "../components/BudgetContext";


const Budget = () => {
  const { totalBudget, setTotalBudget, categories, setCategories } = useBudget();


  const [newCategory, setNewCategory] = useState("");
  const [newBudget, setNewBudget] = useState("");
  const [newSpent, setNewSpent] = useState("");

  const [editingIndex, setEditingIndex] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedBudget, setEditedBudget] = useState("");
  const [editedSpent, setEditedSpent] = useState("");

  const handleAddCategory = () => {
    if (newCategory && newBudget && newSpent) {
      const totalAllocated = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
      if (totalAllocated + Number(newBudget) > totalBudget) {
        alert("Total category budgets exceed overall budget.");
        return;
      }

      const colorPalette = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#6366F1", "#14B8A6", "#A855F7"];
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];

      setCategories([
        ...categories,
        {
          name: newCategory,
          budgeted: Number(newBudget),
          spent: Number(newSpent),
          color,
        },
      ]);
      setNewCategory("");
      setNewBudget("");
      setNewSpent("");
    } else {
      alert("Please fill all fields for the new category.");
    }
  };

  const handleEditCategory = (index) => {
    const cat = categories[index];
    setEditingIndex(index);
    setEditedName(cat.name);
    setEditedBudget(cat.budgeted);
    setEditedSpent(cat.spent);
  };

  const handleSaveEdit = () => {
    const updated = categories.map((cat, i) =>
      i === editingIndex
        ? { ...cat, name: editedName, budgeted: Number(editedBudget), spent: Number(editedSpent) }
        : cat
    );
    setCategories(updated);
    setEditingIndex(null);
    setEditedName("");
    setEditedBudget("");
    setEditedSpent("");
  };

  const handleRemoveCategory = (index) => {
    const updated = [...categories];
    updated.splice(index, 1);
    setCategories(updated);
  };
  

  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = totalBudget - totalSpent;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">💸 Budget</h2>

      {/* Total Budget */}
      <div className="p-6 bg-white border rounded-xl shadow">
        <h3 className="text-lg font-semibold text-gray-700">Total Budget</h3>
        <input
          type="number"
          placeholder="Enter your total budget"
          value={totalBudget}
          onChange={(e) => setTotalBudget(Number(e.target.value))}
          className="mt-3 p-3 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Add New Category */}
      <div className="p-6 bg-white border rounded-xl shadow space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Add Category</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="p-2 border rounded-md"
          />
          <input
            type="number"
            placeholder="Budget Amount"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            className="p-2 border rounded-md"
          />
          <input
            type="number"
            placeholder="Spent Amount"
            value={newSpent}
            onChange={(e) => setNewSpent(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
        <button
          onClick={handleAddCategory}
          className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Category
        </button>
      </div>

      {/* Category List */}
      <div className="p-6 bg-white border rounded-xl shadow space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Category Overview</h3>

        {categories.length === 0 ? (
          <p className="text-gray-500">No categories added yet.</p>
        ) : (
          categories.map((cat, index) => (
            <div
              key={index}
              className={`flex items-center justify-between gap-3 p-3 rounded-md ${
                cat.spent > cat.budgeted ? "bg-red-100 border border-red-300" : "bg-gray-50"
              }`}
            >
              <span className="font-medium">{cat.name}</span>
              <progress
                value={(cat.spent / cat.budgeted) * 100}
                max="100"
                className="w-1/2 h-2"
              />
              <span className="text-sm text-gray-600">
                ${cat.spent} / ${cat.budgeted}
              </span>
              {cat.spent > cat.budgeted && (
                <span className="text-sm font-semibold text-red-600">Overspent!</span>
              )}
              <button
                onClick={() => handleEditCategory(index)}
                className="text-blue-600 hover:underline"
              >
                ✎
              </button>
              <button
                onClick={() => handleRemoveCategory(index)}
                className="text-red-600 hover:underline"
              >
                ✖
              </button>
            </div>
          ))
        )}

        {/* Edit Form */}
        {editingIndex !== null && (
          <div className="p-4 mt-4 border rounded-lg bg-blue-50 space-y-3">
            <h4 className="text-md font-semibold">Edit Category</h4>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="p-2 border rounded-md w-full"
            />
            <input
              type="number"
              value={editedBudget}
              onChange={(e) => setEditedBudget(e.target.value)}
              className="p-2 border rounded-md w-full"
            />
            <input
              type="number"
              value={editedSpent}
              onChange={(e) => setEditedSpent(e.target.value)}
              className="p-2 border rounded-md w-full"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="p-2 bg-green-600 text-white rounded-md"
              >
                Save
              </button>
              <button
                onClick={() => setEditingIndex(null)}
                className="p-2 bg-gray-600 text-white rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pie Chart */}
      {categories.length > 0 && (
        <div className="p-6 bg-white border rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Spending Insights
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categories}
                dataKey="spent"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
              >
                {categories.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Link to Savings Page */}
      <div className="text-center pt-4">
        <Link
          to="/savings"
          className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          Go to Savings →
        </Link>
      </div>
    </div>
  );
};

export default Budget;
