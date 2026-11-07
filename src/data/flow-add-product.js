// Mock data for the "Add my product" flow (Figma AP1–AP7), transcribed from the outlines.

export const R = {
  category: '/x/ap1-add-product-category',
  company: '/x/ap2-add-product-company',
  brochure: '/x/ap2b-add-product-brochure-premium',
  reading: '/x/ap2c-add-product-reading-brochure',
  brochureNormal: '/x/ap2d-add-product-brochure-normal-plan',
  product: '/x/ap3-add-product-product',
  productFix: '/x/ap3b-add-product-fix-value-launch-date',
  variants: '/x/ap4-add-product-variants',
  variantsFix: '/x/ap4b-add-product-fix-value-plus-sum-insured',
  features: '/x/ap5-add-product-features',
  featuresFix: '/x/ap5b-add-product-fix-value-opd',
  featuresAdding: '/x/ap5c-add-product-features-ticked-fixed-adding',
  review: '/x/ap6-add-product-review-and-submit',
  published: '/x/ap7-products-published',
  products: '/products',
  billing: '/x/17-settings-plan-and-billing',
}

export const steps = ['Category', 'Company', 'Brochure', 'Product', 'Variants', 'Features', 'Review']

export const categories = [
  { key: 'health', label: 'Health', icon: 'heart', bg: 'bg-[#fde8ec]' },
  { key: 'motor', label: 'Motor', icon: 'car', bg: 'bg-[#d9eafd]' },
  { key: 'life', label: 'Life', icon: 'users', bg: 'bg-[#e9e3fc]' },
  { key: 'term', label: 'Term', icon: 'umbrella', bg: 'bg-[#fde8c9]' },
  { key: 'travel', label: 'Travel', icon: 'plane', bg: 'bg-[#d4f1e7]' },
]

export const insurerQuery = 'Star'
export const insurerResults = [
  { initials: 'SH', name: 'Star Health and Allied Insurance Co. Ltd.', meta: 'Health · in your list', inList: true },
  { initials: 'SU', name: 'Star Union Dai-ichi Life Insurance Co. Ltd.', meta: 'Life · not in your list', inList: false },
  { initials: 'SG', name: 'Shriram General Insurance Co. Ltd.', meta: 'General · not in your list', inList: false },
  // Rest of the library — only surfaces when the search changes
  { initials: 'HE', name: 'HDFC ERGO General Insurance Co. Ltd.', meta: 'General · in your list', inList: true },
  { initials: 'IL', name: 'ICICI Lombard General Insurance Co. Ltd.', meta: 'General · in your list', inList: true },
  { initials: 'NB', name: 'Niva Bupa Health Insurance Co. Ltd.', meta: 'Health · in your list', inList: true },
  { initials: 'CH', name: 'Care Health Insurance Ltd.', meta: 'Health · not in your list', inList: false },
  { initials: 'AB', name: 'Aditya Birla Health Insurance Co. Ltd.', meta: 'Health · not in your list', inList: false },
  { initials: 'BA', name: 'Bajaj Allianz General Insurance Co. Ltd.', meta: 'General · not in your list', inList: false },
  { initials: 'TA', name: 'Tata AIG General Insurance Co. Ltd.', meta: 'General · not in your list', inList: false },
]

// Product preview card ("Your product") — value null renders the em-dash placeholder.
export const previewLabels = ['Category', 'Company', 'Product', 'Variants', 'Features']
export const previewByStep = {
  category: [null, null, null, null, null],
  company: ['Health', 'Star Health', null, null, null],
  read: ['Health', 'Star Health', 'Arogya Plus', '2 · Classic, Plus', '6 of 8'],
}

export const brochureFile = { name: 'arogya-plus-brochure.pdf', meta: '2.4 MB · 12 pages · uploaded' }
export const willFill = [
  { icon: 'list', label: 'Product details' },
  { icon: 'users', label: 'Variants' },
  { icon: 'check', label: 'Features' },
]

