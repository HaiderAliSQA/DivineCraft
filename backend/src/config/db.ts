// backend/src/config/db.ts
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      // ── Atlas M0 (free tier) optimized settings ──────────────────────────
      // Atlas free tier aggressively closes idle connections ~30s.
      // These settings keep the connection alive without wasting resources.

      serverSelectionTimeoutMS: 30000,  // 30s to find a primary node
      connectTimeoutMS: 20000,          // 20s max for initial TCP handshake
      socketTimeoutMS: 45000,           // 45s before a stalled query times out

      // Heartbeat every 7s — keeps connection alive on Atlas M0
      // (well under the ~30s idle cut-off Atlas enforces)
      heartbeatFrequencyMS: 7000,

      // Pool: 1 min so Atlas doesn't kill "extra" idle sockets,
      // max 5 so we don't exhaust M0's 500-connection limit
      maxPoolSize: 5,
      minPoolSize: 1,

      // Retire idle connections after 25s (just under Atlas's ~30s limit)
      maxIdleTimeMS: 25000,

      // Force IPv4 — avoids DNS resolution issues on Render.com
      family: 4,

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

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    // Removed process.exit(1) to allow server to stay alive for debugging
  }
};

// ── Connection event listeners ────────────────────────────────────────────────
// Registered ONCE at module level (not inside connectDB) so they never
// stack up even if connectDB is called more than once.
//
// Atlas M0 free tier does rapid pool-socket rotations that fire
// 'disconnected' + 'reconnected' in quick succession — this is normal
// pool housekeeping, NOT a real outage.  We use a short debounce so only
// genuine disconnects (lasting > 3 s) print a warning to the console.

let disconnectTimer: ReturnType<typeof setTimeout> | null = null;

mongoose.connection.on('disconnected', () => {
  // Wait 3 s — if reconnected before then, stay silent (it was just pool churn)
  disconnectTimer = setTimeout(() => {
    console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
  }, 3000);
});

mongoose.connection.on('reconnected', () => {
  // Cancel the pending disconnect warning — reconnect was fast (pool rotation)
  if (disconnectTimer) {
    clearTimeout(disconnectTimer);
    disconnectTimer = null;
  }
  // Only log if it was a real outage (timer had already fired)
  // We keep this silent for normal pool cycling.
});

mongoose.connection.on('error', (err) => {
  // Always log genuine driver-level errors
  console.error('❌ MongoDB error:', err.message);
});

export default connectDB;
