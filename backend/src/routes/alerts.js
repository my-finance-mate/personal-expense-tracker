const express = require('express');
const { generateAlerts } = require('../controllers/alertController');
const Notification = require('../models/Notification');
const { formatNotification } = require('../utils/notificationHelper');
const connectSecondaryDB = require("../config/secondaryDB");
const secondaryDB = connectSecondaryDB();
const Expense = require("../models/expense.model")(secondaryDB);

const router = express.Router();

// GET /alerts/unmarked/:userId - Get transactions without notifications
router.get('/unmarked/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get all transactions
    const transactions = await Expense.find({ userId }).sort('-date');
    
    // Get existing transaction notifications
    const notifications = await Notification.find({
      userId,
      type: 'transaction',
      'metadata.transactionId': { $exists: true }
    });

    // Create a Set of transaction IDs that already have notifications
    const notifiedTransactionIds = new Set(
      notifications.map(n => n.metadata.transactionId.toString())
    );

    // Filter out transactions that don't have notifications
    const unmarkedTransactions = transactions.filter(
      transaction => !notifiedTransactionIds.has(transaction._id.toString())
    );

    res.status(200).json({ transactions: unmarkedTransactions });
  } catch (error) {
    console.error('Error getting unmarked transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /alerts/:userId - Get all alerts for a user
router.get('/:userId', generateAlerts);

// GET /alerts/unmarked/:userId - Get transactions without notifications
router.get('/unmarked/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get all transactions
    const transactions = await Expense.find({ userId }).sort('-date');
    
    // Get existing transaction notifications
    const notifications = await Notification.find({
      userId,
      type: 'transaction',
      'metadata.transactionId': { $exists: true }
    });

    // Create a Set of transaction IDs that already have notifications
    const notifiedTransactionIds = new Set(
      notifications.map(n => n.metadata.transactionId.toString())
    );

    // Filter out transactions that don't have notifications
    const unmarkedTransactions = transactions.filter(
      transaction => !notifiedTransactionIds.has(transaction._id.toString())
    );

    res.status(200).json({ transactions: unmarkedTransactions });
  } catch (error) {
    console.error('Error getting unmarked transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /alerts/notifications/:userId - Get push notifications
router.get('/notifications/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.userId,
      status: 'unread'
    }).sort('-createdAt');

    // Format notifications for web push
    const formattedNotifications = notifications.map(notification => ({
      id: notification._id.toString(),
      ...formatNotification(notification)
    }));

    res.status(200).json({ notifications: formattedNotifications });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /alerts/:userId/subscribe - Subscribe to push notifications
router.post('/:userId/subscribe', async (req, res) => {
  try {
    const { subscription } = req.body;
    const userId = req.params.userId;

    // Store subscription in user's document or a separate collection
    await Notification.updateOne(
      { userId },
      { 
        $set: { 
          pushSubscription: subscription,
          notificationsEnabled: true 
        }
      },
      { upsert: true }
    );

    res.status(200).json({ message: 'Successfully subscribed to notifications' });
  } catch (error) {
    console.error('Error subscribing to notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /alerts/:userId/unsubscribe - Unsubscribe from push notifications
router.post('/:userId/unsubscribe', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    await Notification.updateOne(
      { userId },
      { 
        $unset: { pushSubscription: "" },
        $set: { notificationsEnabled: false }
      }
    );

    res.status(200).json({ message: 'Successfully unsubscribed from notifications' });
  } catch (error) {
    console.error('Error unsubscribing from notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /alerts/count/:userId - Get unread alert count
router.get('/count/:userId', async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.params.userId,
      status: 'unread'
    });
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error getting alert count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /alerts/unmarked/:userId - Get unmarked notifications
router.get('/unmarked/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const unmarkedNotifications = await Notification.find({
      userId,
      status: 'unread',
      $or: [
        { type: 'transaction' },
        { type: 'budget', priority: 'high' }
      ]
    }).sort('-createdAt');

    // Send push notifications for high priority items
    for (const notification of unmarkedNotifications) {
      if (notification.priority === 'high') {
        await sendPushNotification(userId, notification);
      }
    }

    res.status(200).json({ 
      notifications: unmarkedNotifications.map(notif => ({
        id: notif._id,
        type: notif.type,
        category: notif.category,
        message: notif.message,
        priority: notif.priority,
        createdAt: notif.createdAt
      }))
    });
  } catch (error) {
    console.error('Error getting unmarked notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /alerts/:alertId/read - Mark an alert as read
router.post('/:alertId/read', async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.alertId);
    
    if (!notification) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    // Update the notification status
    notification.status = 'read';
    notification.readAt = new Date();
    await notification.save();

    // Get all related notifications if this was part of a group
    const relatedNotifications = notification.relatedNotifications || [];
    const notificationsToUpdate = [notification._id, ...relatedNotifications];

    // Update all related notifications
    await Notification.updateMany(
      {
        _id: { $in: notificationsToUpdate },
        status: 'unread'
      },
      { 
        $set: { 
          status: 'read',
          readAt: new Date()
        }
      }
    );

    // If this was a transaction notification, update any other notifications with same transactionId
    if (notification.type === 'transaction' && notification.metadata?.transactionId) {
      await Notification.updateMany(
        {
          'metadata.transactionId': notification.metadata.transactionId,
          status: 'unread'
        },
        { 
          $set: { 
            status: 'read',
            readAt: new Date()
          }
        }
      );
    }

    // Archive old read notifications (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    await Notification.updateMany(
      {
        status: 'read',
        readAt: { $lt: thirtyDaysAgo }
      },
      {
        $set: { status: 'archived' }
      }
    );

    res.status(200).json({ 
      message: 'Alert marked as read',
      alert: {
        id: notification._id,
        status: notification.status
      }
    });
  } catch (error) {
    console.error('Error marking alert as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;