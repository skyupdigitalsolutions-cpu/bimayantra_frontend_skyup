# Bimayantra UI guidelines (live app)

How the connected pages (`src/live/`) are built and how to add or change one without breaking the shared
behaviour. `docs/SCREEN_GUIDE.md` covers the original Figma prototype build; where the two differ, this file wins.

## 1. Where things live

| What | Where |
| --- | --- |
| Connected pages (real API) | `src/live/*.jsx`, routed in `src/live/routes.jsx` (`LIVE_ROUTES`, `PUBLIC_ROUTES`) |
| Prototype frames (mock data, dev only) | `src/screens/<section>/` — not shipped in production builds |
| API calls | `src/api/endpoints/*.js` through `api.*`; read with `useQuery`, write with `useAct` / `useMutation` |
| Design tokens | `src/index.css` (`text-ink`, `bg-panel`, `bg-navy`, `border-line`, …) |
| Shared shell | `components/AppLayout.jsx` (rail + panel), `screens/catalogue/_parts.jsx` (`Header`, `HeadButton`, `SmallButton`, `SegTabs`, `StatusChip`, `Panel`, `DataTable`) |
| Header search | `components/headerSearchBus.js`, `components/GlobalSearch.jsx`, page hook `useHeaderSearch` in `screens/tasks/_filter.jsx` |

A new connected page goes in `src/live/`, is added to `LIVE_ROUTES` with the roles that may open it, and uses
`AppLayout` + `Header`. Never import mock data (`src/data/*`) into a live page.

Every link a live page uses must have a live route. A fixed sub-path under a section with record pages
(`/campaigns/guide`, `/quotations/new`) needs its **own** route listed before `/<section>/:id`; otherwise the word is
read as a record ID and the page shows “Not found”. Prototype frames are not shipped, so a link that only works in
`npm run dev` is broken in production.

## 2. Page header

Use `Header` from `screens/catalogue/_parts.jsx`:

```jsx
<Header breadcrumb="SALES  /  QUOTATIONS" title="Quotations" subtitle="…" actions={<HeadButton …/>} />
```

- `breadcrumb` is upper case with two spaces around each `/`.
- `actions` sit on the right after the search box and the bell. One primary (pink or navy) action at most.
- `search={false}` removes the search box — use it on forms and wizards (see §4).

### Back button

Pass `back="<parent path>"` on every page that is **below** a sidebar item: detail pages, forms, wizards,
sub-pages (feature table, price versions, compare variants). Do **not** add it to top-level pages reached from the
sidebar (Dashboard, Leads, Products, Quotations…).

```jsx
<Header back="/quotations" breadcrumb={`SALES  /  QUOTATIONS  /  ${x.number}`} … />
```

The button goes to the previous page when there is one, otherwise to `back` (a page opened from a shared link
or a new tab). Pick the nearest parent: a quotation → `/quotations`; a product's price versions →
`/products/:id`; the proposal wizard → `/proposals/:id`.

## 3. Search

### Where a search bar appears

| Page kind | Search bar | What typing does |
| --- | --- | --- |
| **Dashboard** | **None** (desktop, tablet and mobile app bar) | — |
| List pages (Leads, Policy holders, Tasks, Notifications, Products, Quotations, Comparisons, Proposals, Policies, Renewals, Communications, Documents, Campaigns) | Header “Search anything · Ctrl K” | Filters that page’s list |
| Detail pages, Best fit, Settings, other pages without a list | Header “Search anything · Ctrl K” | Account-wide search panel (leads, policy holders, family members, quotations, policies) |
| Forms and wizards (Add my product, New lead, Feature table) | None in the header (`search={false}`); a page-specific box where needed | — |

### Rules

1. **A list page must filter with the header search.** Call the hook once and filter with `matchesQuery`:

   ```jsx
   const [q, clearQ] = useHeaderSearch()
   const rows = all.filter((r) => matchesQuery(q, r.name, r.number, r.customer?.name))
   ```

   Show `NoMatches` with `onClear={clearQ}` when the search leaves the list empty, and say what was searched
   (“No quotations match “abc””).
