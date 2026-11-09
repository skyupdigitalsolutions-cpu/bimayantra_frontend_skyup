# Bimayantra — Advisor Workspace UI

React 19 + Vite + Tailwind CSS v4 build of the full Bimayantra Figma file: **all 268 frames**, each on its own route, with the Figma prototype click-throughs wired as real links.

```bash
npm install
npm run dev        # http://localhost:5173
```

- `/screens` — index of every screen grouped by Figma section (34 sections)
- `/` dashboard · `/login` · `/leads` · `/campaigns` · `/customers` · `/products` · `/best-fit` · `/quotations` · `/proposals` · `/policies` · `/renewals` · `/communications` · `/settings` · `/tasks` · `/notifications` · `/admin` · `/referrer` · `/q/QT-1042` · `/r/suresh-rao` · `/screens/inventory`
- Every other frame (flows, states, modals) lives at `/x/<frame-name>` — full map in `docs/figma-routes.json`
- Responsive: dashboard, tasks, leads list and new lead adapt to tablet (834) and mobile (390) per the R1–R5 frames

## Structure
- `src/index.css` — design tokens (Tailwind v4 `@theme`)
- `src/components/` — Icon set (exported from Figma), Sidebar (sticky), AppLayout, shared UI primitives, cards
- `src/screens/<section>/` — one file per Figma frame + `_parts.jsx` shared layouts, registered in each `index.js`
- `src/data/` — mock data transcribed from the designs (swap for bimayantra-api calls)
- `docs/UI-GUIDELINES.md` — **how to build and change connected pages**: header and back button, where search bars go and how they work, forms, products, hand-over checklist
- `docs/SCREEN_GUIDE.md` — conventions used to build the prototype screens (historical)
- `docs/INTEGRATIONS.md` — Meta Ads / Google Ads / website lead integration: credentials needed, .env template, webhook specs and Express route skeletons for bimayantra-api (in-app version at `/campaigns/guide`)
