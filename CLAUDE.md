# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — start dev server
- `pnpm build` — type check + production build
- `pnpm fmt` — format code with oxfmt
- `pnpm fmt:check` — check formatting

## Tech Stack

- React 19 + TypeScript 6 + Vite 8
- TanStack Router (file-based routing, auto code-splitting)
- Tailwind CSS v4
- Jotai for cross-page state
- React Compiler enabled — do NOT use `useMemo`, `useCallback`, or `React.memo`

## Path Alias

`@/` maps to `src/` (e.g. `@/routes/...`)

## Code Conventions

- All code comments and documentation must be in English
- Route files follow TanStack Router file-based conventions with `-components/`, `-mock/`, `-store/` directories as needed
- Use `type` instead of `interface` for type definitions
- Prefer regular functions over arrow functions (except for inline JSX handlers)
- No `useMemo`, `useCallback`, or `React.memo` — React Compiler handles optimization

## Principles

- Progressive disclosure: keep CLAUDE.md and code comments lean. Don't dump all context upfront — point to `docs/dev` for details and expand only when needed.

## Documentation

Feature-specific design docs live in `docs/dev`.
