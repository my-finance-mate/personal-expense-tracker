// src/components/NotificationBell.jsx
import React, { useState } from "react";
import { Bell } from "lucide-react";

const NotificationBell = ({ initialUnread = 3, onClick }) => {
  const [unread, setUnread] = useState(initialUnread);

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-300"
      aria-label={`You have ${unread} unread notifications`}
    >
      <Bell className="text-gray-600 dark:text-gray-300" size={24} />
      {unread > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium shadow-md">
          {unread}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
