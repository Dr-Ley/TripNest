const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: true,
    enum: ['Theme Park', 'Museum', 'Historical Site', 'Natural Wonder', 'Adventure', 'Cultural', 'Entertainment']
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  priceRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    currency: { type: String, default: 'USD' }
  },
  openingHours: {
    monday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    tuesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    wednesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    thursday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    friday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    saturday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    sunday: { open: String, close: String, isOpen: { type: Boolean, default: true } }
  },
  activities: [{
    name: { type: String, required: true },
    description: { type: String },
    duration: { type: String },
    difficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard'] },
    ageRestriction: { type: String }
  }],
  amenities: [{
    name: { type: String, required: true },
    icon: { type: String },
    isAvailable: { type: Boolean, default: true }
  }],
  visitorInfo: {
    maxCapacity: { type: Number },
    recommendedDuration: { type: String },
    bestTimeToVisit: [String],
    accessibility: [String],
    parking: { type: Boolean, default: false },
    foodAvailable: { type: Boolean, default: false }
  },
  contact: {
    phone: { type: String },
    email: { type: String },
    website: { type: String }
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

module.exports = mongoose.model('Attraction', attractionSchema); 