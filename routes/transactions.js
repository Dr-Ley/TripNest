const express = require('express');
const { body, validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Transaction = require('../models/Transaction');
const HotelReservation = require('../models/HotelReservation');
const BookingHistory = require('../models/BookingHistory');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/transactions/create-payment-intent
// @desc    Create Stripe payment intent for hotel reservation
// @access  Private
router.post('/create-payment-intent', [
  auth,
  body('reservationId').isMongoId().withMessage('Valid reservation ID is required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Valid amount is required'),
  body('currency').optional().isIn(['USD', 'EUR', 'GBP']).withMessage('Valid currency is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reservationId, amount, currency = 'USD' } = req.body;

    // Check if reservation exists and belongs to user
    const reservation = await HotelReservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if reservation is already paid
    if (reservation.paymentStatus === 'Paid') {
      return res.status(400).json({ message: 'Reservation is already paid' });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        reservationId: reservationId,
        userId: req.user.id,
        hotelName: reservation.hotelId ? reservation.hotelId.toString() : 'Unknown',
        roomType: reservation.roomTypeName,
        checkIn: reservation.checkIn.toISOString(),
        checkOut: reservation.checkOut.toISOString()
      },
      description: `Hotel reservation payment for ${reservation.roomTypeName} room`,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update reservation with payment intent ID
    reservation.stripePaymentIntentId = paymentIntent.id;
    await reservation.save();

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (err) {
    console.error('Stripe payment intent creation error:', err);
    res.status(500).json({ message: 'Payment intent creation failed' });
  }
});

// @route   POST /api/transactions/confirm-payment
// @desc    Confirm payment and create transaction record
// @access  Private
router.post('/confirm-payment', [
  auth,
  body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required'),
  body('reservationId').isMongoId().withMessage('Valid reservation ID is required'),
  body('paymentMethod').isObject().withMessage('Payment method details are required'),
  body('billingDetails').isObject().withMessage('Billing details are required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentIntentId, reservationId, paymentMethod, billingDetails } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (!paymentIntent) {
      return res.status(404).json({ message: 'Payment intent not found' });
    }

    // Check if payment was successful
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment was not successful' });
    }

    // Get reservation details
    const reservation = await HotelReservation.findById(reservationId)
      .populate('hotelId', 'name');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create transaction record
    const transaction = new Transaction({
      userId: req.user.id,
      reservationId: reservationId,
      stripePaymentIntentId: paymentIntentId,
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency.toUpperCase(),
      status: 'Succeeded',
      paymentMethod: {
        type: paymentMethod.type || 'card',
        card: paymentMethod.card || {}
      },
      billingDetails: billingDetails,
      metadata: {
        hotelName: reservation.hotelId.name,
        roomType: reservation.roomTypeName,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        numberOfNights: Math.ceil((new Date(reservation.checkOut) - new Date(reservation.checkIn)) / (1000 * 60 * 60 * 24)),
        numberOfGuests: reservation.numberOfGuests.adults + reservation.numberOfGuests.children + reservation.numberOfGuests.infants
      },
      description: `Hotel reservation payment for ${reservation.hotelId.name}`,
      receiptUrl: paymentIntent.charges?.data[0]?.receipt_url
    });

    await transaction.save();

    // Update reservation payment status
    reservation.paymentStatus = 'Paid';
    reservation.status = 'Confirmed';
    await reservation.save();

    // Update booking history
    await BookingHistory.findOneAndUpdate(
      { reservationId: reservationId },
      {
        $set: {
          transactionId: transaction._id,
          paymentStatus: 'Paid',
          status: 'Confirmed'
        }
      }
    );

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        transactionId: transaction._id,
        amount: transaction.amount,
        status: transaction.status,
        receiptUrl: transaction.receiptUrl
      }
    });
  } catch (err) {
    console.error('Payment confirmation error:', err);
    res.status(500).json({ message: 'Payment confirmation failed' });
  }
});

