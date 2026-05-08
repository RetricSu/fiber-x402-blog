# Fiber x402 Blog

A blog demo with Fiber x402 paywall — built with Astro and React.

> **Note:** This demo depends on the x402 module in Fiber Network, which is currently in a [pull request](https://github.com/nervosnetwork/fiber/pull/1301) and has not been merged into the main branch yet.

## Features

- **Hybrid Astro site** — static pages with server-rendered API routes
- **x402 paywall** — native Fiber Network payment protocol
- **Direct node connection** — connect your Fiber node for instant payments
- **Merchant RPC proxy** — keeps merchant Fiber RPC URL off the client

## Prerequisites

- Node.js 20+
- pnpm 9+
- Running Fiber node with x402 module enabled (see [fiber#1301](https://github.com/nervosnetwork/fiber/pull/1301))

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your merchant pubkey and RPC URLs
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
   - Calls Astro `/api/invoice` to create an invoice on the merchant node
   - User pays the invoice via connected node
   - Frontend verifies and settles via Astro `/api/verify` and `/api/settle`
   - Content unlocks and is cached in localStorage

## Architecture

- **Astro API proxy routes** — merchant invoice, verify, and settle requests stay server-side
- **Hybrid Astro build** — static article content plus server endpoints
- **Native x402 endpoints** — Astro forwards to fnn's built-in `/verify` and `/settle`

## Configuration

The following environment variables can be configured in `.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `PUBLIC_PAY_TO_PUBKEY` | Merchant node pubkey for receiving payments | *(required)* |
| `MERCHANT_FIBER_RPC_URL` | Merchant Fiber node RPC URL used only by Astro server routes | `http://127.0.0.1:8230` |
| `PUBLIC_DEFAULT_PAYER_RPC_URL` | Default payer Fiber node RPC URL | `http://127.0.0.1:28229` |

### Node Requirements

- **Merchant node** — Must run the [fiber#1301](https://github.com/nervosnetwork/fiber/pull/1301) branch with x402 module enabled. This node handles invoice generation plus x402 verification and settlement behind Astro API routes.
- **Payer node** — Can be any standard Fiber node (no special branch required). This is the user's node that pays invoices.

### Hardcoded Defaults

If environment variables are not set, the app falls back to these defaults:
- **Merchant RPC**: `http://127.0.0.1:8230` — used server-side by Astro for invoice generation and x402 verification/settlement
- **Payer RPC**: `http://127.0.0.1:28229` — the node that pays invoices (user's node, any standard Fiber node)

> These defaults assume both nodes are running locally. Adjust them via `.env` for your setup.

## Future Work

Once [fiber#1301](https://github.com/nervosnetwork/fiber/pull/1301) is merged:

- Update Fiber node version requirement
- Consider removing hardcoded RPC URL fallbacks
- Add support for remote merchant nodes

## License

MIT
