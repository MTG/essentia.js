import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/essentiajs-discogs/",
  plugins: [vue()],
  server: {
    https: true
  },
  preview: {
    https: true
  }
})
