const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['hotel', 'restaurant', 'attraction', 'package']
  },
  image: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    user: String,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Method to reduce quantity when purchased
productSchema.methods.reduceQuantity = function(amount) {
  if (this.quantity >= amount) {
    this.quantity -= amount;
    return this.save();
  } else {
    throw new Error('Insufficient quantity available');
  }
};

// Method to add quantity (for admin)
productSchema.methods.addQuantity = function(amount) {
  this.quantity += amount;
  return this.save();
};

module.exports = mongoose.model('Product', productSchema); 