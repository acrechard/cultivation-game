import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import spaFallback from 'vite-plugin-spa-fallback';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    spaFallback() // 添加SPA回退插件以处理Vue Router的客户端路由
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@stores': '/src/stores',
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3005,
    strictPort: true,  // 如果端口被占用则报错而不是自动切换
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  root: '.',  // 明确指定根目录
  publicDir: 'public',  // 明确指定公共目录
  appType: 'spa',  // SPA应用类型
});