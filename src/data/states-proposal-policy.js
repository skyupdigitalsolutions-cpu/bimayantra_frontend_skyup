// Mock data for States · Proposal / Policy / Renewal (Figma 285:31639 … 285:33944)

export const S = {
  proposals: '/proposals',
  r1: '/x/r1-proposal-members',
  r7: '/x/r7-proposal-submitted',
  r9: '/x/09-proposal-nominees',
  prd: '/x/prd-proposal-mark-declined',
  prd2: '/x/prd2-proposal-declined',
  prc: '/x/prc-proposal-cancel',
  l1: '/x/l1-record-issued-policy',
  l2: '/x/l2-policy-issued',
  policy: '/policies/1',
  po1: '/x/po1-policy-record-cancellation',
  po2: '/x/po2-policy-cancelled',
  n1: '/x/n1-renewal-detail',
  n2: '/x/n2-renewal-log-contact',
  n3: '/x/n3-renewal-not-renewing',
  rn0: '/x/rn0-renewal-how-to-renew',
  rs1: '/x/rs1-renewal-in-follow-up',
  rs2: '/x/rs2-renewal-not-renewing',
  rs3: '/x/rs3-renewal-reopen',
  renewals: '/renewals',
}

/* ── PRL ── */
export const proposalTabs = [
  { key: 'all', label: 'All', count: 5 },
  { key: 'draft', label: 'Draft', count: 1 },
  { key: 'submitted', label: 'Submitted', count: 1 },
  { key: 'issued', label: 'Issued', count: 2 },
  { key: 'declined', label: 'Declined', count: 1 },
  { key: 'cancelled', label: 'Cancelled', count: 0 },
]

export const proposalRows = [
  { id: 'PR-202610-00005', initials: 'KH', bg: '#fbd5dd', holder: 'Kavya Hegde', product: 'CareFirst Family · Gold', premium: '₹18,054', status: 'submitted', updated: '26 Oct', to: S.r7 },
  { id: 'PR-202610-00004', initials: 'FK', bg: '#d9eafd', holder: 'Faizal Khan Sr', product: 'Private Car Package', premium: '₹13,263', status: 'draft', updated: '25 Oct', to: S.r9 },
  { id: 'PR-202609-00003', initials: 'AK', bg: '#e9e3fc', holder: 'Anitha Kulkarni', product: 'SecurePlus · Secure', premium: '₹16,240', status: 'issued', updated: '28 Sep', to: S.policy },
  { id: 'PR-202509-00001', initials: 'KH', bg: '#fbd5dd', holder: 'Kavya Hegde', product: 'FamilySure · Plus', premium: '₹21,340', status: 'issued', updated: '28 Nov 2025', to: S.policy },
  { id: 'PR-202608-00002', initials: 'SP', bg: '#eef1f5', holder: 'Suresh Patil', product: 'Supreme Plus', premium: '₹14,200', status: 'declined', updated: '14 Aug', to: S.prd2 },
]

/* ── PRD / PRD2 ── */
export const submitted = {
  id: 'PR-202610-00005',
  sub: 'Submitted 26 Oct 2026 · waiting for Niva Bupa to issue',
  heroSub: 'Policy record PL-000071 is awaiting issuance. Record the policy number and PDF when Niva Bupa issues it.',
  frozen: [
    ['Members', 'Kavya, Arjun, Anya'],
    ['Declarations', 'Arjun: hypothyroidism since Mar 2021'],
    ['Nominee', 'Arjun Hegde · 100%'],
    ['Premium', '₹18,054.00 · paid'],
  ],
}

/* ── PO1–PO4 ── */
export const policy = {
  number: '2245/88/26/0001842',
  crumb: 'POLICIES  /  PL-000061',
  sub: 'PL-000061 · Kavya Hegde · Star Health FamilySure',
  product: 'Star Health FamilySure',
  covers: 'Covers Kavya, Arjun and Anya · ₹10 lakh · Yearly',
  start: '04 Dec 2025',
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
  nominee: { initials: 'AH', name: 'Arjun Hegde', sub: 'Spouse · born 02 Jul 1989', share: '100%' },
  commission: '₹2,712',
}

/* ── RS1–RS4 ── */
export const renewal = {
  crumb: 'RENEWALS  /  KAVYA HEGDE',
  title: 'Renewal · Kavya Hegde',
  sub: 'Star Health FamilySure · 2245/88/26/0001842',
  grace: 'Grace period until 02 Jan 2027 · last premium ₹21,340 · ₹10 lakh',
}

export const contacts = [
  { icon: 'phone', bg: '#d9eafd', title: 'Spoke to customer', meta: '26 Oct, 11:40 · You', note: 'Wants to compare with CareFirst before renewing.' },
  { icon: 'mail', bg: '#e9e3fc', title: 'Reminder emailed (60 days)', meta: '04 Oct, 09:00 · System' },
]
