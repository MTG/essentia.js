import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2';
import Components from 'unplugin-vue-components/vite'; 
import { VuetifyResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    createVuePlugin(),
    Components({
      resolvers: [VuetifyResolver()]
    })
  ],
  test: {
    environment: 'happy-dom'
  }
})
