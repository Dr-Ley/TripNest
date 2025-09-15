"use client"

import { useState, useEffect } from "react"
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
  Pagination,
  Stack,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  useTheme,
} from "@mui/material"
import { Search, FilterList, LocationOn, Hotel, Restaurant, Attractions, AccessTime, Group } from "@mui/icons-material"
import HotelBookingForm from "../components/HotelBookingForm"
import RestaurantBookingForm from "../components/RestaurantBookingForm"
import AttractionBookingForm from "../components/AttractionBookingForm"

const Explore = () => {
  const theme = useTheme()
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Data states
  const [hotels, setHotels] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [attractions, setAttractions] = useState([])

  const [hotelBookingOpen, setHotelBookingOpen] = useState(false)
  const [restaurantBookingOpen, setRestaurantBookingOpen] = useState(false)
  const [attractionBookingOpen, setAttractionBookingOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const categories = ["all", "Adventure", "Luxury", "Cultural", "Relaxation", "Budget"]
  const priceRanges = ["all", "$", "$$", "$$$", "$$$$"]
  const tabLabels = ["Hotels", "Restaurants", "Attractions"]

  // Fetch data from API
  const fetchData = async (endpoint) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/${endpoint}`)
      const data = await response.json()

      if (data.success) {
        return data.data
      } else {
        throw new Error(data.message || "Failed to fetch data")
      }
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err)
      setError(`Failed to load ${endpoint}`)
      return []
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadAllData = async () => {
      const [hotelsData, restaurantsData, attractionsData] = await Promise.all([
        fetchData("hotels"),
        fetchData("restaurants"),
        fetchData("attractions"),
      ])

      setHotels(hotelsData)
      setRestaurants(restaurantsData)
      setAttractions(attractionsData)
    }

    loadAllData()
  }, [])

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 0:
        return hotels
      case 1:
        return restaurants
      case 2:
        return attractions
      default:
        return hotels
    }
  }

  // Filter data based on search and filters
  const getFilteredData = () => {
    const currentData = getCurrentData()

    return currentData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.location?.city && item.location.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.location?.country && item.location.country.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory =
        categoryFilter === "all" ||
        (activeTab === 2 && item.category === categoryFilter) ||
        (activeTab === 1 && item.cuisine && item.cuisine.some((c) => c === categoryFilter))

      const matchesPrice = priceFilter === "all" || (item.priceRange && getPriceRange(item.priceRange) === priceFilter)

      return matchesSearch && matchesCategory && matchesPrice
    })
  }

  // Helper function to get price range string
  const getPriceRange = (priceRange) => {
    const avg = (priceRange.min + priceRange.max) / 2
    if (avg < 50) return "$"
    if (avg < 100) return "$$"
    if (avg < 200) return "$$$"
    return "$$$$"
  }

  // Helper function to get image URL
  const getImageUrl = (item) => {
    if (item.images && item.images.length > 0) {
      const featuredImage = item.images.find((img) => img.isFeatured)
      return featuredImage ? featuredImage.url : item.images[0].url
    }
    return "/images/placeholder.jpg"
  }

  // Helper function to get location string
  const getLocationString = (item) => {
    if (item.location) {
      return `${item.location.city}, ${item.location.country}`
    }
    return "Location not specified"
  }

  // Helper function to get highlights/tags
  const getHighlights = (item) => {
    if (activeTab === 0 && item.amenities) {
      return item.amenities.slice(0, 3).map((amenity) => amenity.name)
    }
    if (activeTab === 1 && item.cuisine) {
      return item.cuisine.slice(0, 3)
    }
    if (activeTab === 2 && item.activities) {
      return item.activities.slice(0, 3).map((activity) => activity.name)
    }
    return []
  }

  // Helper function to get category for attractions
  const getCategory = (item) => {
    if (activeTab === 2 && item.category) {
      return item.category
    }
    if (activeTab === 1 && item.cuisine && item.cuisine.length > 0) {
      return item.cuisine[0]
    }
    return "General"
  }

  const filteredData = getFilteredData()
  const itemsPerPage = 6
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    setCurrentPage(1)
    setSearchTerm("")
    setCategoryFilter("all")
    setPriceFilter("all")
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setCategoryFilter("all")
    setPriceFilter("all")
    setCurrentPage(1)
  }

  const handleBookNow = (item) => {
    setSelectedItem(item)

    switch (activeTab) {
      case 0: // Hotels
        setHotelBookingOpen(true)
        break
      case 1: // Restaurants
        setRestaurantBookingOpen(true)
        break
      case 2: // Attractions
        setAttractionBookingOpen(true)
        break
      default:
        break
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "grey.50" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #00aa6c 0%, #008c5a 100%)",
          color: "white",
          py: { xs: 6, md: 8 },
          textAlign: "center",
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
            Explore Destinations
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.95,
              fontSize: { xs: "18px", sm: "20px" },
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Discover amazing hotels, restaurants, and attractions around the world
          </Typography>
        </Container>
      </Box>

      {/* Tabs */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
          <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 2 }}>
            <Tab icon={<Hotel />} label="Hotels" iconPosition="start" />
            <Tab icon={<Restaurant />} label="Restaurants" iconPosition="start" />
            <Tab icon={<Attractions />} label="Attractions" iconPosition="start" />
          </Tabs>
        </Box>

        {/* Search and Filters */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label={`Search ${tabLabels[activeTab].toLowerCase()}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: "grey.500" }} />,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
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
                  <MenuItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
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
                {priceRanges.map((price) => (
                  <MenuItem key={price} value={price}>
                    {price === "all" ? "All Prices" : price}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={handleClearFilters}
              fullWidth
              sx={{
                borderRadius: 2,
                height: "56px",
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Results Count */}
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3, fontWeight: "bold" }}>
          {filteredData.length} {tabLabels[activeTab]} Found
        </Typography>

        {/* Data Grid */}
        <Grid container spacing={4} alignItems="flex-start" justifyContent="center">
          {paginatedData.map((item) => (
            <Grid item xs={12} sm={6} md={6} lg={6} key={item._id}>
              <Card
                sx={{
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
                  height="200"
                  image={getImageUrl(item)}
                  alt={item.name}
                  sx={{ objectFit: "cover" }}
                  onError={(e) => {
                    console.error("Image failed to load:", getImageUrl(item))
                    e.target.src = "https://via.placeholder.com/400x200?text=Image+Not+Available"
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: "bold" }}>
                      {item.name}
                    </Typography>
                    <Chip
                      label={getPriceRange(item.priceRange)}
                      color="primary"
                      size="small"
                      sx={{ borderRadius: 2 }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {item.description}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <LocationOn sx={{ fontSize: 16, color: "grey.500", mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {getLocationString(item)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Rating
                      value={item.rating?.average || 0}
                      readOnly
                      size="small"
                      sx={{
                        "& .MuiRating-iconFilled": {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({item.rating?.count || 0} reviews)
                    </Typography>
                  </Box>

                  {activeTab === 2 && item.activities && item.activities.length > 0 && (
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <AccessTime sx={{ fontSize: 16, color: "grey.500", mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {item.activities[0].duration || "Varies"}
                      </Typography>
                    </Box>
                  )}

                  {activeTab === 2 && (
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Group sx={{ fontSize: 16, color: "grey.500", mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {item.visitorInfo?.maxCapacity
                          ? `${item.visitorInfo.maxCapacity} people max`
                          : "Various group sizes"}
                      </Typography>
                    </Box>
                  )}

                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      label={getCategory(item)}
                      size="small"
                      variant="outlined"
                      color="secondary"
                      sx={{ borderRadius: 2 }}
                    />
                  </Stack>

                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: "bold", textAlign: "left" }}>
                    Highlights:
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", justifyContent: "flex-start" }}>
                    {getHighlights(item)
                      .slice(0, 2)
                      .map((highlight, index) => (
                        <Chip
                          key={index}
                          label={highlight}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: 2, mb: 1 }}
                        />
                      ))}
                  </Stack>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <Button
                      variant="contained"
                      onClick={() => handleBookNow(item)}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: 2,
                        px: 4, // Added horizontal padding for smaller button
                        "&:hover": {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      Book Now
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}

        {/* No Results */}
        {filteredData.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No {tabLabels[activeTab].toLowerCase()} found matching your criteria
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search terms or filters
            </Typography>
          </Box>
        )}

        {/* Hotel Booking Modal */}
        {hotelBookingOpen && selectedItem && (
          <HotelBookingForm open={hotelBookingOpen} onClose={() => setHotelBookingOpen(false)} hotel={selectedItem} />
        )}

        {/* Restaurant Booking Modal */}
        {restaurantBookingOpen && selectedItem && (
          <RestaurantBookingForm
            open={restaurantBookingOpen}
            onClose={() => setRestaurantBookingOpen(false)}
            restaurant={selectedItem}
          />
        )}

        {/* Attraction Booking Modal */}
        {attractionBookingOpen && selectedItem && (
          <AttractionBookingForm
            open={attractionBookingOpen}
            onClose={() => setAttractionBookingOpen(false)}
            attraction={selectedItem}
          />
        )}
      </Container>
    </Box>
  )
}

export default Explore