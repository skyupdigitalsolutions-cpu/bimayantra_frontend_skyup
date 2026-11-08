// Bimayantra API client — the single place that talks HTTP to bimayantra-api (insurehub-backend).
//
// Conventions implemented here (README › "Conventions every client must follow"):
//  • Sessions: HttpOnly cookies set by the API → every request uses credentials: 'include'.
//    The Vite dev server proxies /v1 to the API, so the browser sees one origin and the
//    backend's Origin check (CORS_ORIGINS) passes.
//  • Expired access token (401 TOKEN_EXPIRED) → one silent POST /auth/refresh, then the request is repeated.
//    Any other 401 → the session is over: listeners registered with onSessionEnded() are told.
//  • Idempotency-Key: sent on every POST/PUT/PATCH/DELETE. Pass `idempotencyKey` to reuse the key
//    made when a form opened (useMutation does this), otherwise a fresh one is made per call.
//  • Step-up OTP (403 STEP_UP_REQUIRED): the handler registered with setStepUpHandler() asks the
//    user for the OTP and returns a token; the request is repeated with X-Step-Up-Token.
//  • Envelope: success → { data, meta? }, error → { error: { code, messageId, message, fields?, details?, requestId } }.
//    Every call resolves to { data, meta } and rejects with ApiError.

export const API_BASE = (import.meta.env.VITE_API_BASE || '/v1').replace(/\/$/, '')

export class ApiError extends Error {
  constructor({ status = 0, code = 'NETWORK', messageId = 'GEN-07', message, fields = [], details = null, requestId = null } = {}) {
    super(message || 'Could not reach Bimayantra. Your entries are kept. Check your internet connection and select Retry.')
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.messageId = messageId
    this.fields = fields || []
    this.details = details
    this.requestId = requestId
  }
  /** { fieldName: message } for inline form errors */
  get fieldErrors() {
    return Object.fromEntries((this.fields || []).map((f) => [f.field, f.message]))
  }
  is(...codes) {
    return codes.includes(this.code)
  }
}

export const newIdempotencyKey = () =>
  (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`)

/* ───────── session + step-up hooks (set by AuthProvider) ───────── */
const sessionListeners = new Set()
export function onSessionEnded(fn) {
  sessionListeners.add(fn)
  return () => sessionListeners.delete(fn)
}
const emitSessionEnded = (err) => sessionListeners.forEach((fn) => fn(err))

let stepUpHandler = null
/** fn(error) => Promise<string stepUpToken | null> */
export function setStepUpHandler(fn) {
  stepUpHandler = fn
}

/* ───────── helpers ───────── */
function buildUrl(path, query) {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`
  if (!query) return url
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null || v === '') continue
    qs.set(k, Array.isArray(v) ? v.join(',') : v instanceof Date ? v.toISOString() : String(v))
  }
  const s = qs.toString()
  return s ? `${url}?${s}` : url
}

async function parse(res) {
  if (res.status === 204) return { data: null }
  const type = res.headers.get('content-type') || ''
  if (type.includes('application/json')) return res.json()
  // files (exports, audio, PDFs): hand back the blob
  return { data: await res.blob(), meta: { contentType: type, filename: filenameOf(res) } }
}

function filenameOf(res) {
  const cd = res.headers.get('content-disposition') || ''
  const m = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(cd)
  return m ? decodeURIComponent(m[1]) : null
}

let refreshing = null
async function refreshSession() {
  // One refresh for all requests that hit TOKEN_EXPIRED at the same time.
  refreshing ??= fetch(buildUrl('/auth/refresh'), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  })
    .then((r) => r.ok)
    .catch(() => false)
    .finally(() => setTimeout(() => { refreshing = null }, 0))
  return refreshing
}

const WRITE = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

/**
 * request(method, path, { query, body, headers, idempotencyKey, stepUpToken, signal, form })
 * → Promise<{ data, meta }>
 */
export async function request(method, path, opts = {}) {
  const { query, body, headers = {}, idempotencyKey, stepUpToken, signal, form, raw, _retried = false, _stepped = false } = opts
  const h = { Accept: 'application/json', ...headers }
  let payload
  if (form) {
    payload = form // FormData: the browser sets the multipart boundary
  } else if (raw) {
    payload = raw // File/Blob sent as raw bytes (POST /files)
    h['Content-Type'] = raw.type || 'application/octet-stream'
    if (raw.name) h['X-File-Name'] = /^[\x20-\x7e]*$/.test(raw.name) ? raw.name : encodeURIComponent(raw.name)
  } else if (body !== undefined) {
    h['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  } else if (WRITE.has(method)) {
    h['Content-Type'] = 'application/json'
    payload = '{}'
  }
  if (WRITE.has(method)) h['Idempotency-Key'] = idempotencyKey || newIdempotencyKey()
  if (stepUpToken) h['X-Step-Up-Token'] = stepUpToken

  let res
  try {
    res = await fetch(buildUrl(path, query), { method, credentials: 'include', headers: h, body: payload, signal })
  } catch (e) {
    if (e?.name === 'AbortError') throw e
    throw new ApiError({}) // GEN-07: network
  }

  // The API only ever answers JSON or files — never an HTML page. HTML means /v1 hit the static host
  // (SPA fallback serving index.html) instead of the API: fail loudly rather than treat the page as data.
  if ((res.headers.get('content-type') || '').includes('text/html')) {
    throw new ApiError({ status: res.status, code: 'API_UNREACHABLE', message: `The API did not answer at ${API_BASE}. Check the API proxy / VITE_API_BASE setting.` })
  }

  const json = await parse(res).catch(() => ({}))
  if (res.ok) return { data: json?.data ?? null, meta: json?.meta ?? {} }

  const err = new ApiError({ status: res.status, ...(json?.error || { code: `HTTP_${res.status}`, messageId: 'GEN-07', message: res.statusText }) })

  // Expired access token → refresh once and repeat (same idempotency key, so a write is never doubled).
  if (res.status === 401 && err.code === 'TOKEN_EXPIRED' && !_retried && !path.startsWith('/auth/refresh')) {
    if (await refreshSession()) {
      return request(method, path, { ...opts, idempotencyKey: h['Idempotency-Key'], _retried: true })
    }
  }
  if (res.status === 401 && !path.startsWith('/auth/login') && !path.startsWith('/auth/register') && !path.startsWith('/auth/logout')) {
    emitSessionEnded(err)
  }
  // Sensitive action → ask for the step-up OTP, then repeat.
  if (res.status === 403 && err.code === 'STEP_UP_REQUIRED' && stepUpHandler && !_stepped) {
    const token = await stepUpHandler(err)
    if (token) return request(method, path, { ...opts, idempotencyKey: h['Idempotency-Key'], stepUpToken: token, _stepped: true })
  }
  throw err
}

export const http = {
  get: (path, query, opts) => request('GET', path, { ...opts, query }),
  post: (path, body, opts) => request('POST', path, { ...opts, body }),
  put: (path, body, opts) => request('PUT', path, { ...opts, body }),
  patch: (path, body, opts) => request('PATCH', path, { ...opts, body }),
  del: (path, body, opts) => request('DELETE', path, { ...opts, body }),
  upload: (path, form, opts) => request('POST', path, { ...opts, form }),
  raw: (path, file, query, opts) => request('POST', path, { ...opts, raw: file, query }),
}

/** Build a path with encoded params: p`/leads/${id}/status` */
export const p = (strings, ...vals) => strings.reduce((acc, s, i) => acc + s + (i < vals.length ? encodeURIComponent(vals[i]) : ''), '')
