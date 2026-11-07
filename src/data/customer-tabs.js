// Mock data for the customer-profile tab frames (05a–05i) and the family/documents flow (FD1–FD6).

export const profile = {
  name: 'Kavya Hegde',
  initials: 'KH',
  meta: 'CU-000318 · 34 years · Bengaluru',
  tagline: 'Software engineer · prefers calls after 6 pm',
  minis: [['Policies', '2'], ['Open quotes', '2'], ['Renewal in', '38 days']],
}

/** Profile tab bar — `to` is the default ⇒ link; screens can override per frame. */
export const profileTabs = [
  { key: 'overview', label: 'Overview', to: '/customers/1' },
  { key: 'family', label: 'Family', count: 3, to: '/x/05a-customer-family' },
  { key: 'consent', label: 'Consent', to: '/x/05b-customer-consent' },
  { key: 'documents', label: 'Documents', count: 3, to: '/x/05c-customer-documents' },
  { key: 'vehicles', label: 'Vehicles', to: '/x/05d-customer-vehicles' },
  { key: 'quotations', label: 'Quotations', count: 3, to: '/x/05e-customer-quotations' },
  { key: 'policies', label: 'Policies', count: 2, to: '/x/05f-customer-policies' },
  { key: 'payments', label: 'Payments', to: '/x/05g-customer-payments' },
  { key: 'renewals', label: 'Renewals', count: 1, to: '/x/05h-customer-renewals' },
  { key: 'activities', label: 'Activities', to: '/x/05i-customer-activities' },
]

/* ───────────── 05a Family ───────────── */

export const members = [
  {
    key: 'kavya', initials: 'KH', bg: '#fbd5dd', name: 'Kavya Hegde', rel: 'Self · 34',
    dob: '14 Mar 1992', phone: '98861 23456',
    docs: [{ tone: 'green', icon: 'check', label: 'Aadhaar' }, { tone: 'green', icon: 'check', label: 'PAN' }],
  },
  {
    key: 'arjun', initials: 'AH', bg: '#d9eafd', name: 'Arjun Hegde', rel: 'Spouse · 37',
    dob: '02 Jul 1989', phone: '98861 23499',
    docs: [{ tone: 'gray', icon: 'folder', label: 'Medical report' }],
    to: '/x/fd6-arjun-hegde-documents', addDocTo: '/x/fd4-add-document-which-document',
  },
  {
    key: 'anya', initials: 'AH', bg: '#d4f1e7', name: 'Anya Hegde', rel: 'Daughter · 5',
    dob: '19 Jan 2021', phone: 'No mobile', docs: [],
  },
  {
    key: 'shanta', initials: 'SH', bg: '#fde8c9', name: 'Shanta Hegde', rel: 'Mother',
    dob: 'Add date of birth', dobWarn: true, phone: '98450 11223',
    docs: [{ tone: 'red', icon: 'alert', label: 'Aadhaar missing' }, { tone: 'red', icon: 'alert', label: 'PAN missing' }],
  },
]

export const newMember = {
  key: 'rohan', initials: 'RH', bg: '#e9e3fc', name: 'Rohan Hegde', rel: 'Son · 2',
  dob: '14 Feb 2024', phone: 'No mobile', docs: [],
}

/* ───────────── 05b Consent ───────────── */

const GIVEN = { kind: 'given', to: '/x/cs4-withdraw-consent', chipTo: '/x/cs3-consent-proof' }
const NOREC = { kind: 'none', to: '/x/cs1-record-consent' }
const WITHDRAWN = { kind: 'withdrawn', to: '/x/cs1-record-consent' }

export const consentRows = [
  { initials: 'KH', bg: '#fbd5dd', name: 'Kavya', rel: 'Self', cells: [GIVEN, GIVEN, NOREC] },
  { initials: 'AH', bg: '#d9eafd', name: 'Arjun', rel: 'Spouse', cells: [WITHDRAWN, NOREC, NOREC] },
  { initials: 'AH', bg: '#d4f1e7', name: 'Anya', rel: 'Daughter', cells: [NOREC, NOREC, NOREC] },
  { initials: 'SH', bg: '#fde8c9', name: 'Shanta', rel: 'Mother', cells: [GIVEN, NOREC, NOREC] },
]

