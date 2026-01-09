import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Optimize for low memory systems
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Reduce memory usage by limiting chunk size
        manualChunks: undefined,
      },
    },
    // Reduce memory usage during build
    minify: 'esbuild', // esbuild is faster and uses less memory than terser
    // Disable source maps to reduce memory usage
    sourcemap: false,
  },
  server: {
    port: 3002,
    host: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/sitemap.xml': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/robots.txt': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/p': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/p/, '/api/image/placeholder'),
      },
    },
  },
});
