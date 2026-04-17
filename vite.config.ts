import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },

  build: {
    outDir: 'dist/client',   // 🔥 MUST match server.ts
    emptyOutDir: true
  },

  base: '/', // ensures correct asset paths

  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});