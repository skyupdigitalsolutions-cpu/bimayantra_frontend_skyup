// Mock data for the catalogue / after-sale screens (policies, renewals, comms, docs, products).

export const policyStats = [
  { key: 'awaiting', bg: 'bg-violet-100', icon: 'clock', label: 'Awaiting issuance', value: 1, note: 'Submitted 7 days ago' },
  { key: 'issued', bg: 'bg-mint-100', icon: 'shield', label: 'Issued', value: 3, note: '₹50,460 premium in force' },
  { key: 'renewing', bg: 'bg-amber-100', icon: 'refresh', label: 'Renewing in 60 days', value: 1, note: 'FamilySure · 03 Dec' },
  { key: 'expired', bg: 'bg-pink-100', icon: 'alert', label: 'Expired or lapsed', value: 1, note: 'Suresh Patil' },
]

export const policies = [
  { id: 1, status: 'issued', initials: 'KH', bg: 'bg-pink-200', number: '2245/88/26/0001842', ref: 'PL-000061', customer: 'Kavya Hegde', product: 'Star Health FamilySure', ends: '03 Dec 2026', premium: '₹21,340' },
  { id: 2, status: 'issued', initials: 'FK', bg: 'bg-blue-100', number: '3001/2026/88812', ref: 'PL-000070', customer: 'Faizal Khan Sr', product: 'ICICI Private Car', ends: '14 Feb 2027', premium: '₹12,880' },
  { id: 3, status: 'issued', initials: 'AK', bg: 'bg-violet-100', number: '2856/0049/221', ref: 'PL-000052', customer: 'Anitha Kulkarni', product: 'HDFC ERGO SecurePlus', ends: '30 May 2027', premium: '₹16,240' },
  { id: 4, status: 'awaiting', initials: 'RM', bg: 'bg-amber-100', number: 'Pending', ref: 'PR-000014', customer: 'Rohan Mehta', product: 'Niva Bupa ReAssure 2.0', ends: '—', premium: '₹18,900' },
  { id: 5, status: 'expired', initials: 'SP', bg: 'bg-mint-100', number: '1120/2024/5531', ref: 'PL-000031', customer: 'Suresh Patil', product: 'Care Supreme', ends: '12 Sep 2026', premium: '₹14,450' },
]

export const policyTabs = [
  { key: 'awaiting', label: 'Awaiting issuance' },
  { key: 'issued', label: 'Issued' },
  { key: 'expired', label: 'Expired' },
  { key: 'renewed', label: 'Renewed' },
  { key: 'cancelled', label: 'Cancelled' },
]

export const policyDetail = {
  number: '2245/88/26/0001842',
  ref: 'PL-000061',
  customer: 'Kavya Hegde',
  product: 'Star Health FamilySure',
  covers: 'Covers Kavya, Arjun and Anya · ₹10 lakh · Yearly',
  start: '04 Dec 2025',
  end: '03 Dec 2026 · 38 days left',
  progress: 465 / 520,
  premium: '₹21,340',
  source: 'Recorded from QT-202510-00007',
  kv: [
    ['Insurer policy number', '2245/88/26/0001842'],
    ['Issue date', '28 Nov 2025'],
    ['Frequency', 'Yearly'],
    ['Sum insured', '₹10 lakh'],
    ['Agent code', 'SH-30981'],
    ['Source', 'Quotation'],
  ],
  nominees: [{ initials: 'AH', name: 'Arjun Hegde', sub: 'Spouse · born 02 Jul 1989', share: '100%' }],
  commission: '₹2,712',
}

export const renewalTabs = [
  { key: 'due', label: 'Due', count: 1 },
  { key: 'followup', label: 'In follow-up', count: 0 },
  { key: 'upcoming', label: 'Upcoming', count: 2 },
  { key: 'notrenewing', label: 'Not renewing', count: 0 },
  { key: 'lapsed', label: 'Lapsed', count: 1 },
  { key: 'renewed', label: 'Renewed', count: 0 },
]

