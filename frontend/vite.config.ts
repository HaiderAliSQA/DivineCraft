// frontend/vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load env file from the current directory (frontend)
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_URL || 'http://localhost:5001';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5174,
      strictPort: false,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      // Report compressed sizes in the build output
      reportCompressedSize: true,
      // Warn when a chunk exceeds 600 KB
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            // Core React runtime — cached aggressively by CDN
            vendor: ['react', 'react-dom', 'react-router-dom'],
            // State management — changes less often than app code
            redux: ['@reduxjs/toolkit', 'react-redux'],
            // UI utilities — separate so they don't bloat the main bundle
            ui: ['react-hot-toast'],
          },
        },
      },
      // Use esbuild for faster, smaller minification
      minify: 'esbuild',
    },
  };
});
