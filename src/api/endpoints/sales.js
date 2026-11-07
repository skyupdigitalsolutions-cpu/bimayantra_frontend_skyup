// Leads (P-12–P-14), customers (P-15–P-19), documents (P-18), vehicles (P-54), best fit, tasks, notifications,
// dashboard (P-08) and search (P-09).
import { http, p } from '../client'

export const pipelines = { list: () => http.get('/pipelines') }

export const leads = {
  /** query: page, limit, pipelineId, status (comma list), source (codes), priority, search, followUp (today|overdue), campaignId */
  list: (query) => http.get('/leads', query),
  duplicateCheck: (query) => http.get('/leads/duplicate-check', query), // { mobile, name?, excludeId? }
  create: (body, opts) => http.post('/leads', body, opts),
  get: (id) => http.get(p`/leads/${id}`),
  timeline: (id, types) => http.get(p`/leads/${id}/timeline`, { types }),
  update: (id, body) => http.patch(p`/leads/${id}`, body), // { version, …fields, confirm? }
  changeStatus: (id, body, opts) => http.post(p`/leads/${id}/status`, body, opts), // { version, status, nextFollowUpAt?, lostReason?, note? }
  logContact: (id, body, opts) => http.post(p`/leads/${id}/contacts`, body, opts), // { outcome, channel?: CALL|WHATSAPP|EMAIL|MEETING, note? }
  convert: (id, body, opts) => http.post(p`/leads/${id}/convert`, body, opts), // { version, mode: CREATE|LINK, customerId?, customer?, confirm? }
  // Q97: the person withdrew their ad form — keep the lead, or remove it with its tasks (advisor only)
  keepAfterWithdrawal: (id, version) => http.post(p`/leads/${id}/withdrawal/keep`, { version }),
  remove: (id, body, opts) => http.post(p`/leads/${id}/remove`, body, opts), // { version, reason? }
}

export const customers = {
  list: (query) => http.get('/customers', query), // page, limit, status, search → rows carry familyCount, policyCount, personalDataConsent
  stats: () => http.get('/customers/stats'), // { active, inactive, familyMembers, households, policiesInForce, awaitingIssuance, consentPending }
  duplicateCheck: (query) => http.get('/customers/duplicate-check', query),
  create: (body, opts) => http.post('/customers', body, opts),
  get: (id) => http.get(p`/customers/${id}`),
  update: (id, body) => http.patch(p`/customers/${id}`, body),
  deactivate: (id, body) => http.post(p`/customers/${id}/deactivate`, body), // { version, reason?, note? }
  reactivate: (id, body) => http.post(p`/customers/${id}/reactivate`, body),
  setIdentity: (id, body) => http.put(p`/customers/${id}/identity`, body), // { version, pan?, aadhaar? }
  revealIdentity: (id, field) => http.post(p`/customers/${id}/identity/reveal`, { field }), // PAN | AADHAAR
  family: (id) => http.get(p`/customers/${id}/family`),
  addFamily: (id, body, opts) => http.post(p`/customers/${id}/family`, body, opts),
  updateFamily: (id, memberId, body) => http.patch(p`/customers/${id}/family/${memberId}`, body),
  deactivateFamily: (id, memberId, body) => http.post(p`/customers/${id}/family/${memberId}/deactivate`, body),
  activateFamily: (id, memberId, body) => http.post(p`/customers/${id}/family/${memberId}/activate`, body),
  consents: (id) => http.get(p`/customers/${id}/consents`),
  recordConsent: (id, body, opts) => http.post(p`/customers/${id}/consents`, body, opts),
  // B-01 default nominee and linked policy holders · B-05/B-06 activity in one request
  defaultNominee: (id) => http.get(p`/customers/${id}/default-nominee`),
  setDefaultNominee: (id, body) => http.put(p`/customers/${id}/default-nominee`, body), // { version, nominee | null }
  links: (id) => http.get(p`/customers/${id}/links`),
  addLink: (id, body, opts) => http.post(p`/customers/${id}/links`, body, opts), // { linkedCustomerId, relationship }
  removeLink: (id, linkId) => http.del(p`/customers/${id}/links/${linkId}`),
  activity: (id, query) => http.get(p`/customers/${id}/activity`, query),
  // tabs that live in other modules
  documents: (id, query) => http.get(p`/customers/${id}/documents`, query),
  vehicles: (id, query) => http.get(p`/customers/${id}/vehicles`, query),
  addVehicle: (id, body, opts) => http.post(p`/customers/${id}/vehicles`, body, opts),
  bestFitOptions: (id, query) => http.get(p`/customers/${id}/best-fit/options`, query),
  runBestFit: (id, body, opts) => http.post(p`/customers/${id}/best-fit`, body, opts),
  chooseBestFit: (id, rankingId, body, opts) => http.post(p`/customers/${id}/best-fit/${rankingId}/choose`, body, opts),
}

