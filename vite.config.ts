import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'


// https://vitejs.dev/config/
export default defineConfig({
  base: "/dist",
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      "/api": { // “/api” 以及前置字符串会被替换为真正域名
        target: "http://localhost:8080/", // 请求域名
        secure: false, // 请求是否为https
        changeOrigin: true, // 是否跨域
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  }
})
