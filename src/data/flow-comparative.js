// Mock data for Flow · Comparative quotation (Figma CQ2–CQ9, 218:16885 … 219:18211)

export const CQ_STEPS = ['Customer', 'Type', 'Insurance', 'Options', 'Details', 'Premiums', 'Recommend', 'Review']

export const CQ_NO = 'CQ-202610-00003'

export const CQ = {
  type: '/x/cq2-comparison-type',
  insurance: '/x/cq3-comparison-insurance',
  options: '/x/cq4-comparison-options',
  details: '/x/cq5-comparison-details',
  premiums: '/x/cq6-comparison-premiums',
  recommend: '/x/cq7-comparison-recommend',
  review: '/x/cq8-comparison-review',
  generated: '/x/cq9-comparison-generated',
  shared: '/x/c2-comparison-shared',
  singleType: '/x/q2-quotation-type',
  customer: '/x/q1-quotation-customer',
}

export const insuranceTypes = [
  { key: 'Health', icon: 'heart', bg: 'bg-[#fde8ec]' },
  { key: 'Motor', icon: 'car', bg: 'bg-[#d9eafd]' },
  { key: 'Life', icon: 'users', bg: 'bg-[#e9e3fc]' },
  { key: 'Term', icon: 'umbrella', bg: 'bg-[#fde8c9]' },
  { key: 'Travel', icon: 'plane', bg: 'bg-[#d4f1e7]' },
]

export const cqOptions = [
  {
    key: 'gold', product: 'CareFirst Family', variant: 'Gold', insurer: 'Niva Bupa', tint: 'bg-[#fde8ec]',
    variants: ['Silver', 'Gold', 'Platinum'], base: '14,900', addons: [{ name: 'Daily hospital cash', price: '₹1,200' }],
    beforeGst: '₹16,100', total: '₹18,998', lowest: true,
    features: [['No room-rent limit', true], ['Unlimited restore', true], ['Maternity cover', false], ['OPD cover', false]],
  },
  {
    key: 'platinum', product: 'CareFirst Family', variant: 'Platinum', insurer: 'Niva Bupa', tint: 'bg-[#fde8c9]',
    variants: ['Silver', 'Gold', 'Platinum'], base: '21,150', addons: [],
    beforeGst: '₹21,150', total: '₹24,957',
    features: [['No room-rent limit', true], ['Unlimited restore', true], ['Maternity cover', true], ['OPD cover', true]],
  },
  {
    key: 'secure', product: 'SecurePlus', variant: 'Secure', insurer: 'HDFC ERGO', tint: 'bg-[#e9e3fc]',
    variants: ['Secure', 'Secure Plus'], base: '16,930', addons: [],
    beforeGst: '₹16,930', total: '₹19,977',
    features: [['No room-rent limit', true], ['Unlimited restore', true], ['Maternity cover', false], ['OPD cover', true]],
  },
]

export const cqPeople = [
  { key: 'kavya', initials: 'KH', label: 'Kavya Hegde · Self 34', avatar: 'bg-[#fbd5dd]', on: true },
  { key: 'arjun', initials: 'AH', label: 'Arjun Hegde · Spouse 37', avatar: 'bg-[#d9eafd]', on: true },
  { key: 'anya', initials: 'AH', label: 'Anya Hegde · Daughter 5', avatar: 'bg-[#d4f1e7]', on: true },
  { key: 'shanta', initials: 'SH', label: 'Shanta Hegde · add DOB', avatar: 'bg-[#fde8c9]', on: false, disabled: true },
]

export const WHY_GOLD = 'No room-rent limit and unlimited restore suit a young family; premium is within budget.'

export const shareChannels = [
  { key: 'email', label: 'Email', icon: 'mail', tint: 'bg-[#e9e3fc]' },
  { key: 'whatsapp', label: 'WhatsApp', icon: 'chat', tint: 'bg-[#d4f1e7]' },
  { key: 'link', label: 'Copy link', icon: 'link', tint: 'bg-[#d9eafd]' },
  { key: 'pdf', label: 'PDF', icon: 'download', tint: 'bg-[#fde8c9]' },
]
