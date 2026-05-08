# Fiber x402 Blog

A blog demo with Fiber x402 paywall — built with Astro and React.

## Features

- **Static site** — articles embedded at build time
- **x402 paywall** — native Fiber Network payment protocol
- **Direct node connection** — connect your Fiber node for instant payments
- **Manual payment** — copy invoice and pay with any compatible wallet

## Prerequisites

- Node.js 20+
- pnpm 9+
- Running Fiber node with x402 module enabled

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your node's pubkey
```

3. Build and preview:
```bash
pnpm build
pnpm preview
```

## How It Works

1. Articles are loaded from `src/content/articles/` at build time
2. Each article has a `price` in CKB in its frontmatter
3. When user clicks "Unlock", the frontend:
   - Generates an invoice via the connected node's `new_invoice` RPC
   - User pays the invoice (auto via connected node or manual)
   - Frontend verifies payment via fnn's native `/verify` endpoint
   - Content unlocks and is cached in localStorage

## Architecture

- **No proxy server** — direct browser-to-fnn x402 communication
- **Static Astro build** — articles embedded at build time
- **Native x402 endpoints** — uses fnn's built-in `/supported`, `/verify`, `/settle`

## License

MIT
