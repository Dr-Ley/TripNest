const express = require('express');
const { body, validationResult } = require('express-validator');
const Hotel = require('../models/Hotel');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/hotels
// @desc    Get all hotels with optional filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      city, 
      country, 
      minPrice, 
      maxPrice, 
      rating, 
      amenities,
      checkIn,
      checkOut,
      guests,
      rooms
    } = req.query;

    let filter = {};

    // Location filtering
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (country) filter['location.country'] = new RegExp(country, 'i');

    // Price filtering
    if (minPrice || maxPrice) {
      filter['priceRange.min'] = {};
      if (minPrice) filter['priceRange.min'].$gte = parseFloat(minPrice);
      if (maxPrice) filter['priceRange.max'].$lte = parseFloat(maxPrice);
    }

    // Rating filtering
    if (rating) filter['rating.average'] = { $gte: parseFloat(rating) };

    // Amenities filtering
    if (amenities) {
      const amenityArray = amenities.split(',').map(a => a.trim());
      filter['amenities.name'] = { $in: amenityArray };
    }

    let hotels = await Hotel.find(filter)
      .select('name description location images rating priceRange amenities isPopular')
      .populate('amenities', 'name icon');

    // Filter by availability if dates are provided
    if (checkIn && checkOut && guests && rooms) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const guestCount = parseInt(guests);
      const roomCount = parseInt(rooms);

      hotels = hotels.filter(hotel => {
        return hotel.roomTypes.some(roomType => {
          return roomType.availableRooms >= roomCount && roomType.capacity >= guestCount;
        });
      });
    }

    res.json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/hotels/:id
// @desc    Get hotel by ID with detailed information
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('amenities', 'name icon isAvailable')
      .populate('roomTypes', 'name description price capacity availableRooms images');

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json({
      success: true,
      data: hotel
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/hotels/:id/availability
// @desc    Check hotel availability for specific dates
// @access  Public
router.get('/:id/availability', [
  body('checkIn').isISO8601().toDate(),
  body('checkOut').isISO8601().toDate(),
  body('guests').isInt({ min: 1 }),
  body('rooms').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { checkIn, checkOut, guests, rooms } = req.body;
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Check room availability
    const availableRooms = hotel.roomTypes.filter(roomType => {
      return roomType.availableRooms >= rooms && roomType.capacity >= guests;
    });

    // Calculate pricing
    const availability = availableRooms.map(room => ({
      roomType: room.name,
      description: room.description,
      price: room.price,
      availableRooms: room.availableRooms,
      capacity: room.capacity,
      images: room.images,
      totalPrice: room.price * rooms,
      taxes: (room.price * rooms) * 0.15, // 15% tax
      fees: (room.price * rooms) * 0.05,  // 5% service fee
      finalPrice: (room.price * rooms) * 1.20 // Total with tax and fees
    }));

    res.json({
      success: true,
      hotelName: hotel.name,
      checkIn,
      checkOut,
      guests,
      rooms,
      availability
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/hotels/:id/rooms
// @desc    Get all room types for a hotel
// @access  Public
router.get('/:id/rooms', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .select('name roomTypes');

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json({
      success: true,
      hotelName: hotel.name,
      rooms: hotel.roomTypes
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/hotels/search/popular
// @desc    Get popular hotels
// @access  Public
router.get('/search/popular', async (req, res) => {
  try {
    const popularHotels = await Hotel.find({ isPopular: true })
      .select('name description location images rating priceRange')
      .limit(6);

    res.json({
      success: true,
      count: popularHotels.length,
      data: popularHotels
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/hotels/search/by-location
// @desc    Search hotels by location
// @access  Public
router.get('/search/by-location', async (req, res) => {
  try {
    const { city, country } = req.query;

    if (!city && !country) {
      return res.status(400).json({ message: 'City or country parameter is required' });
    }

    let filter = {};
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (country) filter['location.country'] = new RegExp(country, 'i');

    const hotels = await Hotel.find(filter)
      .select('name description location images rating priceRange')
      .limit(20);

    res.json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 