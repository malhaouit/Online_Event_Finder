import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',  // Base set for root deployment
  build: {
    outDir: 'dist',  // Ensure Vite outputs build files to 'dist'
  },
});
