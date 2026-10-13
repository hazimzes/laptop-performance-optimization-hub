# OptiSet — Laptop Performance Optimization Hub

A step-by-step laptop setup and optimization guide. Pick the lane that matches how you use your laptop — Everyday, Gaming, Creator, or AI/Dev — then work through the checklist top to bottom, checking off steps as you go.

**Live site:** https://hazimzes.github.io/laptop-performance-optimization-hub/

## What it does

- **36 guided tasks** across 4 usage profiles, each with numbered steps, why-it-matters notes, macOS alternatives, and copy-on-click terminal commands.
- **Progress tracking** that saves automatically to the browser. On the static GitHub Pages deployment, progress is stored in localStorage (per device). When deployed to a server with the included API routes and a PostgreSQL database, progress syncs across devices.
- **Video guide per section** — a curated YouTube tutorial embedded in each task card, with an animated click-path walkthrough as a fallback.
- **No account, no tracking** — the static site is pure HTML/JS served from GitHub Pages.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- Tailwind CSS v4
- Drizzle ORM + PostgreSQL (optional, for the cross-device sync API)
- GitHub Actions deployment to GitHub Pages (static export)

## Development

Requires Node.js 22+.

```bash
npm install
npm run dev      # start dev server at http://localhost:3000
npm run build    # production build (server mode)
npm run lint     # eslint
npm run typecheck
```

For the optional plan-sync API, set `DATABASE_URL` in `.env` and apply the schema with `npx drizzle-kit push`.

### Static export (GitHub Pages)

The Pages workflow (`.github/workflows/deploy-pages.yml`) builds with `BUILD_TARGET=pages`, which switches `next.config.ts` to static export mode (`output: "export"`, basePath set to the repo name). In this mode the API routes are excluded and the client falls back to localStorage-only persistence.

## Project structure

```
src/
  app/
    page.tsx               # home page (renders the client app)
    optimizer-client.tsx   # main interactive checklist
    setup-data.ts          # all task/step content
    video-map.ts           # curated video per section
    SectionVideo.tsx       # YouTube embed + animated fallback
    api/plans/route.ts     # plan sync API (server deploys only)
  db/                      # Drizzle schema and client
```

## License

All rights reserved. Video content remains the property of the respective YouTube creators and is embedded via YouTube's standard embed player.
