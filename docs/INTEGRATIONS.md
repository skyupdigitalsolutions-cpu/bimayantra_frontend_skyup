# Bimayantra — Campaign integrations (Meta Ads, Google Ads, Website)

How leads from **Meta (Facebook + Instagram) Lead Ads**, **Google Ads lead form assets** and **advisor websites**
reach Bimayantra, which credentials each one needs, where each value comes from and where it is stored.

- Backend: `bimayantra-api` (Express + Drizzle + Postgres on Supabase, deployed on Railway).
- Frontend: this app. In-app version of this guide: **`/campaigns/guide`** (tabs Meta Ads / Google Ads / Website).
- Doc research date: **31 Oct 2026**. Meta Graph API examples use **v26.0**, Google Ads API examples use **v26**
  (both are the versions the official pages showed on that date). Re-check versions when you build.

> Replace `https://api.bimayantra.in` everywhere below with the real public URL of `bimayantra-api`
> (Railway custom domain). All webhook URLs must be **HTTPS with a valid certificate** (Meta does not accept self-signed certificates).

---

## 0. The short answer (for the client)

| Platform | What Bimayantra (the platform owner) needs once | What each advisor does | Secrets that live only on the server |
|---|---|---|---|
| **Meta Ads** | A Meta **Business** app with Facebook Login for Business + Webhooks; **App ID**, **App Secret**; a **webhook verify token**; permissions `leads_retrieval`, `pages_manage_metadata`, `pages_show_list`, `pages_read_engagement`, `ads_management` (+ `ads_read` for spend, `pages_manage_ads`, `business_management`) approved for **Advanced Access** through **App Review**, plus **Business Verification** | Clicks **Continue with Facebook**, picks the Page + ad account + lead forms. If their Business has customised Leads Access, they give the Bimayantra app access in **Leads Access Manager** | App Secret, verify token, every user/Page access token |
| **Google Ads** | For campaign metrics (spend, cost per lead): a Google Ads **developer token** (Basic or Standard access), an OAuth **client ID** + **client secret** (Google Cloud project, consent screen **In production**) | Pastes the **webhook URL** and **key** Bimayantra shows into each lead form asset → *Send test data*. Optionally clicks **Sign in with Google** so Bimayantra can read spend (gives us a **refresh token** + **customer ID**) | Developer token, client secret, refresh tokens, the per-advisor webhook key (stored hashed) |
| **Website** | Nothing beyond the API itself | Pastes the one-line **embed snippet** (public form key) **or** posts from their own backend with a **secret API key** + HMAC signature | Per-advisor website secret key |

**Lead delivery is webhook-based on all three** (no polling needed). Spend/cost-per-lead numbers are pulled on a schedule
from the Meta Insights API and the Google Ads API.

---

## 1. Meta Ads (Facebook + Instagram Lead Ads)

### 1.1 How it works

```
Person submits Instant Form ──► Meta sends POST /webhooks/meta  {object:"page", entry[].changes[].value.leadgen_id …}
                                   │  (only IDs, no answers)
bimayantra-api verifies X-Hub-Signature-256, replies 200 fast, queues job
                                   │
job: GET https://graph.facebook.com/v26.0/{leadgen_id}?fields=…&access_token={PAGE_TOKEN}
                                   │
map field_data → Bimayantra lead, dedupe on mobile, create lead + task + notification
```

The webhook only carries `leadgen_id`, `page_id`, `form_id`, `adgroup_id`, `ad_id`, `created_time`. The answers must be
fetched from the Graph API with a **Page access token** that has `leads_retrieval`.

### 1.2 One-time platform setup (Bimayantra / Skyup admin)

1. **Create the app** at <https://developers.facebook.com/apps> → *Create app* → choose the **Business** app type
   (in the newer use-case flow, pick the use case for capturing/managing ad leads with the Marketing API) and attach it to
   the Bimayantra Business portfolio.
2. **App settings → Basic**: copy **App ID** (public) and **App Secret** (secret → `META_APP_SECRET`). Fill privacy-policy URL,
   terms URL, app icon, category, data-deletion URL — App Review needs them.
3. **Add products**: *Facebook Login for Business* (redirect URI `https://app.bimayantra.in/integrations/meta/callback`)
   and *Webhooks*.
4. **Webhooks**: object **Page** → *Subscribe to this object* → **Callback URL** `https://api.bimayantra.in/webhooks/meta`,
   **Verify token** = the random string in `META_WEBHOOK_VERIFY_TOKEN` → *Verify and save* (Meta calls our GET handler) →
   subscribe to the **`leadgen`** field.
5. **Permissions** to request (Login for Business configuration + App Review):

   | Permission | Why Bimayantra needs it |
   |---|---|
   | `leads_retrieval` | Read the answers of each lead (`GET /{leadgen_id}`) |
   | `pages_manage_metadata` | Subscribe the advisor's Page to our app's `leadgen` webhook |
   | `pages_show_list` | Show the advisor the Pages they manage |
   | `pages_read_engagement` | Page metadata; dependency of the above |
   | `ads_management` | Required by the leadgen webhook install and to read ad/campaign info for leads |
   | `ads_read` | Ads Insights API → spend, cost per lead on the Campaigns screen |
   | `pages_manage_ads` | Listed by Meta for "read all lead and ad-level data" |
   | `business_management` | Listed as a dependency of `leads_retrieval`; lets us list the Business's ad accounts |

