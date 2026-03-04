import { defineConfig } from 'vite'
import { imagetools } from 'vite-imagetools'
import path from 'path'

export default defineConfig({
  plugins: [
    imagetools(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@scripts': path.resolve(__dirname, './src/scripts'),
      '@components': path.resolve(__dirname, './src/components'),
      '@sections': path.resolve(__dirname, './src/sections'),
      '@data': path.resolve(__dirname, './src/data'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
  build: {
    rollupOptions: {
      // Theatre Studio 在生产环境完全排除（通过 import.meta.env.DEV 条件引入）
    },
    target: 'es2020',
  },
  css: {
    postcss: './postcss.config.js',
  },
})