export const renewalCards = [
  { initials: 'KH', tone: 'pink', name: 'Kavya Hegde', insurer: 'Star Health', plan: 'FamilySure · Health', due: 'Due in 38 days', urgent: true, renews: '03 Dec 2026', premium: '₹21,340', stage: 'due', days: 38 },
  { initials: 'FK', tone: 'blue', name: 'Faizal Khan Sr', insurer: 'ICICI Lombard', plan: 'Car Package · Motor', due: 'Upcoming · 111 days', renews: '14 Feb 2027', premium: '₹12,880', stage: 'upcoming', days: 111 },
  { initials: 'AK', tone: 'violet', name: 'Anitha Kulkarni', insurer: 'HDFC ERGO', plan: 'SecurePlus · Health', due: 'Upcoming · 216 days', renews: '30 May 2027', premium: '₹16,240', stage: 'upcoming', days: 216 },
]
// Lapsed renewals (shown as the wide row under the cards)
export const lapsedRenewals = [
  { initials: 'SP', name: 'Suresh Patil', insurer: 'Star Health', plan: 'FamilySure', note: 'Grace ended 03 Sep 2026. If the insurer revives it, you can still record the renewal.', stage: 'lapsed' },
]
export const renewalRanges = [
  { key: '30', label: 'Next 30 days', days: 30 },
  { key: '60', label: 'Next 60 days', days: 60 },
  { key: '90', label: 'Next 90 days', days: 90 },
  { key: '365', label: 'Next 12 months', days: 365 },
  { key: 'all', label: 'All dates', days: Infinity },
]

export const reminderSteps = [
  { title: '60 days before', sub: 'Sent 04 Oct · Email', done: true },
  { title: '30 days before', sub: '03 Nov · Email + WhatsApp' },
  { title: '15 days before', sub: '18 Nov' },
  { title: '7 days before', sub: '26 Nov' },
  { title: '1 day before', sub: '02 Dec' },
  { title: '1 day after expiry', sub: '04 Dec' },
]

export const documentTabs = [
  { key: 'all', label: 'All', count: 8 },
  { key: 'identity', label: 'Identity', count: 3 },
  { key: 'policies', label: 'Policies', count: 3 },
  { key: 'medical', label: 'Medical', count: 1 },
  { key: 'vehicle', label: 'Vehicle', count: 1 },
]

// chip: [label, tone, icon]
export const documentCards = [
  { cat: 'identity', bg: 'bg-[#fde8ec]', icon: 'lock', title: 'Aadhaar', owner: 'Kavya Hegde', ver: 'v2 · 24 Oct · Priya', chip: ['Unconfirmed', 'amber', 'alert'] },
  { cat: 'identity', bg: 'bg-[#e9e3fc]', icon: 'lock', title: 'PAN', owner: 'Kavya Hegde', ver: 'v1 · 04 Sep', chip: ['Confirmed', 'green', 'check'] },
  { cat: 'medical', bg: 'bg-[#d4f1e7]', icon: 'heart', title: 'Medical report', owner: 'Arjun Hegde', ver: 'v1 · 06 Sep', chip: ['Saved', 'neutral'] },
  { cat: 'policies', bg: 'bg-[#fde8c9]', icon: 'shield', title: 'Policy 2245/88/26', owner: 'Kavya Hegde', ver: 'v1 · 28 Nov 2025', chip: ['Saved', 'neutral'] },
  { cat: 'vehicle', bg: 'bg-[#d9eafd]', icon: 'car', title: 'Vehicle RC', owner: 'Faizal Khan Sr', ver: 'v1 · 01 Aug', chip: ['Saved', 'neutral'] },
  { cat: 'policies', bg: 'bg-[#fde8c9]', icon: 'shield', title: 'Policy 3001/2026', owner: 'Faizal Khan Sr', ver: 'v1 · 10 Feb', chip: ['Saved', 'neutral'] },
  { cat: 'policies', bg: 'bg-[#fde8c9]', icon: 'shield', title: 'Policy 2856/0049', owner: 'Anitha Kulkarni', ver: 'v1 · 28 May', chip: ['Saved', 'neutral'] },
  { cat: 'identity', bg: 'bg-[#eef1f5]', icon: 'folder', title: 'Old policy scan', owner: 'Suresh Patil', ver: 'v1 · 01 Aug 2025', chip: ['Confirmed', 'green', 'check'] },
]

