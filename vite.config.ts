import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'src/background.ts'),
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === 'background') return 'background.js'
          return 'assets/[name]-[hash].js'
        },
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  publicDir: 'public',
  server: {
    hmr: false, // HMR doesn't apply to extension build; we use reload.txt polling
  },
  pluginsPostHooks: [
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
    } as any,
  ],
}))