export const consentHistory = [
  ['WhatsApp withdrawn · Arjun', '12 Oct · replied STOP'],
  ['WhatsApp given · Shanta', '05 Sep · by phone · Priya'],
  ['Email given · Kavya', '04 Sep · signed form'],
  ['Personal data consent', '02 Sep · signed form'],
]

/* ───────────── 05c Documents ───────────── */

export const documentGroups = [
  {
    owner: 'KAVYA HEGDE',
    docs: [
      { bg: '#fde8ec', title: 'Aadhaar', sub: 'v2 · 24 Oct · Priya', chip: ['amber', 'alert', 'Unconfirmed'], check: true },
      { bg: '#e9e3fc', title: 'PAN', sub: 'v1 · 04 Sep · You', chip: ['green', 'check', 'Confirmed'] },
    ],
  },
  {
    owner: 'ARJUN HEGDE',
    docs: [{ bg: '#d4f1e7', title: 'Medical report · thyroid 2025', sub: 'v1 · 06 Sep', chip: ['gray', null, 'Saved'] }],
  },
]

/* ───────────── 05d Vehicles ───────────── */

export const vehicleChecklist = [
  ['folder', 'RC'], ['eye', 'Front'], ['eye', 'Rear'], ['eye', 'Left'], ['eye', 'Right'], ['eye', 'Odometer'],
]

/* ───────────── 05e Quotations ───────────── */

export const quotations = [
  { icon: 'quote', bg: '#e7f4ee', title: 'QT-202610-00013 · R1', sub: 'Normal · CareFirst Family · Gold', status: 'Paid · proposal submitted', amount: '₹18,054', chip: ['green', 'check', 'Accepted'] },
  { icon: 'quote', bg: '#e8f0fd', title: 'QT-202610-00012 · R2', sub: 'Normal · CareFirst Family · Gold', status: 'Valid till 08 Nov · viewed 24 Oct', amount: '₹17,582', chip: ['blue', 'send', 'Shared'] },
  { icon: 'compare', bg: '#e9e3fc', title: 'CQ-202610-00003', sub: 'Comparison · 3 options', status: 'Kavya chose Gold', amount: '—', chip: ['green', 'check', 'Product chosen'] },
  { icon: 'quote', bg: '#eef1f5', title: 'QT-202610-00012 · R1', sub: 'Normal · CareFirst Family · Gold', status: 'Replaced by R2', amount: '₹19,120', chip: ['gray', 'x', 'Superseded'] },
]

/* ───────────── 05f Policies ───────────── */

export const policies = [
  {
    bg: '#d4f1e7', title: 'Star Health FamilySure', sub: '2245/88/26/0001842', chip: ['green', 'check', 'Issued'],
    progress: 90, term: '04 Dec 2025 → 03 Dec 2026',
    boxes: [['Premium', '₹21,340'], ['Status', 'Renews in 38 days'], ['Insured', 'Kavya, Arjun, Anya']],
    second: { icon: 'users', label: 'Edit nominees', to: '/x/pp1-edit-policy-nominees' },
  },
  {
    bg: '#e9e3fc', title: 'Niva Bupa CareFirst Family · Gold', sub: 'Number pending · PL-000071', chip: ['violet', 'clock', 'Awaiting issuance'],
    progress: 0, term: '10 Nov 2026 → 09 Nov 2027',
    boxes: [['Premium', '₹18,054'], ['Status', 'Submitted 26 Oct'], ['Insured', 'Kavya, Arjun, Anya']],
    second: { icon: 'shield', label: 'Record issued policy', to: '/x/l1-record-issued-policy' },
  },
]

/* ───────────── 05g Payments ───────────── */

export const payments = [
  { bg: '#e7f4ee', title: 'QT-202610-00013 R1', sub: 'UPI · UTR6271839934 · 26 Oct 2026', amount: '₹18,054.00', chip: ['green', 'check', 'Paid'] },
  { bg: '#f0ecfb', title: 'QT-202610-00012 R2', sub: 'Insurer link · pay.nivabupa.com', amount: '₹17,582.00', chip: ['violet', 'clock', 'Awaiting payment'] },
  { bg: '#fbebec', title: 'QT-202610-00012 R1', sub: 'Insurer link · replaced by R2', amount: '₹19,120.16', chip: ['red', 'x', 'Cancelled'] },
]

