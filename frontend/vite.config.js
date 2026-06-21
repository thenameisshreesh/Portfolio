import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path is / for root domain deployment
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
