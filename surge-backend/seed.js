import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from './models/Product.js';

dotenv.config();

const products = [
  {
    name: 'SURGE Protein Bar — Chocolate Blast',
    description: 'Rich dark chocolate layered with crunchy peanuts. 20g plant protein, zero guilt.',
    price: 199,
    protein: 20,
    stock: 150,
    imageUrl: 'https://via.placeholder.com/300x300?text=Chocolate+Blast',
    category: 'protein',
  },
  {
    name: 'SURGE Protein Bar — Vanilla Crunch',
    description: 'Smooth vanilla bean coating with crispy rice puffs. The perfect post-workout refuel.',
    price: 199,
    protein: 20,
    stock: 120,
    imageUrl: 'https://via.placeholder.com/300x300?text=Vanilla+Crunch',
    category: 'protein',
  },
  {
    name: 'SURGE Protein Bar — Peanut Butter Fury',
    description: 'Loaded with real peanut butter and topped with roasted nuts. Protein that tastes like a cheat meal.',
    price: 219,
    protein: 22,
    stock: 100,
    imageUrl: 'https://via.placeholder.com/300x300?text=Peanut+Butter+Fury',
    category: 'protein',
  },
  {
    name: 'SURGE Protein Bar — Mango Tango',
    description: 'Tropical mango flavor with a tangy twist. A refreshing protein hit for summer days.',
    price: 189,
    protein: 18,
    stock: 80,
    imageUrl: 'https://via.placeholder.com/300x300?text=Mango+Tango',
    category: 'protein',
  },
  {
    name: 'SURGE Whey Protein — Double Chocolate',
    description: '25g premium whey isolate per scoop. Ultra-smooth mix, zero clumps. 30 servings.',
    price: 1499,
    protein: 25,
    stock: 60,
    imageUrl: 'https://via.placeholder.com/300x300?text=Whey+Double+Choco',
    category: 'protein',
  },
  {
    name: 'SURGE Whey Protein — Belgian Vanilla',
    description: 'Clean vanilla flavor with 24g protein per serving. Mixes instantly with water or milk.',
    price: 1499,
    protein: 24,
    stock: 55,
    imageUrl: 'https://via.placeholder.com/300x300?text=Whey+Vanilla',
    category: 'protein',
  },
  {
    name: 'SURGE Protein Chips — Spicy Sriracha',
    description: 'Baked, not fried. 15g protein per bag with a spicy kick that keeps you coming back.',
    price: 149,
    protein: 15,
    stock: 200,
    imageUrl: 'https://via.placeholder.com/300x300?text=Sriracha+Chips',
    category: 'protein',
  },
  {
    name: 'SURGE Protein Chips — Cream & Onion',
    description: 'Classic cream & onion reimagined with 15g of plant protein. Crunch without compromise.',
    price: 149,
    protein: 15,
    stock: 180,
    imageUrl: 'https://via.placeholder.com/300x300?text=Cream+Onion+Chips',
    category: 'protein',
  },
  {
    name: 'SURGE Protein Cookie — Choco Chip',
    description: 'Soft-baked cookie packed with 12g protein and real chocolate chips. Snack smart.',
    price: 99,
    protein: 12,
    stock: 200,
    imageUrl: 'https://via.placeholder.com/300x300?text=Choco+Chip+Cookie',
    category: 'protein',
  },
  {
    name: 'SURGE Protein Shake — Coffee Mocha',
    description: 'Grab-and-go RTD shake with 30g protein and real cold-brew coffee. Fuel your mornings.',
    price: 249,
    protein: 30,
    stock: 90,
    imageUrl: 'https://via.placeholder.com/300x300?text=Coffee+Mocha+Shake',
    category: 'protein',
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await Product.deleteMany({});
    console.log('Database cleared — existing products removed.');

    await Product.insertMany(products);
    console.log(`✅ ${products.length} products seeded successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();
