// backend/src/utils/productCache.ts
//
// Zero-dependency in-memory TTL cache for product API responses.
//
// How it works:
//   - Results are stored in a plain Map keyed by the full query string.
//   - Each entry has a timestamp; entries older than TTL_MS are treated as
//     expired and are evicted on the next read (lazy eviction).
//   - Admin mutations (create / update / delete) call invalidateProductCache()
//     to flush all entries immediately so fresh data is served right away.
//
// Why not a package like node-cache?
//   - Zero new dependencies.
//   - The product list is simple enough that a Map + timestamp is sufficient.
//   - Works perfectly on Render.com free tier (single process, in-memory).

const TTL_MS = 60_000; // Cache entries expire after 60 seconds

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const store = new Map<string, CacheEntry>();

/**
 * Returns the cached value for `key`, or `null` if the entry is missing
 * or has expired.
 */
export function getCached(key: string): unknown | null {
  const entry = store.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }

  return entry.data;
}

/**
 * Stores `data` under `key` with a TTL of 60 seconds.
 */
export function setCache(key: string, data: unknown): void {
  store.set(key, {
    data,
    expiresAt: Date.now() + TTL_MS,
  });
}

/**
 * Flushes all product cache entries.
 * Call this whenever a product is created, updated, or deleted so the next
 * request gets fresh data from MongoDB instead of stale cached data.
 */
export function invalidateProductCache(): void {
  store.clear();
}

/**
 * Returns the number of active (non-expired) entries currently in the cache.
 * Useful for health-check endpoints or debugging.
 */
export function getCacheSize(): number {
  const now = Date.now();
  let count = 0;
  for (const [key, entry] of store.entries()) {
    if (now <= entry.expiresAt) {
      count++;
    } else {
      store.delete(key); // Opportunistic cleanup while iterating
    }
  }
  return count;
}
