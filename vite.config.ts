import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react'],
          'supabase': ['@supabase/supabase-js'],
          'tiptap': ['@tiptap/react', '@tiptap/starter-kit', '@tiptap/extension-link']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
});