import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  build: {
    outDir: 'dist'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
})