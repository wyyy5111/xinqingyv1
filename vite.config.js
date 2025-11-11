import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // 项目页部署到 https://wyyy5111.github.io/xinqingyv1/ 时需要设置基础路径
  base: '/xinqingyv1/',
  plugins: [react()],
})