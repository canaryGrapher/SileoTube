# SileoTube

A calming, decluttered YouTube experience.

## Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
# Chrome/Chromium
npm run dev

# Firefox
npm run dev:firefox

# Safari
npm run dev:safari
```

## Building

### Build for Chrome/Chromium

```bash
npm run build
```

### Build for Firefox

```bash
npm run build:firefox
```

### Build for Edge

```bash
npm run build:edge
```

### Build for Safari

```bash
npm run build:safari
```

## Packaging

### Create ZIP for Chrome/Chromium

```bash
npm run zip
```

### Create ZIP for Firefox

```bash
npm run zip:firefox
```

### Create ZIP for Edge

```bash
npm run zip:edge
```

### Create ZIP for Safari

```bash
npm run zip:safari
```

## Type Checking

```bash
npm run compile
```

## Notes for Firefox Team

To build this extension for Firefox:

1. Install dependencies: `npm install`
2. Build the extension: `npm run build:firefox`
3. The built extension will be available in the `.output/firefox-mv2` directory

For development/testing:
- Run `npm run dev:firefox` to start the development server with hot-reload for Firefox
