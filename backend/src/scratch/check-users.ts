import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function checkUsers() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error('MONGODB_URI not found');
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    const users = await User.find({});
    console.log(`Total Users in DB: ${users.length}`);
    users.forEach(u => {
      console.log(`- ID: ${u._id} | Email: ${u.email} | Role: ${u.role} | Active: ${u.isActive}`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkUsers();
