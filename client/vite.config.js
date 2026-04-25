// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: [
      {find: '@', replacement: path.resolve(__dirname, 'src')},
      {find: '@components', replacement: path.resolve(__dirname, 'src/components')},
      {find: '@services', replacement: path.resolve(__dirname, 'src/services')},
      {find: '@shared', replacement: path.resolve(__dirname, 'src/pages/Shared')},
    ],
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