// @route   GET /api/transactions/user
// @desc    Get all transactions for the authenticated user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id })
      .populate('reservationId', 'hotelId roomTypeName checkIn checkOut')
      .populate('reservationId.hotelId', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/transactions/:id
// @desc    Get transaction by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('reservationId', 'hotelId roomTypeName checkIn checkOut numberOfGuests')
      .populate('reservationId.hotelId', 'name location');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if user owns this transaction
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/transactions/:id/refund
// @desc    Request refund for a transaction
// @access  Private
router.post('/:id/refund', [
  auth,
  body('amount').optional().isFloat({ min: 0.01 }).withMessage('Valid amount is required'),
  body('reason').notEmpty().withMessage('Refund reason is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, reason } = req.body;
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if user owns this transaction
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if transaction can be refunded
    if (transaction.status !== 'Succeeded') {
      return res.status(400).json({ message: 'Transaction cannot be refunded' });
    }

    // Calculate refund amount (full amount if not specified)
    const refundAmount = amount || transaction.amount;

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: transaction.stripePaymentIntentId,
      amount: Math.round(refundAmount * 100), // Convert to cents
      reason: 'requested_by_customer',
      metadata: {
        reason: reason,
        userId: req.user.id
      }
    });

    // Update transaction with refund
    transaction.refunds.push({
      amount: refundAmount,
      reason: reason,
      status: refund.status === 'succeeded' ? 'Succeeded' : 'Pending'
    });

    if (refund.status === 'succeeded') {
      transaction.status = 'Refunded';
    }

    await transaction.save();

    // Update reservation status if full refund
    if (refundAmount >= transaction.amount) {
      await HotelReservation.findByIdAndUpdate(
        transaction.reservationId,
        { 
          paymentStatus: 'Refunded',
          status: 'Cancelled'
        }
      );

      // Update booking history
      await BookingHistory.findOneAndUpdate(
        { reservationId: transaction.reservationId },
        {
          $set: {
            paymentStatus: 'Refunded',
            status: 'Cancelled',
            'cancellation.isCancelled': true,
            'cancellation.cancellationDate': new Date(),
            'cancellation.cancellationReason': 'Refund requested',
            'cancellation.refundAmount': refundAmount
          }
        }
      );
    }

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refundId: refund.id,
        amount: refundAmount,
        status: refund.status
      }
    });
  } catch (err) {
    console.error('Refund processing error:', err);
    res.status(500).json({ message: 'Refund processing failed' });
  }
});

// @route   GET /api/transactions/:id/receipt
// @desc    Get transaction receipt
// @access  Private
router.get('/:id/receipt', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('reservationId', 'hotelId roomTypeName checkIn checkOut numberOfGuests')
      .populate('reservationId.hotelId', 'name location contact');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check if user owns this transaction
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const receipt = {
      transactionId: transaction._id,
      stripePaymentIntentId: transaction.stripePaymentIntentId,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
      paymentMethod: transaction.paymentMethod,
      billingDetails: transaction.billingDetails,
      hotelName: transaction.reservationId.hotelId.name,
      hotelAddress: transaction.reservationId.hotelId.location.address,
      hotelCity: transaction.reservationId.hotelId.hotelId.location.city,
      hotelCountry: transaction.reservationId.hotelId.hotelId.location.country,
      hotelPhone: transaction.reservationId.hotelId.hotelId.contact.phone,
      roomType: transaction.reservationId.roomTypeName,
      checkIn: transaction.reservationId.checkIn,
      checkOut: transaction.reservationId.checkOut,
      numberOfGuests: transaction.reservationId.numberOfGuests,
      metadata: transaction.metadata,
      createdAt: transaction.createdAt,
      receiptUrl: transaction.receiptUrl
    };

    res.json({
      success: true,
      data: receipt
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/transactions/webhook
// @desc    Stripe webhook for payment status updates
// @access  Public (Stripe calls this)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
      case 'charge.refunded':
        await handleRefundSuccess(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook processing error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Helper functions for webhook handling
async function handlePaymentSuccess(paymentIntent) {
  try {
    const transaction = await Transaction.findOne({ 
      stripePaymentIntentId: paymentIntent.id 
    });

    if (transaction) {
      transaction.status = 'Succeeded';
      await transaction.save();

      // Update reservation status
      await HotelReservation.findByIdAndUpdate(
        transaction.reservationId,
        { 
          paymentStatus: 'Paid',
          status: 'Confirmed'
        }
      );
    }
  } catch (err) {
    console.error('Payment success handling error:', err);
  }
}

async function handlePaymentFailure(paymentIntent) {
  try {
    const transaction = await Transaction.findOne({ 
      stripePaymentIntentId: paymentIntent.id 
    });

    if (transaction) {
      transaction.status = 'Failed';
      await transaction.save();

      // Update reservation status
      await HotelReservation.findByIdAndUpdate(
        transaction.reservationId,
        { 
          paymentStatus: 'Failed',
          status: 'Pending'
        }
      );
    }
  } catch (err) {
    console.error('Payment failure handling error:', err);
  }
}

async function handleRefundSuccess(charge) {
  try {
    const transaction = await Transaction.findOne({ 
      stripePaymentIntentId: charge.payment_intent 
    });

    if (transaction) {
      // Update refund status
      const refund = transaction.refunds.find(r => 
        r.amount === charge.amount_refunded / 100
      );
      
      if (refund) {
        refund.status = 'Succeeded';
        await transaction.save();
      }
    }
  } catch (err) {
    console.error('Refund success handling error:', err);
  }
}

module.exports = router; 