// Mock data for the New quotation wizard (Figma Q1–Q11).

export const STEPS = [
  { label: 'Customer', path: '/x/q1-quotation-customer' },
  { label: 'Type', path: '/x/q2-quotation-type' },
  { label: 'Insurance', path: '/x/q3-quotation-insurance' },
  { label: 'Insurer', path: '/x/q4-quotation-insurer' },
  { label: 'Product', path: '/x/q5-quotation-product' },
  { label: 'Details', path: '/x/q6-quotation-details' },
  { label: 'Riders', path: '/x/q7-quotation-riders' },
  { label: 'Premium', path: '/x/q8-quotation-premium' },
  { label: 'Discount', path: '/x/q9-quotation-discount' },
  { label: 'Review', path: '/x/q10-quotation-review' },
]
export const GENERATED_PATH = '/x/q11-quotation-generated'

export const QUOTE_NO = 'QT-202610-00013  R1'
export const SUBTITLE_PRODUCT = 'Kavya Hegde · Niva Bupa CareFirst Family'
export const SUBTITLE_VARIANT = 'Kavya Hegde · Niva Bupa CareFirst Family · Gold'

/** Summary values in the order they get filled by the wizard. */
export const SUMMARY = [
  ['Customer', 'Kavya Hegde'],
  ['Type', 'Single quotation'],
  ['Insurance', 'Health'],
  ['Insurer', 'Niva Bupa · NB-77421'],
  ['Product', 'CareFirst Family · Gold'],
  ['People and cover', '3 people · ₹10 lakh'],
]

export const customers = [
  { id: 'CU-000318', initials: 'KH', name: 'Kavya Hegde', meta: 'CU-000318 · 98861 23456 · 3 family members', tone: 'bg-pink-200', consent: true },
  { id: 'CU-000319', initials: 'FK', name: 'Faizal Khan Sr', meta: 'CU-000319 · Mysuru', tone: 'bg-blue-100' },
  { id: 'CU-000320', initials: 'AK', name: 'Anitha Kulkarni', meta: 'CU-000320 · Hubballi', tone: 'bg-violet-100' },
]

export const quoteTypes = [
  { key: 'single', icon: 'quote', iconBg: 'bg-amber-100', title: 'Single quotation', text: 'One product. Can carry the insurer’s payment link.' },
  { key: 'compare', icon: 'compare', iconBg: 'bg-mint-100', title: 'Comparative quotation', text: '2 to 3 products or variants side by side. No payment link.', to: '/x/cq2-comparison-type' },
]

export const insuranceTypes = [
  { key: 'health', icon: 'heart', title: 'Health', sub: '5 products', bg: 'bg-pink-100' },
  { key: 'motor', icon: 'car', title: 'Motor', sub: '1 product', bg: 'bg-blue-100' },
  { key: 'life', icon: 'umbrella', title: 'Life and Term', sub: 'Not on licence', bg: 'bg-violet-100', disabled: true },
  { key: 'travel', icon: 'plane', title: 'Travel', sub: 'Coming soon', bg: 'bg-mint-100', disabled: true },
]

export const insurers = [
  { key: 'nb', initials: 'NB', name: 'Niva Bupa', meta: 'NB-77421 · valid till 31 Mar 2027', tone: 'bg-white' },
  { key: 'sh', initials: 'SH', name: 'Star Health', meta: 'SH-30981 · valid till 30 Jun 2027', tone: 'bg-white' },
  { key: 'he', initials: 'HE', name: 'HDFC ERGO', meta: 'HE-55102 · valid till 31 Jan 2027', tone: 'bg-white' },
  { key: 'ch', initials: 'CH', name: 'Care Health', meta: 'Agent code expired 30 Sep 2026. Update it to quote.', tone: 'bg-white', expired: true },
]

