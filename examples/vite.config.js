import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import Components from 'unplugin-vue-components/vite'
import { BootstrapVueNextResolver } from 'bootstrap-vue-next'
import Icons from 'unplugin-icons/vite'
import IconsResolve from 'unplugin-icons/resolver'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { basePath } from './config.js';

const customElementNames = ["mic-toggle-button"];

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // add specific custom element names
          isCustomElement: (tag) => customElementNames.includes(tag)
        },
        transformAssetUrls: transformAssetUrls
      }
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/onnxruntime-web/dist/*.wasm',
          dest: 'node_modules/.vite/deps'
        }
      ]
    }),
    Vuetify(),
    Components({
      resolvers: [BootstrapVueNextResolver(), IconsResolve()],
      dts: true
    }),
    Icons({
      compiler: 'vue3',
      autoInstall: true
    })
  ],
  root: './',
  base: basePath,
  publicDir: '../public',
  // assetsInclude: ["**/*.wasm"]
})