// Mock data for the Sales pipeline section (leads, policy holders, best fit, quotations, proposals).

/* ───────────── Leads board (Figma 8:503) ───────────── */

// counts are derived from `leads` on the board; kept here for reference (Health 5 · Motor 2 · Life and Term 2 · Travel 0 · Other 1)
export const pipelines = [
  { key: 'health', label: 'Health', count: 5 },
  { key: 'motor', label: 'Motor', count: 2 },
  { key: 'life', label: 'Life and Term', count: 2 },
  { key: 'travel', label: 'Travel', count: 0 },
  { key: 'other', label: 'Other', count: 1 },
]

// Column tint, dot, count text and dashed "Add lead" colour per stage
export const leadStages = [
  { key: 'new', label: 'New', bg: '#e3eefd', ink: '#1f5fd6', dash: 'rgba(31,95,214,0.3)' },
  { key: 'contacted', label: 'Contacted', bg: '#eee9fc', ink: '#5b3fb8', dash: 'rgba(91,63,184,0.3)' },
  { key: 'qualified', label: 'Qualified', bg: '#e2f4ec', ink: '#127650', dash: 'rgba(18,118,80,0.3)' },
  { key: 'followup', label: 'Follow-up', bg: '#fceedc', ink: '#8a5a12', dash: 'rgba(138,90,18,0.3)' },
]

export const leads = [
  {
    id: 2, pipeline: 'health', stage: 'new', initials: 'DS', avatar: '#d9eafd', name: 'Deepa Shetty', phone: '90080 33441',
    note: 'Referred by Kavya Hegde. Wants cover for parents.',
    chips: [{ tone: 'blue', label: 'New today' }], source: { tone: 'green', label: 'Referral · client' },
  },
  {
    id: 3, pipeline: 'health', stage: 'new', initials: 'PH', avatar: '#e9e3fc', name: 'Prakash Hegde', phone: '94800 12777',
    note: 'Came from Facebook ad. Single, 29.',
    chips: [{ tone: 'gray', label: 'Medium' }], source: { tone: 'blue', label: 'Meta Ads' },
  },
  {
    id: 4, pipeline: 'health', stage: 'contacted', initials: 'SR', avatar: '#fde8c9', name: 'Sunita Reddy', phone: '96200 44512',
    note: 'Senior citizen parents, both 68.',
    chips: [{ tone: 'high', label: 'High' }], source: { tone: 'gray', label: 'Social media' },
  },
  {
    id: 5, pipeline: 'health', stage: 'qualified', initials: 'AK', avatar: '#d4f1e7', name: 'Anand Kulkarni', phone: '98450 77120',
    note: 'Shares family phone with wife Anitha.',
    chips: [{ tone: 'gray', label: 'Low' }], source: { tone: 'green', label: 'Referral · client' },
  },
  {
    id: 1, pipeline: 'health', stage: 'followup', initials: 'RG', avatar: '#fde8c9', name: 'Ramesh Gowda', phone: '98860 12345',
    note: 'Family floater for 4. Wants no room-rent cap.',
    chips: [{ tone: 'red', icon: 'clock', label: 'Overdue · 24 Oct' }, { tone: 'high', label: 'High' }],
    source: { tone: 'green', label: 'Referral · Manjunath K' },
  },,
  // Motor · Life and Term · Other pipelines
  {
    id: 6, pipeline: 'motor', stage: 'new', initials: 'VR', avatar: '#d9eafd', name: 'Vikram Rao', phone: '99000 45121',
    note: 'New Creta, wants zero-dep cover.',
    chips: [{ tone: 'gray', label: 'Low' }], source: { tone: 'high', label: 'Google Ads' },
  },
  {
    id: 7, pipeline: 'motor', stage: 'new', initials: 'NK', avatar: '#d4f1e7', name: 'Naveen Kumar', phone: '99860 21455',
    note: 'Two-wheeler renewal due next month.',
    chips: [{ tone: 'gray', label: 'Low' }], source: { tone: 'amber', label: 'Walk-in' },
  },
  {
    id: 8, pipeline: 'life', stage: 'contacted', initials: 'RS', avatar: '#fbd5dd', name: 'Rahul Sharma', phone: '98450 66120',
    note: 'Term cover of ₹1 crore, non-smoker, 31.',
    chips: [{ tone: 'gray', label: 'Medium' }], source: { tone: 'blue', label: 'Meta Ads' },
  },
  {
    id: 9, pipeline: 'life', stage: 'contacted', initials: 'MI', avatar: '#e9e3fc', name: 'Meera Iyer', phone: '97400 88213',
    note: 'Child education plan for her son.',
    chips: [{ tone: 'gray', label: 'Medium' }], source: { tone: 'violet', label: 'Website' },
  },
  {
    id: 10, pipeline: 'other', stage: 'qualified', initials: 'RN', avatar: '#fde8c9', name: 'Rekha Nair', phone: '94480 22617',
    note: 'Home insurance for a new flat in Whitefield.',
    chips: [{ tone: 'high', label: 'High' }], source: { tone: 'green', label: 'Referral · client' },
  }
]

