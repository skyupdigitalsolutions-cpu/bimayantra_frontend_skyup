// Mock data for public pages (customer quotation, referral form, referrer dashboard)
export const publicQuote = {
  validUntil: '08 Nov 2026',
  ref: 'QT-202610-00012 · R2 · prepared on 24 Oct 2026',
  product: 'Niva Bupa CareFirst Family',
  uin: 'UIN NBHHLIP00001V012526 · Health insurance',
  facts: [
    ['users', 'Covers', 'Kavya, Arjun, Anya'],
    ['shield', 'Sum insured', '₹10 lakh'],
    ['calendar', 'Starts', '10 Nov 2026'],
  ],
  features: ['No room-rent limit', 'No co-pay', 'Unlimited restore', '10,200 network hospitals'],
  ledger: [
    ['Base premium', '₹14,900.00'],
    ['Riders', '₹0.00'],
    ['GST 18%', '₹2,682.00'],
  ],
  total: '₹17,582.00',
}

export const referralInterests = { Health: true, Motor: false, 'Life and Term': true, Travel: false }

export const referrerStatsCards = [
  { icon: 'send', label: 'Sent', n: '4', bg: '#d9eafd' },
  { icon: 'clock', label: 'In progress', n: '2', bg: '#e9e3fc' },
  { icon: 'users', label: 'Became customers', n: '1', bg: '#d4f1e7' },
  { icon: 'shield', label: 'Policy taken', n: '1', bg: '#fde8c9' },
]

export const myReferrals = [
  { ini: 'RG', bg: '#fde8c9', name: 'Ramesh Gowda', sub: '98••••••45 · 12 Oct 2026', status: 'In progress', tone: 'blue' },
  { ini: 'KH', bg: '#fbd5dd', name: 'Kavya Hegde', sub: '98••••••56 · 02 Sep 2026', status: 'Policy taken', tone: 'green', icon: 'check' },
  { ini: 'SR', bg: '#e9e3fc', name: 'Sunita R', sub: '96••••••12 · 21 Oct 2026', status: 'Already known to the advisor', tone: 'gray' },
  { ini: 'NR', bg: '#d9eafd', name: 'Nisha Rao', sub: '91••••••01 · 26 Oct 2026', status: 'New', tone: 'blue' },
]
