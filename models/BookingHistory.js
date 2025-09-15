const mongoose = require('mongoose');

const bookingHistorySchema = new mongoose.Schema({
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
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  },
  bookingType: {
    type: String,
    enum: ['hotel', 'restaurant', 'attraction'],
    required: true
  },
  // Hotel specific details
  hotelDetails: {
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    hotelName: { type: String, required: true },
    roomType: { type: String, required: true },
    roomNumber: String,
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    numberOfNights: { type: Number, required: true },
    numberOfRooms: { type: Number, required: true },
    numberOfGuests: {
      adults: { type: Number, required: true },
      children: { type: Number, default: 0 },
      infants: { type: Number, default: 0 }
    }
  },
  // Restaurant specific details
  restaurantDetails: {
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
    restaurantName: String,
    reservationDate: Date,
    reservationTime: String,
    numberOfGuests: Number,
    tableNumber: String,
    specialOccasion: String
  },
  // Attraction specific details
  attractionDetails: {
    attractionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Attraction' },
    attractionName: String,
    visitDate: Date,
    visitTime: String,
    numberOfGuests: Number,
    activity: String,
    guideName: String
  },
  pricing: {
    basePrice: { type: Number, required: true },
    taxes: { type: Number, required: true },
    fees: { type: Number, default: 0 },
    discounts: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    pointsEarned: { type: Number, default: 0 },
    pointsRedeemed: { type: Number, default: 0 }
  },
  status: {
    type: String,
    required: true,
    enum: ['Confirmed', 'Checked In', 'Checked Out', 'Cancelled', 'No Show', 'Completed'],
    default: 'Confirmed'
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['Paid', 'Partially Paid', 'Refunded', 'Failed'],
    default: 'Paid'
  },
  specialRequests: [String],
  amenities: [{
    name: { type: String, required: true },
    price: { type: Number, default: 0 },
    isIncluded: { type: Boolean, default: false }
  }],
  reviews: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    reviewDate: Date,
    isPublic: { type: Boolean, default: true }
  },
  cancellation: {
    isCancelled: { type: Boolean, default: false },
    cancellationDate: Date,
    cancellationReason: String,
    refundAmount: Number,
    cancellationFee: Number
  },
  modifications: [{
    field: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    modifiedAt: { type: Date, default: Date.now },
    modifiedBy: String
  }],
  documents: [{
    type: { type: String, enum: ['Confirmation', 'Receipt', 'Invoice', 'Voucher'] },
    url: String,
    filename: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  notes: {
    customerNotes: String,
    hotelNotes: String,
    internalNotes: String
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
bookingHistorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
bookingHistorySchema.index({ userId: 1, createdAt: -1 });
bookingHistorySchema.index({ 'hotelDetails.checkIn': 1 });
bookingHistorySchema.index({ status: 1 });
bookingHistorySchema.index({ bookingType: 1 });

// Virtual for total guests
bookingHistorySchema.virtual('totalGuests').get(function() {
  if (this.bookingType === 'hotel') {
    return this.hotelDetails.numberOfGuests.adults + 
           this.hotelDetails.numberOfGuests.children + 
           this.hotelDetails.numberOfGuests.infants;
  }
  return this.hotelDetails?.numberOfGuests || 
         this.restaurantDetails?.numberOfGuests || 
         this.attractionDetails?.numberOfGuests || 0;
});

// Virtual for isUpcoming
bookingHistorySchema.virtual('isUpcoming').get(function() {
  if (this.bookingType === 'hotel') {
    return this.hotelDetails.checkIn > new Date() && this.status === 'Confirmed';
  }
  if (this.bookingType === 'restaurant') {
    return this.restaurantDetails.reservationDate > new Date() && this.status === 'Confirmed';
  }
  if (this.bookingType === 'attraction') {
    return this.attractionDetails.visitDate > new Date() && this.status === 'Confirmed';
  }
  return false;
});

// Virtual for isPast
bookingHistorySchema.virtual('isPast').get(function() {
  if (this.bookingType === 'hotel') {
    return this.hotelDetails.checkOut < new Date();
  }
  if (this.bookingType === 'restaurant') {
    return this.restaurantDetails.reservationDate < new Date();
  }
  if (this.attractionDetails.visitDate < new Date()) {
    return true;
  }
  return false;
});

// Method to calculate total amount
bookingHistorySchema.methods.calculateTotal = function() {
  this.pricing.totalAmount = this.pricing.basePrice + this.pricing.taxes + this.pricing.fees - this.pricing.discounts;
  return this.pricing.totalAmount;
};

// Method to add modification record
bookingHistorySchema.methods.addModification = function(field, oldValue, newValue, modifiedBy) {
  this.modifications.push({
    field,
    oldValue,
    newValue,
    modifiedBy
  });
  return this.save();
};

module.exports = mongoose.model('BookingHistory', bookingHistorySchema); 