// Mock data for Flow · Record payment (Figma 42:5774 / 42:5954 / 42:6143)

export const paymentQuote = {
  id: 'QT-202610-00013',
  revision: 'R1',
  customer: 'Kavya Hegde',
  product: 'CareFirst Family',
  plan: 'Gold',
  insurer: 'Niva Bupa',
  insurerDomain: 'nivabupa.com',
  total: '₹18,054',
  totalExact: '18,054.00',
  proposalId: 'PR-202610-00005',
}

export const paymentModes = ['Insurer link', 'UPI', 'Net banking', 'Card', 'Cheque', 'Cash']

export const recordedPayment = {
  amount: '₹18,054.00',
  mode: 'UPI',
  utr: 'UTR6271839934',
  date: '26-10-2026',
  dateLong: '26 Oct 2026',
}

export const proposalChecklist = [
  { icon: 'users', title: 'Members', sub: 'Locked from quotation', tint: 'bg-[#d9eafd]' },
  { icon: 'list', title: 'Declarations', sub: 'Health questions per person', tint: 'bg-[#e9e3fc]' },
  { icon: 'user-plus', title: 'Nominees', sub: 'Must total 100%', tint: 'bg-[#fde8ec]' },
  { icon: 'lock', title: 'KYC check', sub: 'Aadhaar and PAN on file', tint: 'bg-[#fde8c9]' },
  { icon: 'send', title: 'Submit', sub: 'Advisor only', tint: 'bg-[#d4f1e7]' },
]
