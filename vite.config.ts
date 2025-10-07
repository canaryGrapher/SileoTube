import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
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
          background: resolve(__dirname, 'src/background/index.ts'),
          contentScripts: resolve(__dirname, 'src/content/index.ts'),
          homePage: resolve(__dirname, 'src/content/home-page.ts'),
          shortsBlocker: resolve(__dirname, 'src/content/shorts-blocker.ts'),
          shortsRecommendations: resolve(__dirname, 'src/content/shorts-recommendations-removal.ts'),
          sidebarRemoval: resolve(__dirname, 'src/content/sidebar-removal.ts'),
          watchPage: resolve(__dirname, 'src/content/watch-page.ts'),
          watchPageComments: resolve(__dirname, 'src/content/watch-page-comments.ts')
        },
        output: {
          entryFileNames: (chunk: { name?: string }) => {
            if (chunk.name === 'background') return 'scripts/background.js'
            if (chunk.name === 'contentScripts') return 'scripts/content.js'
            if (chunk.name === 'homePage') return 'scripts/home-page.js'
            if (chunk.name === 'shortsBlocker') return 'scripts/shorts-blocker.js'
            if (chunk.name === 'watchPage') return 'scripts/watch-page.js'
            if (chunk.name === 'shortsRecommendations') return 'scripts/shorts-recommendations-removal.js'
            if (chunk.name === 'sidebarRemoval') return 'scripts/sidebar-removal.js'
            if (chunk.name === 'watchPageComments') return 'scripts/watch-page-comments.js'
            if (chunk.name === 'index') return 'index.html'
            return 'assets/[name]-[hash].js'
          },
          format: 'es', // Use ES modules for all
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
