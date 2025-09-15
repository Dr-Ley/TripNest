"use client"

import { useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import HotelBookingForm from "./HotelBookingForm"
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import {
  Flight,
  Hotel,
  Restaurant as RestaurantIcon,
  Attractions as AttractionsIcon,
  ArrowForward,
  Search,
  Bed,
  EventSeat,
  FlightTakeoff,
} from "@mui/icons-material"

const Home = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [searchTab, setSearchTab] = useState(0)
  const [searchData, setSearchData] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
  })
  const [hotelBookingOpen, setHotelBookingOpen] = useState(false)

  const featuredDestinations = [
    {
      id: 1,
      name: "Nairobi",
      image: "/images/nairobi.jpg",
      description: "Experience the vibrant culture and modern city life of Kenya's capital",
      category: "Urban",
      rating: 4.6,
    },
    {
      id: 2,
      name: "Maasai Mara",
      image: "/images/maasai-mara.jpg",
      description: "Witness the spectacular wildlife and annual wildebeest migration",
      category: "Wildlife",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Tokyo",
      image: "/images/tokyo.jpg",
      description: "Immerse yourself in the perfect blend of tradition and innovation",
      category: "Cultural",
      rating: 4.8,
    },
  ]

  const services = [
    {
      icon: <Hotel sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Hotel Booking",
      description: "Find and book the perfect accommodation",
      path: "/hotel-reservation",
    },
    {
      icon: <RestaurantIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Restaurant Reservations",
      description: "Book tables at the finest restaurants",
      path: "/restaurant",
    },
    {
      icon: <AttractionsIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Attractions & Tours",
      description: "Explore exciting activities and tours",
      path: "/attraction",
    },
  ]

  const searchTabs = [
    { label: "Hotels", icon: <Bed />, value: "hotels" },
    { label: "Things to do", icon: <AttractionsIcon />, value: "things" },
    { label: "Restaurants", icon: <EventSeat />, value: "restaurants" },
    { label: "Flights", icon: <FlightTakeoff />, value: "flights" },
  ]

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    // Handle search logic here
    console.log("Search submitted:", searchData)
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #00aa6c 0%, #008c5a 100%)",
          color: "white",
          py: { xs: 8, md: 12 },
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "32px", sm: "40px", md: "48px" },
              mb: 2,
            }}
          >
            Where to?
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              mb: 6,
              opacity: 0.95,
              fontSize: { xs: "18px", sm: "20px" },
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Discover amazing places at exclusive deals
          </Typography>
        </Container>
      </Box>

      {/* Search Section */}
      <Box sx={{ py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Paper
            elevation={3}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            }}
          >
            {/* Search Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={searchTab}
                onChange={(e, newValue) => setSearchTab(newValue)}
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons="auto"
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontSize: "16px",
                    fontWeight: 500,
                    minHeight: "60px",
                  },
                  "& .Mui-selected": {
                    color: theme.palette.primary.main,
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: theme.palette.primary.main,
                    height: 3,
                  },
                }}
              >
                {searchTabs.map((tab, index) => (
                  <Tab key={tab.value} label={isMobile ? undefined : tab.label} icon={tab.icon} iconPosition="start" />
                ))}
              </Tabs>
            </Box>

            {/* Search Form */}
            <Box component="form" onSubmit={handleSearchSubmit} sx={{ p: { xs: 3, md: 4 } }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Where are you going?"
                    value={searchData.destination}
                    onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Check-in"
                    value={searchData.checkIn}
                    onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Check-out"
                    value={searchData.checkOut}
                    onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Guests</InputLabel>
                    <Select
                      value={searchData.guests}
                      label="Guests"
                      onChange={(e) => setSearchData({ ...searchData, guests: e.target.value })}
                      sx={{
                        borderRadius: 2,
                      }}
                    >
                      <MenuItem value="1">1 guest</MenuItem>
                      <MenuItem value="2">2 guests</MenuItem>
                      <MenuItem value="3">3 guests</MenuItem>
                      <MenuItem value="4">4+ guests</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<Search />}
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 2,
                      height: "56px",
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    Search
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography variant="h2" component="h2" textAlign="center" gutterBottom sx={{ mb: 3 }}>
          Our Services
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: "600px", mx: "auto" }}
        >
          Everything you need for a perfect trip
        </Typography>

        <Grid container spacing={4} alignItems="stretch" justifyContent="center">
          {services.map((service, index) => (
            <Grid item xs={12} md={4} key={index} sx={{ display: "flex" }}>
              <Card
                sx={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  p: 3,
                  borderRadius: 3,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    transition: "all 0.3s ease-in-out",
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{service.icon}</Box>
                <CardContent sx={{ flexGrow: 1, px: 0 }}>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {service.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {service.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center", px: 0, pt: 0 }}>
                  <Button
                    component={RouterLink}
                    to={service.path}
                    endIcon={<ArrowForward />}
                    size="large"
                    sx={{
                      color: theme.palette.primary.main,
                      "&:hover": {
                        backgroundColor: "rgba(0, 170, 108, 0.05)",
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
      </Container>

      {/* Featured Destinations */}
      <Box sx={{ backgroundColor: "grey.50", py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h2" textAlign="center" gutterBottom sx={{ mb: 3 }}>
            Featured Destinations
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: "600px", mx: "auto" }}
          >
            Discover amazing places to visit
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {featuredDestinations.map((destination) => (
              <Grid item xs={12} sm={6} md={4} key={destination.id} sx={{ display: "flex" }}>
                <Card
                  sx={{
                    height: 360,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                      transition: "all 0.3s ease-in-out",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={destination.image}
                    alt={destination.name}
                    sx={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                  <CardContent sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "60%",
                        }}
                      >
                        {destination.name}
                      </Typography>
                      <Chip
                        label={`★ ${destination.rating}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ borderRadius: 2, fontSize: "0.75rem" }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        flexGrow: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: "1.4",
                      }}
                    >
                      {destination.description}
                    </Typography>
                    <Box sx={{ mt: "auto" }}>
                      <Chip
                        label={destination.category}
                        size="small"
                        variant="outlined"
                        color="secondary"
                        sx={{ borderRadius: 2, fontSize: "0.75rem" }}
                      />
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      component={RouterLink}
                      to="/explore"
                      size="small"
                      endIcon={<ArrowForward />}
                      sx={{
                        color: theme.palette.primary.main,
                        fontSize: "0.875rem",
                        "&:hover": {
                          backgroundColor: "rgba(0, 170, 108, 0.05)",
                        },
                      }}
                    >
                      Explore
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, textAlign: "center" }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 3 }}>
            Ready to Start Your Journey?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: "500px", mx: "auto" }}>
            Join thousands of travelers who trust TripNest for their adventures
          </Typography>
          <Button
            onClick={() => setHotelBookingOpen(true)}
            variant="contained"
            size="large"
            startIcon={<Flight />}
            sx={{
              backgroundColor: theme.palette.primary.main,
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: "18px",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            Book Now
          </Button>
        </Container>
      </Box>

      {/* Hotel Booking Form */}
      <HotelBookingForm open={hotelBookingOpen} onClose={() => setHotelBookingOpen(false)} hotelData={null} />
    </Box>
  )
}

export default Home