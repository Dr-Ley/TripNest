# Hotel Reservation System - API Documentation

## Overview
This document outlines all the API endpoints for the hotel reservation system with Stripe payment integration.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Routes

### POST /auth/register
**Description:** Register a new user
**Access:** Public
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "postCode": "12345",
  "address": "123 Main St",
  "phone": "+1234567890"
}
```

### POST /auth/login
**Description:** Authenticate user and get token
**Access:** Public
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

## 🏨 Hotel Routes

### GET /hotels
**Description:** Get all hotels with optional filtering
**Access:** Public
**Query Parameters:**
- `city` - Filter by city
- `country` - Filter by country
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `rating` - Minimum rating filter
- `amenities` - Comma-separated amenities
- `checkIn` - Check-in date for availability
- `checkOut` - Check-out date for availability
- `guests` - Number of guests for availability
- `rooms` - Number of rooms for availability

### GET /hotels/:id
**Description:** Get hotel by ID with detailed information
**Access:** Public

### GET /hotels/:id/availability
**Description:** Check hotel availability for specific dates
**Access:** Public
**Body:**
```json
{
  "checkIn": "2025-01-15",
  "checkOut": "2025-01-18",
  "guests": 2,
  "rooms": 1
}
```

### GET /hotels/:id/rooms
**Description:** Get all room types for a hotel
**Access:** Public

### GET /hotels/search/popular
**Description:** Get popular hotels
**Access:** Public

### GET /hotels/search/by-location
**Description:** Search hotels by location
**Access:** Public
**Query Parameters:**
- `city` - City name
- `country` - Country name

---

## 📅 Reservation Routes

### POST /reservations/hotel
**Description:** Create a new hotel reservation
**Access:** Private
**Body:**
```json
{
  "hotelId": "507f1f77bcf86cd799439011",
  "roomTypeId": "room_123",
  "roomTypeName": "Deluxe Room",
  "checkIn": "2025-01-15",
  "checkOut": "2025-01-18",
  "numberOfRooms": 1,
  "numberOfGuests": {
    "adults": 2,
    "children": 1,
    "infants": 0
  },
  "guestDetails": {
    "primaryGuest": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    }
  },
  "specialRequests": "Early check-in if possible"
}
```

### GET /reservations/user
**Description:** Get all reservations for the authenticated user
**Access:** Private

### GET /reservations/:id
**Description:** Get reservation by ID
**Access:** Private

### PUT /reservations/:id
**Description:** Update reservation
**Access:** Private
**Body:**
```json
{
  "checkIn": "2025-01-16",
  "checkOut": "2025-01-19",
  "specialRequests": "Updated special requests"
}
```

### DELETE /reservations/:id
**Description:** Cancel reservation
**Access:** Private
**Body:**
```json
{
  "reason": "Change of plans"
}
```

### GET /reservations/:id/confirmation
**Description:** Get reservation confirmation details
**Access:** Private

---

## 💳 Transaction Routes

### POST /transactions/create-payment-intent
**Description:** Create Stripe payment intent for hotel reservation
**Access:** Private
**Body:**
```json
{
  "reservationId": "507f1f77bcf86cd799439011",
  "amount": 299.99,
  "currency": "USD"
}
```

### POST /transactions/confirm-payment
**Description:** Confirm payment and create transaction record
**Access:** Private
**Body:**
```json
{
  "paymentIntentId": "pi_1234567890",
  "reservationId": "507f1f77bcf86cd799439011",
  "paymentMethod": {
    "type": "card",
    "card": {
      "brand": "visa",
      "last4": "4242"
    }
  },
  "billingDetails": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": {
      "line1": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "US"
    }
  }
}
```

### GET /transactions/user
**Description:** Get all transactions for the authenticated user
**Access:** Private

### GET /transactions/:id
**Description:** Get transaction by ID
**Access:** Private

### POST /transactions/:id/refund
**Description:** Request refund for a transaction
**Access:** Private
**Body:**
```json
{
  "amount": 299.99,
  "reason": "Cancellation"
}
```

### GET /transactions/:id/receipt
**Description:** Get transaction receipt
**Access:** Private

### POST /transactions/webhook
**Description:** Stripe webhook for payment status updates
**Access:** Public (Stripe calls this)

---

## 👤 User Routes

### GET /users/profile
**Description:** Get user profile
**Access:** Private

### POST /users/profile
**Description:** Create or update user profile
**Access:** Private
**Body:**
```json
{
  "personalInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "nationality": "US",
    "passportNumber": "123456789"
  },
  "preferences": {
    "roomType": ["Standard", "Deluxe"],
    "bedType": ["King", "Queen"],
    "smoking": false
  }
}
```

### PUT /users/profile/preferences
**Description:** Update user preferences
**Access:** Private
**Body:**
```json
{
  "roomType": ["Standard", "Deluxe", "Suite"],
  "smoking": false,
  "accessibility": ["Wheelchair accessible"]
}
```

### POST /users/profile/addresses
**Description:** Add new address to user profile
**Access:** Private
**Body:**
```json
{
  "type": "Home",
  "address": {
    "line1": "123 Main St",
    "line2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "US"
  },
  "isDefault": true
}
```

### GET /users/bookings
**Description:** Get user booking history
**Access:** Private
**Query Parameters:**
- `status` - Filter by status
- `type` - Filter by booking type
- `page` - Page number for pagination
- `limit` - Items per page

### GET /users/bookings/upcoming
**Description:** Get user upcoming bookings
**Access:** Private

### GET /users/bookings/past
**Description:** Get user past bookings
**Access:** Private

### GET /users/bookings/:id
**Description:** Get specific booking details
**Access:** Private

### POST /users/bookings/:id/review
**Description:** Add review to a completed booking
**Access:** Private
**Body:**
```json
{
  "rating": 5,
  "comment": "Excellent stay!",
  "isPublic": true
}
```

### GET /users/dashboard
**Description:** Get user dashboard summary
**Access:** Private

---

## 🔧 Other Routes

### GET /destinations
**Description:** Get all destinations
**Access:** Public

### GET /restaurants
**Description:** Get all restaurants
**Access:** Public

### GET /attractions
**Description:** Get all attractions
**Access:** Public

### GET /reviews
**Description:** Get all reviews
**Access:** Public

---

## 📊 Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "count": 1,
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create a `.env` file:
```env
MONGODB_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 3. Start the Server
```bash
npm start
```

### 4. Test the API
Use tools like Postman or curl to test the endpoints:

```bash
# Test the base endpoint
curl http://localhost:5000/api

# Test hotel search
curl "http://localhost:5000/api/hotels?city=New%20York&minPrice=100"
```

---

## 🧪 Testing Stripe Integration

For development, use Stripe's test card numbers:

- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Expiry:** Any future date
- **CVC:** Any 3 digits

---

## 📱 Frontend Integration

The API is designed to work seamlessly with the React frontend. Key integration points:

1. **Authentication:** Store JWT token in localStorage
2. **Hotel Search:** Use query parameters for filtering
3. **Reservations:** Create reservations before payment
4. **Payments:** Use Stripe Elements for secure payment
5. **User Dashboard:** Fetch user data and bookings

This API provides a complete foundation for the hotel reservation system with full payment processing capabilities! 