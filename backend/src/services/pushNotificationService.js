const webpush = require('web-push');
const Notification = require('../models/Notification');
const { formatNotification } = require('../utils/notificationHelper');

// Configure web-push
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY
};

webpush.setVapidDetails(
  'mailto:contact@personal-expense-tracker.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const getSubscription = async (userId) => {
  const userNotification = await Notification.findOne({
    userId,
    notificationsEnabled: true,
    pushSubscription: { $exists: true }
  });
  return userNotification?.pushSubscription;
};

const updateNotificationStatus = async (notificationId, update) => {
  await Notification.findByIdAndUpdate(notificationId, {
    $set: {
      'pushNotification': {
        ...update,
        updatedAt: new Date()
      }
    }
  });
};

const handleInvalidSubscription = async (userId, subscriptionEndpoint) => {
  console.log('Push subscription is invalid or expired for user:', userId);
  await Notification.updateMany(
    { 
      userId,
      'pushSubscription.endpoint': subscriptionEndpoint
    },
    { 
      $unset: { pushSubscription: "" },
      $set: { notificationsEnabled: false }
    }
  );
};

const shouldRetryNotification = (notification) => {
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const notificationAge = Date.now() - notification.createdAt.getTime();
  
  return (
    notification.pushNotification.retries < notification.pushNotification.maxRetries &&
    notificationAge < maxAge &&
    notification.priority !== 'low'
  );
};

const sendPushNotification = async (userId, notification, options = {}) => {
  try {
    const subscription = await getSubscription(userId);
    if (!subscription) {
      console.log('No push subscription found for user:', userId);
      return false;
    }

    const { title, subtitle, options: notificationOptions } = formatNotification(notification);
    
    // Add optional grouping for related notifications
    if (notification.relatedNotifications?.length > 0) {
      notificationOptions.tag = `group-${notification.type}-${notification.category}`;
      notificationOptions.renotify = true;
    }

    const payload = JSON.stringify({
      title,
      ...notificationOptions,
      body: options.customMessage || subtitle || notification.message
    });

    try {
      await webpush.sendNotification(subscription, payload);
      console.log('Push notification sent successfully to user:', userId);
      
      await updateNotificationStatus(notification._id, {
        sent: true,
        sentAt: new Date(),
        error: null
      });

      return true;
    } catch (pushError) {
      if (pushError.statusCode === 410 || pushError.statusCode === 404) {
        await handleInvalidSubscription(userId, subscription.endpoint);
      } else {
        console.error('Error sending push notification:', pushError);
        
        const shouldRetry = shouldRetryNotification(notification);
        await updateNotificationStatus(notification._id, {
          sent: false,
          error: pushError.message,
          retries: (notification.pushNotification?.retries || 0) + 1,
          // Schedule retry if appropriate
          nextRetryAt: shouldRetry ? new Date(Date.now() + 5 * 60 * 1000) : null
        });

        // Throw error only if we shouldn't retry
        if (!shouldRetry) {
          throw pushError;
        }
      }
      return false;
    }
  } catch (error) {
    console.error('Error in push notification process:', error);
    if (!options.suppressErrors) {
      throw error;
    }
    return false;
  }
};

const generateVapidKeys = () => {
  return webpush.generateVAPIDKeys();
};

const retryFailedNotifications = async () => {
  try {
    const failedNotifications = await Notification.find({
      'pushNotification.sent': false,
      'pushNotification.nextRetryAt': { $lte: new Date() }
    });

    for (const notification of failedNotifications) {
      if (shouldRetryNotification(notification)) {
        await sendPushNotification(notification.userId, notification, {
          suppressErrors: true,
          customMessage: `${notification.message} (Retry ${notification.pushNotification.retries + 1})`
        });
      }
    }
  } catch (error) {
    console.error('Error retrying failed notifications:', error);
  }
};

module.exports = {
  sendPushNotification,
  generateVapidKeys,
  retryFailedNotifications
};
