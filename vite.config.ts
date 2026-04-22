import path from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, 'src/components/core/index.ts'),
      '@games': path.resolve(__dirname, 'src/games'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@types': path.resolve(__dirname, 'src/types'),
    },
  },
})
