import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // относительные пути, чтобы сборка открывалась на GitHub Pages из подпапки /<repo>/
  base: './',
})
