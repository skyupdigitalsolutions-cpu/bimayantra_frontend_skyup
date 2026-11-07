// Mock data for SkyUp Admin screens (Figma 25:1976, 25:2215, 25:2413)

export const homeStats = [
  { label: 'Pending approvals', value: '5', note: '2 are yours · someone else approves', icon: 'check', bg: '#e9e3fc' },
  { label: 'KYC queue', value: '2', note: 'Oldest 24 Oct · target 2 days', icon: 'shield', bg: '#fde8c9' },
  { label: 'Product corrections', value: '1', note: 'From Lakshmi Agencies', icon: 'edit', bg: '#d9eafd' },
  { label: 'Active accounts', value: '4', note: '1 suspended', icon: 'users', bg: '#d4f1e7' },
]

export const homeApprovals = [
  { icon: 'box', tint: 'bg-[#fde8c9]', title: 'Star Health FamilySure, version 3', meta: 'Product version · Rahul N · 25 Oct, 16:20' },
  { icon: 'card', tint: 'bg-[#d9eafd]', title: 'CareFirst Family price PV-4 from 01 Dec', meta: 'Price version · Rahul N · 25 Oct, 17:05' },
  { icon: 'settings', tint: 'bg-violet-100', title: 'CFG-46 Quotation valid for: 15 → 21 days', meta: 'Configuration · you · 26 Oct, 08:45', own: true },
]

export const planBars = [
  { label: 'Trial', w: 110, color: '#9aa4b5', n: 1 },
  { label: 'Normal', w: 220, color: '#1f5fd6', n: 2 },
  { label: 'Premium', w: 220, color: '#5b3fb8', n: 2 },
]

export const kycWaiting = [
  { initials: 'SR', name: 'Suresh Rao', wait: '2 days waiting' },
  { initials: 'PK', name: 'Prakash K', wait: '1 day waiting' },
]

export const recentActivity = [
  { text: 'Opened customer CU-•••••• under support grant · Rao Insurance Services', meta: 'Rahul N · 26 Oct, 09:41' },
  { text: 'Approved Care Health insurer record', meta: 'Arvind Shetty · 20 Oct, 11:00' },
  { text: 'Suspended sending for Coastal Cover', meta: 'System · 10 Oct, 10:05' },
]

export const approvals = [
  {
    title: 'Star Health FamilySure, version 3',
    short: 'FamilySure v3',
    meta: 'Product version · by Rahul N · 25 Oct 2026, 16:20',
    rows: [
      ['Network hospitals', '14,000', '14,250'],
      ['Restore benefit', 'Yes, once a year', 'Yes, unlimited'],
    ],
  },
  {
    title: 'CFG-46 Quotation valid for',
    short: 'CFG-46',
    meta: 'Configuration · by you · 26 Oct 2026, 08:45',
    rows: [['Value', '15 days', '21 days']],
    own: true,
  },
  {
    title: 'CareFirst Family price PV-4 from 01 Dec',
    short: 'CareFirst PV-4',
    meta: 'Price version · by Rahul N · 25 Oct 2026, 17:05',
    rows: [
      ['Base premium', '₹14,900 a year', '₹15,640 a year'],
      ['Starts', '—', '01 Dec 2026, 00:00 IST'],
    ],
  },
  {
    title: 'Care Health Supreme Plus, version 2',
    short: 'Supreme Plus v2',
    meta: 'Product version · by Arvind Shetty · 24 Oct 2026, 15:30',
    rows: [['Pre-existing disease wait', '4 years', '3 years']],
  },
  {
    title: 'payment_pending email template',
    short: 'payment_pending',
    meta: 'Message template · by Rahul N · 26 Oct 2026, 09:12',
    rows: [['Subject', 'Payment pending for your policy', 'Your premium payment is pending']],
  },
]

export const kycQueue = [
  { initials: 'SR', tint: 'bg-[#fbd5dd]', name: 'Suresh Rao', meta: 'Rao Insurance Services · 2 days', submitted: 'Submitted 24 Oct 2026 · Rao Insurance Services',
    kv: [['Name as on PAN', 'Suresh Rao'], ['PAN', 'ABCPR1234K'], ['Licence number', '12345678'], ['Licence valid until', '14 Feb 2028'], ['Advisor type', 'Individual agent'], ['Categories', 'General, Health']] },
  { initials: 'PK', tint: 'bg-[#d9eafd]', name: 'Prakash K', meta: 'Hubli Health Advisors · 1 day', submitted: 'Submitted 25 Oct 2026 · Hubli Health Advisors',
    kv: [['Name as on PAN', 'Prakash K'], ['PAN', 'BKQPK5521L'], ['Licence number', '87654321'], ['Licence valid until', '02 Sep 2027'], ['Advisor type', 'Individual agent'], ['Categories', 'Health']] },
]
