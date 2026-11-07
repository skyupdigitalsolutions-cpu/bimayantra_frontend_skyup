// Mock data for the Settings section
export const profile = {
  name: 'Suresh Rao',
  dob: '21-06-1983',
  email: 'suresh.rao@example.in',
  mobile: '98450 12345',
  address: '14, 2nd Main, Jayanagar 4th Block, Bengaluru 560011',
  licence: '12345678',
  licenceUntil: '14-02-2028',
  quoteName: 'Rao Insurance Services',
  categories: { Life: false, General: true, Health: true },
}

export const plans = {
  normal: [
    [true, 'Leads, customers, quotations, policies'],
    [true, 'Best fit and comparisons'],
    [true, 'Renewal reminder emails'],
    [true, 'Referrers'],
    [false, 'Assistant users'],
    [false, 'Dedicated WhatsApp number'],
    [false, 'Automated WhatsApp greetings'],
  ],
  premium: ['Everything in Normal', 'Up to 2 assistant users', 'Dedicated WhatsApp Business number', 'Automated greetings and reminders', 'WhatsApp wallet (₹1 / message)', 'Priority support'],
}

export const insurers = [
  { ini: 'NB', name: 'Niva Bupa', code: 'NB-77421', until: '31 Mar 2027', status: 'active', action: 'Edit' },
  { ini: 'SH', name: 'Star Health', code: 'SH-30981', until: '30 Jun 2027', status: 'active', action: 'Edit' },
  { ini: 'HE', name: 'HDFC ERGO', code: 'HE-55102', until: '31 Jan 2027', status: 'active', action: 'Edit' },
  { ini: 'IL', name: 'ICICI Lombard', code: 'IL-88213', until: '31 Dec 2026', status: 'expiring', action: 'Edit', to: '/x/in2-my-insurers-deactivate' },
  { ini: 'CH', name: 'Care Health', code: 'CH-11027', until: '30 Sep 2026', status: 'expired', action: 'Update code' },
]

export const walletTx = [
  { title: 'Debit · Renewal reminder to Kavya Hegde', when: '03 Oct, 09:00', amount: '− ₹1.00' },
  { title: 'Recharge · Payment gateway · pay_Q8x2', when: '01 Oct, 18:22', amount: '+ ₹500.00', credit: true },
  { title: 'Credit · Manual credit by SkyUp · goodwill', when: '28 Sep, 11:00', amount: '+ ₹20.00', credit: true },
]

export const assistantRules = {
  can: ['Add and work leads', 'Add customers and documents', 'Prepare quotations and proposals', 'Log renewal contacts'],
  cannot: ['Record payments or submit proposals', 'Mark leads lost or reopen them', 'See commission or full PAN and Aadhaar', 'Change plan, wallet or team'],
}

export const referrerStats = [['4', 'Referrals'], ['3', 'Became leads'], ['1', 'Became customers'], ['1', 'Policies taken']]
export const referrers = [
  { ini: 'MK', bg: '#fde8c9', name: 'Manjunath K', sub: '3 sent · 1 converted · link K7MX4QPA', status: 'Active', to: '/x/rf2-referrer-disable' },
  { ini: 'KA', bg: '#d9eafd', name: 'Kiran Auto Works', sub: '1 sent · link Q9TR2WZC', status: 'Active' },
  { ini: 'SR', bg: '#fbd5dd', name: 'Shobha Rao', sub: 'Invite valid 7 days', status: 'Invited' },
]

export const supportOpened = [
  ['Customer CU-000318 · Kavya Hegde', '26 Oct, 09:41'],
  ['Quotation QT-202610-00012 R2', '26 Oct, 09:44'],
]

export const exportSets = [
  ['Customers and family', true], ['Leads', true], ['Quotations and comparisons', true], ['Payments', true],
  ['Policies and nominees', true], ['Renewals', true], ['Communications log', false], ['Documents list', true],
]
export const exportsList = [
  { title: 'All', when: '26 Oct, 11:02', status: 'Being prepared', chipClass: 'bg-[#f0ecfb] text-[#5b3fb8]' },
  { title: 'All', when: '02 Oct, 18:00', status: 'Link expired' },
]

export const activityLog = [
  {
    day: 'TODAY',
    items: [
      { icon: 'eye', bg: '#fde8c9', title: 'Full Aadhaar viewed · Kavya Hegde', who: 'You', meta: '09:58 · You' },
      { icon: 'eye', bg: '#e9e3fc', title: 'SkyUp opened CU-000318 under support grant', who: 'SkyUp', meta: '09:41 · Rahul N' },
      { icon: 'lock', bg: '#e9e3fc', title: 'Support access given to Rahul N', who: 'You', meta: '09:30 · You' },
      { icon: 'user-plus', bg: '#d9eafd', title: 'Lead LD-2610-00049 created from referral form', who: 'System', meta: '08:12 · System' },
    ],
  },
  {
    day: 'YESTERDAY',
    items: [
      { icon: 'quote', bg: '#fde8c9', title: 'Revision R2 generated · QT-202610-00012', who: 'You', meta: '19:31 · You' },
      { icon: 'upload', bg: '#d4f1e7', title: 'Aadhaar v2 uploaded for Kavya Hegde', who: 'Priya', meta: '18:02 · Priya' },
    ],
  },
]

export const devices = [
  { icon: 'grid', name: 'Chrome on Windows', where: 'Bengaluru · active now', current: true },
  { icon: 'phone', name: 'Bimayantra app on Android', where: 'Bengaluru · 25 Oct, 21:10' },
  { icon: 'grid', name: 'Safari on iPad', where: 'Mysuru · 19 Oct, 08:02' },
]
