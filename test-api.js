const fetch = require('node-fetch');

async function testAPI() {
  const baseURL = 'http://localhost:5000/api';
  
  try {
    console.log('🧪 Testing API Endpoints...\n');
    
    // Test hotels
    console.log('🏨 Testing Hotels:');
    const hotelsResponse = await fetch(`${baseURL}/products?category=hotel`);
    const hotels = await hotelsResponse.json();
    console.log(`Found ${hotels.length} hotels:`);
    hotels.forEach(hotel => console.log(`- ${hotel.name} (${hotel.category})`));
    
    console.log('\n🍽️ Testing Restaurants:');
    const restaurantsResponse = await fetch(`${baseURL}/products?category=restaurant`);
    const restaurants = await restaurantsResponse.json();
    console.log(`Found ${restaurants.length} restaurants:`);
    restaurants.forEach(restaurant => console.log(`- ${restaurant.name} (${restaurant.category})`));
    
    console.log('\n🎯 Testing Attractions:');
    const attractionsResponse = await fetch(`${baseURL}/products?category=attraction`);
    const attractions = await attractionsResponse.json();
    console.log(`Found ${attractions.length} attractions:`);
    attractions.forEach(attraction => console.log(`- ${attraction.name} (${attraction.category})`));
    
    console.log('\n✅ API Tests Completed!');
    
  } catch (error) {
    console.error('❌ API Test Error:', error.message);
  }
}

testAPI(); 