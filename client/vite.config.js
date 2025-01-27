import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // Use http instead of https
        secure: false,  // Disable SSL verification for local development
      },
    },
  },
  plugins: [react()],
  css: {
    postcss: './postcss.config.js', // Ensure PostCSS configuration is linked
  },
});

