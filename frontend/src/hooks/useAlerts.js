import { useEffect, useState } from "react";

const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [readStatus, setReadStatus] = useState({});
  const [alertFilter, setAlertFilter] = useState("all");

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("http://localhost:4000/alerts/654f8c2b3d9c8a1c4e8b4567");
        if (!response.ok) throw new Error("Failed to fetch alerts");

        const data = await response.json();
        setAlerts(data.alerts);

        const savedReadStatus = JSON.parse(localStorage.getItem("readStatus")) || {};
        const initialReadStatus = { ...savedReadStatus };

        data.alerts.forEach((alert, index) => {
          if (!(index in savedReadStatus)) {
            initialReadStatus[index] = false;
          }
        });

        setReadStatus(initialReadStatus);
        localStorage.setItem("readStatus", JSON.stringify(initialReadStatus));
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    fetchAlerts();
  }, []);

  const markAsRead = (index) => {
    const updatedReadStatus = { ...readStatus, [index]: true };
    setReadStatus(updatedReadStatus);
    localStorage.setItem("readStatus", JSON.stringify(updatedReadStatus));
  };

  const unreadCount = alerts.filter((_, index) => !readStatus[index]).length;

  const filteredAlerts = alerts.filter(
    (alert) => alertFilter === "all" || alert.category.toLowerCase() === alertFilter
  );

  return { alerts, unreadCount, markAsRead, filteredAlerts, setAlertFilter };
};

export default useAlerts;
