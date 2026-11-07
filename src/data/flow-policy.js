// Mock data for Flow · Policy & renewal (Figma 46:6554 … 72:9902) and the renewal-quotation flow (255:21407 …)

export const P = {
  l1: '/x/l1-record-issued-policy',
  l2: '/x/l2-policy-issued',
  n1: '/x/n1-renewal-detail',
  n2: '/x/n2-renewal-log-contact',
  n3: '/x/n3-renewal-not-renewing',
  n4: '/x/n4-renewal-renewed',
  n1b: '/x/n1b-renewal-quotation',
  n1c: '/x/n1c-renewal-quotation-ready',
  rn0: '/x/rn0-renewal-how-to-renew',
  rnb1: '/x/rnb1-renewal-new-quotation-product',
  rnb2: '/x/rnb2-renewal-new-quotation-details-and-premium',
  rnb3: '/x/rnb3-renewal-new-quotation-review',
  rnb4: '/x/rnb4-renewal-new-quotation-ready',
  rs2: '/x/rs2-renewal-not-renewing',
  cq2: '/x/cq2-comparison-type',
  policy: '/policies/1',
}

/* ── L1 / L2 ── */
export const issued = {
  sub: 'PL-000071 · Kavya Hegde · Niva Bupa CareFirst Family · Gold',
  number: '31142/HEALTH/2026/0091',
  issueDate: '28-10-2026',
  startDate: '10-11-2026',
  endDate: '09-11-2027',
  frequency: 'Yearly',
  frequencies: ['Yearly', 'Half-yearly', 'Quarterly', 'Monthly'],
  premium: '18,054.00',
  sumInsured: '₹10 lakh',
  sumInsuredOptions: ['₹5 lakh', '₹10 lakh', '₹15 lakh', '₹25 lakh'],
  file: 'policy-31142-2026-0091.pdf',
  fileMeta: '1.4 MB · uploaded',
  commission: '2,295',
  fromProposal: [
    ['Insured', 'Kavya, Arjun, Anya'],
    ['Nominee', 'Arjun Hegde · 100%'],
    ['Declared', 'Arjun: hypothyroidism'],
  ],
}

export const saleJourney = ['Lead', 'Customer', 'Best fit', 'Quotation', 'Payment', 'Proposal', 'Policy'].map((label) => ({ label }))

export const alsoActions = [
  { icon: 'link', label: 'Ask Kavya for a referral' },
  { icon: 'sparkle', label: 'Set Arjun’s birthday greeting' },
  { icon: 'folder', label: 'Upload the policy to Documents' },
]

/* ── Renewal ── */
export const renewal = {
  crumb: 'RENEWALS  /  KAVYA HEGDE',
  title: 'Renewal · Kavya Hegde',
  sub: 'Star Health FamilySure · 2245/88/26/0001842',
  days: '38',
  renewsOn: 'Renews on 03 Dec 2026',
  grace: 'Grace period until 02 Jan 2027 · last premium ₹21,340 · ₹10 lakh',
  reminders: '1 of 6 sent',
  phone: '98861 23456',
}

export const contacts = [
  { icon: 'phone', bg: '#d9eafd', title: 'Spoke to customer', meta: '26 Oct, 11:40 · You', note: 'Wants to compare with CareFirst before renewing.' },
  { icon: 'mail', bg: '#e9e3fc', title: 'Reminder emailed (60 days)', meta: '04 Oct, 09:00 · System' },
]

export const contactOutcomes = ['Spoke to customer', 'Not reachable', 'Asked to call back']
export const followUpTimes = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM']
export const notRenewingReasons = ['Bought elsewhere', 'Too expensive', 'No longer needed', 'Moved to group cover', 'Other']

export const renewedJourney = [
  { label: 'Due', date: '04 Oct' },
  { label: 'Contacted', date: '26 Oct' },
  { label: 'Renewal quote', date: '27 Oct' },
  { label: 'Paid', date: '29 Nov' },
  { label: 'Proposal', date: '29 Nov' },
  { label: 'New policy', date: '30 Nov' },
]

/* ── N1b renewal quotation (same policy) ── */
export const carriedOver = [
  ['Customer', 'Kavya Hegde'],
  ['Product', 'FamilySure · Plus'],
  ['People', 'Kavya, Arjun, Anya'],
  ['Insurer', 'Star Health'],
]
export const renewalRiders = [
  { name: 'Outpatient cover', price: '2,500', on: true },
  { name: 'Room upgrade', price: '', on: false },
]
export const termOptions = ['1 year', '2 years', '3 years']
export const sumInsuredOptions = ['₹5 lakh', '₹10 lakh', '₹15 lakh', '₹25 lakh']

/* ── Ready (N1c / RNB4) ── */
export const shareChannels = [
  { key: 'email', icon: 'mail', bg: '#e9e3fc', label: 'Email' },
  { key: 'whatsapp', icon: 'chat', bg: '#d4f1e7', label: 'WhatsApp' },
  { key: 'link', icon: 'link', bg: '#d9eafd', label: 'Copy link' },
  { key: 'pdf', icon: 'download', bg: '#fde8c9', label: 'PDF' },
]
