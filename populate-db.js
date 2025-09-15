const mongoose = require('mongoose');
const Product = require('./models/Product');
const Hotel = require('./models/Hotel');
const Restaurant = require('./models/Restaurant');
const Attraction = require('./models/Attraction');

// Sample travel products data
const sampleProducts = [
  // HOTELS
  {
    name: 'Nest Resort & Spa',
    description: 'Luxury resort with stunning ocean views and world-class amenities.',
    price: 299,
    quantity: 50,
    category: 'hotel',
    image: '/images/nest-resort.jpeg',
    location: 'Bali, Indonesia',
    rating: 4.9
  },
  {
    name: 'Mountain View Lodge',
    description: 'Cozy mountain retreat with breathtaking alpine views.',
    price: 189,
    quantity: 30,
    category: 'hotel',
    image: '/images/mountain-view.jpeg',
    location: 'Swiss Alps',
    rating: 4.7
  },
  {
    name: 'Desert Oasis Hotel',
    description: 'Unique desert experience with traditional Moroccan hospitality.',
    price: 159,
    quantity: 25,
    category: 'hotel',
    image: '/images/sahara.jpeg',
    location: 'Sahara Desert, Morocco',
    rating: 4.6
  },
  {
    name: 'Bali Paradise Resort',
    description: 'Tropical paradise with lush gardens and pristine beaches.',
    price: 245,
    quantity: 40,
    category: 'hotel',
    image: '/images/bali.jpeg',
    location: 'Bali, Indonesia',
    rating: 4.8
  },
  {
    name: 'Swiss Alpine Retreat',
    description: 'Authentic Swiss mountain experience with panoramic alpine views.',
    price: 175,
    quantity: 35,
    category: 'hotel',
    image: '/images/swiss.jpeg',
    location: 'Swiss Alps, Switzerland',
    rating: 4.5
  },

  // RESTAURANTS
  {
    name: 'Sahara Spice Restaurant',
    description: 'Authentic Moroccan cuisine with traditional flavors and warm hospitality.',
    price: 45,
    quantity: 100,
    category: 'restaurant',
    image: '/images/sahara-spice.jpeg',
    location: 'Marrakech, Morocco',
    rating: 4.8
  },
  {
    name: 'Nest Fine Dining',
    description: 'Elegant dining experience with international cuisine and ocean views.',
    price: 75,
    quantity: 80,
    category: 'restaurant',
    image: '/images/nest-fine-dining.jpeg',
    location: 'Bali, Indonesia',
    rating: 4.9
  },
  {
    name: 'Mountain Bistro',
    description: 'Cozy alpine bistro serving traditional Swiss dishes and local wines.',
    price: 55,
    quantity: 60,
    category: 'restaurant',
    image: '/images/mountain-bistro.jpeg',
    location: 'Swiss Alps, Switzerland',
    rating: 4.6
  },
  {
    name: 'Coastal Grill',
    description: 'Fresh seafood and Mediterranean cuisine with stunning coastal views.',
    price: 65,
    quantity: 70,
    category: 'restaurant',
    image: '/images/coastal-grill.jpeg',
    location: 'Mediterranean Coast',
    rating: 4.7
  },

  // ATTRACTIONS
  {
    name: 'Bali Temple Tour',
    description: 'Discover the spiritual heart of Bali with visits to ancient temples.',
    price: 85,
    quantity: 40,
    category: 'attraction',
    image: '/images/bali-temple-tour.jpeg',
    location: 'Bali, Indonesia',
    rating: 4.7
  },
  {
    name: 'Tokyo Cultural Experience',
    description: 'Immerse yourself in Japanese culture with traditional tea ceremonies and temple visits.',
    price: 120,
    quantity: 35,
    category: 'attraction',
    image: '/images/tokyo-cultural-experience.jpeg',
    location: 'Tokyo, Japan',
    rating: 4.8
  },
  {
    name: 'Swiss Alps Hiking',
    description: 'Explore the breathtaking Swiss Alps with guided hiking tours.',
    price: 150,
    quantity: 25,
    category: 'attraction',
    image: '/images/swiss-alps-hiking.jpeg',
    location: 'Swiss Alps, Switzerland',
    rating: 4.6
  },
  {
    name: 'Paris Art History Tour',
    description: 'Discover the artistic heritage of Paris with visits to world-famous museums.',
    price: 95,
    quantity: 45,
    category: 'attraction',
    image: '/images/paris-art-history.jpeg',
    location: 'Paris, France',
    rating: 4.9
  },
  {
    name: 'Sahara Desert Adventure',
    description: 'Experience the magic of the Sahara Desert with camel treks and camping.',
    price: 180,
    quantity: 20,
    category: 'attraction',
    image: '/images/sahara.jpeg',
    location: 'Sahara Desert, Morocco',
    rating: 4.8
  },
  {
    name: 'Amazon Rainforest Expedition',
    description: 'Explore the diverse ecosystem of the Amazon with expert guides.',
    price: 220,
    quantity: 15,
    category: 'attraction',
    image: '/images/amazon-rainforest-expedition.jpeg',
    location: 'Amazon Rainforest, Brazil',
    rating: 4.7
  }
];

