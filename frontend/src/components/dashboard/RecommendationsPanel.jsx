import { useEffect, useState } from "react";
import { Star, TrendingUp, PieChart, Lightbulb, Target } from "lucide-react";
import { generateRecommendations } from "../../utils/gemini";

const RecommendationsPanel = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Mock transaction data for testing
        const transactions = [
          { date: "2025-04-01", category: "Groceries", amount: 85.50 },
          { date: "2025-04-02", category: "Dining", amount: 45.00 },
          { date: "2025-04-03", category: "Entertainment", amount: 60.00 },
          { date: "2025-04-05", category: "Utilities", amount: 120.00 },
          { date: "2025-04-07", category: "Savings", amount: 150.00 },
          { date: "2025-04-10", category: "Dining", amount: 55.00 },
          { date: "2025-04-12", category: "Subscriptions", amount: 35.00 },
          { date: "2025-04-14", category: "Transport", amount: 25.00 }
        ];

        // Calculate totals
        const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
        const totalSavings = transactions.find(t => t.category === "Savings")?.amount || 0;

        const userProfile = {
          monthlyIncome: 5000,
          savingsGoal: totalSavings,
          spendingLimits: {
            dining: 500,
            entertainment: 400,
            shopping: 600
          }
        };

        const recentActivity = {
          transactions,
          totalSpent,
          savingsAmount: totalSavings
        };

        const data = await generateRecommendations(userProfile, recentActivity);
        
        if (!data || !data.summary) {
          throw new Error("Invalid response from AI");
        }
        
        setRecommendations(data);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
        setError(err.message || "Failed to generate recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-center text-gray-500 dark:text-gray-300">
          Analyzing your financial data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-center text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!recommendations) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-6 dark:text-white">
        AI-Powered Financial Insights
      </h2>

      {/* Summary Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold dark:text-white">Summary</h3>
        </div>
        <p className="dark:text-gray-300">{recommendations?.summary}</p>
      </div>

      {/* Spending Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold dark:text-white">Spending Breakdown</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(recommendations?.spendingBreakdown || {}).map(([category, amount]) => (
            <div key={category} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium dark:text-white capitalize">{category}</span>
              <span className="text-gray-600 dark:text-gray-300">
                ${typeof amount === 'number' ? amount.toFixed(2) : '0.00'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Insights & Patterns */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold dark:text-white">Insights & Patterns</h3>
        </div>
        <ul className="space-y-3">
          {recommendations?.insightsAndPatterns?.map((insight, index) => (
            <li key={index} className="flex items-start gap-3">
              <Star className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="dark:text-gray-300">{insight}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold dark:text-white">Recommendations</h3>
        </div>
        <ul className="space-y-3">
          {recommendations?.recommendations?.map((recommendation, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <span className="text-sm font-medium text-purple-600 dark:text-purple-300">
                  {index + 1}
                </span>
              </div>
              <p className="dark:text-gray-300">{recommendation}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecommendationsPanel;