export const reading = {
  title: 'Extracting variants and features…',
  sub: 'arogya-plus-brochure.pdf · page 9 of 12',
  pct: 72,
  stages: [
    { label: 'Uploaded', state: 'done' },
    { label: 'Reading pages', state: 'done' },
    { label: 'Extracting', state: 'active' },
    { label: 'Ready to review', state: 'todo' },
  ],
  found: [
    { label: 'Company (matches your pick)', value: 'Star Health', done: true },
    { label: 'Product', value: 'Arogya Plus', done: true },
    { label: 'UIN', value: 'SHAHLIP00099V012526', done: true },
    { label: 'Variants', value: '2 · Classic, Plus', done: true },
    { label: 'Features', value: '6 of 8 template features', done: false },
  ],
}

export const productForm = {
  name: 'Arogya Plus',
  uin: 'SHAHLIP00099V012526',
  code: 'MY-AP',
  launch: '01-08-2026',
}

// "What the AI read" rows. status: ok | warn | missing ; conf: High | Medium | Low | Not found
export const productExtracted = [
  { label: 'Product name', value: 'Arogya Plus', conf: 'High', page: 'p.1', status: 'ok' },
  { label: 'IRDAI UIN', value: 'SHAHLIP00099V012526', conf: 'High', page: 'p.12', status: 'ok' },
  { label: 'Launch date', value: '01-08-2026 (read as 01-03-2026?)', conf: 'Low', page: 'p.12', status: 'warn', fix: 'productFix' },
  { label: 'Product code', value: 'Not in the brochure', conf: 'Not found', status: 'missing' },
]

export const variantsExtracted = [
  { label: 'Classic · sum insured', value: '₹3 lakh – ₹10 lakh · Individual', conf: 'High', page: 'p.3', status: 'ok' },
  { label: 'Plus · sum insured', value: '₹5 lakh – ₹25 lakh · Family floater', conf: 'Medium', page: 'p.3', status: 'warn', fix: 'variantsFix' },
  { label: 'Adult entry age', value: '18 – 65 years', conf: 'High', page: 'p.4', status: 'ok' },
  { label: 'Child entry age', value: '91 days – 25 years (unclear print)', conf: 'Low', page: 'p.4', status: 'warn', fix: 'variantsFix' },
]

export const variants = [
  {
    name: 'Classic', cover: 'Individual', open: true,
    fields: [
      { label: 'Sum insured from', value: '₹3 lakh', select: true },
      { label: 'Sum insured up to', value: '₹10 lakh', select: true },
      { label: 'Entry age', value: '18 – 65' },
    ],
    pricing: 'Rate table (CSV)',
  },
  { name: 'Plus', cover: 'Family floater', summary: '₹5 lakh – ₹25 lakh · ages 18–65 · priced from insurer portal' },
]
export const coverTypes = ['Individual', 'Family floater']
export const pricingTypes = ['Rate table (CSV)', 'Typed from insurer portal']
export const newVariantDraft = 'Senior 60+'

// Source viewer (brochure page skeleton) per step
export const sourcePages = {
  product: { page: 12, label: 'Product name and UIN', hl: { top: 300, h: 80, labelTop: 278 }, titleW: 171 },
  variants: { page: 3, label: 'Variants table', hl: { top: 120, h: 170, labelTop: 98 }, titleW: 176 },
  features: { page: 7, label: 'Benefits table', hl: { top: 180, h: 140, labelTop: 158 }, titleW: 177 },
}
export const pageLines = [
  [24, 140, 10, true], [52, 300], [78, 300], [104, 300], [130, 200], [156, 300], [182, 300], [208, 300],
  [234, 200], [260, 300], [286, 300], [312, 300], [338, 200], [364, 300], [390, 300],
]

export const standardFeatures = [
  'In-patient hospitalisation',
  'Pre-hospitalisation (60 days)',
  'Post-hospitalisation (90 days)',
  'Day-care procedures',
  'Road ambulance',
  'AYUSH treatment',
  'Organ donor expenses',
]

