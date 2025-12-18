
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Sets the base path to your repository name for GitHub Pages subfolder deployment
  base: '/omni-work/',
  define: {
    // Vite does not provide process.env by default. 
    // This allows the Gemini SDK to access the API_KEY safely.
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY || '')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  server: {
    historyApiFallback: true,
  },
});
