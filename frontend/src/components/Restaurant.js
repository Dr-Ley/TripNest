import React, { useState, useEffect } from 'react';
import RestaurantBookingForm from './RestaurantBookingForm';
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
  Alert,
  Badge,
  Paper,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  Restaurant as RestaurantIcon,
  LocationOn,
  Star,
  AccessTime,
  People,
  LocalDining,
  WineBar,
  Coffee,
  Fastfood,
} from '@mui/icons-material';

const Restaurant = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [cuisine, setCuisine] = useState('all');
  const [priceRange, setPriceRange] = useState([10, 200]);
  const [rating, setRating] = useState(0);
  const [restaurantBookingOpen, setRestaurantBookingOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch restaurants from database
  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?category=restaurant');
      if (response.ok) {
        const data = await response.json();
        // Transform database products to restaurant format
        const restaurantData = data.map(product => ({
          id: product._id,
          name: product.name,
          image: product.image,
          description: product.description,
          location: product.location,
          cuisine: getCuisineFromLocation(product.location),
          rating: product.rating || 4.5,
          reviewCount: Math.floor(Math.random() * 200) + 50,
          priceRange: product.price > 60 ? '$$$' : product.price > 30 ? '$$' : '$',
          pricePerPerson: product.price,
          openingHours: '12:00 PM - 11:00 PM',
          specialties: getSpecialtiesFromCuisine(getCuisineFromLocation(product.location)),
          amenities: ['Outdoor Seating', 'Live Music', 'Vegetarian Options'],
          reservationTypes: ['Dinner', 'Lunch', 'Group Events'],
          quantity: product.quantity
        }));
        setRestaurants(restaurantData);
      } else {
        throw new Error('Failed to fetch restaurants');
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setError('Failed to load restaurants. Please try again later.');
      // Fallback to mock data
      setRestaurants(getMockRestaurants());
    } finally {
      setLoading(false);
    }
  };

  const getCuisineFromLocation = (location) => {
    if (location.includes('Morocco')) return 'Moroccan';
    if (location.includes('Bali')) return 'International';
    if (location.includes('Swiss')) return 'Swiss';
    if (location.includes('Mediterranean')) return 'Mediterranean';
    return 'International';
  };

  const getSpecialtiesFromCuisine = (cuisine) => {
    const specialties = {
      'Moroccan': ['Tagine', 'Couscous', 'Mint Tea'],
      'International': ['Seafood', 'Fusion Dishes', 'Wine Pairing'],
      'Swiss': ['Fondue', 'Raclette', 'Alpine Dishes'],
      'Mediterranean': ['Fresh Seafood', 'Olive Oil Dishes', 'Local Wines']
    };
    return specialties[cuisine] || ['Local Specialties', 'Fresh Ingredients', 'Chef Recommendations'];
  };

  // Fallback mock data
  const getMockRestaurants = () => [
    {
      id: 1,
      name: 'Sahara Spice',
      image: '/images/sahara-spice.jpeg',
      description: 'Authentic Moroccan cuisine with traditional flavors and warm hospitality.',
      location: 'Marrakech, Morocco',
      cuisine: 'Moroccan',
      rating: 4.8,
      reviewCount: 156,
      priceRange: '$$',
      pricePerPerson: 45,
      openingHours: '12:00 PM - 11:00 PM',
      specialties: ['Tagine', 'Couscous', 'Mint Tea'],
      amenities: ['Outdoor Seating', 'Live Music', 'Vegetarian Options'],
      reservationTypes: ['Dinner', 'Lunch', 'Group Events'],
    },
    {
      id: 2,
      name: 'Nest Fine Dining',
      image: '/images/nest-fine-dining.jpeg',
      description: 'Upscale dining experience with panoramic ocean views and international cuisine.',
      location: 'Bali, Indonesia',
      cuisine: 'International',
      rating: 4.9,
      reviewCount: 234,
      priceRange: '$$$',
      pricePerPerson: 85,
      openingHours: '6:00 PM - 11:00 PM',
      specialties: ['Seafood', 'Fusion Dishes', 'Wine Pairing'],
      amenities: ['Ocean View', 'Private Dining', 'Sommelier Service'],
      reservationTypes: ['Dinner', 'Special Occasions', 'Private Events'],
    },
    {
      id: 3,
      name: 'Mountain Bistro',
      image: '/images/mountain-bistro.jpeg',
      description: 'Cozy alpine restaurant serving hearty mountain cuisine and local specialties.',
      location: 'Swiss Alps',
      cuisine: 'Swiss',
      rating: 4.6,
      reviewCount: 89,
      priceRange: '$$',
      pricePerPerson: 55,
      openingHours: '11:00 AM - 10:00 PM',
      specialties: ['Fondue', 'Rösti', 'Alpine Cheese'],
      amenities: ['Mountain Views', 'Fireplace', 'Local Ingredients'],
      reservationTypes: ['Lunch', 'Dinner', 'Family Meals'],
    },
    {
      id: 4,
      name: 'Coastal Grill',
      image: '/images/coastal-grill.jpeg',
      description: 'Fresh seafood and coastal cuisine with stunning beachfront views.',
      location: 'Amalfi Coast, Italy',
      cuisine: 'Italian',
      rating: 4.7,
      reviewCount: 178,
      priceRange: '$$$',
      pricePerPerson: 75,
      openingHours: '11:30 AM - 10:30 PM',
      specialties: ['Fresh Seafood', 'Pasta', 'Local Wine'],
      amenities: ['Beachfront', 'Outdoor Terrace', 'Wine Cellar'],
      reservationTypes: ['Lunch', 'Dinner', 'Sunset Dining'],
    },
  ];

  const cuisineTypes = [
    'All Cuisines',
    'Italian',
    'Moroccan',
    'International',
    'Swiss',
    'Japanese',
    'Thai',
    'Indian',
    'French',
    'Mediterranean',
  ];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !location || restaurant.location.toLowerCase().includes(location.toLowerCase());
    const matchesCuisine = cuisine === 'all' || restaurant.cuisine === cuisine;
    const matchesRating = restaurant.rating >= rating;
    const matchesPrice = restaurant.pricePerPerson >= priceRange[0] && restaurant.pricePerPerson <= priceRange[1];
    
    return matchesSearch && matchesLocation && matchesCuisine && matchesRating && matchesPrice;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'grey.50' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #00aa6c 0%, #008c5a 100%)',
          color: 'white',
          py: { xs: 6, md: 8 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '32px', sm: '40px', md: '48px' },
              mb: 2,
            }}
          >
            Find the Perfect Restaurant
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.95,
              fontSize: { xs: '18px', sm: '20px' },
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Discover amazing dining experiences and book your table with ease
          </Typography>
        </Container>
      </Box>

      {/* Error Alert */}
      {error && (
        <Container maxWidth="lg" sx={{ mt: 3 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Container>
      )}

      {/* Search and Filters */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            p: { xs: 3, md: 4 },
            mb: 4,
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search restaurants"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'grey.500' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                InputProps={{
                  startAdornment: <LocationOn sx={{ mr: 1, color: 'grey.500' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Cuisine Type</InputLabel>
                <Select
                  value={cuisine}
                  label="Cuisine Type"
                  onChange={(e) => setCuisine(e.target.value)}
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  {cuisineTypes.map((type) => (
                    <MenuItem key={type} value={type === 'All Cuisines' ? 'all' : type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Price Range (per person)
              </Typography>
              <Slider
                value={priceRange}
                onChange={(e, newValue) => setPriceRange(newValue)}
                valueLabelDisplay="auto"
                min={10}
                max={200}
                sx={{
                  color: theme.palette.primary.main,
                }}
              />
              <Typography variant="body2" color="text.secondary">
                ${priceRange[0]} - ${priceRange[1]}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Minimum Rating
              </Typography>
              <Rating
                value={rating}
                onChange={(e, newValue) => setRating(newValue)}
                size="large"
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: theme.palette.primary.main,
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {rating} stars and above
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Results */}
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ mb: 3, fontWeight: 'bold' }}
        >
          {filteredRestaurants.length} Restaurants Found
        </Typography>

        <Grid container spacing={4} alignItems="flex-start" justifyContent="center">
          {filteredRestaurants.map((restaurant) => (
            <Grid item xs={12} sm={6} md={6} lg={6} key={restaurant.id}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    transition: 'all 0.3s ease-in-out',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={restaurant.image}
                  alt={restaurant.name}
                  sx={{ objectFit: 'cover' }}
                  onError={(e) => {
                    console.error('Image failed to load:', restaurant.image);
                    e.target.src = 'https://via.placeholder.com/400x200?text=Restaurant+Image';
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {restaurant.name}
                    </Typography>
                    <Chip
                      label={restaurant.priceRange}
                      color="primary"
                      size="small"
                      sx={{ borderRadius: 2 }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {restaurant.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn sx={{ fontSize: 16, color: 'grey.500', mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {restaurant.location}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating
                      value={restaurant.rating}
                      readOnly
                      size="small"
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({restaurant.reviewCount} reviews)
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTime sx={{ fontSize: 16, color: 'grey.500', mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {restaurant.openingHours}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <People sx={{ fontSize: 16, color: 'grey.500', mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      From ${restaurant.pricePerPerson} per person
                    </Typography>
                  </Box>
                  
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    {restaurant.specialties.slice(0, 2).map((specialty) => (
                      <Chip
                        key={specialty}
                        label={specialty}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      />
                    ))}
                  </Stack>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      setSelectedRestaurant(restaurant);
                      setRestaurantBookingOpen(true);
                    }}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Book Table
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredRestaurants.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <RestaurantIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No restaurants found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search criteria
            </Typography>
          </Box>
        )}
      </Container>

      {/* Restaurant Booking Form */}
      <RestaurantBookingForm
        open={restaurantBookingOpen}
        onClose={() => setRestaurantBookingOpen(false)}
        restaurantData={selectedRestaurant}
      />
    </Box>
  );
};

export default Restaurant; 