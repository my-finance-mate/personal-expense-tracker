import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [totalBudget, setTotalBudget] = useState(0);
  const [categories, setCategories] = useState([]);
  const [savingsGoal, setSavingsGoal] = useState(1000);
  const [loading, setLoading] = useState(true);

  const totalExpenses = categories.reduce(
    (sum, cat) => sum + Number(cat.spent || 0),
    0
  );
  const savings = totalBudget - totalExpenses;

  // ✅ Fetch budget + category data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, budgetRes] = await Promise.all([
          axios.get("http://localhost:5000/api/categories"),
          axios.get("http://localhost:5000/api/budget"),
        ]);

        setCategories(catRes.data || []);

        if (budgetRes.data) {
          setTotalBudget(budgetRes.data.totalBudget || 0);
          setSavingsGoal(budgetRes.data.savingsGoal || 1000);
        }
      } catch (error) {
        console.error("❌ Error fetching budget data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Save category data to backend
  const saveCategories = async (updatedCategories) => {
    try {
      await axios.post("http://localhost:5000/api/categories", updatedCategories);
      setCategories(updatedCategories);
    } catch (error) {
      console.error("❌ Error saving categories:", error);
    }
  };

  // ✅ Save budget and savings goal to backend
  const saveBudget = async (newBudget, newGoal) => {
    try {
      await axios.post("http://localhost:5000/api/budget", {
        totalBudget: newBudget,
        savingsGoal: newGoal,
      });
      setTotalBudget(newBudget);
      setSavingsGoal(newGoal);
    } catch (error) {
      console.error("❌ Error saving budget:", error);
    }
  };

  return (
    <BudgetContext.Provider
      value={{
        totalBudget,
        setTotalBudget,
        categories,
        setCategories,
        totalExpenses,
        savings,
        savingsGoal,
        setSavingsGoal,
        saveCategories,
        saveBudget,
        loading, // optional if you want to show loaders in UI
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => useContext(BudgetContext);
