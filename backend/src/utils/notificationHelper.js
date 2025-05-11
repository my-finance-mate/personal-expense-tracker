const formatNotification = (notification) => {
  const { title, subtitle } = getNotificationTitles(notification);
  const icon = getNotificationIcon(notification.type, notification.category);
  
  const options = {
    body: notification.message,
    icon,
    badge: '/notification-badge.png',
    tag: notification._id.toString(),
    timestamp: notification.createdAt.getTime(),
    renotify: notification.priority === 'high',
    requireInteraction: notification.priority === 'high',
    silent: notification.priority === 'low',
    data: {
      notificationId: notification._id.toString(),
      type: notification.type,
      category: notification.category,
      priority: notification.priority,
      url: `/alerts/${notification._id}`,
      createdAt: notification.createdAt
    },
    actions: getNotificationActions(notification)
  };

  // Add vibration pattern for high priority notifications
  if (notification.priority === 'high') {
    options.vibrate = [200, 100, 200];
  }

  return { title, subtitle, options };
};

const getNotificationTitles = (notification) => {
  let title, subtitle;

  switch (notification.type) {
    case 'budget':
      title = `Budget Alert: ${notification.category}`;
      subtitle = notification.metadata?.amount ? 
        `${((notification.metadata.amount / notification.metadata.threshold) * 100).toFixed(0)}% of budget used` :
        'Budget update';
      break;
    
    case 'transaction':
      title = `New ${notification.category} Transaction`;
      subtitle = notification.metadata?.amount ?
        `Amount: Rs${notification.metadata.amount}` :
        'Transaction recorded';
      break;
      
    case 'system':
      title = 'System Notification';
      subtitle = 'Important update';
      break;
      
    default:
      title = 'Alert';
      subtitle = notification.category;
  }

  return { title, subtitle };
};

const getNotificationIcon = (type, category) => {
  const iconPath = '/icons/';
  
  // First check category
  const categoryIcons = {
    food: 'food.png',
    transport: 'transport.png',
    entertainment: 'entertainment.png',
    utilities: 'utilities.png',
    shopping: 'shopping.png',
    health: 'health.png',
    education: 'education.png'
  };

  if (category && categoryIcons[category.toLowerCase()]) {
    return iconPath + categoryIcons[category.toLowerCase()];
  }

  // Fallback to type-based icons
  const typeIcons = {
    budget: 'budget.png',
    transaction: 'transaction.png',
    system: 'system.png'
  };

  return iconPath + (typeIcons[type] || 'default.png');
};

const getNotificationActions = (notification) => {
  const actions = [
    {
      action: 'mark-as-read',
      title: 'Mark as read'
    }
  ];

  // Add view details action for transactions and high priority notifications
  if (notification.type === 'transaction' || notification.priority === 'high') {
    actions.push({
      action: 'view',
      title: 'View details'
    });
  }

  return actions;
};

module.exports = {
  formatNotification
};
