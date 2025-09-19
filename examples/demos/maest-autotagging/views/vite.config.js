import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/essentiajs-discogs/",
  plugins: [
    vue(),
    basicSsl(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/onnxruntime-web/dist/*.wasm',
          dest: 'node_modules/.vite/deps'
        },
        // {
        //   src: 'src/audio/model_sharded/!(*.onnx)',
        //   dest: 'node_modules/.vite/deps'
        // }
      ]
    })
  ],
  assetsInclude: ['src/audio/model_sharded/!(*.onnx)'],
  server: {
    https: true
  },
  preview: {
    https: true
  }
})
