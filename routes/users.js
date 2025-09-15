const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/users');
const UserProfile = require('../models/UserProfile');
const BookingHistory = require('../models/BookingHistory');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.user.id })
      .populate('userId', 'name email');

    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.json({
      success: true,
      data: userProfile
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/profile
// @desc    Create or update user profile
// @access  Private
router.post('/profile', [
  auth,
  body('personalInfo.firstName').notEmpty().withMessage('First name is required'),
  body('personalInfo.lastName').notEmpty().withMessage('Last name is required'),
  body('personalInfo.email').isEmail().withMessage('Valid email is required'),
  body('personalInfo.phone').optional().isString(),
  body('personalInfo.dateOfBirth').optional().isISO8601().toDate(),
  body('personalInfo.nationality').optional().isString(),
  body('personalInfo.passportNumber').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      personalInfo,
      preferences,
      addresses,
      emergencyContact,
      communication
    } = req.body;

    let userProfile = await UserProfile.findOne({ userId: req.user.id });

    if (userProfile) {
      // Update existing profile
      if (personalInfo) userProfile.personalInfo = { ...userProfile.personalInfo, ...personalInfo };
      if (preferences) userProfile.preferences = { ...userProfile.preferences, ...preferences };
      if (addresses) userProfile.addresses = addresses;
      if (emergencyContact) userProfile.emergencyContact = emergencyContact;
      if (communication) userProfile.communication = communication;
    } else {
      // Create new profile
      userProfile = new UserProfile({
        userId: req.user.id,
        personalInfo,
        preferences: preferences || {},
        addresses: addresses || [],
        emergencyContact,
        communication: communication || {}
      });
    }

    await userProfile.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: userProfile
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile/preferences
// @desc    Update user preferences
// @access  Private
router.put('/profile/preferences', [
  auth,
  body('roomType').optional().isArray(),
  body('bedType').optional().isArray(),
  body('floor').optional().isArray(),
  body('smoking').optional().isBoolean(),
  body('accessibility').optional().isArray(),
  body('dietaryRestrictions').optional().isArray(),
  body('specialRequests').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userProfile = await UserProfile.findOne({ userId: req.user.id });
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // Update preferences
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        userProfile.preferences[key] = req.body[key];
      }
    });

    await userProfile.save();

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: userProfile.preferences
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/profile/addresses
// @desc    Add new address to user profile
// @access  Private
router.post('/profile/addresses', [
  auth,
  body('type').isIn(['Home', 'Work', 'Billing', 'Other']).withMessage('Valid address type is required'),
  body('address.line1').notEmpty().withMessage('Address line 1 is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.state').notEmpty().withMessage('State is required'),
  body('address.postalCode').notEmpty().withMessage('Postal code is required'),
  body('address.country').notEmpty().withMessage('Country is required'),
  body('isDefault').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, address, isDefault = false } = req.body;

    const userProfile = await UserProfile.findOne({ userId: req.user.id });
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    // If this is the first address, make it default
    if (userProfile.addresses.length === 0) {
      isDefault = true;
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      userProfile.addresses.forEach(addr => addr.isDefault = false);
    }

    userProfile.addresses.push({
      type,
      address,
      isDefault
    });

    await userProfile.save();

    res.json({
      success: true,
      message: 'Address added successfully',
      data: userProfile.addresses[userProfile.addresses.length - 1]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile/addresses/:addressId
// @desc    Update user address
// @access  Private
router.put('/profile/addresses/:addressId', [
  auth,
  body('type').optional().isIn(['Home', 'Work', 'Billing', 'Other']),
  body('address.line1').optional().notEmpty(),
  body('address.city').optional().notEmpty(),
  body('address.state').optional().notEmpty(),
  body('address.postalCode').optional().notEmpty(),
  body('address.country').optional().notEmpty(),
  body('isDefault').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { addressId } = req.params;
    const updates = req.body;

    const userProfile = await UserProfile.findOne({ userId: req.user.id });
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const addressIndex = userProfile.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If setting as default, unset other defaults
    if (updates.isDefault) {
      userProfile.addresses.forEach(addr => addr.isDefault = false);
    }

    // Update address
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        userProfile.addresses[addressIndex][key] = updates[key];
      }
    });

    await userProfile.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: userProfile.addresses[addressIndex]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/profile/addresses/:addressId
// @desc    Delete user address
// @access  Private
router.delete('/profile/addresses/:addressId', auth, async (req, res) => {
  try {
    const { addressId } = req.params;

    const userProfile = await UserProfile.findOne({ userId: req.user.id });
    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const addressIndex = userProfile.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    const deletedAddress = userProfile.addresses[addressIndex];
    userProfile.addresses.splice(addressIndex, 1);

    // If deleted address was default and there are other addresses, set first as default
    if (deletedAddress.isDefault && userProfile.addresses.length > 0) {
      userProfile.addresses[0].isDefault = true;
    }

    await userProfile.save();

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/bookings
// @desc    Get user booking history
// @access  Private
router.get('/bookings', auth, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;
    
    let filter = { userId: req.user.id };
    
    if (status) filter.status = status;
    if (type) filter.bookingType = type;

    const skip = (page - 1) * limit;
    
    const bookings = await BookingHistory.find(filter)
      .populate('reservationId', 'hotelId roomTypeName checkIn checkOut')
      .populate('reservationId.hotelId', 'name location images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await BookingHistory.countDocuments(filter);

    res.json({
      success: true,
      count: bookings.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: bookings
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/bookings/upcoming
// @desc    Get user upcoming bookings
// @access  Private
router.get('/bookings/upcoming', auth, async (req, res) => {
  try {
    const upcomingBookings = await BookingHistory.find({
      userId: req.user.id,
      status: 'Confirmed'
    })
    .populate('reservationId', 'hotelId roomTypeName checkIn checkOut')
    .populate('reservationId.hotelId', 'name location images')
    .sort({ 'hotelDetails.checkIn': 1 });

    // Filter for truly upcoming bookings
    const now = new Date();
    const upcoming = upcomingBookings.filter(booking => {
      if (booking.bookingType === 'hotel') {
        return new Date(booking.hotelDetails.checkIn) > now;
      }
      return false;
    });

    res.json({
      success: true,
      count: upcoming.length,
      data: upcoming
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/bookings/past
// @desc    Get user past bookings
// @access  Private
router.get('/bookings/past', auth, async (req, res) => {
  try {
    const pastBookings = await BookingHistory.find({
      userId: req.user.id,
      status: { $in: ['Completed', 'Checked Out', 'Cancelled'] }
    })
    .populate('reservationId', 'hotelId roomTypeName checkIn checkOut')
    .populate('reservationId.hotelId', 'name location images')
    .sort({ 'hotelDetails.checkOut': -1 });

    res.json({
      success: true,
      count: pastBookings.length,
      data: pastBookings
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/bookings/:id
// @desc    Get specific booking details
// @access  Private
router.get('/bookings/:id', auth, async (req, res) => {
  try {
    const booking = await BookingHistory.findById(req.params.id)
      .populate('reservationId', 'hotelId roomTypeName checkIn checkOut numberOfGuests specialRequests')
      .populate('reservationId.hotelId', 'name location contact policies')
      .populate('transactionId', 'amount currency status receiptUrl');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/bookings/:id/review
// @desc    Add review to a completed booking
// @access  Private
router.post('/bookings/:id/review', [
  auth,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isString().isLength({ max: 500 }).withMessage('Comment must be less than 500 characters'),
  body('isPublic').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment, isPublic = true } = req.body;
    const { id } = req.params;

    const booking = await BookingHistory.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if booking is completed
    if (booking.status !== 'Completed' && booking.status !== 'Checked Out') {
      return res.status(400).json({ message: 'Can only review completed bookings' });
    }

    // Update or add review
    booking.reviews = {
      rating,
      comment,
      reviewDate: new Date(),
      isPublic
    };

    await booking.save();

    res.json({
      success: true,
      message: 'Review added successfully',
      data: booking.reviews
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/dashboard
// @desc    Get user dashboard summary
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({ userId: req.user.id });
    
    // Get booking statistics
    const totalBookings = await BookingHistory.countDocuments({ userId: req.user.id });
    const upcomingBookings = await BookingHistory.countDocuments({ 
      userId: req.user.id, 
      status: 'Confirmed' 
    });
    const completedBookings = await BookingHistory.countDocuments({ 
      userId: req.user.id, 
      status: { $in: ['Completed', 'Checked Out'] } 
    });

    // Get recent bookings
    const recentBookings = await BookingHistory.find({ userId: req.user.id })
      .populate('reservationId', 'hotelId roomTypeName checkIn checkOut')
      .populate('reservationId.hotelId', 'name location images')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get favorite destinations
    const favoriteDestinations = userProfile?.travelHistory?.favoriteDestinations || [];

    const dashboard = {
      userProfile: userProfile ? {
        loyalty: userProfile.loyalty,
        preferences: userProfile.preferences
      } : null,
      statistics: {
        totalBookings,
        upcomingBookings,
        completedBookings
      },
      recentBookings,
      favoriteDestinations
    };

    res.json({
      success: true,
      data: dashboard
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 