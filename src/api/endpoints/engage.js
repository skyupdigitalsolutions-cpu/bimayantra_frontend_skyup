// Communications, greetings, WhatsApp wallet, referrals, call logs, campaigns, my insurers.
import { http, p } from '../client'

export const communications = {
  list: (query) => http.get('/communications', query),
  cancel: (id, body) => http.post(p`/communications/${id}/cancel`, body),
  resend: (id, body, opts) => http.post(p`/communications/${id}/resend`, body, opts),
}

export const greetings = {
  get: () => http.get('/greetings'),
  save: (body) => http.put('/greetings', body),
}

export const wallet = {
  get: () => http.get('/wallet'),
  recharge: (body, opts) => http.post('/wallet/recharge', body, opts),
  /** After Razorpay Checkout: { razorpayOrderId, razorpayPaymentId, razorpaySignature } */
  verifyRecharge: (id, body) => http.post(p`/wallet/recharge/${id}/verify`, body),
}

export const referrers = {
  list: (query) => http.get('/referrers', query),
  create: (body, opts) => http.post('/referrers', body, opts),
  disable: (id, body) => http.post(p`/referrers/${id}/disable`, body),
  enable: (id, body) => http.post(p`/referrers/${id}/enable`, body),
  newLink: (id, body) => http.post(p`/referrers/${id}/new-link`, body),
}

/** The referrer's own portal (role REF) */
export const referral = {
  me: () => http.get('/referral/me'),
  myReferrals: (query) => http.get('/referral/me/referrals', query),
  refer: (body, opts) => http.post('/referral/me/refer', body, opts),
}

export const calls = {
  list: (query) => http.get('/call-logs', query),
  today: () => http.get('/call-logs/today'),
  forLead: (leadId) => http.get(p`/call-logs/lead/${leadId}`),
  match: (query) => http.get('/call-logs/match', query),
  audioUrl: (callId, recId) => `${import.meta.env.VITE_API_BASE || '/v1'}/call-logs/${encodeURIComponent(callId)}/recordings/${encodeURIComponent(recId)}/audio`,
  // used by the mobile app; listed so the web client covers every endpoint
  sync: (body, opts) => http.post('/call-logs/sync', body, opts),
  appCall: (body, opts) => http.post('/call-logs/app-call', body, opts),
  uploadRecording: (formData, opts) => http.upload('/call-logs/recording', formData, opts), // multipart field "recording"
}

export const campaigns = {
  platforms: () => http.get('/campaigns/platforms'),
  connections: () => http.get('/campaigns/connections'),
  connect: (body, opts) => http.post('/campaigns/connections', body, opts),
  /** Own-app Meta / LinkedIn: { channel, name, pageId+pageToken+appSecret | accountUrn+accessToken+clientSecret, …details } */
  connectManual: (body, opts) => http.post('/campaigns/connections/manual', body, opts),
  updateManual: (id, body) => http.put(p`/campaigns/connections/${id}/manual`, body),
  /** Edit details: name, pipelineId, defaultStatus, adSetName, parentCampaign, category, contactPageUrl, campaignIds, formIds */
  saveSettings: (id, body) => http.put(p`/campaigns/connections/${id}/settings`, body),
  rotateKey: (id) => http.post(p`/campaigns/connections/${id}/rotate-key`, {}),
  disconnect: (id, body) => http.post(p`/campaigns/connections/${id}/disconnect`, body),
  reconnect: (id, body) => http.post(p`/campaigns/connections/${id}/reconnect`, body),
  embedForms: (id, body) => http.post(p`/campaigns/connections/${id}/embed-forms`, body),
  syncNow: (id) => http.post(p`/campaigns/connections/${id}/sync-now`, {}),
  sources: (id) => http.get(p`/campaigns/connections/${id}/sources`),
  saveSources: (id, body) => http.put(p`/campaigns/connections/${id}/sources`, body),
  startOAuth: (channel, body) => http.post(p`/campaigns/oauth/${channel}/start`, body), // META | GOOGLE | LINKEDIN → { url }
  forms: (query) => http.get('/campaigns/forms', query),
  saveForm: (id, body) => http.put(p`/campaigns/forms/${id}`, body), // field mapping, pipeline …
  submissions: (query) => http.get('/campaigns/submissions', query),
  retrySubmission: (id) => http.post(p`/campaigns/submissions/${id}/retry`, {}),
  leadAnswers: (leadId) => http.get(p`/campaigns/leads/${leadId}/answers`),
  list: (query) => http.get('/campaigns', query),
  get: (id) => http.get(p`/campaigns/${id}`),
  leads: (id, query) => http.get(p`/campaigns/${id}/leads`, query),
}

export const myInsurers = {
  list: () => http.get('/my-insurers'),
  available: () => http.get('/my-insurers/available'),
  add: (body, opts) => http.post('/my-insurers', body, opts),
  update: (id, body) => http.patch(p`/my-insurers/${id}`, body),
  deactivate: (id, body) => http.post(p`/my-insurers/${id}/deactivate`, body),
  activate: (id, body) => http.post(p`/my-insurers/${id}/activate`, body),
  catalogue: (query) => http.get('/insurers', query),
}