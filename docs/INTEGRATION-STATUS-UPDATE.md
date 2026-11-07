# Bimayantra — Integration status update (04 Nov 2026, stage 2)

This report lists only what was actually done and how it was checked. It is **not** a completion certificate:
93 of 269 frames are still on mock data (list at the end).

## Frames done: 172 of 269 (was 121)

| Batch | Frames | How it is connected now |
|---|---|---|
| 3 Family and documents | 11 | Dialogs on the Family and Documents tabs: add/edit/deactivate member, add document, check values (OCR + confirm), versions, change label (`src/live/FamilyDocs.jsx`) |
| 3b Default nominee, linked holders | 2 | Cards on the Family tab, backed by new B-01 endpoints |
| 4 Consent | 7 | Record, withdraw, personal-data consent, history (`src/live/Consent.jsx`) |
| 5 Vehicles | 3 | Add vehicle (RC + photos), mark sold / active (`src/live/Vehicles.jsx`) |
| R Redirects | 2 | PE2, PA1 redirected |
| 1 New quotation wizard | 12 | `/quotations/new` and `/quotations/:id/edit` (`src/live/QuotationWizard.jsx`) |
| 1b Payment states | 5 | Mark failed / link expired / reverse on the quotation (`src/live/PaymentStates.jsx`) |
| 6 Proposal wizard | 8 | `/proposals/:id/edit` (`src/live/ProposalWizard.jsx`) |
| 7b Cancel proposal | 1 | Dialog + new B-02 endpoint |

Also: Customer Payments tab now uses one request (B-04); Activities tab uses one request (B-05/B-06);
lint errors 4 → 0 and the duplicate redirect key removed (F-10).

## Backend changes (insurehub-backend)
B-01 default nominee + linked holders · B-02 proposal cancel · B-03 documents library · B-04 payments by customer ·
B-05/B-06 customer activity (assistants: no old/new values) · B-08 non-English file names · B-09 one gender format.
New proposals now start with the customer's default nominee (OPEN-QUESTIONS Q51).
**B-07 (SkyUp maker-checker) is not built: it needs a business decision on the approval rules.**

## How it was checked
| Check | Result |
|---|---|
| Backend `tsc --noEmit` | Clean |
| Frontend `vite build` | Passes |
| Frontend `oxlint` | 0 errors (70 warnings, all pre-existing style warnings) |
| Pure functions (file-name decoding, gender normalising) run directly | Correct |
| Browser test with a stubbed API: quotation wizard Customer → Review, premium shown; family dialog opens; no page errors | Passed (found and fixed one bug) |
| **Backend integration tests** (new ones in `tests/integration-gaps.int.test.ts` and `tests/payments-proposals.int.test.ts`) | **Written, NOT run**: the sandbox cannot download MongoDB. Run `npm test` on your machine before release |
| New dialogs (consent, vehicles, documents, proposal wizard) against the real API | **Not tested end to end** |

## Still on mock data (93 frames to wire)
7 Record policy / policy nominees (3) · 8 Renewal quotation (7) · 9 Comparisons (10) · 10 Add my product, price versions (18) ·
11 Feature tables (9) · 12 Documents library (1, backend B-03 now ready) · 13 Campaign connect (14) · 14 Message detail (1) ·
15 Subscription banners (3) · 16 Public pages (6) · 17 SkyUp Admin (21, approvals wait on B-07).
The 4 design-reference frames are intentionally not connected.