/* ───────────── Lead detail (Figma 8:809) ───────────── */

export const leadDetail = {
  id: 'LD-2610-00042',
  name: 'Ramesh Gowda',
  initials: 'RG',
  summary: 'Family floater for 4 · wants no room-rent cap',
  meta: 'LD-2610-00042 · Health pipeline · Created 12 Oct 2026',
  details: [
    ['Primary mobile', '98860 12345'],
    ['Alternate mobile', '—'],
    ['Email', 'ramesh.g@example.in'],
    ['Source', 'Referred by a referrer'],
    ['Referrer', 'Manjunath K'],
    ['Insurance interest', 'Health'],
  ],
  activity: [
    { icon: 'chat', bg: '#fde8c9', title: 'Contact logged: Asked to call back', meta: '20 Oct 2026, 12:05 · You', note: 'Call after Diwali.' },
    { icon: 'refresh', bg: '#e9e3fc', title: 'Moved to Follow-up', meta: '20 Oct 2026, 12:05 · You' },
    { icon: 'phone', bg: '#d9eafd', title: 'Contact logged: Spoke to customer', meta: '13 Oct 2026, 17:40 · You' },
    { icon: 'user-plus', bg: '#d4f1e7', title: 'Lead created', meta: '12 Oct 2026, 09:10 · You' },
  ],
  stages: [
    { dot: '#b7791f', tone: 'amber', label: 'Follow-up', meta: '20 Oct, 12:05 · You' },
    { dot: '#c3ccd8', tone: 'blue', label: 'Contacted', meta: '13 Oct, 17:40 · You' },
    { dot: '#c3ccd8', tone: 'blue', label: 'New', meta: '12 Oct, 09:10 · You' },
  ],
}

/* ───────────── Policy Holders (Figma 9:562) ───────────── */

export const customerStats = [
  { icon: 'users', label: 'Active customers', value: '4', sub: '1 inactive', bg: '#d9eafd' },
  { icon: 'user-plus', label: 'Family members', value: '3', sub: 'Across 1 household', bg: '#e9e3fc' },
  { icon: 'shield', label: 'Policies in force', value: '3', sub: '1 awaiting issuance', bg: '#d4f1e7' },
  { icon: 'lock', label: 'Consent pending', value: '3', sub: 'Record before adding PAN', bg: '#fde8c9' },
]

