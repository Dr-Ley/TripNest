const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Product = require('../models/Product');

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  req.userId = req.session.userId;
  next();
};

// Hotel Booking
router.post('/hotel', requireAuth, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      checkIn,
      checkOut,
      guests,
      roomType,
      specialRequests,
      hotelName,
      hotelLocation,
      bookingType,
      bookingDate,
      status,
      productId,
      totalPrice
    } = req.body;

    // Create the booking
    const bookingData = {
      userId: req.userId, // Always include user ID for authenticated users
      firstName,
      lastName,
      email,
      phone,
      checkIn,
      checkOut,
      guests,
      roomType,
      specialRequests,
      hotelName,
      hotelLocation,
      bookingType,
      bookingDate,
      status,
      totalPrice,
      userEmail: email
    };

    // Add product ID if provided
    if (productId) {
      bookingData.productId = productId;
      
      // Reduce product quantity
      try {
        const product = await Product.findById(productId);
        if (product) {
          if (product.quantity > 0) {
            await product.reduceQuantity(1); // Reduce by 1 for each booking
            console.log(`✅ Reduced quantity for ${product.name} from ${product.quantity + 1} to ${product.quantity}`);
          } else {
            return res.status(400).json({ 
              message: 'Sorry, this hotel is currently fully booked' 
            });
          }
        }
      } catch (quantityError) {
        console.error('Error reducing product quantity:', quantityError);
        // Continue with booking even if quantity reduction fails
      }
    }

    const booking = new Booking(bookingData);
    await booking.save();

    console.log(`✅ Hotel booking created successfully for ${firstName} ${lastName} (User: ${req.userId})`);
    
    res.status(201).json({ 
      message: 'Hotel booking created successfully', 
      booking,
      quantityReduced: productId ? true : false
    });
  } catch (error) {
    console.error('Hotel booking error:', error);
    res.status(500).json({ message: 'Error creating hotel booking', error: error.message });
  }
});

// Restaurant Booking
router.post('/restaurant', requireAuth, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      guests,
      reservationDate,
      reservationTime,
      reservationType,
      specialRequests,
      restaurantName,
      restaurantLocation,
      bookingType,
      bookingDate,
      status,
      productId,
      totalPrice
    } = req.body;

    // Create the booking
    const bookingData = {
      userId: req.userId, // Always include user ID for authenticated users
      firstName,
      lastName,
      email,
      phone,
      guests,
      reservationDate,
      reservationTime,
      reservationType,
      specialRequests,
      restaurantName,
      restaurantLocation,
      bookingType,
      bookingDate,
      status,
      totalPrice,
      userEmail: email
    };

    // Add product ID if provided
    if (productId) {
      bookingData.productId = productId;
      
      // Reduce product quantity
      try {
        const product = await Product.findById(productId);
        if (product) {
          if (product.quantity > 0) {
            await product.reduceQuantity(1);
            console.log(`✅ Reduced quantity for ${product.name} from ${product.quantity + 1} to ${product.quantity}`);
          } else {
            return res.status(400).json({ 
              message: 'Sorry, this restaurant is currently fully booked' 
            });
          }
        }
      } catch (quantityError) {
        console.error('Error reducing product quantity:', quantityError);
      }
    }

    const booking = new Booking(bookingData);
    await booking.save();

    console.log(`✅ Restaurant booking created successfully for ${firstName} ${lastName} (User: ${req.userId})`);
    
    res.status(201).json({ 
      message: 'Restaurant booking created successfully', 
      booking,
      quantityReduced: productId ? true : false
    });
  } catch (error) {
    console.error('Restaurant booking error:', error);
    res.status(500).json({ message: 'Error creating restaurant booking', error: error.message });
  }
});

// Attraction Booking
router.post('/attraction', requireAuth, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      attraction,
      date,
      time,
      guests,
      specialRequests,
      attractionName,
      attractionLocation,
      bookingType,
      bookingDate,
      status,
      productId,
      totalPrice
    } = req.body;

    // Create the booking
    const bookingData = {
      userId: req.userId, // Always include user ID for authenticated users
      firstName,
      lastName,
      email,
      phone,
      attraction: attraction || attractionName,
      date,
      time,
      guests,
      specialRequests,
      attractionName: attractionName || attraction,
      attractionLocation,
      bookingType,
      bookingDate,
      status,
      totalPrice,
      userEmail: email
    };

    // Add product ID if provided
    if (productId) {
      bookingData.productId = productId;
      
      // Reduce product quantity
      try {
        const product = await Product.findById(productId);
        if (product) {
          if (product.quantity > 0) {
            await product.reduceQuantity(1);
            console.log(`✅ Reduced quantity for ${product.name} from ${product.quantity + 1} to ${product.quantity}`);
          } else {
            return res.status(400).json({ 
              message: 'Sorry, this attraction is currently fully booked' 
            });
          }
        }
      } catch (quantityError) {
        console.error('Error reducing product quantity:', quantityError);
      }
    }

    const booking = new Booking(bookingData);
    await booking.save();

    console.log(`✅ Attraction booking created successfully for ${firstName} ${lastName} (User: ${req.userId})`);
    
    res.status(201).json({ 
      message: 'Attraction booking created successfully', 
      booking,
      quantityReduced: productId ? true : false
    });
  } catch (error) {
    console.error('Attraction booking error:', error);
    res.status(500).json({ message: 'Error creating attraction booking', error: error.message });
  }
});

// Get user's bookings (authenticated users only)
router.get('/my-bookings', requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId })
      .sort({ bookingDate: -1 })
      .populate('productId', 'name category image');

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Get specific booking (user can only access their own bookings)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    }).populate('productId', 'name category image');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Error fetching booking' });
  }
});

// Update booking status (user can only update their own bookings)
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Error updating booking status' });
  }
});

// Cancel booking (user can only cancel their own bookings)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only allow cancellation of pending bookings
    if (booking.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Only pending bookings can be cancelled' 
      });
    }

    // Update status to cancelled instead of deleting
    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Error cancelling booking' });
  }
});

// Get all bookings (admin only - for future use)
router.get('/admin/all', requireAuth, async (req, res) => {
  try {
    // In a real app, you'd check if user is admin
    const bookings = await Booking.find()
      .sort({ bookingDate: -1 })
      .populate('userId', 'name email')
      .populate('productId', 'name category');

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

module.exports = router; 