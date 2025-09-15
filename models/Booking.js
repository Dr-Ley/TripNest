const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // User Information (if authenticated)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for guest bookings
  },
  userEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },

  // Personal Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },

  // Product Reference (for quantity management)
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false // Optional for external bookings
  },

  // Hotel-specific fields
  checkIn: {
    type: String,
    required: function() { return this.bookingType === 'hotel'; }
  },
  checkOut: {
    type: String,
    required: function() { return this.bookingType === 'hotel'; }
  },
  roomType: {
    type: String,
    required: function() { return this.bookingType === 'hotel'; },
    enum: ['Standard', 'Deluxe', 'Suite', 'Executive', 'Presidential']
  },
  hotelName: {
    type: String,
    required: function() { return this.bookingType === 'hotel'; }
  },
  hotelLocation: {
    type: String,
    required: function() { return this.bookingType === 'hotel'; }
  },

  // Restaurant-specific fields
  reservationDate: {
    type: String,
    required: function() { return this.bookingType === 'restaurant'; }
  },
  reservationTime: {
    type: String,
    required: function() { return this.bookingType === 'restaurant'; }
  },
  reservationType: {
    type: String,
    required: function() { return this.bookingType === 'restaurant'; },
    enum: ['Dinner', 'VIP/Mezzanine', 'Birthday/Anniversary', 'Nightlife']
  },
  restaurantName: {
    type: String,
    required: function() { return this.bookingType === 'restaurant'; }
  },
  restaurantLocation: {
    type: String,
    required: function() { return this.bookingType === 'restaurant'; }
  },

  // Attraction-specific fields
  attraction: {
    type: String,
    required: function() { return this.bookingType === 'attraction'; }
  },
  date: {
    type: String,
    required: function() { return this.bookingType === 'attraction'; }
  },
  time: {
    type: String,
    required: function() { return this.bookingType === 'attraction'; }
  },
  attractionName: {
    type: String,
    required: function() { return this.bookingType === 'attraction'; }
  },
  attractionLocation: {
    type: String,
    required: function() { return this.bookingType === 'attraction'; }
  },

  // Common fields
  guests: {
    type: String,
    required: true
  },
  specialRequests: {
    type: String,
    trim: true
  },
  bookingType: {
    type: String,
    required: true,
    enum: ['hotel', 'restaurant', 'attraction']
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  
  // Pricing and payment
  totalPrice: {
    type: Number,
    required: false
  },
  currency: {
    type: String,
    default: 'USD'
  }
}, {
  timestamps: true
});

// Index for better query performance
bookingSchema.index({ bookingType: 1, bookingDate: -1 });
bookingSchema.index({ email: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ userId: 1 });
bookingSchema.index({ productId: 1 });

module.exports = mongoose.model('Booking', bookingSchema); 