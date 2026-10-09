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
    motion.ts                 stagger(i): sets the --i custom property used for entrance delays
```

## Conventions

- Pages and components read data through functions in `src/lib/data.ts`, never the store directly.
- Server actions are public POST endpoints: treat every argument as untrusted. Validate ids against the store and fail clearly.
- Forms call server actions through `<form action={...}>` so they work before JavaScript loads.
- Keep components small and typed. No `any`.
- Comments explain *why*, not *what*. Keep them rare.
- Use Tailwind utility classes. Support dark mode with `dark:` variants.

## Motion

All motion tokens and keyframes live in `src/app/globals.css`. Use them; do not hardcode durations or easings.

- Durations: `--dur-fast` 150ms (hover, press), `--dur-base` 220ms (state changes), `--dur-enter` 480ms (entrances). Easings: `--ease-out` (enter), `--ease-spring` (switch thumb).
- Staggered entrances: add `motion-rise` (or `motion-fade` for table rows) and `style={stagger(i)}`. The delay is `i * --stagger`, capped at `--stagger-max` items.
- Animate only `transform` and `opacity` (plus color and shadow on hover). Never width or height.
- Entrance animations use `fill-mode: backwards` so hover transforms on the same element still work afterwards.
- Reduced motion is handled once, globally, at the bottom of `globals.css`. Infinite animations (pulse, shimmer) also get `motion-reduce:hidden`.
- Keep motion in CSS. The only client component is `StatusToggle` (it needs `useFormStatus`). Do not add client components just for animation.

## Before calling a task done

```bash
npm run lint
npx tsc --noEmit
npm run build
```

All three must pass with no errors. Update `README.md` if behavior, setup or assumptions change.
