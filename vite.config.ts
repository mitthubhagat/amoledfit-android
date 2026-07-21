import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // Use './' so assets work correctly in Capacitor's WebView
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Inline small assets so the WebView doesn't need separate fetches
    assetsInlineLimit: 4096,
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
  },
});
