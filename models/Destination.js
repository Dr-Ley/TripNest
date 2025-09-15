const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
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
    enum: ['Beach', 'Mountain', 'City', 'Cultural', 'Adventure', 'Relaxation', 'Historical']
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
  highlights: [String],
  bestTimeToVisit: [String],
  activities: [String],
  isPopular: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Destination', destinationSchema); 