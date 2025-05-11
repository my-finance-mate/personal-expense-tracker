const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['budget', 'transaction', 'system'], required: true },
  category: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['unread', 'read', 'archived'], default: 'unread' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  createdAt: { type: Date, default: Date.now },
  readAt: { type: Date },
  metadata: {
    budgetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget' },
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
    amount: { type: Number },
    threshold: { type: Number }
  },
  notificationsEnabled: { type: Boolean, default: true },
  pushSubscription: {
    endpoint: String,
    keys: {
      p256dh: String,
      auth: String
    }
  },
  pushNotification: {
    sent: { type: Boolean, default: false },
    sentAt: Date,
    error: String,
    retries: { type: Number, default: 0 },
    maxRetries: { type: Number, default: 3 }
  },
  relatedNotifications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification'
  }],
  expiresAt: Date // For temporary notifications
});

notificationSchema.methods.markAsRead = function() {
  this.status = 'read';
  return this.save();
};

module.exports = mongoose.model('Notification', notificationSchema);