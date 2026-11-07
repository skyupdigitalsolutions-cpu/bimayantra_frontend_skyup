# Bimayantra UI — screen implementation guide (v2, full Figma export)

Stack: React 19 + Vite 8 + Tailwind CSS v4 (`src/index.css` `@theme`) + react-router-dom 7. Frames are 1440 wide (a few are taller; responsive frames are 834 / 390 wide).

## Source of truth — local Figma export (NO Figma tool calls)
The whole Figma file has been exported locally. **Do not call any Figma MCP tool** — the account's daily call budget is spent; everything you need is on disk:

`F=/tmp/claude-0/-home-claude/86a605f8-bd1a-5010-8b7b-f5d79de4ffe9/scratchpad/figma`

- `node $F/outline.js <frameId>` → full spec of a frame as an indented outline: every layer with position `@x,y` (relative to its parent), size `WxH`, fill `bg:`, `stroke:`, radius `r`, shadows `fx:d x y blur spread color alpha`, auto-layout `[H|V gapN padT,R,B,L primary/counter]`, text `T "copy" size/weight/color ls lh`, icons `ICON name size color`, and **prototype click targets `⇒/route`** (already resolved to app routes). This is the spec — copy text verbatim, use exact px/hex values.
- `$F/frames/<id with - instead of :>.json` → raw JSON (same data; `svg` fields hold exported vector markup for logos/illustrations — save those as files under `src/assets/<folder>/` if needed).
- `$F/ref/<id>.png` → pixel-accurate reference render of the frame (Read it to see the target).
- `$F/routes.json` / `docs/figma-routes.json` → every frame id → `{ path, name, section, folder }`. Use these exact paths for routes and links.
- `python3 $F/compare.py <frameId> <route> <port> <out.png> [viewportWidth]` → screenshots your route at the frame size and writes a side-by-side PNG (Figma left, app right). Read it and fix differences.
- Components (reference only): Quick Tile `3:136`, Lead Card `8:387`, Checkbox `97:11224`, Toggle `97:11235`, Sidebar `37:3060`, Renewal Card `3:208`, Tasks Section `259:22727` — outline them the same way.

## Shared code — reuse, don't edit
- `src/index.css` tokens: `text-ink` #172b4d, `text-ink-2` #44526a, `text-muted` #7a8699, `text-faint` #9aa4b5, `text-slate` #5b6b80, `bg-navy` #13294b, `bg-panel` #f4f6fb, `bg-panel-2` #f5f7fb, `bg-chip` #f1f3f8, `bg-tile` #f4f6fa, `border-line` #e8ecf3, `border-line-2` #edf0f5, pinks `pink-50/100/200/300/400`, `rose` #c2415a, `rose-ink` #8b3a4c, `blue` #1f5fd6 / `blue-50` / `blue-100`, `violet` / `violet-50/100/200`, `amber-100`, `mint-100`; gradients `bg-pink-hero` `bg-rail` `bg-violet-cta`. Any other hex → arbitrary value (`bg-[#e7f4ee]`). Global `line-height: normal`.
- `src/components/Icon.jsx` → `<Icon name size className="text-[#hex]" strokeWidth />` — every `ICON` in the outlines exists here; colour via text colour.
- `src/components/AppLayout.jsx` → advisor shell (28px gutter, 100px sticky rail, panel #f4f6fb r40, px-10 pt-9 pb-10; panel grows for tall frames). `<AppLayout active="leads">`. Sidebar keys: dashboard leads campaigns customers products bestfit quotations proposals policies renewals communications settings. Custom rail: `sidebar={<Sidebar items={[...]} active=… home="/admin" />}`.
- `src/components/ui.jsx` primitives (PageHeader, SearchPill, IconButton, Button, Card, Chip, Avatar, Field, Input, Select, Checkbox, Toggle, Modal, Stepper, Table, …). `cx()` is tailwind-merge aware, so `className` overrides defaults. Primitives are optional: if one doesn't match the outline exactly, build a local component in your folder's `_parts.jsx`.
- `src/components/cards.jsx`, `src/data/mock.js`.
- **Do not edit** anything outside your own folder(s) and your own `src/data/<folder>.js`. Never touch `registry.js`, `ui.jsx`, `index.css`, `AppLayout.jsx`, `Sidebar.jsx`, `Icon.jsx`, `cards.jsx`, `mock.js`, `package.json`, `App.jsx`. Don't install packages. Don't run git.

## Rules
1. **Every frame assigned to you gets its own route** (path from routes.json) and file `src/screens/<folder>/<PascalName>.jsx` beginning `// Figma <id> · <frame name>`, registered in `src/screens/<folder>/index.js`:
   `export default [{ id: '<code>', name: '<frame name>', figma: '<id>', path: '<path>', Component }]`.
   Existing files in your folder may be outdated (the design changed) — rebuild against the outline; reuse only what still matches.
2. Translate absolute positions into flex/grid using the auto-layout info; keep exact px values via arbitrary classes. Copy all text verbatim.
3. **Prototype**: every `⇒/route` in the outline must be a working `<Link to>` / `navigate()` on that element (`⇒BACK` → `navigate(-1)`). Other obviously-interactive controls (tabs, toggles, checkboxes, inputs, OTP boxes, dropdowns) must work with local state.
4. State/overlay frames (modals, drawers, toasts, "…ed" result states) render the underlying screen + the overlay exactly as the frame shows. Build the base layout once in `_parts.jsx` and reuse it across that family of frames.
5. Mock data → `src/data/<folder>.js`, transcribed from the outlines.
6. Verify every frame: build with your own outDir (`npx vite build --outDir $SCRATCH/<folder>-dist --emptyOutDir`, where `$SCRATCH=/tmp/claude-0/-home-claude/86a605f8-bd1a-5010-8b7b-f5d79de4ffe9/scratchpad/builds`), serve it (`npx vite preview --outDir … --port <yourPort> &`), run `compare.py` for each frame and fix mismatches until they line up. Re-build before re-checking. If the build fails because of ANOTHER folder (another agent mid-edit), wait 30s and retry; keep your own files compiling at all times.
7. When finished, kill your preview server (`pkill -f "port <yourPort>"` style — careful not to kill your own shell: use `kill $(lsof -t -i:<port>)` or `fuser -k <port>/tcp`).
