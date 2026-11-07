# Bimayantra web app ↔ API — integration status

All 269 Figma frames are served by the live app: **26 connected pages** plus **242 frames covered** by a connected page
(their dialog, chip, toast or step is part of that page, and the old `/x/…` link redirects there).
The only frame not in the product is **INV** (screen inventory), a design tool shown at `/screens` in development.

## No mock data in production
- `npm run build` never mounts the Figma frames. Any `/x/…` link goes to its connected page (`REDIRECTS` in
  `src/live/routes.jsx`) or to the dashboard. `/screens` is not mounted.
- `npm run dev` (or `VITE_SHOW_PROTOTYPES=true`) still shows the frames for design reference; add `?proto=1` to stop the redirect.
- Shared parts the connected pages use (`screens/tasks/_parts.jsx`, `screens/sales/_lead.jsx`, `screens/customer-tabs/_parts.jsx`, …)
  link to live routes only, and render the mock values only when no live data is passed (prototype frames).
- An empty database shows empty states everywhere.

## Connected pages by role
| Role | Paths |
|---|---|
| Public | `/login`, `/signup`, `/q/:token`, `/r/:code`, `/c/:token` |
| Advisor / assistant | `/`, `/tasks`, `/notifications`, `/leads…`, `/customers…` (all tabs), `/best-fit`, `/products…` (`/new`, `/:id/prices`, `/:id/variants`, `/feature-table`), `/quotations…`, `/comparisons…`, `/proposals…`, `/policies…`, `/documents`, `/renewals`, `/communications`, `/campaigns…` (`/setup/:id`) |
| Advisor only | `/settings` and its 10 pages, `/products/new`, `/products/:id/prices`, `/campaigns/setup/:id` |
| Referrer | `/referrer` |
| SkyUp admin / staff | `/admin`, `/admin/accounts…`, `/admin/kyc…`, `/admin/approvals`, `/admin/corrections`, `/admin/templates`, `/admin/users`, `/admin/config`, `/admin/audit`, `/admin/flags`, `/admin/support`, `/admin/catalogue…` |

## API client
`src/api/endpoints/*.js` has a function for every browser-facing API route. Not in the client, by design: the document
DELETE routes (always DOC-07), the call-recording audio (opened as a URL), and the server-to-server hooks and webhooks.

## Before deploying
- Real SMS provider, `DEV_TOOLS=false`, `NODE_ENV=production` on the API.
- Keep `.env` files and the API's `storage/` folder out of git (both are in `.gitignore`).
- Rotate any third-party secrets that were shared outside the team. Do not rotate `PII_ENCRYPTION_KEY` / `PII_HASH_KEY`:
  data already encrypted with them would become unreadable.