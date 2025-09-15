const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  phone: { 
    type: String,
    trim: true
  },
  postCode: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  profilePicture: {
    type: String,
    default: null
  },
  preferences: {
    favoriteDestinations: [{ type: String }],
    travelStyle: { type: String, enum: ['Adventure', 'Luxury', 'Budget', 'Cultural', 'Relaxation'] },
    dietaryRestrictions: [{ type: String }]
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);