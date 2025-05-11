self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body || data.message,
    icon: data.icon || '/icons/notification-icon.png',
    badge: data.badge || '/notification-badge.png',
    tag: data.tag || data.id,
    data: {
      ...data.data,
      notificationId: data.id || data.tag,
      createdAt: data.timestamp || new Date().getTime()
    },
    actions: [
      {
        action: 'mark-as-read',
        title: 'Mark as read'
      },
      {
        action: 'view',
        title: 'View details'
      }
    ],
    requireInteraction: data.priority === 'high'
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const action = event.action;
  const data = notification.data;
  const BASE_URL = 'http://localhost:4000';

  notification.close();

  const handleAction = async () => {
    if (action === 'mark-as-read') {
      try {
        const response = await fetch(`${BASE_URL}/alerts/${data.notificationId}/read`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          console.error('Failed to mark notification as read');
        }

        // After marking as read, open window if no clients are focused
        const windowClients = await clients.matchAll({
          type: 'window',
          includeUncontrolled: true
        });

        if (!windowClients.some(client => client.focused)) {
          await clients.openWindow(data.url || '/alerts');
        }
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    } else {
      // Either 'view' action or notification body click
      const windowClients = await clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      });

      // Focus existing window if one exists
      for (const client of windowClients) {
        if (client.url.includes('/alerts') && 'focus' in client) {
          await client.focus();
          return;
        }
      }

      // If no existing window, open new one
      await clients.openWindow(data.url || '/alerts');
    }
  };

  event.waitUntil(handleAction());
});
