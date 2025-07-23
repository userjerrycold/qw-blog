import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS()],
  // 添加代理配置解决跨域问题
  server: {
    proxy: {
      // 将所有/bestv开头的请求代理到目标服务器
      '/bestv': {
        target: 'http://10.215.211.31:9010',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bestv/, ''), // 去掉路径中的/bestv前缀
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
}) 