6. **Business Verification** (Business settings → Security centre). Required for **Advanced Access**.
7. **App Review**: request **Advanced Access** for the permissions above. Bimayantra reads leads of Pages it does not own,
   so Standard Access (own/role-holder assets only) is not enough for real advisors. Submit a screencast of: advisor logs
   in with Facebook → picks Page and forms → a test lead appears in Bimayantra → spend shows on Campaigns.
   Meta lists "Ads Management Standard Access" as a dependency of `leads_retrieval`.
8. Switch the app to **Live** mode. (The Lead Ads Testing Tool does **not** work while the app is in development mode.)

### 1.3 Each advisor connects (what the CN1–CN5 wizard does)

1. Advisor clicks **Continue with Facebook** → Facebook Login for Business returns a **short-lived user token** to our callback.
2. Server exchanges it for a **long-lived user token** (≈60 days):
   ```
   GET https://graph.facebook.com/v26.0/oauth/access_token
       ?grant_type=fb_exchange_token&client_id={APP_ID}&client_secret={APP_SECRET}&fb_exchange_token={SHORT_LIVED_TOKEN}
   ```
   (server only — never from the browser, it carries the App Secret).
3. `GET /v26.0/me/accounts?access_token={LONG_LIVED_USER_TOKEN}` → list of Pages, each with its own `access_token`.
   A Page token obtained from a long-lived user token is a **long-lived Page token** with no expiry date (it is invalidated
   if the user changes password, loses the Page role, removes the app, or permissions are revoked).
   The user must be able to perform the **ADVERTISE** task on the Page.
4. Subscribe the Page to our app:
   ```
   POST https://graph.facebook.com/v26.0/{page_id}/subscribed_apps?subscribed_fields=leadgen&access_token={PAGE_TOKEN}
   → {"success": true}
   ```
   `GET` on the same edge lists installed apps (use it for the "Connected" health check).
5. List forms for the CN2 checklist: `GET /v26.0/{page_id}/leadgen_forms?access_token={PAGE_TOKEN}`.
6. List ad accounts for spend: `GET /v26.0/me/adaccounts?fields=account_id,name` (user token).
7. **Leads Access Manager** — if the advisor's Business has customised leads access, Page admins no longer get leads
   automatically and our app must be assigned explicitly: *Meta Business Suite → Settings → Integrations → Leads access →
   select the Page → CRMs tab → Assign CRM → choose "Bimayantra"*. If leads access was never customised, all Page admins
   (and apps acting for them) have access.
8. Save to DB (encrypted): page id, Page token, ad account id, selected form ids, field mapping, pipeline.

### 1.4 Webhook endpoint spec — `GET|POST /webhooks/meta`

**Verification (GET)** — Meta calls once when you click *Verify and save*:

```
GET /webhooks/meta?hub.mode=subscribe&hub.verify_token=XXXX&hub.challenge=1158201444
→ 200 text/plain  "1158201444"          (if hub.verify_token === META_WEBHOOK_VERIFY_TOKEN)
→ 403                                    (otherwise)
```

**Lead notification (POST)**

```http
POST /webhooks/meta
Content-Type: application/json
X-Hub-Signature-256: sha256=8f7a…e21c

{
  "object": "page",
  "entry": [{
    "id": "103582271928374",
    "time": 1761454320,
    "changes": [{
      "field": "leadgen",
      "value": {
        "leadgen_id": "1186233940914402",
        "page_id": "103582271928374",
        "form_id": "823344019920117",
        "adgroup_id": "120210000000000123",
        "ad_id": "120210000000000123",
        "created_time": 1761454318
      }
    }]
  }]
}
```

- Validate `X-Hub-Signature-256` = `sha256=` + hex HMAC-SHA256 of the **raw request body** with the **App Secret**.
  Use the raw bytes (Meta signs the escaped-unicode payload; re-serialised JSON will not match).
