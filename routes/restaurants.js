const express = require('express');
const Restaurant = require('../models/Restaurant');
const router = express.Router();

// @route   GET /api/restaurants
// @desc    Get all restaurants with optional filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      city, 
      country, 
      cuisine,
      minPrice, 
      maxPrice, 
      rating 
    } = req.query;

    let filter = {};

    // Location filtering
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (country) filter['location.country'] = new RegExp(country, 'i');

    // Cuisine filtering
    if (cuisine) {
      const cuisineArray = cuisine.split(',').map(c => c.trim());
      filter['cuisine'] = { $in: cuisineArray };
    }

    // Price filtering
    if (minPrice || maxPrice) {
      filter['priceRange.min'] = {};
      if (minPrice) filter['priceRange.min'].$gte = parseFloat(minPrice);
      if (maxPrice) filter['priceRange.max'].$lte = parseFloat(maxPrice);
    }

    // Rating filtering
    if (rating) filter['rating.average'] = { $gte: parseFloat(rating) };

    const restaurants = await Restaurant.find(filter)
      .select('name description location images cuisine rating priceRange amenities isPopular')
      .populate('amenities', 'name icon');

    res.json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/restaurants/:id
// @desc    Get restaurant by ID with detailed information
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('amenities', 'name icon isAvailable');

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json({
      success: true,
      data: restaurant
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/restaurants/search/popular
// @desc    Get popular restaurants
// @access  Public
router.get('/search/popular', async (req, res) => {
  try {
    const popularRestaurants = await Restaurant.find({ isPopular: true })
      .select('name description location images cuisine rating priceRange')
      .limit(6);

    res.json({
      success: true,
      count: popularRestaurants.length,
      data: popularRestaurants
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 