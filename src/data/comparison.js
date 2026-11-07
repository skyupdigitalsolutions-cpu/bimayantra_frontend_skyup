// Mock data for Flow · Comparison (Figma C2 42:5439 / C3 42:5644).

export const COMPARISON_NO = 'CQ-202610-00003'

export const C = {
  shared: '/x/c2-comparison-shared',
  chose: '/x/c3-comparison-customer-chose',
  createQuote: '/x/q6-quotation-details',
}

export const WHY_GOLD = 'No room-rent limit and unlimited restore suit a young family; premium is within budget.'

export const sharedOptions = [
  {
    key: 'gold', name: 'CareFirst Family · Gold', insurer: 'Niva Bupa', premium: '₹17,582', recommended: true, tint: 'bg-[#fde8ec]',
    rows: [['Room rent', 'No limit'], ['Co-pay', '0%'], ['PED wait', '3 years'], ['Claims settled', '91.2%']],
  },
  {
    key: 'platinum', name: 'CareFirst Family · Platinum', insurer: 'Niva Bupa', premium: '₹24,960', tint: 'bg-[#fde8c9]',
    rows: [['Room rent', 'No limit'], ['Co-pay', '0%'], ['PED wait', '2 years'], ['Claims settled', '91.2%']],
  },
  {
    key: 'secure', name: 'SecurePlus · Secure', insurer: 'HDFC ERGO', premium: '₹19,978', tint: 'bg-[#e9e3fc]',
    rows: [['Room rent', 'No limit'], ['Co-pay', '0%'], ['PED wait', '3 years'], ['Claims settled', '98.6%']],
  },
]

export const activity = [
  { icon: 'eye', title: 'Viewed by customer', time: '24 Oct, 20:05' },
  { icon: 'mail', title: 'Emailed to Kavya', time: '20 Oct, 15:00' },
]
