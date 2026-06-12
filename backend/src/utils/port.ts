// backend/src/utils/port.ts
import net from 'net';
import fs from 'fs';
import path from 'path';

const FORBIDDEN_PORTS = [500, 5413, 3000];

/**
 * Checks if a port is available on all interfaces (0.0.0.0).
 */
export function isPortAvailable(port: number): Promise<boolean> {
  if (FORBIDDEN_PORTS.includes(port)) {
    return Promise.resolve(false);
  }
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => {
      resolve(false);
    });
    server.once('listening', () => {
      server.close(() => {
        resolve(true);
      });
    });
    server.listen(port, '0.0.0.0');
  });
}

/**
 * Finds a free port starting from startPort (defaulting to 5001).
 * If the startPort is in use or forbidden, it increments the port number until a free one is found.
 */
export async function findFreePort(startPort: number): Promise<number> {
  let port = startPort;
  while (true) {
    if (await isPortAvailable(port)) {
      return port;
    }
    port++;
    if (port > 65535) {
      throw new Error('No free ports available in range 1-65535.');
    }
  }
}

/**
 * Updates frontend/.env file with the actual port the backend is running on.
 */
export function updateFrontendEnv(port: number): void {
  try {
    // Resolve frontend/.env relative to process.cwd() or __dirname
    let frontendEnvPath = path.resolve(process.cwd(), '../frontend/.env');
    
    if (!fs.existsSync(frontendEnvPath)) {
      const fallbackPath = path.resolve(__dirname, '../../../../frontend/.env');
      if (!fs.existsSync(fallbackPath)) {
        console.warn(`⚠️ Could not find frontend/.env at ${frontendEnvPath} or ${fallbackPath}`);
        return;
      }
      frontendEnvPath = fallbackPath;
    }
    
    let content = '';
    if (fs.existsSync(frontendEnvPath)) {
      content = fs.readFileSync(frontendEnvPath, 'utf8');
    }
    
    const targetLine = `VITE_API_URL=http://localhost:${port}`;
    
    if (content.includes('VITE_API_URL=')) {
      content = content.replace(/VITE_API_URL=.*/, targetLine);
    } else {
      content = content.trim() + `\n${targetLine}\n`;
    }
    
    fs.writeFileSync(frontendEnvPath, content, 'utf8');
    console.log(`✅ Dynamically updated frontend/.env: VITE_API_URL=http://localhost:${port}`);
  } catch (error) {
    console.error('⚠️ Failed to update frontend/.env file:', error);
  }
}
