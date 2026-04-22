import path from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, 'src/core/index.ts'),
      '@common': path.resolve(__dirname, 'src/common'),
      '@games': path.resolve(__dirname, 'src/games'),
      '@hooks': path.resolve(__dirname, 'src/common/hooks'),
      '@pages': path.resolve(__dirname, 'src/pages'),
    },
  },
})