export const customers = [
  { id: 1, initials: 'KH', avatar: '#fbd5dd', name: 'Kavya Hegde', code: 'CU-000318', mobile: '98861 23456', city: 'Bengaluru', family: 3, policies: 1, consent: true, active: true },
  { id: 2, initials: 'FK', avatar: '#d9eafd', name: 'Faizal Khan Sr', code: 'CU-000319', mobile: '97412 00111', city: 'Mysuru', family: 0, policies: 1, consent: false, active: true },
  { id: 3, initials: 'AK', avatar: '#e9e3fc', name: 'Anitha Kulkarni', code: 'CU-000320', mobile: '98450 77120', city: 'Hubballi', family: 0, policies: 1, consent: false, active: true },
  { id: 4, initials: 'SR', avatar: '#d4f1e7', name: 'Shanthi Rao', code: 'CU-000322', mobile: '98450 11223', city: 'Bengaluru', family: 0, policies: 1, consent: false, active: true },
  { id: 5, initials: 'MN', avatar: '#fde8c9', name: 'Mohan Nayak', code: 'CU-000301', mobile: '99001 44556', city: 'Mangaluru', family: 1, policies: 0, consent: true, active: false },
]

/* ───────────── Customer profile (Figma 9:845) ───────────── */

export const customerTabs = [
  { key: 'overview', label: 'Overview', to: '/customers/1' },
  { key: 'family', label: 'Family', count: 3, to: '/x/05a-customer-family' },
  { key: 'consent', label: 'Consent', to: '/x/05b-customer-consent' },
  { key: 'documents', label: 'Documents', count: 3, to: '/x/05c-customer-documents' },
  { key: 'vehicles', label: 'Vehicles', to: '/x/05d-customer-vehicles' },
  { key: 'quotations', label: 'Quotations', count: 2, to: '/x/05e-customer-quotations' },
  { key: 'policies', label: 'Policies', count: 1, to: '/x/05f-customer-policies' },
  { key: 'payments', label: 'Payments', to: '/x/05g-customer-payments' },
  { key: 'renewals', label: 'Renewals', count: 1, to: '/x/05h-customer-renewals' },
  { key: 'activities', label: 'Activities', to: '/x/05i-customer-activities' },
]

export const customerProfile = {
  name: 'Kavya Hegde',
  initials: 'KH',
  meta: 'CU-000318 · 34 years · Bengaluru',
  tagline: 'Software engineer · prefers calls after 6 pm',
  minis: [['Policies', '1'], ['Open quotes', '1'], ['Renewal in', '38 days']],
  details: [
    ['Date of birth', '14 Mar 1992 (34)'],
    ['Primary mobile', '98861 23456'],
    ['Email', 'kavya.hegde@example.in'],
    ['Preferred contact', 'WhatsApp'],
    ['Wedding anniversary', '25 Nov 2018'],
    ['Occupation', 'Software engineer'],
  ],
  address: '42, 3rd Cross, HSR Layout, Sector 2, Bengaluru, Karnataka 560102',
  members: [
    { initials: 'AH', name: 'Arjun Hegde', rel: 'Spouse · 37', bg: '#d9eafd' },
    { initials: 'AH', name: 'Anya Hegde', rel: 'Daughter · 5', bg: '#d4f1e7' },
    { initials: 'SH', name: 'Shanta Hegde', rel: 'Mother · add DOB', bg: '#fde8c9', warn: true },
  ],
  ids: [
    { label: 'PAN', masked: 'ABCXX1234X' },
    { label: 'Aadhaar', masked: 'XXXX XXXX 1234' },
  ],
  openItems: [
    { icon: 'quote', bg: '#e9e3fc', title: 'QT-202610-00012 R2', sub: 'CareFirst Family · valid till 08 Nov', chip: ['blue', 'Shared'], to: '/quotations/1' },
    { icon: 'refresh', bg: '#fde8c9', title: 'Renewal · FamilySure', sub: 'Ends 03 Dec 2026', chip: ['amber', 'Due'], to: '/x/n1-renewal-detail' },
    { icon: 'calendar', bg: '#d9eafd', title: 'Collect Aadhaar for Shanta', sub: 'Today, 12:00', chip: ['gray', 'Task'] },
  ],
}

