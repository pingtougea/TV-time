import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   base: './',
//   build: {
//     outDir: 'dist',
//     emptyOutDir: true
//   },
//   resolve: {
//     extensions: ['.js', '.jsx', '.ts', '.tsx']
//   },
//   server: {
//     host: true
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'axios']
        }
      }
    }
  },
  server: {
    headers: {
      'Content-Type': 'application/javascript'
    }
  }
})
