import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic'
    })
  ],
  server: {
    host: 'localhost',
    port: 5173,
    hmr: {
      overlay: true
    }
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'html5-qrcode'],
    force: true
  },
  clearScreen: false
});


