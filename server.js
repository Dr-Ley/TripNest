const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/attractions', attractionRoutes);
app.use('/api/orders', orderRoutes);

// Session management
app.use(session({
  secret: 'tripnest-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tripnest';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Error:", err));

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const bookingRoutes = require('./routes/bookings');
const hotelRoutes = require('./routes/hotels');
const restaurantRoutes = require('./routes/restaurants');
const attractionRoutes = require('./routes/attractions');
const orderRoutes = require('./routes/orders');


// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to TripNest MERN API' });
});

/* ----------  PRODUCTION FRONT-END  ---------- */
/* ➜ 2.  static + catch-all  LAST  */
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));
  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
  );
}


/* ----------  FALLBACK 404 FOR UNMATCHED API ROUTES  ---------- */
app.use('/api/*', (req, res) => res.status(404).json({ message: 'Route not found' }));

/* ----------  START SERVER  ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`API running on port ${PORT}`));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📊 MongoDB: ${MONGODB_URI}`);
//   console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
//   console.log(`🛍️ Products API: http://localhost:${PORT}/api/products`);
//   console.log(`🛒 Cart API: http://localhost:${PORT}/api/cart`);
//   console.log(`📅 Bookings API: http://localhost:${PORT}/api/bookings`);
//   console.log(`🏨 Hotels API: http://localhost:${PORT}/api/hotels`);
//   console.log(`🍽️ Restaurants API: http://localhost:${PORT}/api/restaurants`);
//   console.log(`🎡 Attractions API: http://localhost:${PORT}/api/attractions`);
//   console.log(`📦 Orders API: http://localhost:${PORT}/api/orders`);
// }); 