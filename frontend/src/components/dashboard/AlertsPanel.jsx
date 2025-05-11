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
  BellOff,
  DollarSign,
} from "lucide-react";
import { notificationService } from "../../services/notificationService";

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertFilter, setAlertFilter] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [unmarkedTransactions, setUnmarkedTransactions] = useState([]);
  const userId = "681ba16b94ab07240fd6b21b"; // TODO: Get from auth context
  useEffect(() => {
    checkNotificationStatus();
    fetchAlerts(); // This will also set the unread count
  }, []);

  const checkNotificationStatus = async () => {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    // Check if already subscribed
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setNotificationsEnabled(!!subscription);
    }
  };

  const handleNotificationToggle = async () => {
    try {
      if (!notificationsEnabled) {
        const permissionGranted = await notificationService.requestPermission();
        if (!permissionGranted) {
          throw new Error('Notification permission denied');
        }
        
        const subscribed = await notificationService.subscribeUserToPush(userId);
        if (subscribed) {
          setNotificationsEnabled(true);
        }
      } else {
        const unsubscribed = await notificationService.unsubscribeFromPush(userId);
        if (unsubscribed) {
          setNotificationsEnabled(false);
        }
      }
    } catch (err) {
      console.error('Error toggling notifications:', err);
      setError('Failed to ' + (notificationsEnabled ? 'disable' : 'enable') + ' notifications');
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/alerts/count/681ba16b94ab07240fd6b21b"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch alert count");
      }
      const data = await response.json();
      setUnreadCount(data.count);
    } catch (err) {
      console.error("Error fetching alert count:", err);
    }
  };

  const fetchUnmarkedTransactions = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/alerts/unmarked/681ba16b94ab07240fd6b21b"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch unmarked transactions");
      }
      const data = await response.json();
      setUnmarkedTransactions(data.transactions);
    } catch (err) {
      console.error("Error fetching unmarked transactions:", err);
    }
  };  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const alertsResponse = await fetch("http://localhost:4000/alerts/681ba16b94ab07240fd6b21b");
      if (!alertsResponse.ok) throw new Error("Failed to fetch alerts");
      
      const alertsData = await alertsResponse.json();
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
      // Calculate unread count from alerts data instead of making another API call
      const unreadCount = formattedAlerts.filter(alert => !alert.status || alert.status === 'unread').length;
      setUnreadCount(unreadCount);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };  const handleMarkAsRead = async (alertId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/alerts/${alertId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to mark alert as read");
      }

      const data = await response.json();

      if (data.alert.status === 'read') {
        // Update local state to mark the alert as read
        setAlerts(prevAlerts => prevAlerts.map(alert => {
          if (alert.id === alertId || (alert.relatedNotifications && alert.relatedNotifications.includes(alertId))) {
            return {
              ...alert,
              status: 'read',
              readAt: new Date().toISOString()
            };
          }
          return alert;
        }));
          // Update unread count
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
      }
    } catch (err) {
      console.error("Error marking alert as read:", err);
      setError("Failed to mark alert as read. Please try again.");
      fetchAlerts(); // Only fetch if there's an error
    } finally {
      setLoading(false);
    }
  };

  const getAlertIcon = (type, category, priority = 'medium') => {
    const iconProps = {
      className: `w-5 h-5 ${
        priority === 'high' 
          ? 'text-red-500' 
          : priority === 'medium'
          ? 'text-yellow-500'
          : 'text-blue-500'
      }`
    };

    if (type === 'budget') {
      switch (category.toLowerCase()) {
        case "food":
          return <UtensilsCrossed {...iconProps} />;
        case "transport":
          return <Bus {...iconProps} />;
        case "entertainment":
          return <Music {...iconProps} />;
        case "utilities":
          return <Lightbulb {...iconProps} />;
        default:
          return <CreditCard {...iconProps} />;
      }
    } else if (type === 'transaction') {
      return <AlertTriangle {...iconProps} />;
    }
    return <Bell {...iconProps} />;
  };

  const filteredAlerts = alerts.filter(
    (alert) => 
      alertFilter === "all" || 
      alert.category.toLowerCase() === alertFilter ||
      alert.type.toLowerCase() === alertFilter
  );

  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    // Sort by priority first
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const aPriority = a.priority || 'medium';
    const bPriority = b.priority || 'medium';
    
    if (priorityOrder[aPriority] !== priorityOrder[bPriority]) {
      return priorityOrder[aPriority] - priorityOrder[bPriority];
    }
    // Then by date
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  const totalAlerts = alerts.length;
  const readAlerts = alerts.filter(alert => alert.status === 'read').length;
  const unreadAlerts = totalAlerts - readAlerts;

  return (
    <div> {/* Root container */}
      <div className="flex justify-between items-center mb-6"> {/* Header */}
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold dark:text-white">Recent Alerts</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              ({unreadAlerts} unread / {totalAlerts} total)
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleNotificationToggle}
            className="flex items-center space-x-2 px-3 py-2 text-sm rounded-md bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
          >
            {notificationsEnabled ? (
              <>
                <BellOff className="w-4 h-4" />
                <span>Disable Notifications</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                <span>Enable Notifications</span>
              </>
            )}
          </button>
          
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
      
      {loading && <p className="text-center text-gray-500">Loading alerts...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      
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
      
      <div className="space-y-4"> {/* Alerts container */}
        {sortedAlerts.length > 0 ? (
          sortedAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow dark:border-gray-700 
                ${alert.priority === 'high' ? 'border-l-4 border-red-500' : 
                  alert.priority === 'medium' ? 'border-l-4 border-yellow-500' : 
                  'border-l-4 border-blue-500'}
                ${alert.status === 'read' ? "opacity-70" : ""}`}
            >              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                    {getAlertIcon(alert.type, alert.category, alert.priority)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold dark:text-white flex items-center space-x-2">
                          <span>{alert.category}</span>
                          {alert.status === 'read' && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                              (Read {new Date(alert.readAt).toLocaleString()})
                            </span>
                          )}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                          alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.priority ? alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1) : 'Normal'}
                        </span>
                        {alert.status === 'read' ? (
                          <CheckCircle className="text-green-500 w-5 h-5" />
                        ) : (
                          <button
                            onClick={() => handleMarkAsRead(alert.id)}
                            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                          >
                            Mark as Read
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-300 mt-1">
                      {alert.message}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-400">
                        Created: {alert.createdAt}
                      </p>
                    </div>
                  </div>
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
