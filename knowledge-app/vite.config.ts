import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../assets/knowledge-app',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'kb-app.js',
        assetFileNames: 'kb-app.[ext]',
        chunkFileNames: 'kb-app-chunk.js'
      }
    }
  }
})
