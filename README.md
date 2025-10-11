# SileoTube — Cross-browser YouTube CSS injector (Vite + React + TS + MV3)

This repository template contains a working starting point for a Manifest V3 browser extension that:
- Injects different CSS files for YouTube pages (home, watch, search, shorts)
- Detects YouTube SPA navigation (background webNavigation.onHistoryStateUpdated + content script observer)
- Uses a React + TypeScript UI (popup/options) built with Vite
- Persists settings in chrome.storage.local
- Keeps content script non-module (no import) so it works cross-browser
- Uses pnpm

## File Structure

sileotube-template/
├── manifest.json
├── package.json
├── pnpm-lock.yaml (not included)
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── background/
│   │   └── index.ts
│   ├── content/
│   │   └── content.js
│   ├── ui/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   └── index.css
│   ├── styles/
│   │   ├── homepage.css
│   │   ├── watch.css
│   │   ├── search.css
│   │   └── shorts-block.css
│   └── utils/
│       └── storage.ts
└── README.md