export const products = [
  { key: 'carefirst', name: 'CareFirst Family', meta: '4 variants · PV-3', variants: ['Gold · Family floater', 'Silver · Family floater', 'Platinum · Family floater', 'Gold · Individual'] },
  { key: 'companion', name: 'Companion Classic', meta: 'Withdrawn. Choose another product.', withdrawn: true },
  { key: 'arogya', name: 'Arogya Basic (my product)', meta: 'Your own product · My PV-1', variants: ['Standard', 'Plus'] },
]

export const people = [
  { key: 'kavya', initials: 'KH', name: 'Kavya Hegde', meta: 'Self · 34', tone: 'bg-pink-200', on: true },
  { key: 'arjun', initials: 'AH', name: 'Arjun Hegde', meta: 'Spouse · 37', tone: 'bg-blue-100', on: true },
  { key: 'anya', initials: 'AH', name: 'Anya Hegde', meta: 'Daughter · 5', tone: 'bg-mint-100', on: true },
  { key: 'shanta', initials: 'SH', name: 'Shanta Hegde', meta: 'Add date of birth to include', tone: 'bg-amber-100', noDob: true },
]

export const sumInsuredOptions = ['₹5 lakh', '₹10 lakh', '₹15 lakh', '₹25 lakh', '₹50 lakh']
export const termOptions = ['1 year', '2 years', '3 years']

export const BASE_PREMIUM = 14900
export const GST = 0.18

export const riders = [
  { key: 'cash', name: 'Daily hospital cash', meta: '₹1,000 per day in hospital, up to 30 days', price: '1,200', on: true },
  { key: 'maternity', name: 'Maternity cover', meta: 'After 2 years. Tick to add and enter the price.', price: '' },
  { key: 'room', name: 'Room upgrade', meta: 'Not offered on Gold. Available on Platinum.', price: '', disabled: true },
  { key: 'air', name: 'Air ambulance cover', meta: 'Added by you', price: '800', on: true, custom: true },
]

export const includedFeatures = ['No room-rent limit', 'Zero co-pay', 'Restore benefit']

export const benefits = [
  { key: 'claims', title: 'Claim assistance by your advisor', sub: 'Help with cashless approval and paperwork', onPdf: true },
  { key: 'review', title: 'Annual policy review call', sub: 'Check cover and sum insured every year', onPdf: true },
]

export const reviewKV = [
  ['Customer', 'Kavya Hegde'],
  ['People', 'Kavya 34 · Arjun 37 · Anya 5'],
  ['Product', 'CareFirst Family · Gold'],
  ['UIN', 'NBHHLIP00001V012526'],
  ['Agent code', 'NB-77421'],
  ['Sum insured, term', '₹10 lakh · 1 year'],
  ['Start date', '10 Nov 2026'],
  ['Riders', 'Daily hospital cash'],
]

export const QUOTE_ID = 'QT-202610-00013'

export const shareChannels = [
  { key: 'email', icon: 'mail', iconBg: 'bg-violet-100', title: 'Email', sub: 'kavya.hegde@example.in', cta: 'Send by email', ctaIcon: 'send', to: '/quotations/1' },
  { key: 'whatsapp', icon: 'chat', iconBg: 'bg-mint-100', title: 'WhatsApp', sub: 'Opens your WhatsApp', cta: 'Open WhatsApp', ctaIcon: 'chat' },
  { key: 'link', icon: 'link', iconBg: 'bg-blue-100', title: 'Copy link', sub: 'Customer page', cta: 'Copy link', ctaIcon: 'link' },
  { key: 'pdf', icon: 'download', iconBg: 'bg-amber-100', title: 'Download PDF', sub: 'Does not start validity', cta: 'Download PDF', ctaIcon: 'download' },
]

export const nextSteps = [
  ['Customer views and pays the insurer', 'Payment link is on the page'],
  ['Record the payment', 'Quotation becomes Accepted'],
  ['Start the proposal', 'Submit on the insurer portal'],
  ['Record the issued policy', 'Renewal tracking starts'],
]

/** ₹14,900.00 / ₹14,900 */
export const inr = (n, dec = false) =>
  '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: dec ? 2 : 0, maximumFractionDigits: dec ? 2 : 0 })