// Documents are never deleted (AC-P18-3: DELETE /documents always answers 409 DOC-07), so no delete call exists here.
export const documents = {
  /** B-03 · account-wide library: newest version per document. query: page, limit, customerId, type, status, search */
  list: (query) => http.get('/documents', query),
  upload: (body, opts) => http.post('/documents', body, opts), // links an uploaded file (POST /files) to a person
  get: (id) => http.get(p`/documents/${id}`),
  confirm: (id, body) => http.post(p`/documents/${id}/confirm`, body),
  setLabel: (id, body) => http.patch(p`/documents/${id}/label`, body),
  accountTypes: () => http.get('/account/document-types'),
  addAccountType: (body) => http.post('/account/document-types', body),
}

export const vehicles = {
  get: (id) => http.get(p`/vehicles/${id}`),
  addFiles: (id, body) => http.post(p`/vehicles/${id}/files`, body),
  setStatus: (id, body) => http.post(p`/vehicles/${id}/status`, body),
}

export const tasks = {
  /** tab: OVERDUE | TODAY | UPCOMING | DONE | CANCELLED ; type: CALL | MEETING | FOLLOW_UP | COLLECT_DOCUMENTS | RENEWAL | OTHER */
  list: (tab = 'TODAY', type, linked) => http.get('/tasks', { tab, type, linkedType: linked?.type, linkedId: linked?.id }),
  create: (body, opts) => http.post('/tasks', body, opts), // { title, dueDate YYYY-MM-DD, dueTime HH:mm, linkedType?, linkedId?, notes?, taskType?, priority? }
  update: (id, body) => http.patch(p`/tasks/${id}`, body),
  done: (id, version) => http.post(p`/tasks/${id}/done`, { version }),
  reopen: (id, version) => http.post(p`/tasks/${id}/reopen`, { version }),
  reschedule: (id, body) => http.post(p`/tasks/${id}/reschedule`, body), // { version, preset? | dueDate+dueTime }
  cancel: (id, version) => http.post(p`/tasks/${id}/cancel`, { version }),
}

export const notifications = {
  count: () => http.get('/notifications/count'),
  /** filter: ALL | UNREAD | KYC | CORRECTIONS | ACCOUNTS | TEMPLATES | LEADS | RENEWALS | PAYMENTS | CATALOGUE */
  list: (query) => http.get('/notifications', query),
  readAll: () => http.post('/notifications/read-all', {}),
  open: (id) => http.post(p`/notifications/${id}/open`, {}),
}

export const dashboard = {
  openLeads: () => http.get('/dashboard/open-leads'),
  activeCustomers: () => http.get('/dashboard/active-customers'),
  openQuotations: () => http.get('/dashboard/open-quotations'),
  policiesInForce: () => http.get('/dashboard/policies-in-force'),
  renewalsDue: () => http.get('/dashboard/renewals-due'),
  leadStatusCounts: () => http.get('/dashboard/lead-status-counts'),
  followUps: () => http.get('/dashboard/follow-ups'),
  leadSources: () => http.get('/dashboard/lead-sources'),
  catalogueSummary: () => http.get('/dashboard/catalogue-summary'),
  adLeadsToday: () => http.get('/dashboard/ad-leads-today'),
  funnel: (period = 'THIS_MONTH') => http.get('/dashboard/funnel', { period }),
  todaysTasks: () => http.get('/dashboard/todays-tasks'),
  recentActivity: () => http.get('/dashboard/recent-activity'),
  profileCard: () => http.get('/dashboard/profile-card'),
}

export const search = { all: (q) => http.get('/search', { q }) }