/* ───────────── Best fit (Figma 9:1127) ───────────── */

export const bestFitPeople = [
  { key: 'kavya', label: 'Kavya · 34', on: true },
  { key: 'arjun', label: 'Arjun · 37', on: true },
  { key: 'anya', label: 'Anya · 5', on: true },
  { key: 'shanta', label: 'Shanta · no DOB', on: false, disabled: true },
]

export const bestFitPriorities = ['Lowest premium', 'Best coverage', 'Claim reliability', 'Pre-existing condition']

export const bestFitResults = [
  {
    rank: 1, name: 'HDFC ERGO SecurePlus', short: 'SecurePlus', price: '₹19,978', premium: 19978, claims: 98.6, pedYears: 3, score: 89, compare: true,
    rows: [
      ['Budget fit', '×15%', 100, 'Within ₹25,000 budget'],
      ['Room rent', '×30%', 100, 'No limit'],
      ['Co-pay', '×20%', 100, 'No co-pay'],
      ['Waiting period', '×20%', 50, 'PED after 3 years'],
      ['Claim settlement', '×15%', 93, '98.6% claims settled'],
    ],
  },
  {
    rank: 2, name: 'Niva Bupa CareFirst Family', short: 'CareFirst Family', price: '₹17,582', premium: 17582, claims: 91.2, pedYears: 3, score: 83, compare: true,
    rows: [
      ['Budget fit', '×15%', 100, 'Within budget'],
      ['Room rent', '×30%', 100, 'No limit'],
      ['Co-pay', '×20%', 100, 'No co-pay'],
      ['Waiting period', '×20%', 50, 'PED after 3 years'],
      ['Claim settlement', '×15%', 56, '91.2% claims settled', true],
    ],
  },
  {
    rank: 3, name: 'Star Health YoungCover', short: 'YoungCover', price: '₹7,874', premium: 7874, claims: 82.3, pedYears: 2, score: 58, compare: false,
    warning: 'Covers 2 of 3 people. Arjun (37) is outside 18–35.',
  },
]

/* ───────────── Quotation wizard — Step 6 (Figma 10:803) ───────────── */

export const quoteSteps = ['Customer', 'Type', 'Insurance', 'Insurer', 'Product', 'Details', 'Riders', 'Premium', 'Discount', 'Review']

export const quotePeople = [
  { key: 'kavya', initials: 'KH', bg: '#fbd5dd', name: 'Kavya Hegde', sub: 'Self · 34', on: true },
  { key: 'arjun', initials: 'AH', bg: '#d9eafd', name: 'Arjun Hegde', sub: 'Spouse · 37', on: true },
  { key: 'anya', initials: 'AH', bg: '#d4f1e7', name: 'Anya Hegde', sub: 'Daughter · 5', on: true },
  { key: 'shanta', initials: 'SH', bg: '#fde8c9', name: 'Shanta Hegde', sub: 'Add date of birth to include', on: false, disabled: true },
]

/* ───────────── Quotation detail (Figma 10:1093 / 71:9417 / 71:9783 / 71:10022) ───────────── */

