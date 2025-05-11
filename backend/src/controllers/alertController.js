const mongoose = require("mongoose");
const connectSecondaryDB = require("../config/secondaryDB");
const Notification = require("../models/Notification");
const { createTransactionNotifications } = require("./notificationController");
const { sendPushNotification } = require("../services/pushNotificationService");

// Connect to secondary DB (for expenses)
const secondaryDB = connectSecondaryDB();
const Expense = require("../models/expense.model")(secondaryDB);

// Budget is in the primary DB
const Budget = require("../models/Budget");

exports.generateAlerts = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Create notifications for new transactions first
    await createTransactionNotifications(userId);

    const expenses = await Expense.find({ userId });
    const budgets = await Budget.find({ userId });
    const notifications = [];
    const categoryTotals = {};

    // Calculate category totals
    expenses.forEach((e) => {
      if (!categoryTotals[e.category]) categoryTotals[e.category] = 0;
      categoryTotals[e.category] += e.amount;
    });

    // Check budgets and create notifications
    for (const budget of budgets) {
      const spent = categoryTotals[budget.category] || 0;
      
      if (spent > budget.amount) {
        const notification = new Notification({
          userId,
          type: 'budget',
          category: budget.category,
          message: `You have exceeded your budget limit of Rs${budget.amount} in ${budget.category}. Spent: Rs${spent}`,
          priority: 'high',
          status: 'unread',
          metadata: {
            budgetId: budget._id,
            amount: spent,
            threshold: budget.amount
          }
        });
        notifications.push(notification);
        await sendPushNotification(userId, notification); // Send push for high priority
      } else if (spent > budget.amount * 0.8) {
        notifications.push(new Notification({
          userId,
          type: 'budget',
          category: budget.category,
          message: `You are nearing your budget limit in ${budget.category}. Spent: Rs${spent} of Rs${budget.amount}.`,
          priority: 'medium',
          status: 'unread',
          metadata: {
            budgetId: budget._id,
            amount: spent,
            threshold: budget.amount * 0.8
          }
        }));
      }
    }

    // Check for unusual spending patterns
    const totalCategories = Object.keys(categoryTotals).length;
    const totalSpent = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
    const avgSpending = totalCategories ? totalSpent / totalCategories : 0;

    Object.entries(categoryTotals).forEach(([category, total]) => {
      if (total > avgSpending * 2 && avgSpending > 0) {
        const notification = new Notification({
          userId,
          type: 'transaction',
          category,
          message: `Unusually high spending in ${category}. Total spent: Rs${total}, which is well above your average of Rs${avgSpending.toFixed(2)}.`,
          priority: 'high',
          status: 'unread',
          metadata: {
            amount: total,
            threshold: avgSpending * 2
          }
        });
        notifications.push(notification);
        sendPushNotification(userId, notification); // Send push for high priority
      }
    });

    // Save new notifications and group related ones
    if (notifications.length > 0) {
      const savedNotifications = await Notification.insertMany(notifications);
      
      // Group related notifications
      const relatedByCategory = {};
      savedNotifications.forEach(notif => {
        if (!relatedByCategory[notif.category]) {
          relatedByCategory[notif.category] = [];
        }
        relatedByCategory[notif.category].push(notif._id);
      });

      // Update notifications with related ones
      for (const category in relatedByCategory) {
        if (relatedByCategory[category].length > 1) {
          await Notification.updateMany(
            { _id: { $in: relatedByCategory[category] } },
            { $set: { relatedNotifications: relatedByCategory[category] } }
          );
        }
      }
    }

    // Fetch all active notifications (not archived)
    const existingNotifications = await Notification.find({
      userId,
      status: { $in: ['unread', 'read'] }
    })
    .sort({ priority: 1, createdAt: -1 }) // Sort by priority first, then newest
    .lean(); // Convert to plain JavaScript objects

    // Format the notifications for response
    const formattedNotifications = existingNotifications.map(notification => ({
      id: notification._id.toString(),
      category: notification.category,
      type: notification.type,
      message: notification.message,
      priority: notification.priority,
      status: notification.status,
      readAt: notification.readAt,
      createdAt: new Date(notification.createdAt).toISOString(),
      metadata: notification.metadata,
      relatedNotifications: notification.relatedNotifications
    }));

    // Clean up old notifications
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    await Notification.updateMany(
      {
        userId,
        status: 'read',
        readAt: { $lt: thirtyDaysAgo }
      },
      {
        $set: { status: 'archived' }
      }
    );

    res.status(200).json({ alerts: formattedNotifications });
  } catch (error) {
    console.error("Alert Generation Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
