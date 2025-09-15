const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HotelReservation',
    required: true
  },
  stripePaymentIntentId: {
    type: String,
    required: true,
    unique: true
  },
  stripeCustomerId: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Succeeded', 'Failed', 'Canceled', 'Processing'],
    default: 'Pending'
  },
  paymentMethod: {
    type: {
      type: String,
      enum: ['card', 'bank_transfer', 'cash'],
      default: 'card'
    },
    card: {
      brand: String,
      last4: String,
      expMonth: Number,
      expYear: Number,
      country: String
    },
    bankTransfer: {
      accountType: String,
      accountHolderType: String
    }
  },
  billingDetails: {
    name: String,
    email: String,
    phone: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    }
  },
  metadata: {
    hotelName: String,
    roomType: String,
    checkIn: Date,
    checkOut: Date,
    numberOfNights: Number,
    numberOfGuests: Number
  },
  refunds: [{
    amount: Number,
    reason: String,
    status: {
      type: String,
      enum: ['Pending', 'Succeeded', 'Failed'],
      default: 'Pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  fees: {
    stripeFee: Number,
    applicationFee: Number,
    taxAmount: Number
  },
  description: String,
  receiptUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
transactionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ stripePaymentIntentId: 1 });
transactionSchema.index({ status: 1 });

// Virtual for total refunded amount
transactionSchema.virtual('totalRefunded').get(function() {
  return this.refunds.reduce((total, refund) => {
    return total + (refund.status === 'Succeeded' ? refund.amount : 0);
  }, 0);
});

// Virtual for net amount after refunds
transactionSchema.virtual('netAmount').get(function() {
  return this.amount - this.totalRefunded;
});

module.exports = mongoose.model('Transaction', transactionSchema); 