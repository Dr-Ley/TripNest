const express = require('express');
const Attraction = require('../models/Attraction');
const router = express.Router();


// @route   GET /api/attractions
// @desc    Get all attractions with optional filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      city, 
      country, 
      category,
      minPrice, 
      maxPrice, 
      rating 
    } = req.query;

    let filter = {};

    // Location filtering
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (country) filter['location.country'] = new RegExp(country, 'i');

    // Category filtering
    if (category) {
      const categoryArray = category.split(',').map(c => c.trim());
      filter['category'] = { $in: categoryArray };
    }

    // Price filtering
    if (minPrice || maxPrice) {
      filter['priceRange.min'] = {};
      if (minPrice) filter['priceRange.min'].$gte = parseFloat(minPrice);
      if (maxPrice) filter['priceRange.max'].$lte = parseFloat(maxPrice);
    }

    // Rating filtering
    if (rating) filter['rating.average'] = { $gte: parseFloat(rating) };

    const attractions = await Attraction.find(filter)
      .select('name description location images category rating priceRange amenities activities isPopular')
      .populate('amenities', 'name icon');

    res.json({
      success: true,
      count: attractions.length,
      data: attractions
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attractions/:id
// @desc    Get attraction by ID with detailed information
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const attraction = await Attraction.findById(req.params.id)
      .populate('amenities', 'name icon isAvailable');

    if (!attraction) {
      return res.status(404).json({ message: 'Attraction not found' });
    }

    res.json({
      success: true,
      data: attraction
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Attraction not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/attractions/search/popular
// @desc    Get popular attractions
// @access  Public
router.get('/search/popular', async (req, res) => {
  try {
    const popularAttractions = await Attraction.find({ isPopular: true })
      .select('name description location images category rating priceRange')
      .limit(6);

    res.json({
      success: true,
      count: popularAttractions.length,
      data: popularAttractions
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 