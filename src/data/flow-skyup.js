// Mock data for "Flow · SkyUp product reaches advisors" (Figma 129:15020 … 133:16297)

export const ADD_STEPS = ['Category', 'Brochure', 'Company', 'Product', 'Variants', 'Features', 'Review and send']

export const catalogueRows = [
  { name: 'Activ One MAX', meta: 'Aditya Birla Health · 3 variants', tint: '#e9e3fc', isNew: true },
  { name: 'CareFirst Family', meta: 'Niva Bupa · 4 variants', tint: '#fde8ec' },
  { name: 'SecurePlus', meta: 'HDFC ERGO · 3 variants', tint: '#e9e3fc' },
  { name: 'FamilySure', meta: 'Star Health · 2 variants', tint: '#fde8c9' },
  { name: 'Arogya Shield', meta: 'Star Health · 2 variants', tint: '#d9eafd', upcoming: 'Upcoming · 01 Dec' },
]

export const extracted = [
  { label: 'MAX · sum insured', value: '₹5 lakh – ₹1 crore · Family floater', conf: 'High', page: 4, ok: true },
  { label: 'MAX+ · sum insured', value: '₹10 lakh – ₹2 crore', conf: 'High', page: 4, ok: true },
  { label: 'MAX Senior · entry age', value: '60 – 80 years', conf: 'High', page: 5, ok: true },
  { label: 'MAX+ · room rent', value: 'No limit (footnote says “up to ₹10,000”?)', fixed: 'Up to ₹10,000 a day', conf: 'Low', page: 9 },
  { label: 'Child entry age', value: '91 days – 25 years', fixed: '91 days – 30 years', conf: 'Medium', page: 5 },
]

export const reviewTiles = [
  { icon: 'check', label: 'All values checked', value: '42 of 42', bg: '#d4f1e7' },
  { icon: 'edit', label: 'Corrected by you', value: '4 values', bg: '#fde8c9' },
  { icon: 'sparkle', label: 'Confirmed as read', value: '38 values', bg: '#e9e3fc' },
  { icon: 'list', label: 'Variants', value: '3', bg: '#d9eafd' },
]

export const corrections = [
  { field: 'MAX+ · room rent', change: 'No limit → Up to ₹10,000 a day', who: 'p.9 · Meena Iyer' },
  { field: 'Child entry age', change: '91 days – 25 years → 91 days – 30 years', who: 'p.5 · Meena Iyer' },
  { field: 'Launch date', change: '01-03-2026 → 01-08-2026', who: 'p.16 · Meena Iyer' },
  { field: 'OPD · MAX+', change: 'Not found → ₹7,500 a year', who: 'p.12 · Meena Iyer' },
]

/* ───── Advisor side (01b / 10e) ───── */

export const dashQuick = [
  { label: 'New lead', icon: 'user-plus', to: '/x/f1-new-lead', active: true },
  { label: 'New customer', icon: 'users', to: '/x/f3-new-customer' },
  { label: 'Best fit', icon: 'target', to: '/best-fit' },
  { label: 'New quotation', icon: 'quote', to: '/x/q1-quotation-customer' },
  { label: 'Comparison', icon: 'compare', to: '#' },
  { label: 'Record payment', icon: 'card', to: '/x/p2-payment-record-payment' },
  { label: 'Proposal', icon: 'send', to: '/x/r1-proposal-members' },
  { label: 'Record policy', icon: 'shield', to: '/x/l1-record-issued-policy' },
  { label: 'Renewals', icon: 'refresh', to: '/x/n1-renewal-detail' },
  { label: 'Documents', icon: 'folder', to: '/documents' },
]

export const dashRenewals = [
  { initials: 'KH', tone: 'pink', name: 'Kavya Hegde', insurer: 'Star Health', plan: 'FamilySure · Health', due: 'Due in 38 days', urgent: true, renews: '03 Dec 2026', premium: '₹21,340' },
  { initials: 'FK', tone: 'blue', name: 'Faizal Khan Sr', insurer: 'ICICI Lombard', plan: 'Car Package · Motor', due: 'Due in 111 days', renews: '14 Feb 2027', premium: '₹12,880' },
  { initials: 'AK', tone: 'violet', name: 'Anitha Kulkarni', insurer: 'HDFC ERGO', plan: 'SecurePlus · Health', due: 'Due in 216 days', renews: '30 May 2027', premium: '₹16,240' },
]

