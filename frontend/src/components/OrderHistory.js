import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Avatar,
  Stack,
} from '@mui/material';
import {
  History,
  Receipt,
  ExpandMore,
  ExpandLess,
  Visibility,
  Download,
  Print,
  Hotel,
  Restaurant,
  Attractions,
  Person,
  Email,
  Phone,
  Event,
  AccessTime,
  Group,
  Login,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch user's bookings
      const bookingsResponse = await fetch('/api/bookings/my-bookings', {
        credentials: 'include',
      });

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      } else {
        console.error('Failed to fetch bookings');
      }

      // Fetch user's orders (if you have an orders API)
      try {
        const ordersResponse = await fetch('/api/orders/my-orders', {
          credentials: 'include',
        });
        
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setOrders(ordersData);
        }
      } catch (ordersError) {
        console.log('Orders API not available yet');
        setOrders([]);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load your booking history');
    } finally {
      setLoading(false);
    }
  };

  const handleExpandBooking = (bookingId) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedBooking(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const getBookingIcon = (bookingType) => {
    switch (bookingType) {
      case 'hotel':
        return <Hotel />;
      case 'restaurant':
        return <Restaurant />;
      case 'attraction':
        return <Attractions />;
      default:
        return <Receipt />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatBookingDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Check if user is authenticated
  if (!user) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Login sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
          <Typography variant="h4" gutterBottom>
            Sign In Required
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Please sign in to view your booking history and orders.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/signin')}
            sx={{ mt: 2 }}
          >
            Sign In
          </Button>
        </Container>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
            <History sx={{ mr: 2, color: 'primary.main' }} />
            My Booking History
          </Typography>
        </Box>

        {/* User Info */}
        <Card sx={{ mb: 4, p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}>
                <Person />
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user.email}</Typography>
            </Grid>
            <Grid item>
              <Chip label={`${bookings.length} Bookings`} color="primary" />
            </Grid>
          </Grid>
        </Card>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab label={`Bookings (${bookings.length})`} />
            <Tab label={`Orders (${orders.length})`} />
          </Tabs>
        </Box>

        {/* Bookings Tab */}
        {activeTab === 0 && (
          <>
            {bookings.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Receipt sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No bookings found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  You haven't made any bookings yet. Start exploring our amazing destinations!
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/explore')}
                  startIcon={<Receipt />}
                >
                  Explore Destinations
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {bookings.map((booking) => (
                  <Grid item xs={12} key={booking._id}>
                    <Card>
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getBookingIcon(booking.bookingType)}
                              <Typography variant="h6" sx={{ ml: 1 }}>
                                {booking.bookingType.charAt(0).toUpperCase() + booking.bookingType.slice(1)}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(booking.bookingDate)}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" color="text.secondary">
                              {booking.bookingType === 'hotel' ? 'Hotel' : 
                               booking.bookingType === 'restaurant' ? 'Restaurant' : 'Attraction'}
                            </Typography>
                            <Typography variant="h6">
                              {booking.hotelName || booking.restaurantName || booking.attractionName}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} md={2}>
                            <Typography variant="body2" color="text.secondary">
                              Guests
                            </Typography>
                            <Typography variant="h6">
                              {booking.guests}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} md={2}>
                            <Typography variant="body2" color="text.secondary">
                              Total Price
                            </Typography>
                            <Typography variant="h6" color="primary">
                              ${booking.totalPrice || 'N/A'}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12} md={2}>
                            <Typography variant="body2" color="text.secondary">
                              Status
                            </Typography>
                            <Chip
                              label={booking.status}
                              color={getStatusColor(booking.status)}
                              size="small"
                            />
                          </Grid>
                          
                          <Grid item xs={12} md={1} sx={{ textAlign: 'right' }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleViewBooking(booking)}
                              startIcon={<Visibility />}
                              sx={{ mr: 1 }}
                            >
                              View
                            </Button>
                            <IconButton
                              size="small"
                              onClick={() => handleExpandBooking(booking._id)}
                            >
                              {expandedBooking === booking._id ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          </Grid>
                        </Grid>

                        {/* Expanded Booking Details */}
                        <Collapse in={expandedBooking === booking._id}>
                          <Divider sx={{ my: 2 }} />
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="h6" gutterBottom>Booking Details</Typography>
                              <Stack spacing={1}>
                                <Typography variant="body2">
                                  <strong>Name:</strong> {booking.firstName} {booking.lastName}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Email:</strong> {booking.email}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Phone:</strong> {booking.phone}
                                </Typography>
                                {booking.bookingType === 'hotel' && (
                                  <>
                                    <Typography variant="body2">
                                      <strong>Check-in:</strong> {formatBookingDate(booking.checkIn)}
                                    </Typography>
                                    <Typography variant="body2">
                                      <strong>Check-out:</strong> {formatBookingDate(booking.checkOut)}
                                    </Typography>
                                    <Typography variant="body2">
                                      <strong>Room Type:</strong> {booking.roomType}
                                    </Typography>
                                  </>
                                )}
                                {booking.bookingType === 'restaurant' && (
                                  <>
                                    <Typography variant="body2">
                                      <strong>Date:</strong> {formatBookingDate(booking.reservationDate)}
                                    </Typography>
                                    <Typography variant="body2">
                                      <strong>Time:</strong> {booking.reservationTime}
                                    </Typography>
                                    <Typography variant="body2">
                                      <strong>Type:</strong> {booking.reservationType}
                                    </Typography>
                                  </>
                                )}
                                {booking.bookingType === 'attraction' && (
                                  <>
                                    <Typography variant="body2">
                                      <strong>Date:</strong> {formatBookingDate(booking.date)}
                                    </Typography>
                                    <Typography variant="body2">
                                      <strong>Time:</strong> {booking.time}
                                    </Typography>
                                  </>
                                )}
                              </Stack>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="h6" gutterBottom>Location</Typography>
                              <Typography variant="body2" paragraph>
                                {booking.hotelLocation || booking.restaurantLocation || booking.attractionLocation}
                              </Typography>
                              
                              {booking.specialRequests && (
                                <>
                                  <Typography variant="h6" gutterBottom>Special Requests</Typography>
                                  <Typography variant="body2" paragraph>
                                    {booking.specialRequests}
                                  </Typography>
                                </>
                              )}
                            </Grid>
                          </Grid>
                        </Collapse>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {/* Orders Tab */}
        {activeTab === 1 && (
          <>
            {orders.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Receipt sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No orders found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  You haven't placed any orders yet.
                </Typography>
              </Paper>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Orders functionality coming soon...
              </Typography>
            )}
          </>
        )}

        {/* Booking Details Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Booking Details - {selectedBooking?.bookingType?.toUpperCase()}
          </DialogTitle>
          <DialogContent>
            {selectedBooking && (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Booking Information
                    </Typography>
                    <Typography variant="body2">
                      <strong>Booking ID:</strong> {selectedBooking._id}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Booking Date:</strong> {formatDate(selectedBooking.bookingDate)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong> 
                      <Chip
                        label={selectedBooking.status}
                        color={getStatusColor(selectedBooking.status)}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    <Typography variant="body2">
                      <strong>Type:</strong> {selectedBooking.bookingType}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Customer Information
                    </Typography>
                    <Typography variant="body2">
                      <strong>Name:</strong> {selectedBooking.firstName} {selectedBooking.lastName}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {selectedBooking.email}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Phone:</strong> {selectedBooking.phone}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Guests:</strong> {selectedBooking.guests}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h6" gutterBottom>
                  Booking Summary
                </Typography>
                <Typography variant="body2">
                  <strong>Location:</strong> {selectedBooking.hotelLocation || selectedBooking.restaurantLocation || selectedBooking.attractionLocation}
                </Typography>
                <Typography variant="body2">
                  <strong>Total Price:</strong> ${selectedBooking.totalPrice || 'N/A'}
                </Typography>
                {selectedBooking.specialRequests && (
                  <Typography variant="body2">
                    <strong>Special Requests:</strong> {selectedBooking.specialRequests}
                  </Typography>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={() => {
                alert('Downloading booking receipt...');
              }}
            >
              Download Receipt
            </Button>
            <Button
              variant="outlined"
              startIcon={<Print />}
              onClick={() => {
                window.print();
              }}
            >
              Print
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default OrderHistory; 