import { useEffect, useState } from "react";
import {
  Bell,
  UtensilsCrossed,
  Bus,
  Music,
  Lightbulb,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  DollarSign,
} from "lucide-react";

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertFilter, setAlertFilter] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);
  const [unmarkedTransactions, setUnmarkedTransactions] = useState([]);
  const userId = "681ba16b94ab07240fd6b21b"; // TODO: Get from auth context

  const fetchUnmarkedTransactions = async () => {
    try {
      const response = await fetch(`http://localhost:4000/alerts/unmarked/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch unmarked transactions");
      }
      const data = await response.json();
      setUnmarkedTransactions(data.transactions);
    } catch (err) {
      console.error("Error fetching unmarked transactions:", err);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both alerts and unmarked transactions in parallel
      const [alertsResponse, countResponse] = await Promise.all([
        fetch(`http://localhost:4000/alerts/${userId}`),
        fetch(`http://localhost:4000/alerts/count/${userId}`),
        fetchUnmarkedTransactions()
      ]);

      if (!alertsResponse.ok || !countResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const alertsData = await alertsResponse.json();
      const countData = await countResponse.json();

      // Format dates for alerts
      const formattedAlerts = alertsData.alerts.map(alert => ({
        ...alert,
        createdAt: new Date(alert.createdAt).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      }));

      setAlerts(formattedAlerts);
      setUnreadCount(countData.count);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkAsRead = async (alertId) => {
    try {
      const response = await fetch(`http://localhost:4000/alerts/${alertId}/read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error("Failed to mark alert as read");
      }

      const data = await response.json();
      if (data.alert.status === 'read') {
        setAlerts(prevAlerts => 
          prevAlerts.map(alert => 
            alert.id === alertId ? { ...alert, status: 'read' } : alert
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Error marking alert as read:", err);
      setError("Failed to mark alert as read");
    }
  };

  // Filter and sort alerts
  const filteredAlerts = alerts.filter(alert => 
    alertFilter === "all" || 
    alert.category.toLowerCase() === alertFilter ||
    alert.type.toLowerCase() === alertFilter
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold dark:text-white">Recent Alerts</h2>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-300">
              {filteredAlerts.length} Alerts
            </span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <select
            onChange={(e) => setAlertFilter(e.target.value)}
            className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-3 pr-8 text-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Alerts</option>
            <option value="budget">Budget Alerts</option>
            <option value="transaction">Transaction Alerts</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="entertainment">Entertainment</option>
            <option value="utilities">Utilities</option>
          </select>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && <p className="text-center text-gray-500">Loading alerts...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {/* Unmarked Transactions Section */}
      {unmarkedTransactions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold dark:text-white mb-3">
            Unmarked Transactions
          </h3>
          <div className="space-y-3">
            {unmarkedTransactions.map((transaction) => (
              <div
                key={transaction._id}
                className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-800">
                    <DollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium dark:text-white">
                        {transaction.category}
                      </h4>
                      <span className="text-sm text-yellow-600 dark:text-yellow-400">
                        Rs{transaction.amount}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Transaction needs to be reviewed
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(transaction.date).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-4">
        {!loading && filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow dark:border-gray-700 
              ${alert.priority === 'high' ? 'border-l-4 border-red-500' : 
                alert.priority === 'medium' ? 'border-l-4 border-yellow-500' : 
                'border-l-4 border-blue-500'}
              ${alert.status === 'read' ? "opacity-70" : ""}`}
          >
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold dark:text-white">
                      {alert.category}
                    </h3>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                      alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.priority?.charAt(0).toUpperCase() + alert.priority?.slice(1) || 'Normal'}
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-300 mt-1">
                    {alert.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {alert.createdAt}
                  </p>
                </div>
                {(alert.status === 'unread') && (
                  <button
                    onClick={() => handleMarkAsRead(alert.id)}
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                  >
                    Mark as Read
                  </button>
                )}
                {alert.status === 'read' && (
                  <CheckCircle className="text-green-500 w-5 h-5" />
                )}
              </div>
            </div>
          </div>
        ))}
        {!loading && filteredAlerts.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:border-gray-700">
            <div className="p-8 text-center">
              <p className="dark:text-white">No alerts available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;
