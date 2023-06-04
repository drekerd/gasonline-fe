import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import http from 'https'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),

    quasar({
      sassVariables: 'quasar/src/css/variables.sass'
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3008'
        // changeOrigin: true,
        // secure: false,
        // rewrite: path => path.replace(/^\//, ''),
        // agent: new http.Agent()
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