/* ───────── Products ───────── */
export const productSourceTabs = [
  { key: 'verified', label: 'Verified by SkyUp', count: 9 },
  { key: 'mine', label: 'My products', count: 1 },
]
export const productTypeTabs = [
  { key: 'all', label: 'All' },
  { key: 'health', label: 'Health' },
  { key: 'motor', label: 'Motor' },
  { key: 'life', label: 'Life and Term' },
  { key: 'travel', label: 'Travel' },
]

// status: quote | expired | withdrawn
export const products = [
  { id: 'carefirst', insurer: 'Niva Bupa', name: 'CareFirst Family', bg: 'bg-[#fde8ec]', variants: '4 variants', variant: 'Gold · Family floater', stats: ['No limit', '0%', '3 yrs', '91.2%'], compare: true, status: 'quote', type: 'health', source: 'verified' },
  { id: 'familysure', insurer: 'Star Health', name: 'FamilySure', bg: 'bg-[#fde8c9]', variants: '2 variants', variant: 'Plus · Family floater', stats: ['Single pvt', '0%', '4 yrs', '82.3%'], compare: false, status: 'quote', type: 'health', source: 'verified' },
  { id: 'secureplus', insurer: 'HDFC ERGO', name: 'SecurePlus', bg: 'bg-[#e9e3fc]', variants: '3 variants', variant: 'Secure · Family floater', stats: ['No limit', '0%', '3 yrs', '98.6%'], compare: true, status: 'quote', type: 'health', source: 'verified' },
  { id: 'youngcover', insurer: 'Star Health', name: 'YoungCover', bg: 'bg-[#d9eafd]', variants: '2 variants', variant: 'Standard · Individual', stats: ['% of SI', '0%', '2 yrs', '82.3%'], compare: false, status: 'quote', type: 'health', source: 'verified' },
  { id: 'supreme', insurer: 'Care Health', name: 'Supreme Plus', bg: 'bg-[#d4f1e7]', variants: '2 variants', variant: 'Supreme · Family floater', stats: ['No limit', '0%', '3 yrs', '93.1%'], compare: false, status: 'expired', type: 'health', source: 'verified' },
  { id: 'companion', insurer: 'Niva Bupa', name: 'Companion Classic', bg: 'bg-[#eef1f5]', variants: '1 variant', variant: 'Classic · Individual', stats: ['Fixed cap', '10%', '4 yrs', '91.2%'], compare: false, status: 'withdrawn', type: 'health', source: 'verified' },
  // other insurance types (Products › Motor / Life and Term tabs) and the advisor's own product
  { id: 'privatecar', insurer: 'ICICI Lombard', name: 'Private Car Package', bg: 'bg-[#d9eafd]', variants: '2 variants', variant: 'Comprehensive · Zero dep', stats: ['IDV ₹7.2 L', '0%', '—', '96.8%'], compare: false, status: 'quote', type: 'motor', source: 'verified' },
  { id: 'clickprotect', insurer: 'HDFC Life', name: 'Click 2 Protect Super', bg: 'bg-[#e9e3fc]', variants: '3 variants', variant: 'Life · Level cover', stats: ['₹1 Cr', '—', '—', '99.4%'], compare: false, status: 'quote', type: 'life', source: 'verified' },
  { id: 'iprotect', insurer: 'ICICI Prudential', name: 'iProtect Smart', bg: 'bg-[#fde8ec]', variants: '2 variants', variant: 'Term · Return of premium', stats: ['₹50 L', '—', '—', '98.5%'], compare: false, status: 'quote', type: 'life', source: 'verified' },
  { id: 'activhealth', insurer: 'Aditya Birla', name: 'Activ Health Platinum', bg: 'bg-[#d4f1e7]', variants: '1 variant', variant: 'Enhanced · Family floater', stats: ['No limit', '0%', '2 yrs', '94.1%'], compare: false, status: 'quote', type: 'health', source: 'mine' },
]
export const productStatLabels = ['Room rent', 'Co-pay', 'PED wait', 'Claims']

