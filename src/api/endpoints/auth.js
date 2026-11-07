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

export const files = {
  /** purpose: PROFILE_PHOTO | BUSINESS_LOGO | KYC_PAN | KYC_LICENCE | APPOINTMENT_LETTER | CUSTOMER_DOCUMENT | BROCHURE | POLICY_DOCUMENT */
  upload: (file, purpose) => http.raw('/files', file, { purpose }),
  open: (id) => http.get(p`/files/${id}`),
  /** URL usable in <img src>/<a href> (same-origin cookie auth). */
  url: (id) => `${import.meta.env.VITE_API_BASE || '/v1'}/files/${encodeURIComponent(id)}`,
}

export const audit = {
  list: (query) => http.get('/audit', query),
  export: (query) => http.get('/audit/export', query),
}