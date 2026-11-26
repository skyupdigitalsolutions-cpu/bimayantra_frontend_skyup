// /v1/auth, /v1/reference, /v1/flags, /v1/profile, /v1/kyc, /v1/files, /v1/audit — access and account basics.
import { http, p } from '../client'

export const auth = {
  // P-01 register (start free trial)
  registerOtp: (body) => http.post('/auth/register/otp', body), // { name, mobile, termsAccepted: true }
  registerVerify: (body, opts) => http.post('/auth/register/verify', body, opts), // { mobile, code }
  // P-02 login
  loginOtp: (body) => http.post('/auth/login/otp', body), // { mobile }
  loginVerify: (body, opts) => http.post('/auth/login/verify', body, opts), // { mobile, code }
  // P-03 session
  refresh: () => http.post('/auth/refresh', {}),
  logout: () => http.post('/auth/logout', {}),
  me: () => http.get('/auth/me'),
  sessions: () => http.get('/auth/sessions'),
  endSession: (id) => http.del(p`/auth/sessions/${id}`),
  // Step-up OTP (CFG-83)
  stepUpOtp: () => http.post('/auth/step-up/otp', {}),
  stepUpVerify: (code) => http.post('/auth/step-up/verify', { code }),
  // P-04 change registered mobile
  mobileCurrentOtp: () => http.post('/auth/mobile/current/otp', {}),
  mobileCurrentVerify: (code) => http.post('/auth/mobile/current/verify', { code }),
  mobileNewOtp: (body) => http.post('/auth/mobile/new/otp', body), // { changeToken, newMobile }
  mobileNewVerify: (body, opts) => http.post('/auth/mobile/new/verify', body, opts), // { changeToken, newMobile, code }
}

export const reference = { get: () => http.get('/reference') }

export const flags = {
  mine: () => http.get('/flags'),
  // SkyUp Admin (step-up OTP + reason)
  adminList: () => http.get('/admin/flags'),
  adminAccounts: (key, query) => http.get(p`/admin/flags/${key}/accounts`, query),
  adminSet: (key, body) => http.put(p`/admin/flags/${key}`, body),
  adminSetForAccount: (key, accountId, body) => http.put(p`/admin/flags/${key}/accounts/${accountId}`, body),
}

export const profile = {
  get: () => http.get('/profile'),
  updateSection: (section, body) => http.put(p`/profile/${section}`, body),
}

export const kyc = {
  get: () => http.get('/kyc'),
  submit: (body, opts) => http.put('/kyc', body, opts),
  // SkyUp review (advisor KYC is confirmed by an admin)
  adminList: (query) => http.get('/admin/kyc', query),
  adminGet: (accountId) => http.get(p`/admin/kyc/${accountId}`),
  adminDecide: (accountId, body, opts) => http.post(p`/admin/kyc/${accountId}/decision`, body, opts),
}

// Formats and size limit per upload purpose, from /reference (fileRules). Set once the reference lists load.
let FILE_RULES = {}
const orList = (l) => (l.length <= 1 ? l.join('') : `${l.slice(0, -1).join(', ')} or ${l[l.length - 1]}`)
const ruleOf = (purpose) => FILE_RULES[purpose] ?? null

export const files = {
  setRules: (rules) => { FILE_RULES = rules || {} },
  /** "JPG, JPEG or PNG, up to 2 MB" for the hint under an upload box (empty until the rules have loaded). */
  hint: (purpose) => { const r = ruleOf(purpose); return r ? `${orList(r.types)}, up to ${r.maxMb} MB` : '' },
  /** The accept attribute for <input type="file">. */
  accept: (purpose) => { const r = ruleOf(purpose); return r ? r.types.map((t) => `.${t.toLowerCase()}`).join(',') : '.pdf,.jpg,.jpeg,.png' },
  /** A clear message before uploading (format, then size), or null. The server checks the same again. */
  check: (file, purpose) => {
    const r = ruleOf(purpose)
    if (!r || !file) return null
    const ext = String(file.name || '').split('.').pop().toUpperCase()
    const types = r.types.map((t) => t.toUpperCase())
    if (ext && !types.includes(ext) && !(ext === 'JPEG' && types.includes('JPG')) && !(ext === 'JPG' && types.includes('JPEG'))) {
      return `This file is a ${ext}. Upload a ${orList(r.types)} file of up to ${r.maxMb} MB.`
    }
    if (file.size > r.maxMb * 1024 * 1024) return `This file is ${(file.size / 1024 / 1024).toFixed(1)} MB. The largest allowed is ${r.maxMb} MB (${orList(r.types)}). Upload a smaller file.`
    return null
  },
  /** purpose: PROFILE_PHOTO | BUSINESS_LOGO | KYC_PAN | KYC_LICENCE | APPOINTMENT_LETTER | CUSTOMER_DOCUMENT | BROCHURE | POLICY_DOCUMENT */
  upload: (file, purpose) => {
    const problem = files.check(file, purpose)
    if (problem) return Promise.reject(Object.assign(new Error(problem), { status: 400, fieldErrors: { file: problem } }))
    // The server's own checks answer with a clear message (VAL-23/24/26). When the upload never reaches it, say what
    // to do instead of "The API did not answer": a file too large for the connection (413) or no answer at all.
    const r = ruleOf(purpose)
    const size = `${(file.size / 1024 / 1024).toFixed(1)} MB`
    const allowed = r ? `${orList(r.types)} file of up to ${r.maxMb} MB` : 'smaller file'
    return http.raw('/files', file, { purpose }).catch((e) => {
      if (e?.name === 'AbortError' || (e?.status && e.status < 500 && e.status !== 413 && e.code !== 'API_UNREACHABLE')) throw e
      const message = e?.status === 413 || (e?.code === 'API_UNREACHABLE' && file.size > 1024 * 1024)
        ? `This file (${size}) is too large to upload. Upload a ${allowed}. For a photo, take it at a lower resolution or send a screenshot of it.`
        : `The file (${size}) could not be uploaded: the server did not answer. Check the internet connection and try again. Allowed: ${allowed}.`
      throw Object.assign(new Error(message), { status: e?.status ?? 0, code: 'UPLOAD_FAILED', fieldErrors: { file: message } })
    })
  },
  open: (id) => http.get(p`/files/${id}`),
  /** URL usable in <img src>/<a href> (same-origin cookie auth). */
  url: (id) => `${import.meta.env.VITE_API_BASE || '/v1'}/files/${encodeURIComponent(id)}`,
}

export const audit = {
  list: (query) => http.get('/audit', query),
  export: (query) => http.get('/audit/export', query),
}