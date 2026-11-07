// Mock data for SkyUp Admin states (Figma 289:37046 … 290:39177)

export const accountTabs = [
  { key: 'all', label: 'All', count: 5 },
  { key: 'trial', label: 'Trial', count: 1 },
  { key: 'active', label: 'Active', count: 2 },
  { key: 'grace', label: 'Grace', count: 1 },
  { key: 'expired', label: 'Expired', count: 2 },
  { key: 'suspended', label: 'Suspended', count: 1 },
]

// chips: [tone, icon, text]
export const accounts = [
  { initials: 'SR', tint: 'bg-[#fbd5dd]', name: 'Suresh Rao', plan: ['bg-[#eef1f5] text-ink-2', null, 'Normal'], sub: ['blue', 'clock', 'Trial · 3 days left'], acct: ['green', 'check', 'Active'], kyc: ['violet', 'clock', 'Pending review'], last: 'Today, 10:42', tags: ['trial', 'active'] },
  { initials: 'LA', tint: 'bg-[#d9eafd]', name: 'Lakshmi Agencies', plan: ['pink', 'star', 'Premium'], sub: ['green', 'check', 'Active · till 31 Mar'], acct: ['green', 'check', 'Active'], kyc: ['green', 'check', 'Verified'], last: 'Today, 09:10', tags: ['active'] },
  { initials: 'HH', tint: 'bg-[#d4f1e7]', name: 'Hubli Health Advisors', plan: ['bg-[#eef1f5] text-ink-2', null, 'Normal'], sub: ['amber', 'alert', 'Grace · till 31 Oct'], acct: ['green', 'check', 'Active'], kyc: ['green', 'check', 'Verified'], last: 'Yesterday', tags: ['grace'] },
  { initials: 'CC', tint: 'bg-[#eef1f5]', name: 'Coastal Cover', plan: ['bg-[#eef1f5] text-ink-2', null, 'Normal'], sub: ['bg-[#fbebec] text-[#b4323c]', 'lock', 'Expired · read-only'], acct: ['amber', 'alert', 'Suspended'], kyc: ['green', 'check', 'Verified'], last: '10 Oct', tags: ['expired', 'suspended'] },
  { initials: 'MK', tint: 'bg-[#fde8c9]', name: 'Mysuru Kavach', plan: ['bg-[#eef1f5] text-ink-2', null, 'Normal'], sub: ['bg-[#fbebec] text-[#b4323c]', 'lock', 'Expired'], acct: ['bg-[#eef1f5] text-ink-2', 'x', 'Closed'], kyc: ['bg-[#fbebec] text-[#b4323c]', 'x', 'Rejected'], last: '02 Aug', tags: ['expired'] },
]

export const accountCards = [
  { label: 'Plan', chip: ['blue', 'Normal · Trial'] },
  { label: 'Subscription', chip: ['amber', 'Trial ends 29 Oct'] },
  { label: 'Account', chip: ['green', 'Active'] },
  { label: 'KYC', chip: ['violet', 'Pending review'] },
]

export const usage = [
  ['Leads', '16'],
  ['Policy holders', '5'],
  ['Quotations', '14'],
  ['Policies', '4'],
  ['Assistants', '1 of 2'],
  ['Wallet balance', '₹342'],
]

export const correctionRows = [
  { product: 'CareFirst Family · Gold', field: 'Network hospitals', change: '10,200 → 10,650 (insurer site)', from: 'Lakshmi Agencies', status: 'submitted' },
  { product: 'FamilySure · Plus', field: 'Room rent', change: 'Single pvt → No limit', from: 'Suresh Rao', status: 'submitted' },
  { product: 'SecurePlus', field: 'Claims settled', change: '98.6% → 98.9%', from: 'Hubli Health', status: 'accepted' },
  { product: 'YoungCover', field: 'Co-pay', change: '0% → 10%', from: 'Coastal Cover', status: 'rejected' },
]

export const templates = [
  { name: 'renewal_reminder_30d', channel: 'WhatsApp', use: 'Renewal reminders', status: ['green', 'check', 'Active'], updated: '12 Sep', tag: 'active' },
  { name: 'quotation_share', channel: 'Email', use: 'Sharing quotations', status: ['green', 'check', 'Active'], updated: '02 Sep', tag: 'active' },
  { name: 'birthday_greeting_v2', channel: 'WhatsApp', use: 'Occasion greetings', status: ['violet', 'clock', 'Submitted to Meta'], updated: '25 Oct', tag: 'pending' },
  { name: 'payment_pending', channel: 'Email', use: 'Payment reminders', status: ['violet', 'clock', 'Pending approval'], updated: '26 Oct', action: 'Review', tag: 'pending' },
  { name: 'anniversary_greeting', channel: 'WhatsApp', use: 'Occasion greetings', status: ['bg-[#fbebec] text-[#b4323c]', 'x', 'Rejected by Meta'], updated: '20 Oct', action: 'Edit', tag: 'rejected' },
  { name: 'old_renewal_60d', channel: 'WhatsApp', use: 'Renewal reminders', status: ['bg-[#eef1f5] text-ink-2', null, 'Inactive'], updated: '01 Aug', tag: 'active' },
]

