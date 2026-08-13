// frontend/src/utils/keepAlive.ts

/**
 * Silently pings the backend health endpoint on app startup AND every 13 minutes.
 *
 * Render.com free-tier servers spin down after ~15 minutes of inactivity,
 * causing the first real request to take 30–60 seconds (cold start).
 *
 * Strategy (two-layer approach):
 *  1. warmUpServer() — fires immediately on app load to wake the server ASAP.
 *  2. startKeepAlive() — pings every 13 min so the server never sleeps while
 *     a user is actively browsing the site.
 *
 * External tool (UptimeRobot, free) handles pings when NO user is on the site.
 *
 * Both functions are fire-and-forget. They never throw and never block rendering.
 */
const API_URL = (import.meta.env['VITE_API_URL'] as string) ?? 'http://localhost:5002';

// 13 minutes — safely under Render's 15-minute inactivity timeout
const KEEP_ALIVE_INTERVAL_MS = 13 * 60 * 1000;

let keepAliveTimer: ReturnType<typeof setInterval> | null = null;

/** Single silent ping to the health endpoint. */
function ping(): void {
  fetch(`${API_URL}/api/health`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-store',
    keepalive: true,
  }).catch(() => {
    // Swallow all errors — best-effort, not a critical path.
  });
}

/**
 * Fire an immediate warm-up ping on app startup.
 * Call this as early as possible (e.g. in main.tsx before React mounts).
 */
export function warmUpServer(): void {
  ping();
}

/**
 * Start a repeating keep-alive ping every 13 minutes.
 * Call this once after the app has mounted.
 * Safe to call multiple times — only one interval will ever run.
 */
export function startKeepAlive(): void {
  if (keepAliveTimer !== null) return; // already running
  keepAliveTimer = setInterval(ping, KEEP_ALIVE_INTERVAL_MS);
}

/**
 * Stop the keep-alive interval (e.g. when user logs out or tab goes hidden).
 */
export function stopKeepAlive(): void {
  if (keepAliveTimer !== null) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
}
