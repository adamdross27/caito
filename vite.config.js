import { defineConfig } from 'vite'; // Import defineConfig
import react from '@vitejs/plugin-react'; // Import the react plugin

export default defineConfig({
  plugins: [react()], // Use the react plugin
  base: '/caito/', // Correct path for GitHub Pages
  build: {
    outDir: 'dist',
  },
});
