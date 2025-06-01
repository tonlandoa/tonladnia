import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'

// https://vite.dev/config/
export default defineConfig({
  plugins: [

    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'lottie-player',
        },
      },
    }),
    vueJsx(),
    vueDevTools(),
    svgLoader(),
  ],
  server: {
    host: true, // или можно указать конкретный IP, например '0.0.0.0'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
