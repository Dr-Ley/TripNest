const fetch = require('node-fetch');

// Test the backend API endpoints
async function testBackend() {
  const baseUrl = 'http://localhost:5000';
  
  console.log('Testing TripNest Backend API...\n');
  
  // Test 1: Check if server is running
  try {
    const response = await fetch(`${baseUrl}/`);
    const data = await response.json();
    console.log('✅ Server is running:', data.message);
  } catch (error) {
    console.log('❌ Server is not running:', error.message);
    return;
  }
  
  // Test 2: Test hotel booking endpoint
  try {
    const hotelBookingData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      checkIn: '2024-02-15',
      checkOut: '2024-02-17',
      guests: '2',
      roomType: 'Deluxe',
      specialRequests: 'High floor room',
      hotelName: 'Test Hotel',
      hotelLocation: 'Test City',
      bookingType: 'hotel',
      status: 'pending'
    };
    
    const response = await fetch(`${baseUrl}/api/bookings/hotel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hotelBookingData),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Hotel booking endpoint working:', result.message);
    } else {
      const error = await response.json();
      console.log('❌ Hotel booking endpoint failed:', error.message);
    }
  } catch (error) {
    console.log('❌ Hotel booking endpoint error:', error.message);
  }
  
  // Test 3: Test restaurant booking endpoint
  try {
    const restaurantBookingData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '+0987654321',
      guests: '4',
      reservationDate: '2024-02-20',
      reservationTime: '19:00',
      reservationType: 'Dinner',
      specialRequests: 'Window seat',
      restaurantName: 'Test Restaurant',
      restaurantLocation: 'Test City',
      bookingType: 'restaurant',
      status: 'pending'
    };
    
    const response = await fetch(`${baseUrl}/api/bookings/restaurant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(restaurantBookingData),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Restaurant booking endpoint working:', result.message);
    } else {
      const error = await response.json();
      console.log('❌ Restaurant booking endpoint failed:', error.message);
    }
  } catch (error) {
    console.log('❌ Restaurant booking endpoint error:', error.message);
  }
  
  // Test 4: Test attraction booking endpoint
  try {
    const attractionBookingData = {
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob@example.com',
      phone: '+1122334455',
      attraction: 'Test Attraction',
      date: '2024-02-25',
      time: '14:00',
      guests: '3',
      specialRequests: 'Guided tour',
      attractionName: 'Test Attraction',
      attractionLocation: 'Test City',
      bookingType: 'attraction',
      status: 'pending'
    };
    
    const response = await fetch(`${baseUrl}/api/bookings/attraction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attractionBookingData),
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Attraction booking endpoint working:', result.message);
    } else {
      const error = await response.json();
      console.log('❌ Attraction booking endpoint failed:', error.message);
    }
  } catch (error) {
    console.log('❌ Attraction booking endpoint error:', error.message);
  }
  
  console.log('\nBackend testing completed!');
}

// Run the test
testBackend().catch(console.error); 