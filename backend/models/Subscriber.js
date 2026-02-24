const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, unique: true, index: true },
    status: {
      type: String,
      enum: ['subscribed', 'email_failed'],
      default: 'subscribed',
    },
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscriber', SubscriberSchema);