export const notifications = [
  { icon: 'star', tint: 'bg-violet-100', title: 'New in catalogue: Activ One MAX', body: 'Aditya Birla Health · Health · 3 variants. Add your agent code to quote it.', time: '2 min ago', unread: true, to: '/x/10e-products-new-from-skyup' },
  { icon: 'card', tint: 'bg-[#fde8c9]', title: 'Price update: CareFirst Family', body: 'New rates PV-4 from 01 Dec 2026', time: '1 h ago', unread: true },
  { icon: 'eye', tint: 'bg-[#d9eafd]', title: 'Kavya Hegde viewed QT-202610-00012', time: 'Yesterday' },
]

// type: health | motor | life | travel · source: verified (SkyUp catalogue) | mine (private to the advisor)
// statLabels default to the health labels (Room rent / Co-pay / PED wait / Claims).
export const newProducts = [
  { name: 'CareFirst Family', insurer: 'Niva Bupa', bg: 'bg-pink-100', variants: '4 variants', variant: 'Gold · Family floater', stats: ['No limit', '0%', '3 yrs', '91.2%'], compare: true, status: 'quote', type: 'health', source: 'verified' },
  { name: 'FamilySure', insurer: 'Star Health', bg: 'bg-[#fde8c9]', variants: '2 variants', variant: 'Plus · Family floater', stats: ['Single pvt', '0%', '4 yrs', '82.3%'], status: 'quote', type: 'health', source: 'verified' },
  { name: 'SecurePlus', insurer: 'HDFC ERGO', bg: 'bg-violet-100', variants: '3 variants', variant: 'Secure · Family floater', stats: ['No limit', '0%', '3 yrs', '98.6%'], compare: true, status: 'quote', type: 'health', source: 'verified' },
  { name: 'YoungCover', insurer: 'Star Health', bg: 'bg-[#d9eafd]', variants: '2 variants', variant: 'Standard · Individual', stats: ['% of SI', '0%', '2 yrs', '82.3%'], status: 'quote', type: 'health', source: 'verified' },
  { name: 'Supreme Plus', insurer: 'Care Health', bg: 'bg-[#d4f1e7]', variants: '2 variants', variant: 'Supreme · Family floater', stats: ['No limit', '0%', '3 yrs', '93.1%'], status: 'expired', type: 'health', source: 'verified' },
  { name: 'Activ One MAX', insurer: 'Aditya Birla Health', bg: 'bg-violet-100', variants: '3 variants', variant: 'Max · Family floater', stats: ['No limit', '0%', '2 yrs', '94.1%'], status: 'nocode', isNew: true, quoteTo: '/x/s04-settings-my-insurers', type: 'health', source: 'verified' },
  { name: 'Car Package', insurer: 'ICICI Lombard', bg: 'bg-[#d9eafd]', variants: '2 variants', variant: 'Comprehensive · Private car', statLabels: ['IDV', 'Zero dep', 'NCB', 'Claims'], stats: ['₹6.2 lakh', 'Add-on', 'Up to 50%', '96.1%'], status: 'quote', type: 'motor', source: 'verified' },
  { name: 'Click 2 Protect Supreme', insurer: 'HDFC Life', bg: 'bg-violet-100', variants: '2 variants', variant: 'Life · Level cover', statLabels: ['Cover', 'Term', 'Entry age', 'Claims'], stats: ['₹1 crore', '40 yrs', '18 – 65', '99.4%'], status: 'nocode', quoteTo: '/x/s04-settings-my-insurers', type: 'life', source: 'verified' },
  { name: 'iProtect Smart', insurer: 'ICICI Prudential', bg: 'bg-[#fde8c9]', variants: '3 variants', variant: 'Life Plus · Level cover', statLabels: ['Cover', 'Term', 'Entry age', 'Claims'], stats: ['₹75 lakh', '35 yrs', '18 – 60', '98.6%'], status: 'nocode', quoteTo: '/x/s04-settings-my-insurers', type: 'life', source: 'verified' },
  { name: 'Rao Family Shield', insurer: 'Niva Bupa · my product', bg: 'bg-pink-100', variants: '1 variant', variant: 'Standard · Family floater', stats: ['Single pvt', '10%', '3 yrs', '91.2%'], status: 'quote', type: 'health', source: 'mine' },
]

export const tray = [
  { name: 'CareFirst Family', variant: 'Gold' },
  { name: 'CareFirst Family', variant: 'Platinum' },
  { name: 'SecurePlus', variant: 'Secure' },
]
