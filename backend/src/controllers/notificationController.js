const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const connectSecondaryDB = require("../config/secondaryDB");
const { sendPushNotification } = require('../services/pushNotificationService');

// Connect to secondary DB (for expenses)
const secondaryDB = connectSecondaryDB();
const Expense = require("../models/expense.model")(secondaryDB);

exports.initializeTransactionNotifications = async () => {
  try {
    console.log('Checking for transactions without notifications...');
    
    // Get all transactions
    const transactions = await Expense.find({});
    if (!transactions.length) {
      console.log('No transactions found');
      return;
    }

    // Get existing transaction notifications
    const existingNotifications = await Notification.find({
      type: 'transaction',
      'metadata.transactionId': { $exists: true }
    });

    // Create a Set of transaction IDs that already have notifications
    const existingTransactionIds = new Set(
      existingNotifications.map(n => n.metadata.transactionId.toString())
    );

    // Find transactions without notifications
    const newTransactions = transactions.filter(
      transaction => !existingTransactionIds.has(transaction._id.toString())
    );

    if (!newTransactions.length) {
      console.log('All transactions have notifications');
      return;
    }

    // Create notifications for transactions that don't have them
    const notifications = newTransactions.map(transaction => ({
      userId: transaction.userId,
      type: 'transaction',
      category: transaction.category,
      message: `Transaction recorded in ${transaction.category}: Rs${transaction.amount}`,
      priority: transaction.amount > 1000 ? 'high' : 'medium',
      status: 'unread',
      metadata: {
        transactionId: transaction._id,
        amount: transaction.amount
      }
    }));

    await Notification.insertMany(notifications);
    console.log(`Created ${notifications.length} new transaction notifications`);
  } catch (error) {
    console.error('Error initializing transaction notifications:', error);
  }
};

exports.createTransactionNotifications = async (userId) => {
  try {
    const transactions = await Expense.find({ userId });
    const existingNotifications = await Notification.find({
      userId,
      type: 'transaction',
      'metadata.transactionId': { $exists: true }
    });

    const existingTransactionIds = existingNotifications.map(
      notif => notif.metadata.transactionId.toString()
    );

    // Create notifications for new transactions
    const newTransactionNotifications = [];
    for (const transaction of transactions) {
      if (!existingTransactionIds.includes(transaction._id.toString())) {
        const notification = {
          userId,
          type: 'transaction',
          category: transaction.category,
          message: `New transaction recorded: Rs${transaction.amount} in ${transaction.category}`,
          priority: transaction.amount > 1000 ? 'high' : 'medium',
          status: 'unread',
          metadata: {
            transactionId: transaction._id,
            amount: transaction.amount,
            createdAt: transaction.createdAt
          }
        };
        
        newTransactionNotifications.push(notification);
        
        // Send push notification for high priority transactions
        if (notification.priority === 'high') {
          await sendPushNotification(userId, notification);
        }
      }
    }

    if (newTransactionNotifications.length > 0) {
      const savedNotifications = await Notification.insertMany(newTransactionNotifications);
      
      // Send push notifications for all new notifications
      for (const notification of savedNotifications) {
        await sendPushNotification(userId, notification);
      }
      
      return savedNotifications;
    }

    return [];
  } catch (error) {
    console.error('Error creating transaction notifications:', error);
    throw error;
  }
};
