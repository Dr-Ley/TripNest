import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Rating,
  Slider,
  InputAdornment,
  Stack,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  Hotel,
  LocationOn,
  Star,
  Wifi,
  Pool,
  Restaurant as RestaurantIcon,
  FitnessCenter,
  Spa,
  LocalParking,
  Bookmark,
} from '@mui/icons-material';
import HotelBookingForm from './HotelBookingForm';

const HotelReservation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [priceRange, setPriceRange] = useState([50, 500]);
  const [rating, setRating] = useState(0);
  const [bookingFormOpen, setBookingFormOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch hotels from database
  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?category=hotel');
      if (response.ok) {
        const data = await response.json();
        // Transform database products to hotel format
        const hotelData = data.map(product => ({
          id: product._id, // Use MongoDB ObjectId
          name: product.name,
          image: product.image,
          description: product.description,
          location: product.location,
          rating: product.rating || 4.5,
          reviewCount: Math.floor(Math.random() * 200) + 50, // Mock review count
          price: product.price,
          priceRange: product.price > 300 ? '$$$' : product.price > 150 ? '$$' : '$',
          amenities: ['Wifi', 'Pool', 'Restaurant', 'Spa', 'Fitness Center'], // Default amenities
          roomTypes: ['Standard Room', 'Deluxe Room', 'Suite'],
          highlights: ['Ocean View', 'Beach Access', 'Spa Services'],
          quantity: product.quantity
        }));
        setHotels(hotelData);
      } else {
        throw new Error('Failed to fetch hotels');
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setError('Failed to load hotels. Please try again later.');
      // Fallback to mock data
      setHotels(getMockHotels());
    } finally {
      setLoading(false);
    }
  };

  // Fallback mock data
  const getMockHotels = () => [
    {
      id: 'mock-1',
      name: 'Nest Resort & Spa',
      image: '/images/nest-resort.jpeg',
      description: 'Luxury resort with stunning ocean views and world-class amenities.',
      location: 'Bali, Indonesia',
      rating: 4.9,
      reviewCount: 234,
      price: 299,
      priceRange: '$$$',
      amenities: ['Wifi', 'Pool', 'Restaurant', 'Spa', 'Fitness Center'],
      roomTypes: ['Deluxe Room', 'Ocean View Suite', 'Villa'],
      highlights: ['Infinity Pool', 'Beach Access', 'Spa Services'],
      quantity: 50
    },
    {
      id: 'mock-2',
      name: 'Mountain View Lodge',
      image: '/images/mountain-view.jpeg',
      description: 'Cozy mountain retreat with breathtaking alpine views.',
      location: 'Swiss Alps',
      rating: 4.7,
      reviewCount: 156,
      price: 189,
      priceRange: '$$',
      amenities: ['Wifi', 'Restaurant', 'Fitness Center', 'Parking'],
      roomTypes: ['Standard Room', 'Mountain View Room', 'Family Suite'],
      highlights: ['Mountain Views', 'Hiking Trails', 'Local Cuisine'],
      quantity: 30
    },
    {
      id: 'mock-3',
      name: 'Desert Oasis Hotel',
      image: '/images/sahara.jpeg',
      description: 'Unique desert experience with traditional Moroccan hospitality.',
      location: 'Sahara Desert, Morocco',
      rating: 4.6,
      reviewCount: 89,
      price: 159,
      priceRange: '$$',
      amenities: ['Wifi', 'Pool', 'Restaurant', 'Parking'],
      roomTypes: ['Desert Tent', 'Standard Room', 'Luxury Suite'],
      highlights: ['Desert Views', 'Camel Tours', 'Traditional Food'],
      quantity: 25
    },
    {
      id: 'mock-4',
      name: 'Bali Paradise Resort',
      image: '/images/bali.jpeg',
      description: 'Tropical paradise with lush gardens and pristine beaches.',
      location: 'Bali, Indonesia',
      rating: 4.8,
      reviewCount: 187,
      price: 245,
      priceRange: '$$$',
      amenities: ['Wifi', 'Pool', 'Restaurant', 'Spa', 'Beach Access'],
      roomTypes: ['Garden Villa', 'Beachfront Suite', 'Private Pool Villa'],
      highlights: ['Private Beach', 'Tropical Gardens', 'Spa Treatments'],
      quantity: 40
    },
    {
      id: 'mock-5',
      name: 'Swiss Alpine Retreat',
      image: '/images/swiss.jpeg',
      description: 'Authentic Swiss mountain experience with panoramic alpine views.',
      location: 'Swiss Alps, Switzerland',
      rating: 4.5,
      reviewCount: 112,
      price: 175,
      priceRange: '$$',
      amenities: ['Wifi', 'Restaurant', 'Ski Storage', 'Mountain Views'],
      roomTypes: ['Alpine Room', 'Chalet Suite', 'Family Lodge'],
      highlights: ['Ski Access', 'Mountain Views', 'Local Cuisine'],
      quantity: 35
    }
  ];

  // Filter hotels based on search criteria
  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !location || hotel.location.toLowerCase().includes(location.toLowerCase());
    const matchesPrice = hotel.price >= priceRange[0] && hotel.price <= priceRange[1];
    const matchesRating = hotel.rating >= rating;
    const hasAvailability = hotel.quantity > 0;

    return matchesSearch && matchesLocation && matchesPrice && matchesRating && hasAvailability;
  });

  const getAmenityIcon = (amenity) => {
    const amenityIcons = {
      'Wifi': <Wifi />,
      'Pool': <Pool />,
      'Restaurant': <RestaurantIcon />,
      'Spa': <Spa />,
      'Fitness Center': <FitnessCenter />,
      'Parking': <LocalParking />,
    };
    return amenityIcons[amenity] || null;
  };

  const handleBookNow = (hotel) => {
    console.log('Book Now clicked for hotel:', hotel);
    setSelectedHotel(hotel);
    setBookingFormOpen(true);
  };

  const handleCloseBookingForm = () => {
    setBookingFormOpen(false);
    setSelectedHotel(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Hotel sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" component="h1" gutterBottom>
            Hotel Reservations
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Find and book the perfect accommodation for your stay
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Search Form */}
        <Card sx={{ mb: 6, p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search Hotels"
                placeholder="Hotel name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Location"
                placeholder="City, country..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Check-in"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Check-out"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Guests"
                type="number"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                inputProps={{ min: 1, max: 10 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<Search />}
              >
                Search Hotels
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Filters */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Price Range: ${priceRange[0]} - ${priceRange[1]}</Typography>
              <Slider
                value={priceRange}
                onChange={(event, newValue) => setPriceRange(newValue)}
                valueLabelDisplay="auto"
                min={50}
                max={500}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Minimum Rating: {rating}</Typography>
              <Slider
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={5}
                step={0.5}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>Rating:</Typography>
                <Rating value={rating} onChange={(event, newValue) => setRating(newValue)} />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Results Count */}
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          {filteredHotels.length} hotels found
        </Typography>

        {/* Hotels Grid */}
        <Grid container spacing={4} alignItems="flex-start" justifyContent="center">
          {filteredHotels.map((hotel) => (
            <Grid item xs={12} sm={6} md={6} lg={6} key={hotel.id}>
              <Card sx={{ display: 'flex', flexDirection: 'column' }}>
                                 <CardMedia
                   component="img"
                   height="200"
                   image={hotel.image}
                   alt={hotel.name}
                   sx={{ objectFit: 'cover' }}
                   onError={(e) => {
                     console.error('Image failed to load:', hotel.image);
                     // Try to load a fallback image
                     e.target.src = 'https://via.placeholder.com/400x200?text=Hotel+Image';
                   }}
                 />
                <CardContent sx={{ flexGrow: 1, textAlign: 'left' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {hotel.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {hotel.location}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={hotel.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {hotel.rating} ({hotel.reviewCount} reviews)
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {hotel.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      Amenities:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {hotel.amenities.map((amenity, index) => (
                        <Chip
                          key={index}
                          icon={getAmenityIcon(amenity)}
                          label={amenity}
                          size="small"
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                      ))}
                    </Stack>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      Room Types:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {hotel.roomTypes.map((type, index) => (
                        <Chip
                          key={index}
                          label={type}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>

                  {/* Availability Status */}
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={hotel.quantity > 0 ? `${hotel.quantity} rooms available` : 'Fully booked'}
                      color={hotel.quantity > 0 ? 'success' : 'error'}
                      size="small"
                    />
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', gap: 1.5 }}>
                    <Typography variant="h6" color="primary" sx={{ mr: 2 }}>
                      ${hotel.price}/night
                    </Typography>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<Bookmark />}
                      onClick={() => {
                        alert(`${hotel.name} saved!`);
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Hotel />}
                      onClick={() => handleBookNow(hotel)}
                      disabled={hotel.quantity === 0}
                    >
                      {hotel.quantity === 0 ? 'Fully Booked' : 'Book Now'}
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* No Results */}
        {filteredHotels.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hotels found matching your criteria
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search terms or filters
            </Typography>
          </Box>
        )}

        {/* Booking Tips */}
        <Alert severity="info" sx={{ mt: 4 }}>
          <Typography variant="body2">
            <strong>Booking Tip:</strong> Book early for the best rates and availability. Many hotels offer free cancellation up to 24 hours before check-in.
          </Typography>
        </Alert>
      </Container>

      {/* Hotel Booking Form */}
      <HotelBookingForm
        open={bookingFormOpen}
        onClose={handleCloseBookingForm}
        hotelData={selectedHotel}
      />
    </Box>
  );
};

export default HotelReservation; 