// Subscription & billing, exports, support access, SkyUp admin panel (Stage E2), comms templates, config.
import { http, p } from '../client'

export const billing = {
  get: () => http.get('/billing'),
  quote: (body) => http.post('/billing/quote', body),
  createOrder: (body, opts) => http.post('/billing/orders', body, opts),
  order: (id) => http.get(p`/billing/orders/${id}`),
  /** After Razorpay Checkout: { razorpayOrderId, razorpayPaymentId, razorpaySignature } */
  verifyOrder: (id, body) => http.post(p`/billing/orders/${id}/verify`, body),
  downgrade: (body) => http.post('/billing/downgrade', body),
}

export const exportsApi = {
  list: () => http.get('/exports'),
  request: (body, opts) => http.post('/exports', body, opts),
  download: (id) => http.get(p`/exports/${id}/download`), // resolves to { data: Blob, meta: { filename } }
}

/** Advisor gives SkyUp support access to their account */
export const supportGrants = {
  list: () => http.get('/support-grants'),
  staff: () => http.get('/support-grants/staff'),
  give: (body, opts) => http.post('/support-grants', body, opts),
  end: (id, body) => http.post(p`/support-grants/${id}/end`, body),
}

/** SkyUp staff working inside an account under a grant */
export const support = {
  overview: (accountId) => http.get(p`/support/${accountId}/overview`),
  leads: (accountId, query) => http.get(p`/support/${accountId}/leads`, query),
  quotations: (accountId, query) => http.get(p`/support/${accountId}/quotations`, query),
  documents: (accountId, query) => http.get(p`/support/${accountId}/documents`, query),
  customers: (accountId, query) => http.get(p`/support/${accountId}/customers`, query),
  customer: (accountId, id) => http.get(p`/support/${accountId}/customers/${id}`),
}

export const admin = {
  dashboard: () => http.get('/admin/dashboard'),
  accounts: (query) => http.get('/admin/accounts', query), // ?view=tabs&tab=&kyc=&plan=&q=
  account: (id) => http.get(p`/admin/accounts/${id}`),
  accountSubscription: (id) => http.get(p`/admin/accounts/${id}/subscription`),
  accountKyc: (id) => http.get(p`/admin/accounts/${id}/kyc`),
  accountInsurers: (id) => http.get(p`/admin/accounts/${id}/insurers`),
  accountWallet: (id) => http.get(p`/admin/accounts/${id}/wallet`),
  accountAssistants: (id) => http.get(p`/admin/accounts/${id}/assistants`),
  accountSupportGrants: (id) => http.get(p`/admin/accounts/${id}/support-grants`),
  accountActivity: (id, query) => http.get(p`/admin/accounts/${id}/activity`, query),
  changePlan: (id, body, opts) => http.post(p`/admin/accounts/${id}/plan`, body, opts),
  suspend: (id, body) => http.post(p`/admin/accounts/${id}/suspend`, body), // { reasonCode?, reason? } + step-up
  reactivate: (id, body) => http.post(p`/admin/accounts/${id}/reactivate`, body),
  close: (id, body) => http.post(p`/admin/accounts/${id}/close`, body), // + confirmText: "CLOSE"
  offlinePayment: (id, body, opts) => http.post(p`/admin/accounts/${id}/offline-payment`, body, opts),
  subscriptions: (query) => http.get('/admin/subscriptions', query),
  invoice: (id) => http.get(p`/admin/invoices/${id}`),
  wallets: (query) => http.get('/admin/wallets', query),
  // configuration (CFG values)
  config: () => http.get('/admin/config'),
  configHistory: (query) => http.get('/admin/config/history', query),
  proposeConfig: (id, body) => http.post(p`/admin/config/${id}/changes`, body),
  approveConfig: (changeId, body) => http.post(p`/admin/config/changes/${changeId}/approve`, body),
  rejectConfig: (changeId, body) => http.post(p`/admin/config/changes/${changeId}/reject`, body),
  // agent-code flags
  agentCodeFlags: (query) => http.get('/admin/agent-code-flags', query), // ?view=items&status=
  resolveAgentCodeFlag: (id, body) => http.post(p`/admin/agent-code-flags/${id}/resolve`, body),
  // support grants seen by SkyUp
  supportGrants: (query) => http.get('/admin/support-grants', query),
  endSupportGrant: (id, body) => http.post(p`/admin/support-grants/${id}/end`, body),
  // message templates and wallet credits
  templates: (query) => http.get('/admin/comms/templates', query),
  createTemplate: (body, opts) => http.post('/admin/comms/templates', body, opts),
  submitTemplate: (id, body) => http.post(p`/admin/comms/templates/${id}/submit`, body),
  approveTemplate: (id, body) => http.post(p`/admin/comms/templates/${id}/approve`, body),
  deactivateTemplate: (id, body) => http.post(p`/admin/comms/templates/${id}/deactivate`, body),
  creditWallet: (accountId, body, opts) => http.post(p`/admin/comms/wallet/${accountId}/credit`, body, opts),
}