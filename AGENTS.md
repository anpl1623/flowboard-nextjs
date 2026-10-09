# AGENTS.md

Context for AI coding assistants working in this repo.

## What this is

Flowboard: a small dashboard for business automation workflows (e.g. "Sync Shopify orders to NetSuite").
It is a take-home assessment, so the goal is a small, clear codebase the author can explain line by line.
Prefer the simplest thing that works over clever abstractions.

Required features:
- `/` lists workflows, rendered on the server.
- One server action: pause / resume a workflow.
- `/workflows/[id]` shows a single workflow: trigger, steps, recent runs.

## Stack (do not change)

- Next.js **15** App Router (not 16), React 19, TypeScript strict.
- Tailwind CSS **v4**: configured in `src/app/globals.css` via `@import "tailwindcss"` and `@theme`. There is no `tailwind.config.js`.
- No database. No new dependencies without asking first.

## Next.js 15 gotchas

- `params` and `searchParams` are Promises in pages and `generateMetadata`. Type them as `Promise<{ id: string }>` and `await` them.
- Pages are Server Components by default. Add `"use client"` only to leaf components that need state, effects or hooks like `useFormStatus`.
- After a mutation, call `revalidatePath` for every page that shows the changed data.
- Use `notFound()` from `next/navigation` for unknown ids.

## Layout

```
src/
  app/
    page.tsx                  list page (server)
    actions.ts                server actions ("use server")
    workflows/[id]/page.tsx   detail page (server)
    workflows/[id]/not-found.tsx
  components/                 presentational components; client ones marked "use client"
  lib/
    types.ts                  domain types
    data.ts                   seed data + in-memory store; the only module that touches the store
    format.ts                 date / duration / percentage formatting
```

## Conventions

- Pages and components read data through functions in `src/lib/data.ts`, never the store directly.
- Server actions are public POST endpoints: treat every argument as untrusted. Validate ids against the store and fail clearly.
- Forms call server actions through `<form action={...}>` so they work before JavaScript loads.
- Keep components small and typed. No `any`.
- Comments explain *why*, not *what*. Keep them rare.
- Use Tailwind utility classes. Support dark mode with `dark:` variants.

## Before calling a task done

```bash
npm run lint
npx tsc --noEmit
npm run build
```

All three must pass with no errors. Update `README.md` if behavior, setup or assumptions change.
