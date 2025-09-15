import React, { useState, useEffect } from 'react';
import AttractionBookingForm from './AttractionBookingForm';
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
  Pagination,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  Attractions,
  LocationOn,
  Star,
  AccessTime,
  Group,
  Directions,
  Favorite,
  Share,
} from '@mui/icons-material';

const Attraction = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [rating, setRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [attractionBookingOpen, setAttractionBookingOpen] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch attractions from database
  useEffect(() => {
    fetchAttractions();
  }, []);

  const fetchAttractions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?category=attraction');
      if (response.ok) {
        const data = await response.json();
        // Transform database products to attraction format
        const attractionData = data.map(product => ({
          id: product._id,
          name: product.name,
          image: product.image,
          description: product.description,
          location: product.location,
          category: getCategoryFromLocation(product.location),
          priceRange: product.price > 150 ? '$$$' : product.price > 80 ? '$$' : '$',
          rating: product.rating || 4.5,
          reviewCount: Math.floor(Math.random() * 200) + 50,
          duration: getDurationFromCategory(getCategoryFromLocation(product.location)),
          groupSize: '2-8 people',
          highlights: getHighlightsFromCategory(getCategoryFromLocation(product.location)),
          included: ['Transportation', 'Guide', 'Entrance Fees'],
          notIncluded: ['Personal Expenses', 'Tips', 'Travel Insurance'],
          quantity: product.quantity
        }));
        setAttractions(attractionData);
      } else {
        throw new Error('Failed to fetch attractions');
      }
    } catch (error) {
      console.error('Error fetching attractions:', error);
      setError('Failed to load attractions. Please try again later.');
      // Fallback to mock data
      setAttractions(getMockAttractions());
    } finally {
      setLoading(false);
    }
  };

  const getCategoryFromLocation = (location) => {
    if (location.includes('Desert')) return 'Adventure';
    if (location.includes('Temple') || location.includes('Cultural')) return 'Cultural';
    if (location.includes('Alps') || location.includes('Hiking')) return 'Adventure';
    if (location.includes('Art') || location.includes('Paris')) return 'Cultural';
    if (location.includes('Rainforest')) return 'Adventure';
    return 'Cultural';
  };

  const getDurationFromCategory = (category) => {
    const durations = {
      'Adventure': '2-3 days',
      'Cultural': '1 day',
      'Nature': '1-2 days'
    };
    return durations[category] || '1 day';
  };

  const getHighlightsFromCategory = (category) => {
    const highlights = {
      'Adventure': ['Guided Tours', 'Equipment Provided', 'Safety Briefing'],
      'Cultural': ['Local Guide', 'Cultural Insights', 'Traditional Experiences'],
      'Nature': ['Nature Walks', 'Wildlife Viewing', 'Environmental Education']
    };
    return highlights[category] || ['Local Guide', 'Cultural Experience', 'Memorable Moments'];
  };

  // Fallback mock data
  const getMockAttractions = () => [
    {
      id: 1,
      name: 'Sahara Desert Adventure',
      image: '/images/sahara.jpeg',
      description: 'Experience the magic of the Sahara Desert with camel treks, camping under the stars, and traditional Berber hospitality.',
      location: 'Sahara Desert, Morocco',
      category: 'Adventure',
      priceRange: '$$',
      rating: 4.8,
      reviewCount: 124,
      duration: '2-3 days',
      groupSize: '2-8 people',
      highlights: ['Camel Riding', 'Desert Camping', 'Stargazing', 'Traditional Music'],
      included: ['Transportation', 'Accommodation', 'Meals', 'Guide'],
      notIncluded: ['Flights', 'Personal Expenses', 'Travel Insurance'],
    },
    {
      id: 2,
      name: 'Bali Temple Tour',
      image: '/images/bali-temple-tour.jpeg',
      description: 'Discover the spiritual heart of Bali with visits to ancient temples, traditional ceremonies, and cultural workshops.',
      location: 'Bali, Indonesia',
      category: 'Cultural',
      priceRange: '$$',
      rating: 4.7,
      reviewCount: 89,
      duration: '1 day',
      groupSize: '4-12 people',
      highlights: ['Temple Visits', 'Cultural Workshops', 'Traditional Dance', 'Local Cuisine'],
      included: ['Transportation', 'Guide', 'Entrance Fees', 'Lunch'],
      notIncluded: ['Accommodation', 'Personal Expenses', 'Tips'],
    },
    {
      id: 3,
      name: 'Tokyo Cultural Experience',
      image: '/images/tokyo-cultural-experience.jpeg',
      description: 'Immerse yourself in Japanese culture with tea ceremonies, calligraphy lessons, and traditional crafts.',
      location: 'Tokyo, Japan',
      category: 'Cultural',
      priceRange: '$$$',
      rating: 4.9,
      reviewCount: 156,
      duration: '1 day',
      groupSize: '2-6 people',
      highlights: ['Tea Ceremony', 'Calligraphy', 'Traditional Crafts', 'Local Guide'],
      included: ['All Materials', 'Expert Instruction', 'Traditional Snacks', 'Souvenirs'],
      notIncluded: ['Transportation', 'Accommodation', 'Personal Expenses'],
    },
    {
      id: 4,
      name: 'Swiss Alps Hiking',
      image: '/images/swiss-alps-hiking.jpeg',
      description: 'Explore the breathtaking Swiss Alps with guided hiking tours, mountain huts, and alpine adventures.',
      location: 'Swiss Alps, Switzerland',
      category: 'Adventure',
      priceRange: '$$$',
      rating: 4.6,
      reviewCount: 78,
      duration: '3-5 days',
      groupSize: '4-10 people',
      highlights: ['Mountain Hiking', 'Alpine Views', 'Mountain Huts', 'Local Guides'],
      included: ['Accommodation', 'Meals', 'Guide', 'Equipment'],
      notIncluded: ['Flights', 'Personal Expenses', 'Travel Insurance'],
    },
    {
      id: 5,
      name: 'Paris Art & History',
      image: '/images/paris-art-history.jpeg',
      description: 'Discover the artistic and historical treasures of Paris with expert-guided museum tours and cultural experiences.',
      location: 'Paris, France',
      category: 'Cultural',
      priceRange: '$$',
      rating: 4.5,
      reviewCount: 203,
      duration: '1-2 days',
      groupSize: '2-8 people',
      highlights: ['Museum Tours', 'Art History', 'Cultural Insights', 'Skip-the-Line Access'],
      included: ['Expert Guide', 'Entrance Fees', 'Audio Equipment', 'Refreshments'],
      notIncluded: ['Accommodation', 'Transportation', 'Personal Expenses'],
    },
    {
      id: 6,
      name: 'Amazon Rainforest Expedition',
      image: '/images/amazon-rainforest-expedition.jpeg',
      description: 'Venture into the heart of the Amazon Rainforest for an unforgettable wildlife and nature experience.',
      location: 'Amazon Rainforest, Brazil',
      category: 'Adventure',
      priceRange: '$$$',
      rating: 4.8,
      reviewCount: 67,
      duration: '4-6 days',
      groupSize: '6-12 people',
      highlights: ['Wildlife Spotting', 'Rainforest Trekking', 'River Cruises', 'Indigenous Culture'],
      included: ['Lodge Accommodation', 'All Meals', 'Expert Guides', 'Safety Equipment'],
      notIncluded: ['Flights', 'Personal Expenses', 'Travel Insurance'],
    },
  ];

  const categories = [
    'All Categories',
    'Adventure',
    'Cultural',
    'Nature',
    'Historical',
    'Food & Wine',
    'Water Sports',
    'Wildlife',
  ];

  const priceRanges = [
    'All Prices',
    'Budget ($)',
    'Mid-Range ($$)',
    'Luxury ($$$)',
  ];

  const filteredAttractions = attractions.filter(attraction => {
    const matchesSearch = attraction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attraction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !location || attraction.location.toLowerCase().includes(location.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || attraction.category === categoryFilter;
    const matchesPrice = priceFilter === 'all' || attraction.priceRange === priceFilter;
    const matchesRating = attraction.rating >= rating;
    
    return matchesSearch && matchesLocation && matchesCategory && matchesPrice && matchesRating;
  });

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredAttractions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAttractions = filteredAttractions.slice(startIndex, endIndex);

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
            Discover Amazing Attractions
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
            Explore exciting activities, tours, and experiences around the world
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
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search attractions"
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
          <Grid item xs={12} md={3}>
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
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
                sx={{
                  borderRadius: 2,
                }}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category === 'All Categories' ? 'all' : category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Price Range</InputLabel>
              <Select
                value={priceFilter}
                label="Price Range"
                onChange={(e) => setPriceFilter(e.target.value)}
                sx={{
                  borderRadius: 2,
                }}
              >
                {priceRanges.map((range) => (
                  <MenuItem key={range} value={range === 'All Prices' ? 'all' : range}>
                    {range}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Rating Filter */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
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
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {rating} stars and above
          </Typography>
        </Box>

        {/* Results */}
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ mb: 3, fontWeight: 'bold' }}
        >
          {filteredAttractions.length} Attractions Found
        </Typography>

        <Grid container spacing={4} alignItems="flex-start" justifyContent="center">
          {currentAttractions.map((attraction) => (
            <Grid item xs={12} sm={6} md={6} lg={6} key={attraction.id}>
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
                  image={attraction.image}
                  alt={attraction.name}
                  sx={{ objectFit: 'cover' }}
                  onError={(e) => {
                    console.error('Image failed to load:', attraction.image);
                    e.target.src = 'https://via.placeholder.com/400x200?text=Attraction+Image';
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {attraction.name}
                    </Typography>
                    <Chip
                      label={attraction.priceRange}
                      color="primary"
                      size="small"
                      sx={{ borderRadius: 2 }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {attraction.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn sx={{ fontSize: 16, color: 'grey.500', mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {attraction.location}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating
                      value={attraction.rating}
                      readOnly
                      size="small"
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({attraction.reviewCount} reviews)
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTime sx={{ fontSize: 16, color: 'grey.500', mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {attraction.duration}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Group sx={{ fontSize: 16, color: 'grey.500', mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {attraction.groupSize}
                    </Typography>
                  </Box>
                  
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      label={attraction.category}
                      size="small"
                      variant="outlined"
                      color="secondary"
                      sx={{ borderRadius: 2 }}
                    />
                  </Stack>
                  
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'left' }}>
                    Highlights:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                    {attraction.highlights.slice(0, 2).map((highlight) => (
                      <Chip
                        key={highlight}
                        label={highlight}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 2, mb: 1 }}
                      />
                    ))}
                  </Stack>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      setSelectedAttraction(attraction);
                      setAttractionBookingOpen(true);
                    }}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Book Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredAttractions.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Attractions sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No attractions found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search criteria
            </Typography>
          </Box>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        )}
      </Container>

      {/* Attraction Booking Form */}
      <AttractionBookingForm
        open={attractionBookingOpen}
        onClose={() => setAttractionBookingOpen(false)}
        attractionData={selectedAttraction}
      />
    </Box>
  );
};

export default Attraction; 