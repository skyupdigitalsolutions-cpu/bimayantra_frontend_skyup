// Quotations (P-26–P-30, Stage G), comparisons, payments, proposals, policies (P-33–P-35), renewals.
import { http, p } from '../client'

export const quotations = {
  list: (query) => http.get('/quotations', query), // { customerId?, status? (comma list), search?, page?, limit? } → meta.counts per status
  choices: (query) => http.get('/quotations/choices', query), // { typeId?, insurerId? }
  create: (customerId, opts) => http.post('/quotations', { customerId }, opts),
  get: (id) => http.get(p`/quotations/${id}`),
  saveStep: (id, body) => http.patch(p`/quotations/${id}`, body), // { version, step, inputs }
  calculate: (id) => http.post(p`/quotations/${id}/calculate`, {}),
  generate: (id, opts) => http.post(p`/quotations/${id}/generate`, {}, opts),
  share: (id, channel, opts) => http.post(p`/quotations/${id}/share`, { channel }, opts), // EMAIL | WHATSAPP | LINK | DOWNLOAD
  edit: (id, version) => http.post(p`/quotations/${id}/edit`, { version }),
  revise: (id, version) => http.post(p`/quotations/${id}/revise`, { version }),
  accept: (id, version) => http.post(p`/quotations/${id}/accept`, { version }),
  reject: (id, body) => http.post(p`/quotations/${id}/reject`, body), // { version, reason, note? }
  cancel: (id, body) => http.post(p`/quotations/${id}/cancel`, body), // { version, reason? }
  deleteDraft: (id) => http.del(p`/quotations/${id}`),
  revision: (id, revision) => http.get(p`/quotations/${id}/revisions/${revision}`),
  // payments on a quotation
  payments: (id) => http.get(p`/quotations/${id}/payments`),
  paymentLink: (id, body, opts) => http.post(p`/quotations/${id}/payment-link`, body, opts),
  replacePaymentLink: (id, body, opts) => http.post(p`/quotations/${id}/payment-link/replace`, body, opts),
  recordPayment: (id, body, opts) => http.post(p`/quotations/${id}/payments`, body, opts),
}

export const comparisons = {
  list: (query) => http.get('/comparisons', query),
  create: (body, opts) => http.post('/comparisons', body, opts),
  get: (id) => http.get(p`/comparisons/${id}`),
  save: (id, body) => http.put(p`/comparisons/${id}`, body),
  preview: (id, body) => http.post(p`/comparisons/${id}/preview`, body),
  generate: (id, body, opts) => http.post(p`/comparisons/${id}/generate`, body, opts),
  share: (id, body, opts) => http.post(p`/comparisons/${id}/share`, body, opts),
  choose: (id, body, opts) => http.post(p`/comparisons/${id}/choose`, body, opts),
  createQuotation: (id, body, opts) => http.post(p`/comparisons/${id}/create-quotation`, body, opts),
}

export const payments = {
  /** B-04 · payments of the account (or one customer) with quotation, product and insurer: { customerId?, status?, page?, limit? } */
  list: (query) => http.get('/payments', query),
  markFailed: (id, body) => http.post(p`/payments/${id}/fail`, body),
  markExpired: (id, body) => http.post(p`/payments/${id}/expire`, body),
  undo: (id, body) => http.post(p`/payments/${id}/undo`, body), // reverse
}

export const proposals = {
  list: (query) => http.get('/proposals', query),
  create: (body, opts) => http.post('/proposals', body, opts),
  get: (id) => http.get(p`/proposals/${id}`),
  save: (id, body) => http.put(p`/proposals/${id}`, body),
  submit: (id, body, opts) => http.post(p`/proposals/${id}/submit`, body, opts),
  decline: (id, body) => http.post(p`/proposals/${id}/decline`, body),
  cancel: (id, body) => http.post(p`/proposals/${id}/cancel`, body), // B-02 · a DRAFT proposal: { version, reason, note? }
}

export const policies = {
  list: (query) => http.get('/policies', query),
  recordExisting: (body, opts) => http.post('/policies/existing', body, opts),
  get: (id) => http.get(p`/policies/${id}`),
  issue: (id, body, opts) => http.post(p`/policies/${id}/issue`, body, opts),
  setNominees: (id, body) => http.put(p`/policies/${id}/nominees`, body),
  correct: (id, body) => http.post(p`/policies/${id}/correct`, body),
  cancel: (id, body) => http.post(p`/policies/${id}/cancel`, body),
}

export const renewals = {
  list: (query) => http.get('/renewals', query), // { status?, from?, to?, insurerId?, typeId?, customerId? }
  get: (id) => http.get(p`/renewals/${id}`),
  logContact: (id, body, opts) => http.post(p`/renewals/${id}/contact`, body, opts),
  renewalQuotation: (id, body, opts) => http.post(p`/renewals/${id}/renewal-quotation`, body, opts), // { mode: SAME_POLICY | NEW_QUOTATION | COMPARISON, … }
  premiumPaid: (id, body, opts) => http.post(p`/renewals/${id}/premium-paid`, body, opts),
  notRenewing: (id, body) => http.post(p`/renewals/${id}/not-renewing`, body),
  reopen: (id, body) => http.post(p`/renewals/${id}/reopen`, body),
  pause: (id, body) => http.post(p`/renewals/${id}/pause`, body),
  resume: (id, body) => http.post(p`/renewals/${id}/resume`, body),
}