export const paymentTotals = [
  ['#d4f1e7', 'Total recorded', '₹18,054'],
  ['#e9e3fc', 'Awaiting', '₹17,582'],
  ['#fde8ec', 'Paid to', 'Niva Bupa'],
]

/* ───────────── 05i Activities ───────────── */

export const activityFilters = ['All', 'Quotations', 'Payments', 'Documents', 'Messages', 'Consent']

export const activities = [
  {
    day: 'TODAY',
    items: [
      { icon: 'shield', bg: '#e9e3fc', title: 'Proposal PR-202610-00005 submitted', sub: '11:30 · You', tag: 'Quotations' },
      { icon: 'card', bg: '#d4f1e7', title: 'Payment recorded · ₹18,054 by UPI', sub: '10:05 · You', tag: 'Payments' },
    ],
  },
  {
    day: 'YESTERDAY',
    items: [
      { icon: 'eye', bg: '#d9eafd', title: 'Quotation viewed by Kavya', sub: '20:05', tag: 'Quotations' },
      { icon: 'chat', bg: '#d4f1e7', title: 'Quotation shared on WhatsApp', sub: '19:40 · Priya', tag: 'Messages' },
      { icon: 'upload', bg: '#fde8c9', title: 'Aadhaar v2 uploaded', sub: '18:02 · Priya', tag: 'Documents' },
    ],
  },
  {
    day: 'EARLIER',
    items: [{ icon: 'user-plus', bg: '#fde8ec', title: 'Customer created from lead LD-2609-00031', sub: '04 Sep · You', tag: 'All' }],
  },
]

/* ───────────── FD3–FD6 Add document flow ───────────── */

export const docPeople = [
  { key: 'kavya', initials: 'KH', bg: '#fbd5dd', name: 'Kavya Hegde', sub: 'Self · Aadhaar, PAN' },
  { key: 'arjun', initials: 'AH', bg: '#d9eafd', name: 'Arjun Hegde', sub: 'Spouse · Medical report' },
  { key: 'anya', initials: 'AH', bg: '#d4f1e7', name: 'Anya Hegde', sub: 'Daughter · no documents' },
  { key: 'shanta', initials: 'SH', bg: '#fde8c9', name: 'Shanta Hegde', sub: 'Mother · Aadhaar and PAN missing', warn: true },
]

export const docTypes = [
  { key: 'aadhaar', icon: 'card', bg: '#fde8ec', title: 'Aadhaar card', sub: 'Front and back · read by AI' },
  { key: 'pan', icon: 'card', bg: '#e9e3fc', title: 'PAN card', sub: 'Read by AI' },
  { key: 'passport', icon: 'folder', bg: '#d9eafd', title: 'Passport', sub: 'First and last page' },
  { key: 'dl', icon: 'car', bg: '#d4f1e7', title: 'Driving licence', sub: 'Front and back' },
  { key: 'voter', icon: 'folder', bg: '#fde8c9', title: 'Voter ID', sub: 'Front and back' },
  { key: 'medical', icon: 'heart', bg: '#fde8ec', title: 'Medical report', sub: 'Any pages' },
  { key: 'policy', icon: 'shield', bg: '#e9e3fc', title: 'Policy copy', sub: 'Existing or old policy' },
  { key: 'rc', icon: 'car', bg: '#d9eafd', title: 'Vehicle RC', sub: 'For motor quotes' },
  { key: 'bank', icon: 'wallet', bg: '#d4f1e7', title: 'Bank proof', sub: 'Cheque or passbook' },
]

export const aadhaarRead = [
  { label: 'Name', value: 'Arjun Hegde', conf: ['green', 'High'], action: 'Confirmed' },
  { label: 'Aadhaar number', value: 'XXXX XXXX 5521', conf: ['green', 'High'], action: 'Confirmed' },
  { label: 'Date of birth', value: '02-07-1989', conf: ['amber', 'Medium'], action: 'Check' },
]
