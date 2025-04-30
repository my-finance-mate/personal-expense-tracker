import { useEffect, useState } from "react";
import { Star } from "lucide-react";

const RecommendationsPanel = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/recommendations/654f8c2b3d9c8a1c4e8b4567"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }
        const data = await response.json();
        setRecommendations(data.recommendations);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 dark:text-white">
        AI-Powered Recommendations
      </h2>

      {loading && (
        <p className="text-center text-gray-500 dark:text-gray-300">
          Loading recommendations...
        </p>
      )}

      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((recommendation, index) => (
            <div
              key={recommendation.id || index} // Use recommendation.id if available, otherwise fallback to index
              className="bg-white dark:bg-gray-800 rounded-lg shadow dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white">
                      {recommendation.title}
                    </h3>
                    <div className="flex items-center mt-1">
                      <div
                        className={`w-3 h-3 rounded-full ${getPriorityColor(
                          recommendation.priority
                        )} mr-2`}
                      ></div>
                      <p className="text-gray-500 dark:text-gray-300 capitalize">
                        {recommendation.priority} priority
                      </p>
                    </div>
                  </div>
                  <Star className="h-5 w-5 text-yellow-500" />
                </div>
                <p className="my-4 dark:text-white">
                  {recommendation.description}
                </p>
                {/* Added Category and Message */}
                <div className="mt-4">
                  <h4 className="text-md font-semibold dark:text-white">
                    Category: {recommendation.category}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-300">
                    {recommendation.message}
                  </p>
                </div>
                {recommendation.action && (
                  <button className="px-4 py-2 border rounded-md dark:border-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    {recommendation.action}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mt-6 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold dark:text-white mb-2">
            Spending Analysis
          </h3>
          <p className="text-gray-500 dark:text-gray-300 mb-4">
            Based on your recent transactions
          </p>
          <div className="grid grid-cols-3 gap-4">
            {["Dining", "Shopping", "Entertainment"].map((category) => (
              <div key={category} className="text-center">
                <div className="h-32 w-32 mx-auto mb-2 rounded-full border-8 border-blue-500 flex items-center justify-center">
                  <span className="text-xl font-bold dark:text-white">
                    {Math.floor(Math.random() * 30) + 20}%
                  </span>
                </div>
                <p className="font-medium dark:text-white">{category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPanel;
