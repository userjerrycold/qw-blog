import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isElectron = process.env.ELECTRON === 'true'
  
  return {
    plugins: [
      vue(), 
      UnoCSS(),
      // 只在Electron模式下启用Electron插件
      ...(isElectron ? [
        electron([
          {
            // Main-Process entry file of the Electron App.
            entry: 'electron/main.ts',
          },
          {
            entry: 'electron/preload.ts',
            onstart(options) {
              // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete, 
              // instead of restarting the entire Electron App.
              options.reload()
            },
          },
        ]),
        renderer()
      ] : [])
    ],
    // 添加代理配置解决跨域问题（仅Web模式）
    server: isElectron ? {} : {
      proxy: {
        // 将所有/api开头的请求代理到目标服务器
        '/api': {
          target: 'http://localhost:9090',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''), // 去掉路径中的/api前缀
        }
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    // 添加Monaco编辑器worker配置
    worker: {
      format: 'es',
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            jsonWorker: ['monaco-editor/esm/vs/language/json/json.worker'],
            editorWorker: ['monaco-editor/esm/vs/editor/editor.worker'],
          },
        },
      },
    },
    // 优化依赖预构建
    optimizeDeps: {
      include: [
        'monaco-editor',
        'monaco-editor-vue3'
      ],
      exclude: []
    }
  }
}) 