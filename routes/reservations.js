const express = require('express');
const { body, validationResult } = require('express-validator');
const HotelReservation = require('../models/HotelReservation');
const Hotel = require('../models/Hotel');
const Transaction = require('../models/Transaction');
const BookingHistory = require('../models/BookingHistory');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/reservations/hotel
// @desc    Create a new hotel reservation
// @access  Private
router.post('/hotel', [
  auth,
  body('hotelId').isMongoId().withMessage('Valid hotel ID is required'),
  body('roomTypeId').notEmpty().withMessage('Room type ID is required'),
  body('roomTypeName').notEmpty().withMessage('Room type name is required'),
  body('checkIn').isISO8601().toDate().withMessage('Valid check-in date is required'),
  body('checkOut').isISO8601().toDate().withMessage('Valid check-out date is required'),
  body('numberOfRooms').isInt({ min: 1 }).withMessage('At least 1 room is required'),
  body('numberOfGuests.adults').isInt({ min: 1 }).withMessage('At least 1 adult is required'),
  body('guestDetails.primaryGuest.firstName').notEmpty().withMessage('Primary guest first name is required'),
  body('guestDetails.primaryGuest.lastName').notEmpty().withMessage('Primary guest last name is required'),
  body('guestDetails.primaryGuest.email').isEmail().withMessage('Valid email is required'),
  body('guestDetails.primaryGuest.phone').notEmpty().withMessage('Phone number is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      hotelId,
      roomTypeId,
      roomTypeName,
      checkIn,
      checkOut,
      numberOfRooms,
      numberOfGuests,
      guestDetails,
      specialRequests,
      amenities
    } = req.body;

    // Check if hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Check room availability
    const roomType = hotel.roomTypes.find(room => room.name === roomTypeName);
    if (!roomType) {
      return res.status(400).json({ message: 'Room type not found' });
    }

    if (roomType.availableRooms < numberOfRooms) {
      return res.status(400).json({ message: 'Not enough rooms available' });
    }

    // Calculate pricing
    const roomRate = roomType.price * numberOfRooms;
    const taxes = roomRate * 0.15; // 15% tax
    const fees = roomRate * 0.05;  // 5% service fee
    const totalAmount = roomRate + taxes + fees;

    // Create reservation
    const reservation = new HotelReservation({
      userId: req.user.id,
      hotelId,
      roomTypeId,
      roomTypeName,
      checkIn,
      checkOut,
      numberOfRooms,
      numberOfGuests,
      guestDetails,
      pricing: {
        roomRate,
        taxes,
        fees,
        totalAmount
      },
      specialRequests,
      amenities: amenities || []
    });

    await reservation.save();

    // Update hotel room availability
    roomType.availableRooms -= numberOfRooms;
    await hotel.save();

    // Create booking history entry
    const bookingHistory = new BookingHistory({
      userId: req.user.id,
      reservationId: reservation._id,
      bookingType: 'hotel',
      hotelDetails: {
        hotelId,
        hotelName: hotel.name,
        roomType: roomTypeName,
        checkIn,
        checkOut,
        numberOfNights: Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)),
        numberOfRooms,
        numberOfGuests
      },
      pricing: {
        basePrice: roomRate,
        taxes,
        fees,
        totalAmount,
        currency: 'USD'
      },
      status: 'Confirmed',
      paymentStatus: 'Pending'
    });

    await bookingHistory.save();

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: {
        reservationId: reservation._id,
        bookingHistoryId: bookingHistory._id,
        totalAmount,
        status: reservation.status
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reservations/user
// @desc    Get all reservations for the authenticated user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const reservations = await HotelReservation.find({ userId: req.user.id })
      .populate('hotelId', 'name location images')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reservations/:id
// @desc    Get reservation by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const reservation = await HotelReservation.findById(req.params.id)
      .populate('hotelId', 'name location images policies')
      .populate('userId', 'name email');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if user owns this reservation
    if (reservation.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      data: reservation
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/reservations/:id
// @desc    Update reservation
// @access  Private
router.put('/:id', [
  auth,
  body('checkIn').optional().isISO8601().toDate(),
  body('checkOut').optional().isISO8601().toDate(),
  body('numberOfGuests').optional().isObject(),
  body('specialRequests').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const reservation = await HotelReservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if user owns this reservation
    if (reservation.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if reservation can be modified
    if (reservation.status !== 'Confirmed' && reservation.status !== 'Pending') {
      return res.status(400).json({ message: 'Reservation cannot be modified at this stage' });
    }

    // Update fields
    const updateFields = ['checkIn', 'checkOut', 'numberOfGuests', 'specialRequests'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        reservation[field] = req.body[field];
      }
    });

    // Recalculate pricing if dates or rooms changed
    if (req.body.checkIn || req.body.checkOut || req.body.numberOfRooms) {
      const hotel = await Hotel.findById(reservation.hotelId);
      const roomType = hotel.roomTypes.find(room => room.name === reservation.roomTypeName);
      
      if (roomType) {
        const roomRate = roomType.price * reservation.numberOfRooms;
        const taxes = roomRate * 0.15;
        const fees = roomRate * 0.05;
        reservation.pricing = {
          roomRate,
          taxes,
          fees,
          totalAmount: roomRate + taxes + fees
        };
      }
    }

    await reservation.save();

    // Update booking history
    await BookingHistory.findOneAndUpdate(
      { reservationId: reservation._id },
      {
        $set: {
          'hotelDetails.checkIn': reservation.checkIn,
          'hotelDetails.checkOut': reservation.checkOut,
          'hotelDetails.numberOfGuests': reservation.numberOfGuests
        }
      }
    );

    res.json({
      success: true,
      message: 'Reservation updated successfully',
      data: reservation
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/reservations/:id
// @desc    Cancel reservation
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const reservation = await HotelReservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if user owns this reservation
    if (reservation.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if reservation can be cancelled
    if (reservation.status === 'Checked In' || reservation.status === 'Completed') {
      return res.status(400).json({ message: 'Reservation cannot be cancelled at this stage' });
    }

    // Update reservation status
    reservation.status = 'Cancelled';
    reservation.cancellationPolicy.cancellationDate = new Date();
    reservation.cancellationPolicy.cancellationReason = req.body.reason || 'Cancelled by user';

    await reservation.save();

    // Update hotel room availability
    const hotel = await Hotel.findById(reservation.hotelId);
    const roomType = hotel.roomTypes.find(room => room.name === reservation.roomTypeName);
    if (roomType) {
      roomType.availableRooms += reservation.numberOfRooms;
      await hotel.save();
    }

    // Update booking history
    await BookingHistory.findOneAndUpdate(
      { reservationId: reservation._id },
      {
        $set: {
          status: 'Cancelled',
          'cancellation.isCancelled': true,
          'cancellation.cancellationDate': new Date(),
          'cancellation.cancellationReason': req.body.reason || 'Cancelled by user'
        }
      }
    );

    res.json({
      success: true,
      message: 'Reservation cancelled successfully'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reservations/:id/confirmation
// @desc    Get reservation confirmation details
// @access  Private
router.get('/:id/confirmation', auth, async (req, res) => {
  try {
    const reservation = await HotelReservation.findById(req.params.id)
      .populate('hotelId', 'name location contact policies')
      .populate('userId', 'name email');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if user owns this reservation
    if (reservation.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const confirmation = {
      reservationId: reservation._id,
      hotelName: reservation.hotelId.name,
      hotelAddress: reservation.hotelId.location.address,
      hotelCity: reservation.hotelId.location.city,
      hotelCountry: reservation.hotelId.location.country,
      hotelPhone: reservation.hotelId.contact.phone,
      hotelEmail: reservation.hotelId.contact.email,
      roomType: reservation.roomTypeName,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      numberOfNights: Math.ceil((new Date(reservation.checkOut) - new Date(reservation.checkIn)) / (1000 * 60 * 60 * 24)),
      numberOfRooms: reservation.numberOfRooms,
      numberOfGuests: reservation.numberOfGuests,
      guestDetails: reservation.guestDetails,
      pricing: reservation.pricing,
      status: reservation.status,
      checkInTime: reservation.hotelId.policies.checkIn,
      checkOutTime: reservation.hotelId.policies.checkOut,
      cancellationPolicy: reservation.hotelId.policies.cancellation,
      specialRequests: reservation.specialRequests,
      createdAt: reservation.createdAt
    };

    res.json({
      success: true,
      data: confirmation
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 