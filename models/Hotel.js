const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  images: [{
    url: { type: String, required: true },
    alt: { type: String },
    isFeatured: { type: Boolean, default: false }
  }],
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  amenities: [{
    name: { type: String, required: true },
    icon: { type: String },
    isAvailable: { type: Boolean, default: true }
  }],
  roomTypes: [{
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    availableRooms: { type: Number, required: true },
    images: [String]
  }],
  priceRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    currency: { type: String, default: 'USD' }
  },
  contact: {
    phone: { type: String },
    email: { type: String },
    website: { type: String }
  },
  policies: {
    checkIn: { type: String, default: '3:00 PM' },
    checkOut: { type: String, default: '11:00 AM' },
    cancellation: { type: String },
    pets: { type: Boolean, default: false }
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hotel', hotelSchema); 