export const skyupUsers = [
  { initials: 'MI', tint: 'bg-violet-100', name: 'Meena Iyer (you)', role: 'Admin', mobile: '98450 00001', status: 'active', last: 'Now' },
  { initials: 'AS', tint: 'bg-[#d9eafd]', name: 'Arvind Shetty', role: 'Admin', mobile: '98450 00002', status: 'active', last: 'Today, 10:00' },
  { initials: 'RN', tint: 'bg-[#fde8c9]', name: 'Rahul N', role: 'Staff', mobile: '98450 00011', status: 'active', last: 'Today, 09:41' },
  { initials: 'DP', tint: 'bg-[#d4f1e7]', name: 'Divya P', role: 'Staff', mobile: '98450 00012', status: 'invited', last: '—' },
  { initials: 'KM', tint: 'bg-[#eef1f5]', name: 'Kiran M', role: 'Staff', mobile: '98450 00013', status: 'disabled', last: '02 Jul' },
]

export const configRows = [
  { name: 'Quotation valid for', code: 'CFG-46', live: '15 days', pending: '21 days', status: ['violet', 'clock', 'Pending approval'] },
  { name: 'Trial length', code: 'CFG-78', live: '14 days', pending: '—', status: ['green', 'check', 'Applied'], edit: true },
  { name: 'Grace period', code: 'CFG-79', live: '7 days', pending: '—', status: ['green', 'check', 'Applied'], edit: true },
  { name: 'Support access maximum', code: 'CFG-159', live: '24 hours', pending: '12 hours', status: ['bg-[#fbebec] text-[#b4323c]', 'x', 'Rejected'] },
  { name: 'Release settings', code: 'REL', live: 'Best fit, OCR on', pending: '—', status: ['bg-[#eef1f5] text-ink-2', 'lock', 'Read only'] },
]

export const auditRows = [
  ['26 Oct, 09:44', 'Rahul N (staff)', 'Opened quotation under support grant', 'Rao Insurance', 'QT-••••12'],
  ['26 Oct, 09:41', 'Rahul N (staff)', 'Opened customer under support grant', 'Rao Insurance', 'CU-••••18'],
  ['25 Oct, 16:20', 'Rahul N (staff)', 'Submitted product version FamilySure v3', '—', 'PRD-0041'],
  ['20 Oct, 11:00', 'Arvind Shetty', 'Approved insurer Care Health', '—', 'INS-0007'],
  ['10 Oct, 10:05', 'System', 'Suspended sending: wallet empty', 'Coastal Cover', '—'],
]

export const flagRows = [
  { insurer: 'Niva Bupa', code: 'NB-77421', accounts: 'Rao Insurance · Coastal Cover', raised: '24 Oct', open: true },
  { insurer: 'Star Health', code: 'SH-11020', accounts: 'Lakshmi Agencies · Mysuru Kavach', raised: '02 Aug' },
]

export const grantRows = [
  { advisor: 'Rao Insurance', to: 'Rahul N', reason: 'Ticket #4471 · PDF name', ends: '27 Oct, 09:30', status: ['green', 'eye', 'Active'], open: true },
  { advisor: 'Lakshmi Agencies', to: 'Divya P', reason: 'Ticket #4402', ends: '12 Sep, 12:00', status: ['bg-[#eef1f5] text-ink-2', null, 'Ended'] },
  { advisor: 'Hubli Health', to: 'Rahul N', reason: 'Ticket #4388', ends: '01 Sep, 18:00', status: ['bg-[#eef1f5] text-ink-2', 'clock', 'Expired'] },
]

/* AA7 · advisor product detail (CareFirst Family · Gold) */
export const pdFeatures = [
  ['In-patient hospitalisation', 'Up to sum insured', true],
  ['Pre-hospitalisation', '60 days', true],
  ['Post-hospitalisation', '180 days', true],
  ['Day-care procedures', 'All listed', true],
  ['Room rent', 'No limit', true],
  ['Co-pay', '0%', true],
  ['Pre-existing disease wait', '3 years', true],
  ['Restore benefit', 'Unlimited', true],
  ['Maternity cover', 'Rider only', false],
  ['OPD consultations', 'Not covered', false],
  ['Road ambulance', '₹3,000', true],
  ['Free health check-up', 'Every year', true],
]

export const pdEligibility = [
  ['Adult entry age', '18 – 65'],
  ['Children', '91 days – 25 years'],
  ['Sum insured', '₹5 – 25 lakh'],
  ['Policy term', '1, 2 or 3 years'],
  ['Cover type', 'Family floater'],
]
