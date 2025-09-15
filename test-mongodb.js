const mongoose = require('mongoose');

async function testMongoDB() {
  console.log('Testing MongoDB connection...\n');
  
  try {
    // Try to connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/tripnest');
    console.log('✅ MongoDB connected successfully!');
    
    // Test if we can create a simple document
    const testSchema = new mongoose.Schema({ name: String, date: { type: Date, default: Date.now } });
    const TestModel = mongoose.model('Test', testSchema);
    
    const testDoc = new TestModel({ name: 'Test Connection' });
    await testDoc.save();
    console.log('✅ Database write test successful!');
    
    // Clean up test document
    await TestModel.deleteOne({ name: 'Test Connection' });
    console.log('✅ Database cleanup successful!');
    
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected successfully!');
    
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
    console.log('\nPossible solutions:');
    console.log('1. Make sure MongoDB is running on your system');
    console.log('2. Install MongoDB if not already installed');
    console.log('3. Start MongoDB service');
    console.log('\nOn Windows:');
    console.log('   - Check Services app for "MongoDB" service');
    console.log('   - Or run: net start MongoDB');
    console.log('\nOn Mac/Linux:');
    console.log('   - Run: sudo systemctl start mongod');
    console.log('   - Or: brew services start mongodb-community');
  }
}

testMongoDB(); 