export const carefirstVariants = [
  { key: 'silver', name: 'Silver · Family floater', sub: '₹3 – 10 lakh · from ₹11,420', compare: false },
  { key: 'gold', name: 'Gold · Family floater', sub: '₹5 – 25 lakh · from ₹14,900', compare: true },
  { key: 'platinum', name: 'Platinum · Family floater', sub: '₹10 lakh – 1 crore · from ₹21,700', compare: true },
  { key: 'senior', name: 'Senior 60+', sub: '₹3 – 10 lakh · from ₹28,300', compare: false },
]

export const compareTray = [
  { name: 'CareFirst Family', variant: 'Gold' },
  { name: 'CareFirst Family', variant: 'Platinum' },
  { name: 'SecurePlus', variant: 'Secure' },
]

export const compareFeatures = [
  'No room-rent limit', 'Zero co-pay', 'Pre-existing cover within 2 years', 'Unlimited restore benefit', 'Maternity cover included',
  'OPD consultations covered', 'Worldwide emergency cover', 'Free annual health check-up', 'Claims settled above 95%', '10,000+ network hospitals',
]
export const comparePackages = [
  { insurer: 'Niva Bupa', name: 'CareFirst Family', iconBg: 'bg-[#fde8c9]', variant: 'Platinum · Family floater', price: '₹24,960', has: [1, 1, 1, 1, 1, 1, 1, 1, 0, 1] },
  { insurer: 'Niva Bupa', name: 'CareFirst Family', variant: 'Gold · Family floater', price: '₹17,582', has: [1, 1, 0, 1, 0, 0, 0, 1, 0, 1], best: true },
  { insurer: 'HDFC ERGO', name: 'SecurePlus', iconBg: 'bg-[#e9e3fc]', variant: 'Secure · Family floater', price: '₹19,978', has: [1, 1, 0, 1, 0, 1, 1, 1, 1, 1] },
]

export const productDetail = {
  variants: [
    { key: 'silver', label: 'Silver' },
    { key: 'gold', label: 'Gold' },
    { key: 'platinum', label: 'Platinum' },
    { key: 'senior', label: 'Senior 60+' },
  ],
  features: [
    { t: 'In-patient hospitalisation', s: 'Up to sum insured', ok: true },
    { t: 'Pre-hospitalisation', s: '60 days', ok: true },
    { t: 'Post-hospitalisation', s: '180 days', ok: true },
    { t: 'Day-care procedures', s: 'All listed', ok: true },
    { t: 'Room rent', s: 'No limit', ok: true },
    { t: 'Co-pay', s: '0%', ok: true },
    { t: 'Pre-existing disease wait', s: '3 years', ok: true },
    { t: 'Restore benefit', s: 'Unlimited', ok: true },
    { t: 'Maternity cover', s: 'Rider only', ok: false },
    { t: 'OPD consultations', s: 'Not covered', ok: false },
    { t: 'Road ambulance', s: '₹3,000', ok: true },
    { t: 'Free health check-up', s: 'Every year', ok: true },
  ],
  eligibility: [
    ['Adult entry age', '18 – 65'],
    ['Children', '91 days – 25 years'],
    ['Sum insured', '₹5 – 25 lakh'],
    ['Policy term', '1, 2 or 3 years'],
    ['Cover type', 'Family floater'],
  ],
}