2. **Server-side search** (lists that page through the API): debounce the text and reset to page 1 when it changes:

   ```jsx
   const search = useDebounced(q.trim(), 300)
   ```

   Never send a request on every keystroke.
3. **Do not attach listeners to the search input yourself.** The hooks listen on `document`, so they keep working
   when the header re-renders after data loads. A page that calls `useHeaderSearch()` registers as a list filter;
   while one is mounted the account-wide panel stays closed.
4. **Pages without a list need nothing**: the account-wide panel works automatically. It needs 3 characters
   (backend CFG-24), and only advisors and assistants can use it (`search.use`); other roles see
   “Search isn’t available on this page”.
5. **Ctrl/Cmd + K** focuses the search box on every page that has one. Don’t bind it again.
6. **In-page search boxes** (pickers, “Find a feature…”, admin filters) are controlled inputs. If they call the API:
   debounce 300 ms, respect the API’s minimum length and show a hint below it (“Type at least 3 characters.”),
   and show a “no matches” line after a search returns nothing.
7. Placeholders say what is searched (“Search advisor or mobile”, “Search policy holder by name or mobile”) and
   the search must actually match those fields.

## 4. Forms

- Lead and customer forms use `LeadShell` (`screens/flow-lead/_parts.jsx`). Its Cancel / Save bar sticks to the
  bottom of the window while the form is taller than the screen; do not position action bars absolutely.
- On a failed save, scroll to the first error (or the warning banner) and focus that field; mark error text with
  `data-field-error` so `scrollToProblem` finds it.
- Required labels end with ` *`. Error text is red 12 px under the field; one message per field.
- Dropdowns use `Dropdown` from `components/pickers.jsx` (search inside the list is built in).

## 5. Products

- **Products page** (`live/ProductsLibrary.jsx`): cards with a coloured header, the variant picker (radio +
  per-variant Compare tick + “Compare all N variants”), four key-feature tiles from the feature table, “Add to
  compare” / “In compare”, the quote status chip, Details and New quotation. The compare tray holds up to 3 variants
  of **one** insurance type and opens the feature table narrowed to them (`?pick=productId~Variant|…`).
- **Add my product**: step 1 picks the category; step 2 lists only companies licensed for it
  (`GET /my-products/insurers?typeId=`: Life → term/savings; General → motor, home, travel, health, PA; Standalone
  Health → health, PA, travel; the advisor’s own companies always). Changing the category clears the company.
  Step 6 shows the category’s feature template; numeric types (`Number`, `Amount in ₹`, `Percentage`, `Days`,
  `Months`, `Years`) are typed as text and sent as numbers.
- **Feature table**: with no products yet it still lists the category’s features.

## 6. Integrations (Settings → Integrations)

- An advisor can connect their **own** MSG91 (WhatsApp) and Brevo (email) accounts at `/settings/integrations`
  (`live/Integrations.jsx`, API `/integrations`). Without a connection Bimayantra’s own providers send, as before.
- Keys are checked with the provider before saving, stored encrypted, and never sent back; screens show the last 4
  characters only. Never put a key in a URL, a toast or a log.
- WhatsApp through the advisor’s MSG91 is billed by MSG91, not the Bimayantra wallet; each template must be approved by
  Meta on their number first (shown on the page). Each connection has its own webhook address to paste in the provider.

## 7. Lists, empty states and loading

- Loading: “Loading…” in the list area; never a blank page. Errors: `ErrorPanel` (whole page) or `ErrorNote` (one
  block), with a way back or a Try again.
- Empty: say what is missing and what to do (“You have not added your own products yet.”).
- Status chips use `StatusChip` tones: green = done / can act, amber = needs attention, rose = stopped, neutral =
  information.

## 8. Before you hand a change over

1. `npm run build` passes and `npx oxlint src` shows no new warnings in the files you touched.
2. Open the page at 1440 wide and at a short window (about 760 px high): nothing hidden under fixed bars, Save
   reachable.
3. Type in the search box: a list page filters (and “Clear filters” resets it); any other page shows the
   account-wide panel; the dashboard has no search box.
4. Back button present on sub-pages, absent on top-level pages.
5. If the change needs a backend change, deploy both together and say so in the hand-over.
