# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev        # Start dev server (Vite)
yarn build      # Production build
yarn preview    # Preview production build
yarn lint       # ESLint (0 max warnings)
```

Package manager: **yarn** (yarn.lock is present).

## Purpose

A minimal React + Vite template for deploying and managing Stacks blockchain contracts through the **Asigna multisig** extension. The primary customization point is `src/Contracts.tsx` — modify contract calls, deploys, and STX transfers there.

## Architecture

**State** (`atoms.js` at root): Jotai atoms expose `useNetwork()` (returns `'mainnet'` | `'testnet'`) and `useAddress()` (get/set tuple). Imported via `../atoms` from inside `src/`.

**Entry flow** (`src/App.jsx`):
- Connects a Stacks wallet via `@stacks/connect` (`connect()`)
- `isConnected()` + `getLocalStorage()` hydrates address on reload
- Renders `<Contracts />` once an address is set

**Contract actions** (`src/Contracts.tsx`):
- Demonstrates three action types: STX transfer, contract call, contract deploy
- Each action uses `request('stx_transferStx' | 'stx_callContract' | 'stx_deployContract', options)` from `@stacks/connect` v8 RPC API

## Key Dependencies

| Package | Role |
|---|---|
| `@stacks/connect` | Stacks wallet connection + transaction signing (v8 RPC API) |
| `@stacks/transactions` | Building ClarityValue function arguments (uintCV, principalCV, etc.) |
| `jotai` | Global state (network, address) |

## Notes

- Network is specified as a plain string `'mainnet'` or `'testnet'` in v8 request calls — no `StacksMainnet`/`StacksTestnet` instances needed.
- Connection state is managed via `connect()`, `disconnect()`, `isConnected()`, `getLocalStorage()` from `@stacks/connect`.
- The project mixes `.jsx` and `.tsx` — `Contracts.tsx` uses TypeScript but there is no `tsconfig.json`; Vite handles it via esbuild.
