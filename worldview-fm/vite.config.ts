import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'

// https://vite.dev/config/
export default defineConfig({
  base: '/FulcrumMemo/worldview-fm/',
  plugins: [
    react(),
    cesium({
      rebuildCesium: false
    })
  ],
  define: {
    'process.env': {},
    CESIUM_BASE_URL: JSON.stringify('/FulcrumMemo/worldview-fm/'),
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
