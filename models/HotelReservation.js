const mongoose = require('mongoose');

const hotelReservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  roomTypeId: {
    type: String,
    required: true
  },
  roomTypeName: {
    type: String,
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  numberOfRooms: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  numberOfGuests: {
    adults: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    children: {
      type: Number,
      min: 0,
      default: 0
    },
    infants: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  guestDetails: {
    primaryGuest: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true }
    },
    additionalGuests: [{
      firstName: { type: String },
      lastName: { type: String },
      age: { type: Number }
    }]
  },
  pricing: {
    roomRate: { type: Number, required: true },
    taxes: { type: Number, required: true },
    fees: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'USD' }
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled', 'No Show'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Paid', 'Partially Paid', 'Refunded', 'Failed'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Credit Card', 'Debit Card', 'PayPal', 'Stripe'],
    default: 'Stripe'
  },
  stripePaymentIntentId: {
    type: String
  },
  specialRequests: {
    type: String
  },
  cancellationPolicy: {
    canCancel: { type: Boolean, default: true },
    cancellationDeadline: { type: Date },
    refundAmount: { type: Number },
    cancellationReason: { type: String }
  },
  amenities: [{
    name: { type: String },
    price: { type: Number, default: 0 },
    isIncluded: { type: Boolean, default: false }
  }],
  notes: {
    hotelNotes: { type: String },
    customerNotes: { type: String }
  },
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
hotelReservationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate total amount including taxes and fees
hotelReservationSchema.pre('save', function(next) {
  if (this.isModified('pricing.roomRate') || this.isModified('pricing.taxes') || this.isModified('pricing.fees')) {
    this.pricing.totalAmount = this.pricing.roomRate + this.pricing.taxes + this.pricing.fees;
  }
  next();
});

// Virtual for calculating number of nights
hotelReservationSchema.virtual('numberOfNights').get(function() {
  if (this.checkIn && this.checkOut) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((this.checkOut - this.checkIn) / oneDay));
  }
  return 0;
});

// Virtual for calculating total guests
hotelReservationSchema.virtual('totalGuests').get(function() {
  return this.numberOfGuests.adults + this.numberOfGuests.children + this.numberOfGuests.infants;
});

module.exports = mongoose.model('HotelReservation', hotelReservationSchema); 