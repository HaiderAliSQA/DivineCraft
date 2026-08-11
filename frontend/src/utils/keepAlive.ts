// frontend/src/utils/keepAlive.ts

/**
 * Silently pings the backend health endpoint on app startup.
 *
 * Render.com free-tier servers spin down after ~15 minutes of inactivity,
 * causing the first real request to take 30–60 seconds (cold start).
 * Firing this ping as early as possible — before the user interacts —
 * warms the server up so it is ready by the time the product list loads.
 *
 * This function is intentionally fire-and-forget. It never throws and never
 * blocks rendering.
 */
const API_URL = (import.meta.env['VITE_API_URL'] as string) ?? 'http://localhost:5002';

export function warmUpServer(): void {
  const url = `${API_URL}/api/health`;

  // Use keepalive:true so the request survives if the page navigates immediately.
  fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-store',
    keepalive: true,
  }).catch(() => {
    // Swallow all errors — this is a best-effort warm-up, not a critical path.
  });
}
