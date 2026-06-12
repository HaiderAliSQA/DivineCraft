import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function testAuth() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error('MONGODB_URI not found');
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    const email = 'hafizhaideraliuet@gmail.com';
    const password = '123456789';
    
    console.log(`Checking email: "${email}"`);
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      isActive: true,
    });
    
    if (!user) {
      console.log('User not found by email/isActive');
      process.exit(1);
    }
    
    console.log(`User found: ID = ${user._id}, Email = ${user.email}, Role = ${user.role}, IsActive = ${user.isActive}`);
    console.log('Hashed Password in DB:', user.password);
    
    const isMatch = await user.comparePassword(password);
    console.log(`Password comparison with "${password}":`, isMatch);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

testAuth();
