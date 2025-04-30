import { useEffect, useState } from "react";
import {
  Bell,
  UtensilsCrossed,
  Bus,
  Music,
  Lightbulb,
  CheckCircle,
} from "lucide-react";

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertFilter, setAlertFilter] = useState("all");
  const [readStatus, setReadStatus] = useState({});

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/alerts/654f8c2b3d9c8a1c4e8b4567"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch alerts");
        }
        const data = await response.json();
        setAlerts(data.alerts);

        const savedReadStatus =
          JSON.parse(localStorage.getItem("readStatus")) || {};

        const initialReadStatus = { ...savedReadStatus };
        data.alerts.forEach((alert, index) => {
          if (!(index in savedReadStatus)) {
            initialReadStatus[index] = false;
          }
        });

        setReadStatus(initialReadStatus);
        localStorage.setItem("readStatus", JSON.stringify(initialReadStatus));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const handleMarkAsRead = (index) => {
    const updatedReadStatus = {
      ...readStatus,
      [index]: true,
    };

    setReadStatus(updatedReadStatus);
    localStorage.setItem("readStatus", JSON.stringify(updatedReadStatus));
  };

  const getAlertIcon = (category) => {
    switch (category.toLowerCase()) {
      case "food":
        return <UtensilsCrossed className="w-5 h-5 text-red-500" />;
      case "transport":
        return <Bus className="w-5 h-5 text-blue-500" />;
      case "entertainment":
        return <Music className="w-5 h-5 text-green-500" />;
      case "utilities":
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredAlerts = alerts.filter(
    (alert) => alertFilter === "all" || alert.category.toLowerCase() === alertFilter
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold dark:text-white">Recent Alerts</h2>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500 dark:text-gray-300">
            {filteredAlerts.length} Alerts
          </span>
          <select
            onChange={(e) => setAlertFilter(e.target.value)}
            className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-3 pr-8 text-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Alerts</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="entertainment">Entertainment</option>
            <option value="utilities">Utilities</option>
          </select>
        </div>
      </div>

      {loading && <p className="text-center text-gray-500">Loading alerts...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      <div className="space-y-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow dark:border-gray-700 ${
                readStatus[index] ? "opacity-70" : ""
              }`}
            >
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
                    {getAlertIcon(alert.category)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold dark:text-white">
                      {alert.category}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-300">
                      {alert.message}
                    </p>
                  </div>
                  {!readStatus[index] ? (
                    <button
                      onClick={() => handleMarkAsRead(index)}
                      className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                    >
                      Mark as Read
                    </button>
                  ) : (
                    <CheckCircle className="text-green-500 w-5 h-5" />
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
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
