const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    dateOfBirth: { type: Date },
    nationality: { type: String },
    passportNumber: { type: String }
  },
  preferences: {
    roomType: [String], // ['Standard', 'Deluxe', 'Suite']
    bedType: [String], // ['King', 'Queen', 'Twin']
    floor: [String], // ['High', 'Low', 'Any']
    smoking: { type: Boolean, default: false },
    accessibility: [String], // ['Wheelchair accessible', 'Hearing impaired', 'Visual impaired']
    dietaryRestrictions: [String], // ['Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'Kosher']
    specialRequests: [String]
  },
  loyalty: {
    membershipLevel: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
      default: 'Bronze'
    },
    points: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    memberSince: { type: Date, default: Date.now }
  },
  addresses: [{
    type: {
      type: String,
      enum: ['Home', 'Work', 'Billing', 'Other'],
      default: 'Home'
    },
    isDefault: { type: Boolean, default: false },
    address: {
      line1: { type: String, required: true },
      line2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    }
  }],
  paymentMethods: [{
    stripePaymentMethodId: { type: String },
    type: { type: String, enum: ['card', 'bank_account'] },
    card: {
      brand: String,
      last4: String,
      expMonth: Number,
      expYear: Number
    },
    isDefault: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  travelHistory: {
    totalBookings: { type: Number, default: 0 },
    totalNights: { type: Number, default: 0 },
    favoriteDestinations: [String],
    lastBookingDate: Date,
    upcomingBookings: [{
      reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'HotelReservation' },
      hotelName: String,
      checkIn: Date,
      checkOut: Date
    }]
  },
  communication: {
    emailNotifications: {
      bookingConfirmations: { type: Boolean, default: true },
      reminders: { type: Boolean, default: true },
      promotions: { type: Boolean, default: true },
      newsletters: { type: Boolean, default: true }
    },
    smsNotifications: {
      bookingConfirmations: { type: Boolean, default: false },
      reminders: { type: Boolean, default: false },
      promotions: { type: Boolean, default: false }
    },
    language: { type: String, default: 'English' },
    timezone: { type: String, default: 'UTC' }
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
userProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
userProfileSchema.index({ userId: 1 });
userProfileSchema.index({ 'personalInfo.email': 1 });

// Virtual for full name
userProfileSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Virtual for default address
userProfileSchema.virtual('defaultAddress').get(function() {
  return this.addresses.find(addr => addr.isDefault) || this.addresses[0];
});

// Virtual for default payment method
userProfileSchema.virtual('defaultPaymentMethod').get(function() {
  return this.paymentMethods.find(pm => pm.isDefault) || this.paymentMethods[0];
});

// Method to add points
userProfileSchema.methods.addPoints = function(points) {
  this.loyalty.points += points;
  return this.save();
};

// Method to update membership level based on points
userProfileSchema.methods.updateMembershipLevel = function() {
  const points = this.loyalty.points;
  if (points >= 10000) this.loyalty.membershipLevel = 'Diamond';
  else if (points >= 5000) this.loyalty.membershipLevel = 'Platinum';
  else if (points >= 2000) this.loyalty.membershipLevel = 'Gold';
  else if (points >= 500) this.loyalty.membershipLevel = 'Silver';
  else this.loyalty.membershipLevel = 'Bronze';
  return this.save();
};

module.exports = mongoose.model('UserProfile', userProfileSchema); 