import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8')) as { version: string }
const gitHash = execSync('git rev-parse --short HEAD').toString().trim()

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(`v${version} (${gitHash})`),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ABC 123',
        short_name: 'ABC 123',
        description: 'Fun letter and number learning games for toddlers',
        display: 'fullscreen',
        orientation: 'any',
        theme_color: '#131f24',
        background_color: '#131f24',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
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
