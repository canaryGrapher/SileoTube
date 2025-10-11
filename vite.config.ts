import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: './',
    plugins: [
      react(),
      {
        name: 'emit-reload-stamp',
        apply: 'build',
        closeBundle() {
          if (mode === 'development') {
            const fs = require('node:fs')
            const path = require('node:path')
            const target = path.resolve(__dirname, 'dist', 'reload.txt')
            fs.mkdirSync(path.dirname(target), { recursive: true })
            fs.writeFileSync(target, String(Date.now()))
          }
        },
      },
    ],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'index.html'),
          background: resolve(__dirname, 'src/extension-logic/background/index.ts'),
          homePage: resolve(__dirname, 'src/extension-logic/content/pages/home-page.ts'),
          watchPage: resolve(__dirname, 'src/extension-logic/content/pages/watch-page.ts'),
          shortsPage: resolve(__dirname, 'src/extension-logic/content/pages/shorts-page.ts'),
          shortsRecommendations: resolve(__dirname, 'src/extension-logic/content/features/shorts-recommendations-removal.ts'),
          sidebarRemoval: resolve(__dirname, 'src/extension-logic/content/features/sidebar-removal.ts'),
          watchComments: resolve(__dirname, 'src/extension-logic/content/features/watch-comments.ts')
        },
        output: {
          entryFileNames: (chunk: { name?: string }) => {
            if (chunk.name === 'background') return 'scripts/background.js'
            if (chunk.name === 'homePage') return 'scripts/home-page.js'
            if (chunk.name === 'shortsPage') return 'scripts/shorts-page.js'
            if (chunk.name === 'watchPage') return 'scripts/watch-page.js'
            if (chunk.name === 'shortsRecommendations') return 'scripts/shorts-recommendations-removal.js'
            if (chunk.name === 'sidebarRemoval') return 'scripts/sidebar-removal.js'
            if (chunk.name === 'watchComments') return 'scripts/watch-comments.js'
            return 'assets/[name]-[hash].js'
          },
          format: 'es', // Use ES modules for all
          manualChunks: undefined,
        },
      },
      outDir: 'dist',
      emptyOutDir: true,
    },
    publicDir: 'public',
    server: {
      hmr: false, // HMR doesn't apply to extension build; we use reload.txt polling
    },
  }
})