// AI-suggested features. Cell: [included, value?]
export const aiFeatures = [
  { name: 'No room-rent limit', conf: 'High', page: 'p.2', classic: [false, 'Single pvt'], plus: [true] },
  { name: 'Zero co-pay', conf: 'High', page: 'p.2', classic: [true], plus: [true] },
  { name: 'Pre-existing cover within 2 years', conf: 'High', page: 'p.5', classic: [false, '3 yrs'], plus: [true, '2 yrs'] },
  { name: 'Restore benefit', conf: 'High', page: 'p.6', classic: [false], plus: [true, 'Unlimited'] },
  { name: 'Maternity cover', conf: 'Medium', page: 'p.6', classic: [false], plus: [true, 'After 2 yrs'], fix: true },
  { name: 'OPD consultations', conf: 'Low', page: 'p.7', classic: [false], plus: [true, '₹5,000'], fix: true, corrected: '₹7,500' },
  { name: 'Annual health check-up', conf: 'High', page: 'p.8', classic: [true], plus: [true] },
  { name: 'Network hospitals', conf: 'Medium', page: 'p.11', classic: [true, '14,000'], plus: [true, '14,000'], fix: true },
]
// AP5c: ticked rows (by name) and the OPD correction applied
export const tickedAfter = ['No room-rent limit', 'Zero co-pay', 'Pre-existing cover within 2 years', 'Restore benefit', 'OPD consultations', 'Annual health check-up']

export const myFeatures = [{ name: 'Air ambulance', classic: [false], plus: [true, '₹2.5 lakh'] }]

// Fix-value drawers
export const fixes = {
  product: {
    subtitle: 'Launch date', aiRead: '01-03-2026', conf: 'Low', page: 'Page 12', zoomed: true, hlLabel: 'Launch date',
    value: '01-08-2026', note: 'Faded print; confirmed on insurer website.',
  },
  variants: {
    subtitle: 'Plus · sum insured range', aiRead: '₹5 lakh – ₹25 lakh', conf: 'Medium', page: 'Page 3', zoomed: true, hlLabel: 'Plus · sum insured',
    from: '₹5 lakh', to: '₹50 lakh', note: 'Brochure lists ₹50 lakh as the top option.',
  },
  features: {
    subtitle: 'OPD consultations · Plus variant', aiRead: '₹5,000 a year', conf: 'Low', page: 'Page 7', zoomed: false,
    value: '₹7,500 a year', note: 'Table on page 7 shows ₹7,500 for Plus.',
  },
}
export const cropLines = [[24, 380], [52, 380], [80, 220], [108, 380], [136, 380], [164, 220]]

export const review = [
  ['Category', 'Health'],
  ['Company', 'Star Health'],
  ['Product', 'Arogya Plus'],
  ['UIN', 'SHAHLIP00099V012526'],
  ['Launch date', '01 Aug 2026'],
  ['Variants', 'Classic (Individual), Plus (Family floater)'],
  ['Features', '8 template + 0 custom'],
  ['Brochure', 'arogya-plus-brochure.pdf'],
]

export const libraryTabs = [
  { key: 'verified', label: 'Verified by SkyUp', count: 9 },
  { key: 'mine', label: 'My products', count: 2 },
]
export const categoryTabs = ['All', 'Health', 'Motor', 'Life and Term', 'Travel']
export const myProducts = [
  { name: 'Arogya Plus', category: 'Health', insurer: 'Star Health · My product', variants: '2 variants', bg: 'bg-[#e9e3fc]', note: 'Published 26 Oct 2026 · ready to quote.' },
  { name: 'Arogya Basic', category: 'Health', insurer: 'Star Health · My product', variants: '1 variant', bg: 'bg-[#fde8c9]', note: 'Published 01 Aug 2026 · visible only in your account.' },
]