// Sample hotels data
const sampleHotels = [
  {
    name: 'Nest Resort & Spa',
    description: 'Luxury resort with stunning ocean views and world-class amenities including infinity pools, spa services, and fine dining.',
    location: {
      address: 'Jl. Raya Uluwatu No. 1',
      city: 'Bali',
      country: 'Indonesia',
      coordinates: { latitude: -8.7832, longitude: 115.1349 }
    },
    images: [
      { url: '/images/nest-resort.jpeg', alt: 'Nest Resort & Spa', isFeatured: true },
      { url: '/images/bali.jpeg', alt: 'Bali Paradise', isFeatured: false }
    ],
    rating: { average: 4.9, count: 156 },
    amenities: [
      { name: 'Infinity Pool', icon: 'pool', isAvailable: true },
      { name: 'Spa Services', icon: 'spa', isAvailable: true },
      { name: 'Fine Dining', icon: 'restaurant', isAvailable: true },
      { name: 'Free WiFi', icon: 'wifi', isAvailable: true },
      { name: 'Beach Access', icon: 'beach', isAvailable: true }
    ],
    roomTypes: [
      {
        name: 'Deluxe Ocean View',
        description: 'Spacious room with stunning ocean views',
        price: 299,
        capacity: 2,
        availableRooms: 15,
        images: ['/images/nest-resort.jpeg']
      },
      {
        name: 'Villa with Private Pool',
        description: 'Luxury villa with private infinity pool',
        price: 599,
        capacity: 4,
        availableRooms: 8,
        images: ['/images/bali.jpeg']
      }
    ],
    priceRange: { min: 299, max: 599, currency: 'USD' },
    contact: {
      phone: '+62-361-123456',
      email: 'info@nestresort.com',
      website: 'https://nestresort.com'
    },
    policies: {
      checkIn: '3:00 PM',
      checkOut: '11:00 AM',
      cancellation: 'Free cancellation up to 24 hours before check-in',
      pets: false
    },
    isPopular: true
  },
  {
    name: 'Mountain View Lodge',
    description: 'Cozy mountain retreat with breathtaking alpine views, perfect for nature lovers and adventure seekers.',
    location: {
      address: 'Alpenstrasse 123',
      city: 'Zermatt',
      country: 'Switzerland',
      coordinates: { latitude: 46.0207, longitude: 7.7491 }
    },
    images: [
      { url: '/images/mountain-view.jpeg', alt: 'Mountain View Lodge', isFeatured: true },
      { url: '/images/swiss.jpeg', alt: 'Swiss Alps', isFeatured: false }
    ],
    rating: { average: 4.7, count: 89 },
    amenities: [
      { name: 'Mountain Views', icon: 'mountain', isAvailable: true },
      { name: 'Hiking Trails', icon: 'hiking', isAvailable: true },
      { name: 'Ski Storage', icon: 'ski', isAvailable: true },
      { name: 'Restaurant', icon: 'restaurant', isAvailable: true },
      { name: 'Free WiFi', icon: 'wifi', isAvailable: true }
    ],
    roomTypes: [
      {
        name: 'Alpine Suite',
        description: 'Spacious suite with panoramic mountain views',
        price: 189,
        capacity: 2,
        availableRooms: 12,
        images: ['/images/mountain-view.jpeg']
      },
      {
        name: 'Family Room',
        description: 'Large room perfect for families',
        price: 249,
        capacity: 4,
        availableRooms: 6,
        images: ['/images/swiss.jpeg']
      }
    ],
    priceRange: { min: 189, max: 249, currency: 'USD' },
    contact: {
      phone: '+41-27-123456',
      email: 'info@mountainviewlodge.ch',
      website: 'https://mountainviewlodge.ch'
    },
    policies: {
      checkIn: '2:00 PM',
      checkOut: '10:00 AM',
      cancellation: 'Free cancellation up to 48 hours before check-in',
      pets: true
    },
    isPopular: true
  },
  {
    name: 'Desert Oasis Hotel',
    description: 'Unique desert experience with traditional Moroccan hospitality, featuring authentic architecture and cultural experiences.',
    location: {
      address: 'Route de Fès',
      city: 'Marrakech',
      country: 'Morocco',
      coordinates: { latitude: 31.6295, longitude: -7.9811 }
    },
    images: [
      { url: '/images/sahara.jpeg', alt: 'Desert Oasis Hotel', isFeatured: true }
    ],
    rating: { average: 4.6, count: 124 },
    amenities: [
      { name: 'Desert Tours', icon: 'camel', isAvailable: true },
      { name: 'Traditional Spa', icon: 'spa', isAvailable: true },
      { name: 'Moroccan Restaurant', icon: 'restaurant', isAvailable: true },
      { name: 'Garden', icon: 'garden', isAvailable: true },
      { name: 'Free WiFi', icon: 'wifi', isAvailable: true }
    ],
    roomTypes: [
      {
        name: 'Desert View Room',
        description: 'Room with stunning desert views',
        price: 159,
        capacity: 2,
        availableRooms: 20,
        images: ['/images/sahara.jpeg']
      },
      {
        name: 'Riad Suite',
        description: 'Traditional Moroccan suite with courtyard',
        price: 259,
        capacity: 3,
        availableRooms: 8,
        images: ['/images/sahara.jpeg']
      }
    ],
    priceRange: { min: 159, max: 259, currency: 'USD' },
    contact: {
      phone: '+212-524-123456',
      email: 'info@desertoasis.com',
      website: 'https://desertoasis.com'
    },
    policies: {
      checkIn: '3:00 PM',
      checkOut: '11:00 AM',
      cancellation: 'Free cancellation up to 24 hours before check-in',
      pets: false
    },
    isPopular: false
  }
];