export const quotation = {
  id: 'QT-202610-00012',
  rev: 'R2',
  meta: 'Kavya Hegde · Niva Bupa CareFirst Family · valid until 08 Nov 2026',
  kv: [
    ['Customer', 'Kavya Hegde (CU-000318)'],
    ['People covered', 'Kavya 34 · Arjun 37 · Anya 5'],
    ['Product', 'Niva Bupa CareFirst Family'],
    ['UIN', 'NBHHLIP00001V012526'],
    ['Agent code', 'NB-77421'],
    ['Sum insured', '₹10 lakh'],
    ['Term, start', '1 year, 10 Nov 2026'],
    ['Riders', 'None'],
    ['Price', 'PV-3 (frozen)'],
  ],
  ledger: [['Base premium', '₹14,900.00'], ['Riders', '₹0.00'], ['GST 18%', '₹2,682.00']],
  total: '₹17,582.00',
  activity: [
    { icon: 'eye', bg: '#d4f1e7', title: 'Viewed by customer', meta: '24 Oct 2026, 20:05' },
    { icon: 'chat', bg: '#d9eafd', title: 'Shared on WhatsApp · delivery not tracked', meta: '24 Oct 2026, 19:40 · Priya' },
    { icon: 'mail', bg: '#e9e3fc', title: 'Emailed to kavya.hegde@example.in', meta: '24 Oct 2026, 19:31 · You' },
    { icon: 'quote', bg: '#fde8c9', title: 'Revision R2 generated · R1 superseded', meta: '24 Oct 2026, 19:31 · You' },
  ],
  paymentEvent: { icon: 'eye', bg: '#d4f1e7', title: 'Payment recorded: ₹17,582 by UPI', meta: '26 Oct 2026, 10:05 · You' },
}

export const paymentModes = ['Insurer link', 'UPI', 'Net banking', 'Card', 'Cheque', 'Cash']

/* ───────────── Quotations list (Figma 71:9067) ───────────── */

export const quoteStats = [
  { icon: 'quote', label: 'Ready to share', value: '1', bg: '#d9eafd' },
  { icon: 'send', label: 'Shared, awaiting answer', value: '2', bg: '#e9e3fc' },
  { icon: 'check', label: 'Accepted', value: '2', bg: '#d4f1e7' },
  { icon: 'clock', label: 'Expiring in 7 days', value: '1', bg: '#fde8c9' },
]

export const quotations = [
  { id: 'QT-202610-00013 · R1', to: '/quotations/1', initials: 'KH', bg: '#fbd5dd', customer: 'Kavya Hegde', product: 'CareFirst Family · Gold', total: '₹18,054', status: 'accepted', payment: 'paid', valid: '08 Nov' },
  { id: 'QT-202610-00012 · R2', to: '/quotations/1', initials: 'KH', bg: '#fbd5dd', customer: 'Kavya Hegde', product: 'CareFirst Family · Gold', total: '₹17,582', status: 'shared', payment: 'awaiting', valid: '08 Nov' },
  { id: 'QT-202610-00011 · R1', to: '/x/qs9-quotation-delete-draft', initials: 'AK', bg: '#e9e3fc', customer: 'Anitha Kulkarni', product: 'FamilySure · Plus', total: '—', status: 'draft', payment: null, valid: '—' },
  { id: 'QT-202610-00010 · R1', to: '/quotations/1', initials: 'FK', bg: '#d9eafd', customer: 'Faizal Khan Sr', product: 'Private Car Package', total: '₹13,263', status: 'accepted', payment: 'paid', valid: '29 Oct' },
  { id: 'QT-202609-00009 · R1', to: '/quotations/1', initials: 'AK', bg: '#e9e3fc', customer: 'Anitha Kulkarni', product: 'SecurePlus · Secure', total: '₹16,240', status: 'expired', payment: null, valid: '05 Oct' },
]

export const comparisons = [
  { id: 'CP-202610-00003', to: '/x/c2-comparison-shared', initials: 'KH', bg: '#fbd5dd', customer: 'Kavya Hegde', product: 'SecurePlus vs CareFirst Family', total: '2 products', status: 'shared', payment: null, valid: '08 Nov' },
]

/* ───────────── Proposal — Nominees (Figma 10:1354) ───────────── */

export const proposalSteps = [
  { label: 'Members', sub: 'Locked from quotation', done: true },
  { label: 'Declarations', sub: '2 answered', done: true },
  { label: 'Nominees', sub: 'Must total 100%' },
  { label: 'KYC check', sub: 'Aadhaar and PAN' },
  { label: 'Premium', sub: 'Paid · UPI' },
  { label: 'Review and submit', sub: 'Advisor only' },
]
