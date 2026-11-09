# Advisor integrations, message templates per trigger, wallet hidden

## Settings → Integrations (the advisor's own MSG91 and Brevo)
- New module `src/modules/integrations/` (model, service, routes), mounted at `/v1/integrations`:
  `GET /` · `PUT /:provider` (msg91 | brevo) · `POST /:provider/test` · `DELETE /:provider` · `GET /msg91/templates`.
- Details are checked with the provider before saving (`checkOwnAccount` in `lib/msg91.ts`, `checkBrevo` in
  `comms/brevo.ts`). Wrong key → `INT-03` on the key field; number not on the MSG91 account → `INT-04`; sender not
  verified in Brevo → `INT-05`; provider unreachable → `INT-06` (503). Nothing is saved on any error.
- Key and config (number / sender) are stored encrypted (`secretEnc`, `configEnc`); only the last 4 characters are returned.
- Each connection has its own webhook address (`/v1/webhooks/msg91/<token>`, `/v1/webhooks/brevo/<token>`). Events that
  arrive there update only that account's messages; template decisions are accepted only on SkyUp's own address.
- Leaving the key blank when changing details keeps the saved key (it is checked again).
- New capability `integrations.manage` (ADV).

## Settings → Message templates (which template goes out for which trigger)
- `src/modules/comms/rules.ts`, mounted at `/v1/message-rules`: `GET /` · `PUT /:trigger`. Capability `rules.manage` (ADV).
- Triggers: `LEAD_WELCOME` (new), `FOLLOW_UP` (new), `RENEWAL_REMINDER`, `BIRTHDAY`, `FAMILY_BIRTHDAY`, `ANNIVERSARY`,
  `QUOTATION_EMAIL`. Per channel: `OFF`, `DEFAULT` (Bimayantra's template), `OWN`.
  - WhatsApp `OWN`: an APPROVED template from the advisor's MSG91 account with no media header; each blank `{{n}}` is
    mapped to one of the trigger's values (`MR-02`…`MR-07`, `COM-03`). Sent by position (`body_1…n`) from the advisor's number.
  - Email `OWN`: the advisor's subject and message with `{values}`; sent through their Brevo, or Bimayantra's when not connected.
  - `OWN` WhatsApp without a working MSG91 connection falls back to Bimayantra's template.
- `LEAD_WELCOME` and `FOLLOW_UP` start OFF. `queueLeadMessages()` (every minute, from the sweep) queues them only for
  leads from the time the trigger was turned on and from the last day; repeat-safe by occurrence key. At send time:
  lead still open, follow-up not moved, WhatsApp consent (`L:<lead>`) given. STOP replies now also withdraw lead consent.
- Greeting triggers drive `greetings.on`; turning a trigger off cancels its queued messages.
- New Bimayantra templates (WhatsApp + email) for the two new triggers are seeded by `ensureSystemTemplates()`.
- Communications list shows the lead's name for lead messages.

## WhatsApp wallet hidden
- `WHATSAPP_WALLET` (env, default `false`). Off: `/v1/wallet/*` and the admin wallet credit answer 404; no balance check,
  no `WAL-03` pause, no per-message debit. `true` restores the previous behaviour. Messages through the advisor's own
  MSG91 never use the wallet. Existing wallet data is untouched.
- Tests keep `WHATSAPP_WALLET=true` for the older wallet suites (`tests/setup-env.ts`); `tests/integrations.int.test.ts`
  covers the hidden case.

## Tests
- New: `tests/integrations.int.test.ts` (6 tests).

## New BimaYantra logo
- `src/assets/logo-mark.png` (the "B" mark) and `src/assets/logo-full.png` (mark + "BimaYantra"), cut from the brand
  artwork with a transparent background. The old `logo.svg` (src/assets and public) is removed.
- The mark is used in every logo badge: advisor sidebar, tablet rail, mobile app bar, SkyUp admin rail and referrer
  portal. Those badges are now white (the mark's navy would disappear on the old navy badge).
- Sign-in / sign-up page: the full wordmark on a white panel, replacing the old icon + "Bimayantra" text.
- Browser tab and home-screen icons: `public/favicon-32.png`, `favicon-192.png`, `favicon-512.png`,
  `apple-touch-icon.png`; page title spelled "BimaYantra".
