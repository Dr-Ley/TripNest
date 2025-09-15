const mongoose = require('mongoose');
const Product = require('./models/Product');

async function checkDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/tripnest');
    console.log('✅ Connected to MongoDB');

    const products = await Product.find({});
    console.log(`\n📋 Current Database Content (${products.length} products):`);
    
    const categories = {};
    products.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = [];
      }
      categories[product.category].push(product);
      console.log(`- ${product.name} (${product.category}): ${product.image}`);
    });

    console.log('\n📊 Summary by Category:');
    Object.keys(categories).forEach(category => {
      console.log(`- ${category}: ${categories[category].length} items`);
    });

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

checkDatabase();
