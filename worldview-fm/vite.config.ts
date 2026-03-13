import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'

// https://vite.dev/config/
export default defineConfig({
  base: '/FulcrumMemo/worldview-fm/',
  plugins: [
    react(),
    cesium()  // No options - let plugin handle asset copying
  ],
  define: {
    'process.env': {},
    CESIUM_BASE_URL: JSON.stringify('/FulcrumMemo/worldview-fm/cesium/'),
  },
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        }
      }
    }
  }
})
