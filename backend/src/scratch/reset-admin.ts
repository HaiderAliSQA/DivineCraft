import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from '../models/User';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function resetAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error('MONGODB_URI not found');
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    const email = (process.env.ADMIN_EMAIL || 'haider.sqa98@gmail.com').toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || '123456789';
    
    console.log(`Setting up admin with email: "${email}"`);
    
    let user = await User.findOne({ email });
    if (!user) {
      console.log(`User ${email} not found. Creating user...`);
      user = new User({
        email,
        password,
        role: 'superadmin',
        isActive: true
      });
      await user.save();
      console.log(`Admin user created with email: ${email} and password: ${password}`);
    } else {
      console.log(`User ${email} found. Checking password...`);
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        console.log(`Password is already correct for ${email}`);
      } else {
        console.log(`Password incorrect for ${email}. Updating...`);
        user.password = password;
        await user.save();
        console.log(`Password updated successfully for ${email}`);
      }
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

resetAdmin();