// Sample restaurants data
const sampleRestaurants = [
  {
    name: 'Sahara Spice Restaurant',
    description: 'Authentic Moroccan cuisine with traditional flavors and warm hospitality in a beautiful desert setting.',
    location: {
      address: 'Rue des Épices 45',
      city: 'Marrakech',
      country: 'Morocco',
      coordinates: { latitude: 31.6295, longitude: -7.9811 }
    },
    images: [
      { url: '/images/sahara-spice.jpeg', alt: 'Sahara Spice Restaurant', isFeatured: true }
    ],
    cuisine: ['Moroccan', 'Mediterranean', 'Traditional'],
    rating: { average: 4.8, count: 203 },
    priceRange: { min: 25, max: 65, currency: 'USD' },
    openingHours: {
      monday: { open: '12:00', close: '23:00' },
      tuesday: { open: '12:00', close: '23:00' },
      wednesday: { open: '12:00', close: '23:00' },
      thursday: { open: '12:00', close: '23:00' },
      friday: { open: '12:00', close: '00:00' },
      saturday: { open: '12:00', close: '00:00' },
      sunday: { open: '12:00', close: '22:00' }
    },
    amenities: [
      { name: 'Outdoor Seating', icon: 'outdoor', isAvailable: true },
      { name: 'Live Music', icon: 'music', isAvailable: true },
      { name: 'Vegetarian Options', icon: 'vegetarian', isAvailable: true },
      { name: 'Reservations', icon: 'reservation', isAvailable: true }
    ],
    menu: [
      {
        name: 'Tagine de Poulet',
        description: 'Traditional chicken tagine with preserved lemons and olives',
        price: 18,
        category: 'Main Course',
        isVegetarian: false,
        isVegan: false,
        allergens: ['nuts']
      },
      {
        name: 'Couscous Royal',
        description: 'Steamed couscous with vegetables and lamb',
        price: 22,
        category: 'Main Course',
        isVegetarian: false,
        isVegan: false,
        allergens: ['gluten']
      }
    ],
    reservationTypes: [
      {
        name: 'Standard Table',
        description: 'Regular table reservation',
        price: 0,
        maxGuests: 6
      },
      {
        name: 'Private Dining',
        description: 'Private room for special occasions',
        price: 50,
        maxGuests: 12
      }
    ],
    contact: {
      phone: '+212-524-123456',
      email: 'info@saharaspice.com',
      website: 'https://saharaspice.com'
    },
    isPopular: true
  },
  {
    name: 'Nest Fine Dining',
    description: 'Elegant dining experience with international cuisine and stunning ocean views in a luxurious setting.',
    location: {
      address: 'Jl. Raya Uluwatu No. 1',
      city: 'Bali',
      country: 'Indonesia',
      coordinates: { latitude: -8.7832, longitude: 115.1349 }
    },
    images: [
      { url: '/images/nest-fine-dining.jpeg', alt: 'Nest Fine Dining', isFeatured: true }
    ],
    cuisine: ['International', 'Asian Fusion', 'Seafood'],
    rating: { average: 4.9, count: 167 },
    priceRange: { min: 45, max: 120, currency: 'USD' },
    openingHours: {
      monday: { open: '18:00', close: '23:00' },
      tuesday: { open: '18:00', close: '23:00' },
      wednesday: { open: '18:00', close: '23:00' },
      thursday: { open: '18:00', close: '23:00' },
      friday: { open: '18:00', close: '00:00' },
      saturday: { open: '18:00', close: '00:00' },
      sunday: { open: '18:00', close: '22:00' }
    },
    amenities: [
      { name: 'Ocean Views', icon: 'ocean', isAvailable: true },
      { name: 'Wine Pairing', icon: 'wine', isAvailable: true },
      { name: 'Chef\'s Table', icon: 'chef', isAvailable: true },
      { name: 'Valet Parking', icon: 'parking', isAvailable: true }
    ],
    menu: [
      {
        name: 'Lobster Thermidor',
        description: 'Fresh lobster prepared in classic French style',
        price: 45,
        category: 'Main Course',
        isVegetarian: false,
        isVegan: false,
        allergens: ['shellfish', 'dairy']
      },
      {
        name: 'Wagyu Beef Tenderloin',
        description: 'Premium Japanese Wagyu beef with truffle sauce',
        price: 85,
        category: 'Main Course',
        isVegetarian: false,
        isVegan: false,
        allergens: ['dairy']
      }
    ],
    reservationTypes: [
      {
        name: 'Standard Reservation',
        description: 'Regular table reservation',
        price: 0,
        maxGuests: 8
      },
      {
        name: 'Chef\'s Table Experience',
        description: 'Exclusive chef\'s table with wine pairing',
        price: 150,
        maxGuests: 6
      }
    ],
    contact: {
      phone: '+62-361-123456',
      email: 'dining@nestresort.com',
      website: 'https://nestresort.com/dining'
    },
    isPopular: true
  },
  {
    name: 'Mountain Bistro',
    description: 'Cozy alpine bistro serving traditional Swiss dishes and local wines in a warm, rustic atmosphere.',
    location: {
      address: 'Alpenstrasse 123',
      city: 'Zermatt',
      country: 'Switzerland',
      coordinates: { latitude: 46.0207, longitude: 7.7491 }
    },
    images: [
      { url: '/images/mountain-bistro.jpeg', alt: 'Mountain Bistro', isFeatured: true }
    ],
    cuisine: ['Swiss', 'Alpine', 'European'],
    rating: { average: 4.6, count: 98 },
    priceRange: { min: 35, max: 75, currency: 'USD' },
    openingHours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '22:00' },
      friday: { open: '11:00', close: '23:00' },
      saturday: { open: '11:00', close: '23:00' },
      sunday: { open: '11:00', close: '21:00' }
    },
    amenities: [
      { name: 'Mountain Views', icon: 'mountain', isAvailable: true },
      { name: 'Local Wines', icon: 'wine', isAvailable: true },
      { name: 'Fireplace', icon: 'fireplace', isAvailable: true },
      { name: 'Outdoor Terrace', icon: 'terrace', isAvailable: true }
    ],
    menu: [
      {
        name: 'Fondue Suisse',
        description: 'Traditional Swiss cheese fondue with bread and vegetables',
        price: 28,
        category: 'Main Course',
        isVegetarian: true,
        isVegan: false,
        allergens: ['dairy', 'gluten']
      },
      {
        name: 'Rösti with Bratwurst',
        description: 'Swiss potato rösti with traditional sausage',
        price: 32,
        category: 'Main Course',
        isVegetarian: false,
        isVegan: false,
        allergens: ['gluten']
      }
    ],
    reservationTypes: [
      {
        name: 'Standard Table',
        description: 'Regular table reservation',
        price: 0,
        maxGuests: 6
      },
      {
        name: 'Private Dining Room',
        description: 'Private room for groups',
        price: 30,
        maxGuests: 12
      }
    ],
    contact: {
      phone: '+41-27-123456',
      email: 'info@mountainbistro.ch',
      website: 'https://mountainbistro.ch'
    },
    isPopular: false
  }
];

