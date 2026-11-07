// Display helpers: turn API values into the strings the Figma screens show. All times are IST.
const TZ = 'Asia/Kolkata'

const toDate = (v) => (v instanceof Date ? v : v ? new Date(v) : null)
const valid = (d) => d && !Number.isNaN(d.getTime())

/** 24 Oct 2026 */
export function fmtDate(v, { year = true } = {}) {
  const d = toDate(v)
  if (!valid(d)) return '—'
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', ...(year ? { year: 'numeric' } : {}), timeZone: TZ })
}
/** 11:00 AM */
export function fmtTime(v) {
  const d = toDate(v)
  if (!valid(d)) return ''
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: TZ })
}
/** 24 Oct 2026, 11:00 AM */
export const fmtDateTime = (v) => (valid(toDate(v)) ? `${fmtDate(v)}, ${fmtTime(v)}` : '—')

/** YYYY-MM-DD of a moment, in IST */
export function istDay(v = new Date()) {
  const d = toDate(v)
  return d.toLocaleDateString('en-CA', { timeZone: TZ })
}
const dayDiff = (v) => {
  const a = new Date(`${istDay(v)}T00:00:00Z`).getTime()
  const b = new Date(`${istDay()}T00:00:00Z`).getTime()
  return Math.round((a - b) / 86_400_000)
}
/** "Today, 11:00 AM" · "Tomorrow, 10:30 AM" · "Yesterday, 4:00 PM" · "29 Oct, 10:00 AM" */
export function fmtWhen(v) {
  const d = toDate(v)
  if (!valid(d)) return '—'
  const n = dayDiff(d)
  const day = n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : n === -1 ? 'Yesterday' : fmtDate(d, { year: false })
  return `${day}, ${fmtTime(d)}`
}
/** Short label: time for today, "Tomorrow", or "29 Oct" */
export function fmtShortWhen(v) {
  const d = toDate(v)
  if (!valid(d)) return '—'
  const n = dayDiff(d)
  return n === 0 ? fmtTime(d) : n === 1 ? 'Tomorrow' : fmtDate(d, { year: false })
}
/** Days from today (negative = past) */
export const daysFromToday = (v) => (valid(toDate(v)) ? dayDiff(v) : null)

/** "Monday, 26 Oct 2026" */
export function fmtLongToday() {
  return new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric', timeZone: TZ })
}
/** "Good morning" by IST hour */
export function greetingWord() {
  const h = Number(new Date().toLocaleString('en-GB', { hour: '2-digit', hour12: false, timeZone: TZ }))
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

/** "+919886012345" | "9886012345" → "98860 12345" */
export function fmtMobile(m) {
  if (!m) return '—'
  const d = String(m).replace(/\D/g, '').slice(-10)
  return d.length === 10 ? `${d.slice(0, 5)} ${d.slice(5)}` : String(m)
}
/** what the API accepts as a mobile: 10 digits */
export const cleanMobile = (m) => String(m || '').replace(/\D/g, '').slice(-10)

/** ₹21,340 */
export function fmtMoney(n, { decimals = 0 } = {}) {
  if (n === null || n === undefined || n === '') return '—'
  const v = Number(n)
  if (Number.isNaN(v)) return String(n)
  return `₹${v.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
}

export function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  return ((parts[0][0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

/** Stable pastel avatar colour per person (same palette as the designs) */
const AVATARS = ['#fde8c9', '#d9eafd', '#e9e3fc', '#d4f1e7', '#fbd5dd']
const AVATAR_CLS = ['bg-[#fde8c9]', 'bg-[#d9eafd]', 'bg-[#e9e3fc]', 'bg-[#d4f1e7]', 'bg-[#fbd5dd]']
const hash = (s) => [...String(s || '')].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)
export const avatarHex = (seed) => AVATARS[hash(seed) % AVATARS.length]
export const avatarClass = (seed) => AVATAR_CLS[hash(seed) % AVATAR_CLS.length]

/** API enum → design label: HIGH → High, FOLLOW_UP → Follow-up */
export const titleCase = (s) => (s ? String(s).toLowerCase().replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase()) : '')

export const LEAD_STATUS_LABEL = { NEW: 'New', CONTACTED: 'Contacted', QUALIFIED: 'Qualified', FOLLOW_UP: 'Follow-up', CONVERTED: 'Converted', LOST: 'Lost' }
/** design stage keys used by the board/list ↔ API status codes */
export const STAGE_TO_STATUS = { new: 'NEW', contacted: 'CONTACTED', qualified: 'QUALIFIED', followup: 'FOLLOW_UP', converted: 'CONVERTED', lost: 'LOST' }
export const STATUS_TO_STAGE = Object.fromEntries(Object.entries(STAGE_TO_STATUS).map(([k, v]) => [v, k]))