- Reply `200` quickly (Meta's webhook docs ask for a response within a few seconds; the Messenger docs say 5 s) and process
  in a queue. Meta retries failed deliveries; after ~15 min of failures it alerts, after 1 h it **disables the subscription**
  and the Page must be re-subscribed → this is the **CA1b "Reconnect needed"** state.
- Deliveries can repeat → dedupe on `leadgen_id`.
- `entry` and `changes` are arrays: loop over both.

**Fetch the lead**

```
GET https://graph.facebook.com/v26.0/{leadgen_id}
    ?fields=id,created_time,ad_id,form_id,field_data,campaign_id,campaign_name,ad_name,platform,is_organic,custom_disclaimer_responses
    &access_token={PAGE_TOKEN}
```

```json
{
  "id": "1186233940914402",
  "created_time": "2026-10-26T05:02:01+0000",
  "ad_id": "120210000000000123",
  "form_id": "823344019920117",
  "field_data": [
    { "name": "full_name",    "values": ["Nikhil Shetty"] },
    { "name": "phone_number", "values": ["+919845122018"] },
    { "name": "email",        "values": ["nikhil.s@example.in"] },
    { "name": "city",         "values": ["Mangaluru"] },
    { "name": "who_do_you_want_to_cover?", "values": ["Me, wife and 2 kids"] }
  ]
}
```

`id, created_time, ad_id, form_id, field_data` are documented in Meta's *Retrieving Leads* guide. `campaign_id,
campaign_name, ad_name, platform, is_organic` are Lead-object fields we request for the CC1 "Where this lead came from"
card — confirm them against the Lead reference for your API version; if one is rejected, drop it and look the
campaign up from `ad_id`. Checkbox **custom disclaimer** answers (our WhatsApp-consent tick) are **not** in `field_data`;
read them from `custom_disclaimer_responses`.

**Backfill** (CN4 "Bring in leads from the last 30 days"):
`GET /v26.0/{form_id}/leads?fields=created_time,id,ad_id,form_id,field_data&filtering=[{"field":"time_created","operator":"GREATER_THAN","value":<unix>}]`.
Rate limit for lead reads: 200 × 24 × (leads created on the Page in the last 90 days) calls per 24 h.

### 1.5 Ad spend for the Campaigns screen

```
GET https://graph.facebook.com/v26.0/act_{AD_ACCOUNT_ID}/insights
    ?level=campaign&fields=campaign_id,campaign_name,spend,impressions,clicks,actions
    &date_preset=this_month&access_token={USER_OR_SYSTEM_USER_TOKEN}
```

Needs `ads_read` (or `ads_management`). Run every 1–3 h per connected ad account; cost per lead =
`spend / Bimayantra lead count for that campaign` (we count leads ourselves — the footnote on CA1 says this).

### 1.6 Token lifetime & refresh (Meta)

| Token | Lifetime | What we do |
|---|---|---|
| Short-lived user token | ~1–2 h | Exchange immediately, never store |
| Long-lived user token | ~60 days | Store encrypted; used for Insights + listing ad accounts. Ask the advisor to re-login before day 55 (banner) |
| Long-lived Page token | No expiry date | Store encrypted; used for leads. Invalidated by password change / role removal / app removal / permission revoke |
| (optional) System-user token | Non-expiring or 60-day, set in Business settings | Use for agency-managed accounts instead of a person's token |

On Graph error **190** (invalid/expired token) or **10/200** (permission) → mark the connection `reconnect_needed`
and show CA1b; after reconnect, backfill missed leads with the form `/leads` call above.

---

## 2. Google Ads

There are **two independent pieces**:

1. **Lead form webhook** → leads arrive in real time. Needs only a URL + key. **No API access, no OAuth.**
2. **Google Ads API** → spend / cost per lead on the Campaigns screen. Needs developer token + OAuth.

### 2.1 Lead form webhook (required)

**Bimayantra generates per advisor:** a webhook URL and a random key (shown on CN6/CN7 and in the guide; stored hashed).

**Advisor, inside Google Ads:**

- New form: *Campaigns → + → New campaign → goal **Leads** → … → Create lead form* (Search/Display: *Assets → More asset
  types → Lead forms*; Video: *Lead form → Form*).
- Existing form: *Campaigns menu → **Assets** → choose **Lead form** above the table → hover the form → pencil icon*.
- Expand **Export leads from Google Ads** → **Other data integration options** → **Webhook integration (optional)**:
  paste **Webhook URL** and **Key** → click **Send test data** (must turn green = our server answered 200) → **Save**.

**Request Google sends** (`POST`, JSON):

```json
{
  "lead_id": "TeSter-123-ABCDEFGHIJKLMNOPQRSTUVWXYZ-abcdefghijklmnopqrstuvwxyz-0123456789-AbCdEfGhIjKlMnOp",
  "user_column_data": [
    { "column_id": "FULL_NAME",    "string_value": "Vikram Rao",          "column_name": "Full Name" },
    { "column_id": "PHONE_NUMBER", "string_value": "+919900045121",       "column_name": "User Phone" },
    { "column_id": "EMAIL",        "string_value": "vikram.rao@example.in","column_name": "User Email" },
    { "column_id": "CITY",         "string_value": "Bengaluru" }
  ],
  "api_version": "1.0",
  "form_id": 40000000000,
  "campaign_id": 20000000000,
  "google_key": "bmy_gk_9f3c…",
  "is_test": true,
  "gcl_id": "Cj0KCQjw…BwE",
  "adgroup_id": 0,
  "creative_id": 0,
  "lead_submit_time": "2026-10-26T10:07:00+05:30"
}
```

Rules from Google's spec:

- Validate `google_key` before processing. (Google's own sample payloads spell it `Google_key` in two places — accept both.)
- Respond **`200` with body `{}`**. 4xx = not retried; 5xx = retried. Delivery is **not exactly-once** → dedupe on `lead_id`.
- `is_test: true` → test lead (from *Send test data*): store as test, don't notify/assign.
- Parse `form_id`, `campaign_id`, `adgroup_id`, `creative_id`, `asset_group_id` as 64-bit integers (keep as strings in JS).
  `adgroup_id`/`creative_id` only for video/discovery; `asset_group_id` only for Performance Max.
- Use **`column_id`**, not `column_name` (deprecated, may be missing). Ignore unknown fields.
- Standard `column_id`s we map: `FULL_NAME`, `FIRST_NAME`, `LAST_NAME`, `PHONE_NUMBER`, `EMAIL`, `CITY`, `POSTAL_CODE`, `REGION`.
- Test with curl: `curl -X POST -H "Content-Type: application/json" -d @request.json https://api.bimayantra.in/webhooks/google-ads`.

### 2.2 Google Ads API for metrics (optional but needed for spend / cost per lead)

| Value | Where to get it | Scope | Stored in |
|---|---|---|---|
| **Developer token** | Google Ads **manager (MCC)** account of Bimayantra → *Admin → API Center* | Platform | `.env` `GOOGLE_ADS_DEVELOPER_TOKEN` |
| Developer token **access level** | Starts at *Test* (test accounts only). Apply for **Explorer** (2,880 ops/day on prod), then **Basic** (15,000 ops/day, needs brand verification), then **Standard** (unlimited, ~10 business-day audit) on the Google Ads API page of the Cloud Console | Platform | — |
| **OAuth client ID / secret** | Google Cloud Console → enable *Google Ads API* → OAuth consent screen (scope `https://www.googleapis.com/auth/adwords`) → Credentials → *OAuth client ID* (Web application, redirect `https://api.bimayantra.in/integrations/google/callback`) | Platform | `.env` `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET` |
| **Refresh token** | Returned when the advisor clicks *Sign in with Google* (request `access_type=offline&prompt=consent`) | Per advisor | DB, encrypted |
| **Customer ID** | The advisor's Google Ads account (top right of Google Ads, e.g. `482-119-2201`) → send **without hyphens** `4821192201` | Per advisor | DB |
| **login-customer-id** | Only if access is through a manager account: the **manager's** 10-digit ID, sent as header `login-customer-id` | Per advisor / platform | DB or `.env` `GOOGLE_ADS_LOGIN_CUSTOMER_ID` |

Calls:

```
POST https://www.googleapis.com/oauth2/v3/token
     grant_type=refresh_token&client_id=…&client_secret=…&refresh_token=…      → access_token (≈1 h)

POST https://googleads.googleapis.com/v26/customers/4821192201/googleAds:search
Authorization: Bearer {access_token}
developer-token: {GOOGLE_ADS_DEVELOPER_TOKEN}
login-customer-id: 3105520098            # only via MCC
{ "query": "SELECT campaign.id, campaign.name, metrics.cost_micros, metrics.clicks, metrics.conversions
             FROM campaign WHERE segments.date DURING THIS_MONTH" }
```

`cost_micros / 1_000_000` = spend in the account currency (₹).

**Refresh-token gotchas:** if the OAuth consent screen is *External* and publishing status is **Testing**, refresh tokens
**expire after 7 days** → publish the app (*In production*). Tokens also stop working when the user revokes access,
after **6 months unused**, or when the user exceeds the live-token limit. On `invalid_grant` → mark `reconnect_needed`.

---

## 3. Website lead capture

Two options (CN8 lists both plus a WordPress plugin, which is just option A wrapped as a plugin).

### 3.1 Option A — embeddable snippet (no developer)

```html
<script src="https://forms.bimayantra.in/w.js" data-key="RIS-7KQ2M" data-pipeline="Health" async></script>
```

- `data-key` is a **public form key** (like a Stripe publishable key). It identifies the advisor; it is **not a secret**.
- Protection: server checks the request `Origin` against the advisor's **allowed domains**, rate-limits per key + IP,
  a hidden honeypot field, and (optional) reCAPTCHA/Turnstile token.
- The form includes the WhatsApp/SMS consent tick box (DPDP-friendly: we store consent text + timestamp + page URL).
- The script posts to `POST /webhooks/website` with header `X-Bimayantra-Form-Key`.

### 3.2 Option B — server-to-server webhook (advisor's developer)

- Advisor's backend posts JSON to `POST https://api.bimayantra.in/webhooks/website`.
- Headers:
  - `X-Bimayantra-Key-Id: wk_live_7KQ2M` (public id of the key)
  - `X-Bimayantra-Timestamp: 1761454320` (unix seconds; reject if older than 5 min)
  - `X-Bimayantra-Signature: sha256=<hex HMAC-SHA256(secret, timestamp + "." + rawBody)>`
- The **secret** (`wsk_live_…`) is shown **once** in Settings → Integrations, stored hashed/encrypted, and must **never** be
  placed in browser JavaScript.

Body:

```json
{
  "name": "Meera Iyer",
  "mobile": "+919740088213",
  "email": "meera.iyer@example.in",
  "city": "Bengaluru",
  "insurance_type": "health",
  "message": "Looking for a plan with maternity cover.",
  "consent_whatsapp": true,
  "page_url": "https://raoinsurance.in/get-quote",
  "utm_source": "google", "utm_medium": "organic", "utm_campaign": null,
  "external_id": "form-2026-10-26-0912-001"
}
```

Response: `201 {"lead_id":"LD-2610-00062","duplicate":false}` · `200 {"lead_id":"…","duplicate":true}` when the same
`external_id` (or same mobile within 24 h) arrives again · `400` validation · `401` bad key/signature · `429` rate limit.

Signing example (Node, advisor side):

```js
const ts = Math.floor(Date.now() / 1000).toString()
const body = JSON.stringify(payload)
const sig = crypto.createHmac('sha256', process.env.BIMAYANTRA_WEBSITE_SECRET).update(`${ts}.${body}`).digest('hex')
await fetch('https://api.bimayantra.in/webhooks/website', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Bimayantra-Key-Id': 'wk_live_7KQ2M',
             'X-Bimayantra-Timestamp': ts, 'X-Bimayantra-Signature': `sha256=${sig}` },
  body,
})
```

---

## 4. Credentials — where each value comes from and where it lives

| Value | From | Secret? | Lives in | Shown in UI? |
|---|---|---|---|---|
| Meta App ID | App Dashboard → Settings → Basic | No | `.env` `META_APP_ID` (+ web env for the Login button) | Yes (not needed by advisors) |
| Meta App Secret | App Dashboard → Settings → Basic | **Yes** | `.env` `META_APP_SECRET` | **Never** |
| Meta webhook verify token | We generate (`openssl rand -hex 24`) and paste in App Dashboard → Webhooks | **Yes** (low risk, still server-only) | `.env` `META_WEBHOOK_VERIFY_TOKEN` | Admin only, masked |
| Meta Login for Business config ID | App Dashboard → Facebook Login for Business → Configurations | No | `.env` `META_LOGIN_CONFIG_ID` | No |
| Meta long-lived user token | OAuth exchange | **Yes** | DB `integrations.meta_user_token` (AES-GCM encrypted) | Never |
| Meta Page access token | `GET /me/accounts` | **Yes** | DB `integrations.meta_page_token` (encrypted) | Never |
| Meta Page ID / ad account ID / form IDs | Graph API during wizard | No | DB | Yes (names shown) |
| Google Ads developer token | MCC → Admin → API Center | **Yes** | `.env` `GOOGLE_ADS_DEVELOPER_TOKEN` | Never |
| Google OAuth client ID | Cloud Console → Credentials | No | `.env` `GOOGLE_OAUTH_CLIENT_ID` | No |
| Google OAuth client secret | Cloud Console → Credentials | **Yes** | `.env` `GOOGLE_OAUTH_CLIENT_SECRET` | Never |
| Google refresh token | OAuth consent (per advisor) | **Yes** | DB encrypted | Never |
| Google Ads customer ID | Advisor's Google Ads account | No | DB | Yes |
| Google login-customer-id (MCC) | Manager account ID | No | DB / `.env` | Yes |
| Google lead-form webhook URL | Bimayantra | No | Derived | **Yes** — advisor pastes it into Google Ads |
| Google lead-form webhook key (`google_key`) | Bimayantra generates per advisor | **Yes** (shared with Google only) | DB: SHA-256 hash; plaintext shown to the advisor in the wizard | Yes, masked + copy button |
| Website public form key (`data-key`) | Bimayantra | No (publishable) | DB | Yes |
| Website secret key | Bimayantra, shown once | **Yes** | DB: hash | Shown once at creation |
| Token encryption key | We generate (32 bytes) | **Yes** | `.env` `INTEGRATIONS_ENC_KEY` | Never |

### 4.1 `.env` template for `bimayantra-api`

```dotenv
# Public base URL of this API (Railway custom domain) — used to build webhook URLs shown in the app
PUBLIC_API_URL=https://api.bimayantra.in
APP_URL=https://app.bimayantra.in

# ── Meta ───────────────────────────────────────────────
META_APP_ID=123456789012345
META_APP_SECRET=__secret__
META_GRAPH_VERSION=v26.0
META_WEBHOOK_VERIFY_TOKEN=__random_48_hex__
META_LOGIN_CONFIG_ID=__login_for_business_config_id__
META_OAUTH_REDIRECT_URI=https://app.bimayantra.in/integrations/meta/callback

# ── Google Ads ─────────────────────────────────────────
GOOGLE_ADS_DEVELOPER_TOKEN=__secret__
GOOGLE_ADS_API_VERSION=v26
GOOGLE_ADS_LOGIN_CUSTOMER_ID=3105520098        # only if every call goes through Bimayantra's MCC
GOOGLE_OAUTH_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=__secret__
GOOGLE_OAUTH_REDIRECT_URI=https://api.bimayantra.in/integrations/google/callback

# ── Website capture ────────────────────────────────────
WEBSITE_SIGNATURE_TOLERANCE_SEC=300

# ── Encryption for stored tokens (32 bytes, base64) ───
INTEGRATIONS_ENC_KEY=__base64_32_bytes__
```

Never commit `.env`; set these as Railway service variables. Never expose any of them through `NEXT_PUBLIC_*` /
`VITE_*` except `META_APP_ID` (needed by the Facebook Login button).

---

## 5. Express route skeletons (`bimayantra-api`)

> The raw body is needed for both HMAC checks, so mount these routes with `express.raw({ type: 'application/json' })`
> **before** the global `express.json()`.

```js
// src/routes/webhooks.js
import express from 'express'
import crypto from 'node:crypto'
import { db } from '../db/index.js'                       // Drizzle
import { enqueue } from '../jobs/queue.js'               // pg-boss / BullMQ / simple table queue
import { findConnectionByPageId, findGoogleConnectionByKeyHash,
         findWebsiteKey, createLeadFromWebsite } from '../services/integrations.js'

const router = express.Router()
const raw = express.raw({ type: 'application/json', limit: '1mb' })
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex')
const safeEqual = (a, b) => {
  const A = Buffer.from(String(a)), B = Buffer.from(String(b))
  return A.length === B.length && crypto.timingSafeEqual(A, B)
}

/* ── Meta: verification handshake ── */
router.get('/webhooks/meta', (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']
  if (mode === 'subscribe' && safeEqual(token, process.env.META_WEBHOOK_VERIFY_TOKEN)) {
    return res.status(200).type('text/plain').send(challenge)
  }
  return res.sendStatus(403)
})

/* ── Meta: lead notifications ── */
router.post('/webhooks/meta', raw, async (req, res) => {
  const header = req.get('X-Hub-Signature-256') || ''
  const expected = 'sha256=' + crypto.createHmac('sha256', process.env.META_APP_SECRET).update(req.body).digest('hex')
  if (!safeEqual(header, expected)) return res.sendStatus(401)

  const payload = JSON.parse(req.body.toString('utf8'))
  res.sendStatus(200)                                    // answer fast; work happens in the job

  if (payload.object !== 'page') return
  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== 'leadgen') continue
      const v = change.value
      const conn = await findConnectionByPageId(v.page_id)
      if (!conn) continue                                // page not connected to any advisor
      await enqueue('meta.fetchLead', {                  // job dedupes on leadgen_id (unique index)
        connectionId: conn.id, leadgenId: v.leadgen_id, formId: v.form_id, adId: v.ad_id, createdTime: v.created_time,
      })
    }
  }
})

/* ── Google Ads lead form webhook ── */
router.post('/webhooks/google-ads', raw, async (req, res) => {
  let body
  try { body = JSON.parse(req.body.toString('utf8')) } catch { return res.status(400).json({ message: 'Invalid JSON' }) }
  const key = body.google_key ?? body.Google_key           // Google's samples use both spellings
  if (!key) return res.status(400).json({ message: 'Missing google_key' })
  const conn = await findGoogleConnectionByKeyHash(sha256(key))   // unique per advisor
  if (!conn) return res.status(403).json({ message: 'Unknown key' })   // 4xx → Google does not retry
  if (!body.lead_id || !Array.isArray(body.user_column_data)) return res.status(400).json({ message: 'Bad payload' })

  try {
    await enqueue('google.ingestLead', {
      connectionId: conn.id,
      leadId: String(body.lead_id),                       // unique index → dedupe
      isTest: body.is_test === true,
      formId: String(body.form_id ?? ''), campaignId: String(body.campaign_id ?? ''),
      gclid: body.gcl_id ?? null, submittedAt: body.lead_submit_time ?? null,
      columns: body.user_column_data.map((c) => ({ id: c.column_id, value: c.string_value, name: c.column_name })),
    })
    return res.status(200).json({})
  } catch (e) {
    return res.status(500).json({ message: 'Temporary error' }) // 5xx → Google retries
  }
})

/* ── Website: snippet (public form key) or signed server-to-server ── */
router.post('/webhooks/website', raw, async (req, res) => {
  const formKey = req.get('X-Bimayantra-Form-Key')
  const keyId = req.get('X-Bimayantra-Key-Id')
  let key

  if (keyId) {                                             // signed server-to-server
    key = await findWebsiteKey({ keyId })
    const ts = Number(req.get('X-Bimayantra-Timestamp'))
    const tol = Number(process.env.WEBSITE_SIGNATURE_TOLERANCE_SEC || 300)
    if (!key || !ts || Math.abs(Date.now() / 1000 - ts) > tol) return res.status(401).json({ message: 'Bad key or timestamp' })
    const expected = 'sha256=' + crypto.createHmac('sha256', key.secret).update(`${ts}.`).update(req.body).digest('hex')
    if (!safeEqual(req.get('X-Bimayantra-Signature') || '', expected)) return res.status(401).json({ message: 'Bad signature' })
  } else if (formKey) {                                    // embedded snippet
    key = await findWebsiteKey({ formKey })
    const origin = req.get('Origin') || ''
    if (!key || !key.allowedOrigins.includes(origin)) return res.status(403).json({ message: 'Origin not allowed' })
    // + rate limit (per key + IP) and honeypot / captcha check here
  } else {
    return res.status(401).json({ message: 'Missing key' })
  }

  let b
  try { b = JSON.parse(req.body.toString('utf8')) } catch { return res.status(400).json({ message: 'Invalid JSON' }) }
  if (!b.name || !b.mobile) return res.status(400).json({ message: 'name and mobile are required' })

  const result = await createLeadFromWebsite(key.advisorId, b)   // normalises mobile, dedupes, stores consent
  return res.status(result.duplicate ? 200 : 201).json({ lead_id: result.leadCode, duplicate: result.duplicate })
})

export default router
```

```js
// src/jobs/meta.fetchLead.js — runs in the worker
const G = `https://graph.facebook.com/${process.env.META_GRAPH_VERSION}`
export async function metaFetchLead({ connectionId, leadgenId }) {
  const conn = await getConnection(connectionId)                         // decrypts page token
  const fields = 'id,created_time,ad_id,form_id,field_data,campaign_id,campaign_name,ad_name,platform,custom_disclaimer_responses'
  const r = await fetch(`${G}/${leadgenId}?fields=${fields}&access_token=${conn.pageToken}`)
  const j = await r.json()
  if (j.error) {
    if ([190, 10, 200].includes(j.error.code)) await markReconnectNeeded(connectionId, j.error.message)
    throw new Error(j.error.message)                                     // job retries with backoff
  }
  const answers = Object.fromEntries(j.field_data.map((f) => [f.name, f.values?.join(', ')]))
  await upsertLead(conn.advisorId, mapToLead('meta', answers, conn.mapping, j), { externalId: `meta:${j.id}` })
}
```

Middleware order in `app.js`:

```js
app.use(webhooksRouter)          // has its own express.raw()
app.use(express.json())          // everything else
```

---

## 6. Field mapping → Bimayantra lead

| Bimayantra lead field | Meta `field_data[].name` | Google `column_id` | Website JSON | Notes |
|---|---|---|---|---|
| **Name** (`lead.name`) | `full_name` (or `first_name` + `last_name`) | `FULL_NAME` (or `FIRST_NAME` + `LAST_NAME`) | `name` | Required |
| **Mobile** (`lead.primary_mobile`) | `phone_number` | `PHONE_NUMBER` / `PHONE_NUMBER_VERIFIED` | `mobile` | Normalise to E.164 `+91XXXXXXXXXX`; used for duplicate check ("Linked to existing") |
| **Email** | `email` | `EMAIL` / `WORK_EMAIL` | `email` | Lower-case |
| **City** | `city` | `CITY` (or `POSTAL_CODE` → city lookup) | `city` | |
| **Insurance type / pipeline** | From the form → pipeline chosen in CN2 (e.g. "Family cover quote" → Health) or a custom question | From the form asset → pipeline chosen in CN6 | `insurance_type` (`health`, `motor`, `life_term`, `travel`) | Decides pipeline + task template |
| **Source** | `Meta Ads` (+ `platform`: facebook / instagram) | `Google Ads` | `Website` | Fixed per connection |
| **Campaign** | `campaign_name` (or lookup via `ad_id`) | `campaign_id` → name via Google Ads API (cached) | `utm_campaign` or the form name | Shown as "Campaign" on CC1–CC3 |
| Ad / keyword | `ad_name` | `gcl_id`, `adgroup_id`, `creative_id` | `page_url`, `utm_*` | Stored on the lead's origin card |
| WhatsApp consent | `custom_disclaimer_responses` (checkbox) | Not available unless you add a custom question | `consent_whatsapp` | Store text + timestamp; else "Not recorded" |
| Notes | Every other question as "Q: A" lines | Every other `column_id` | `message` | Keep raw answers too (`lead.raw_answers` JSONB) |
| External ID | `leadgen_id` (unique) | `lead_id` (unique) | `external_id` | Unique index `(source, external_id)` = dedupe |

Advisors can override the per-question mapping on **CN3 / CN7** (`Map fields`).

---

## 7. Testing

| Platform | Tool | Steps |
|---|---|---|
| Meta | **Webhooks → Test** button in the App Dashboard | Sends a sample `leadgen` payload to the callback URL (signature check runs; Graph fetch will fail on the dummy ID — expected) |
| Meta | **Lead Ads Testing Tool** <https://developers.facebook.com/tools/lead-ads-testing> | Select Page → form → *Create lead* (or *Preview form* to type values) → *Track status* until **success**. One test lead per form; delete it (`DELETE /{lead_id}`) to create another. App must be **Live**, you need **Advertiser** role or above |
| Google | **Send test data** button under *Webhook integration* | Must show green (our 200). Payload has `is_test: true` and a dummy `form_id` for unsaved forms |
| Google | curl with a sample payload | `curl -X POST -H "Content-Type: application/json" -d @request.json https://api.bimayantra.in/webhooks/google-ads` |
| Website | CN9 "Send a test lead" | Or curl with a signed request (see §3.2) |

---

## 8. Common errors & fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| Meta "The URL couldn't be validated" when saving the webhook | GET handler not returning `hub.challenge` as plain text, verify token mismatch, non-HTTPS / self-signed cert, route behind auth | Check `META_WEBHOOK_VERIFY_TOKEN`, return the challenge string with 200, public HTTPS |
| No Meta webhooks at all | Page not subscribed (`GET /{page_id}/subscribed_apps` is empty), app still in Development mode, "App" platform disabled in Page settings, subscription auto-disabled after 1 h of failures | Re-run `POST /{page_id}/subscribed_apps?subscribed_fields=leadgen`; set app Live |
| Webhook arrives, `GET /{leadgen_id}` returns permission error | Missing `leads_retrieval` Advanced Access, token from a user without ADVERTISE task, or Leads Access Manager restricts the app | Complete App Review; reconnect with a Page admin/advertiser; assign the app in Leads Access Manager |
| Graph error 190 | Token expired / password changed / app removed | Mark `reconnect_needed` (CA1b), advisor reconnects, backfill via `/{form_id}/leads` |
| Signature mismatch on Meta | Hashing parsed/re-stringified JSON instead of raw body, wrong App Secret (test vs live app) | Use `express.raw` and the raw Buffer |
| Testing Tool: "can't be used in development mode" / lead stuck pending | App not Live / RTU delayed | Switch app to Live; click Track status again |
| Google "Send test data" fails | Non-200 response, timeout, wrong path, key not saved yet in Bimayantra | Return `200 {}`; save the key in Bimayantra before testing |
| Google leads duplicated | Retries (delivery is at-least-once) | Unique index on `lead_id` |
| Google Ads API `DEVELOPER_TOKEN_NOT_APPROVED` | Token still at Test level used on a production account | Apply for Explorer/Basic access |
| Google Ads API `USER_PERMISSION_DENIED` | Missing/incorrect `login-customer-id` when accessing through an MCC | Send the manager's 10-digit ID (no hyphens) |
| Google `invalid_grant` after a week | OAuth consent screen still in *Testing* (7-day refresh tokens) | Publish the consent screen; advisor reconnects |
| Website 401 | Clock skew > 5 min, signing a different string than the raw body | Sign `timestamp + "." + exact body bytes` |
| Website 403 from snippet | Domain not in allowed origins (www vs non-www) | Add both origins in Settings |

---

## 9. Sources (official docs consulted 31 Oct 2026)

Meta
- Leads webhooks (permissions, `subscribed_apps`, payload): <https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-leadgen/>
- Lead Ads webhooks CRM quickstart: <https://developers.facebook.com/documentation/ads-commerce/marketing-api/guides/lead-ads/quickstart/webhooks-integration.md>
- Retrieving leads (`GET /{lead_id}`, `/{form_id}/leads`, filtering, rate limit, `custom_disclaimer_responses`, Leads Access): <https://developers.facebook.com/documentation/ads-commerce/marketing-api/guides/lead-ads/retrieving>
- Testing & troubleshooting (Lead Ads Testing Tool): <https://developers.facebook.com/documentation/ads-commerce/marketing-api/guides/lead-ads/testing-troubleshooting>
- Webhook verification + `X-Hub-Signature-256`, retries, TLS: <https://developers.facebook.com/documentation/business-messaging/messenger-platform/webhooks>
- Long-lived tokens: <https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived/>
- Permissions reference (App Review, Business Verification, dependencies): <https://developers.facebook.com/documentation/development/permissions>
- Ads Insights API: <https://developers.facebook.com/documentation/ads-commerce/marketing-api/insights>
- Leads Access Manager (Business Help Center): <https://www.facebook.com/business/help/540596413257598>

Google
- Lead form webhook implementation (payload, response codes, column IDs): <https://developers.google.com/google-ads/webhook/docs/implementation>
- Webhook testing: <https://developers.google.com/google-ads/webhook/docs/testing>
- Webhook samples: <https://developers.google.com/google-ads/webhook/docs/samples>
- Set up webhook in Google Ads (UI path, Send test data): <https://support.google.com/google-ads/answer/16729613>
- Developer token access levels: <https://developers.google.com/google-ads/api/docs/api-policy/access-levels>
- REST auth headers (`developer-token`, `login-customer-id`, no hyphens): <https://developers.google.com/google-ads/api/rest/auth>
- OAuth single-user flow (`adwords` scope): <https://developers.google.com/google-ads/api/docs/oauth/single-user-authentication>
- Refresh token expiry (Testing = 7 days, 6 months unused): <https://developers.google.com/identity/protocols/oauth2>

### Not verified against the official page (confirm when implementing)
- Exact Meta app-creation labels in the new use-case flow, and the precise Leads Access Manager menu path (the Help Center page blocks automated reading).
- Lead-object fields beyond `id, created_time, ad_id, form_id, field_data` (`campaign_id`, `campaign_name`, `ad_name`, `platform`, `is_organic`).
- The Meta "respond within N seconds" limit for Page webhooks (5 s is documented for Messenger webhooks).
- Whether Google's `adwords` OAuth scope triggers Google's OAuth app verification for an external consent screen.
- How custom (non-standard) questions appear in Google `user_column_data` (Google's samples only show standard columns).
- Lead retention windows in the Meta / Google UIs.