// Sample attractions data
const sampleAttractions = [
  {
    name: 'Bali Temple Tour',
    description: 'Discover the spiritual heart of Bali with visits to ancient temples, including the iconic Tanah Lot and Uluwatu temples.',
    location: {
      address: 'Various locations across Bali',
      city: 'Bali',
      country: 'Indonesia',
      coordinates: { latitude: -8.7832, longitude: 115.1349 }
    },
    images: [
      { url: '/images/bali-temple-tour.jpeg', alt: 'Bali Temple Tour', isFeatured: true }
    ],
    category: 'Cultural',
    rating: { average: 4.7, count: 234 },
    priceRange: { min: 65, max: 105, currency: 'USD' },
    openingHours: {
      monday: { open: '08:00', close: '18:00', isOpen: true },
      tuesday: { open: '08:00', close: '18:00', isOpen: true },
      wednesday: { open: '08:00', close: '18:00', isOpen: true },
      thursday: { open: '08:00', close: '18:00', isOpen: true },
      friday: { open: '08:00', close: '18:00', isOpen: true },
      saturday: { open: '08:00', close: '18:00', isOpen: true },
      sunday: { open: '08:00', close: '18:00', isOpen: true }
    },
    activities: [
      {
        name: 'Tanah Lot Temple Visit',
        description: 'Visit the iconic sea temple perched on a rock formation',
        duration: '2 hours',
        difficulty: 'Easy',
        ageRestriction: 'All ages'
      },
      {
        name: 'Uluwatu Temple Sunset',
        description: 'Experience the magical sunset at Uluwatu temple',
        duration: '3 hours',
        difficulty: 'Easy',
        ageRestriction: 'All ages'
      },
      {
        name: 'Traditional Dance Performance',
        description: 'Watch traditional Balinese dance performances',
        duration: '1 hour',
        difficulty: 'Easy',
        ageRestriction: 'All ages'
      }
    ],
    amenities: [
      { name: 'Guided Tours', icon: 'guide', isAvailable: true },
      { name: 'Transportation', icon: 'transport', isAvailable: true },
      { name: 'Refreshments', icon: 'drinks', isAvailable: true },
      { name: 'Restrooms', icon: 'restroom', isAvailable: true }
    ],
    visitorInfo: {
      maxCapacity: 50,
      recommendedDuration: '6-8 hours',
      bestTimeToVisit: ['Early morning', 'Late afternoon'],
      accessibility: ['Wheelchair accessible', 'Assistance available'],
      parking: true,
      foodAvailable: true
    },
    contact: {
      phone: '+62-361-123456',
      email: 'tours@balitemple.com',
      website: 'https://balitemple.com'
    },
    isPopular: true
  },
  {
    name: 'Swiss Alps Hiking',
    description: 'Explore the breathtaking Swiss Alps with guided hiking tours through pristine alpine landscapes.',
    location: {
      address: 'Various trails in Swiss Alps',
      city: 'Zermatt',
      country: 'Switzerland',
      coordinates: { latitude: 46.0207, longitude: 7.7491 }
    },
    images: [
      { url: '/images/swiss-alps-hiking.jpeg', alt: 'Swiss Alps Hiking', isFeatured: true }
    ],
    category: 'Adventure',
    rating: { average: 4.6, count: 156 },
    priceRange: { min: 120, max: 180, currency: 'USD' },
    openingHours: {
      monday: { open: '07:00', close: '17:00', isOpen: true },
      tuesday: { open: '07:00', close: '17:00', isOpen: true },
      wednesday: { open: '07:00', close: '17:00', isOpen: true },
      thursday: { open: '07:00', close: '17:00', isOpen: true },
      friday: { open: '07:00', close: '17:00', isOpen: true },
      saturday: { open: '07:00', close: '17:00', isOpen: true },
      sunday: { open: '07:00', close: '17:00', isOpen: true }
    },
    activities: [
      {
        name: 'Alpine Meadow Hike',
        description: 'Gentle hike through beautiful alpine meadows',
        duration: '4 hours',
        difficulty: 'Easy',
        ageRestriction: '8+ years'
      },
      {
        name: 'Mountain Peak Ascent',
        description: 'Challenging hike to mountain peaks',
        duration: '8 hours',
        difficulty: 'Hard',
        ageRestriction: '16+ years'
      },
      {
        name: 'Glacier Walk',
        description: 'Guided walk on ancient glaciers',
        duration: '6 hours',
        difficulty: 'Moderate',
        ageRestriction: '12+ years'
      }
    ],
    amenities: [
      { name: 'Expert Guides', icon: 'guide', isAvailable: true },
      { name: 'Safety Equipment', icon: 'safety', isAvailable: true },
      { name: 'Mountain Huts', icon: 'hut', isAvailable: true },
      { name: 'First Aid', icon: 'firstaid', isAvailable: true }
    ],
    visitorInfo: {
      maxCapacity: 20,
      recommendedDuration: '6-8 hours',
      bestTimeToVisit: ['June to September'],
      accessibility: ['Physical fitness required'],
      parking: true,
      foodAvailable: true
    },
    contact: {
      phone: '+41-27-123456',
      email: 'hiking@swissalps.com',
      website: 'https://swissalps.com'
    },
    isPopular: true
  },
  {
    name: 'Sahara Desert Adventure',
    description: 'Experience the magic of the Sahara Desert with camel treks, camping under the stars, and traditional Berber hospitality.',
    location: {
      address: 'Sahara Desert',
      city: 'Merzouga',
      country: 'Morocco',
      coordinates: { latitude: 31.6295, longitude: -7.9811 }
    },
    images: [
      { url: '/images/sahara.jpeg', alt: 'Sahara Desert Adventure', isFeatured: true }
    ],
    category: 'Adventure',
    rating: { average: 4.8, count: 189 },
    priceRange: { min: 150, max: 220, currency: 'USD' },
    openingHours: {
      monday: { open: '06:00', close: '22:00', isOpen: true },
      tuesday: { open: '06:00', close: '22:00', isOpen: true },
      wednesday: { open: '06:00', close: '22:00', isOpen: true },
      thursday: { open: '06:00', close: '22:00', isOpen: true },
      friday: { open: '06:00', close: '22:00', isOpen: true },
      saturday: { open: '06:00', close: '22:00', isOpen: true },
      sunday: { open: '06:00', close: '22:00', isOpen: true }
    },
    activities: [
      {
        name: 'Camel Trek',
        description: 'Traditional camel ride through the desert dunes',
        duration: '3 hours',
        difficulty: 'Easy',
        ageRestriction: 'All ages'
      },
      {
        name: 'Desert Camping',
        description: 'Overnight camping under the stars',
        duration: '12 hours',
        difficulty: 'Easy',
        ageRestriction: 'All ages'
      },
      {
        name: 'Sandboarding',
        description: 'Surf down the massive sand dunes',
        duration: '2 hours',
        difficulty: 'Moderate',
        ageRestriction: '8+ years'
      }
    ],
    amenities: [
      { name: 'Camel Rides', icon: 'camel', isAvailable: true },
      { name: 'Desert Camp', icon: 'camp', isAvailable: true },
      { name: 'Traditional Meals', icon: 'food', isAvailable: true },
      { name: 'Stargazing', icon: 'stars', isAvailable: true }
    ],
    visitorInfo: {
      maxCapacity: 30,
      recommendedDuration: '24 hours',
      bestTimeToVisit: ['October to April'],
      accessibility: ['Basic fitness required'],
      parking: true,
      foodAvailable: true
    },
    contact: {
      phone: '+212-524-123456',
      email: 'adventure@sahara.com',
      website: 'https://sahara.com'
    },
    isPopular: true
  }
];

async function populateDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/tripnest');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await Hotel.deleteMany({});
    await Restaurant.deleteMany({});
    await Attraction.deleteMany({});
    console.log('✅ Cleared existing data');

    // Insert sample data
    const products = await Product.insertMany(sampleProducts);
    const hotels = await Hotel.insertMany(sampleHotels);
    const restaurants = await Restaurant.insertMany(sampleRestaurants);
    const attractions = await Attraction.insertMany(sampleAttractions);

    console.log(`✅ Inserted ${products.length} products`);
    console.log(`✅ Inserted ${hotels.length} hotels`);
    console.log(`✅ Inserted ${restaurants.length} restaurants`);
    console.log(`✅ Inserted ${attractions.length} attractions`);

    // Display summary
    console.log('\n📋 Database Summary:');
    console.log(`- Products: ${products.length} items`);
    console.log(`- Hotels: ${hotels.length} properties`);
    console.log(`- Restaurants: ${restaurants.length} dining venues`);
    console.log(`- Attractions: ${attractions.length} experiences`);

    console.log('\n🎉 Database populated successfully!');
    console.log('🚀 You can now start your server and test the application.');

  } catch (error) {
    console.error('❌ Error populating database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run the population script
populateDatabase(); 