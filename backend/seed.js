
import { Item } from './src/models/item.models.js';
import dotenv from 'dotenv';
import { connectDB } from './src/db/index.js';

dotenv.config({ path: './.env' });

const sampleItems = [
  { name: 'Wireless Headphones', price: 99.99, category: 'Electronics' },
  { name: 'Laptop Stand', price: 49.99, category: 'Electronics' },
  { name: 'Coffee Maker', price: 79.99, category: 'Appliances' },
  { name: 'Running Shoes', price: 129.99, category: 'Sports' },
  { name: 'Yoga Mat', price: 29.99, category: 'Sports' },
  { name: 'Bluetooth Speaker', price: 59.99, category: 'Electronics' },
  { name: 'Desk Lamp', price: 39.99, category: 'Furniture' },
  { name: 'Water Bottle', price: 19.99, category: 'Sports' },
  { name: 'Phone Case', price: 24.99, category: 'Electronics' },
  { name: 'Notebook Set', price: 14.99, category: 'Office' },
  { name: 'Backpack', price: 89.99, category: 'Fashion' },
  { name: 'Watch', price: 199.99, category: 'Fashion' }
];


const seedItems = async () => {
  try {
    await connectDB();
    
    // Clear existing items
    await Item.deleteMany({});
    console.log('Cleared existing items');
    
    // Insert sample items
    await Item.insertMany(sampleItems);
    console.log('Added sample items to database');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedItems();
