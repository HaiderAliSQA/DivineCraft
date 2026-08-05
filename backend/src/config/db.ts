// backend/src/config/db.ts
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,   // 30s to find a server
      socketTimeoutMS: 75000,            // 75s socket idle timeout
      connectTimeoutMS: 30000,           // 30s initial connection timeout
      heartbeatFrequencyMS: 10000,       // ping server every 10s to stay alive
      maxPoolSize: 10,                   // maintain up to 10 connections
      minPoolSize: 2,                    // keep at least 2 connections alive
      maxIdleTimeMS: 60000,              // close idle connections after 60s
      retryWrites: true,
      retryReads: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Drop the legacy/stale unique index "orderNumber_1" if it exists
    try {
      if (conn.connection.db) {
        const ordersCol = conn.connection.db.collection('orders');
        const indexes = await ordersCol.indexes();
        const hasOrderNumIndex = indexes.some((idx: any) => idx.name === 'orderNumber_1');
        if (hasOrderNumIndex) {
          console.log('🔄 Dropping stale unique orderNumber_1 index from orders collection...');
          await ordersCol.dropIndex('orderNumber_1');
          console.log('✅ Stale orderNumber_1 index dropped successfully!');
        }
      }
    } catch (idxError) {
      console.warn('⚠️ Stale index cleanup warning:', idxError);
    }

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    // Removed process.exit(1) to allow server to stay alive for debugging
  }
};

export default connectDB;
