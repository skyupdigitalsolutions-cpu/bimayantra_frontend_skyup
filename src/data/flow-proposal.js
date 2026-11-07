// Mock data for Flow · Proposal (Figma 45:5821 … 45:7141)

export const proposal = {
  id: 'PR-202610-00005',
  sub: 'Kavya Hegde · Niva Bupa CareFirst Family · Gold · QT-202610-00013',
  quote: 'QT-202610-00013 R1',
  total: '₹18,054.00',
}

export const R = {
  members: '/x/r1-proposal-members',
  declarations: '/x/r2-proposal-declarations',
  nominees: '/x/r3-proposal-nominees',
  kyc: '/x/r4-proposal-kyc-check',
  premium: '/x/r5-proposal-premium',
  review: '/x/r6-proposal-review-and-submit',
  submitted: '/x/r7-proposal-submitted',
  cancel: '/x/prc-proposal-cancel',
  declined: '/x/prd-proposal-mark-declined',
  recordPolicy: '/x/l1-record-issued-policy',
}

export const PROPOSAL_STEPS = [
  { label: 'Members', sub: 'Locked from quotation', to: R.members },
  { label: 'Declarations', sub: 'Health questions', to: R.declarations },
  { label: 'Nominees', sub: 'Must total 100%', to: R.nominees },
  { label: 'KYC check', sub: 'Aadhaar and PAN', to: R.kyc },
  { label: 'Premium', sub: 'Payment recorded', to: R.premium },
  { label: 'Review and submit', sub: 'Advisor only', to: R.review },
]

export const members = [
  { initials: 'KH', name: 'Kavya Hegde', sub: 'Self · 34', bg: '#fbd5dd' },
  { initials: 'AH', name: 'Arjun Hegde', sub: 'Spouse · 37', bg: '#d9eafd' },
  { initials: 'AH', name: 'Anya Hegde', sub: 'Daughter · 5', bg: '#d4f1e7' },
]

export const declarationPeople = ['Kavya', 'Arjun', 'Anya']
export const declarationQuestions = [
  { key: 'ped', label: 'Pre-existing disease' },
  { key: 'meds', label: 'Current medicines' },
  { key: 'hosp', label: 'Hospital stay in the last 4 years' },
  { key: 'tobacco', label: 'Tobacco' },
  { key: 'alcohol', label: 'Alcohol' },
]
const no = { ped: 'No', meds: 'No', hosp: 'No', tobacco: 'No', alcohol: 'No' }
export const initialDeclarations = {
  Kavya: { ...no },
  Arjun: { ...no, ped: 'Yes', meds: 'Yes' },
  Anya: { ...no },
}
export const initialCondition = { condition: 'Hypothyroidism', since: 'Mar 2021', treatment: 'Thyronorm 50 mcg' }

export const nomineePeople = ['Arjun Hegde', 'Anya Hegde', 'Suma Hegde', 'Ramesh Hegde']
export const relationships = ['Spouse', 'Daughter', 'Son', 'Mother', 'Father', 'Sibling']
export const initialNominees = [{ id: 1, person: 'Arjun Hegde', relationship: 'Spouse', share: '100' }]

export const kyc = [
  { doc: 'Aadhaar', status: 'Confirmed · v1 · 04 Sep 2026', masked: 'XXXX XXXX 1234' },
  { doc: 'PAN', status: 'Confirmed · v1 · 04 Sep 2026', masked: 'ABCXX1234X' },
]

export const payment = {
  title: 'Paid · ₹18,054.00',
  sub: 'UPI · UTR6271839934 · 26 Oct 2026',
  ledger: [
    ['Premium (override)', '₹15,800.00'],
    ['Discount', '− ₹500.00'],
    ['GST 18%', '₹2,754.00'],
  ],
  total: '₹18,054.00',
}

export const reviewChecks = [
  ['Members locked', '3 people'],
  ['Declarations answered', '1 condition declared for Arjun'],
  ['Nominees total 100%', 'Arjun Hegde'],
  ['Aadhaar and PAN on file', 'Confirmed'],
  ['Premium payment recorded', '₹18,054.00'],
  ['Quotation not expired', 'Valid until 08 Nov'],
]

export const frozen = [
  ['Members', 'Kavya, Arjun, Anya'],
  ['Declarations', 'Arjun: hypothyroidism since Mar 2021'],
  ['Nominee', 'Arjun Hegde · 100%'],
  ['Premium', '₹18,054.00 · paid'],
]
