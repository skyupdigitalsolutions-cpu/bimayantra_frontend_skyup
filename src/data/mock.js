// Shared mock data. Section-specific data lives in src/data/<section>.js.
// Swap these for API calls (bimayantra-api) later — screens only read from here.

export const advisor = {
  name: 'Suresh Rao',
  initials: 'SR',
  email: 'suresh.rao@example.in',
  mobile: '98450 12345',
  business: 'Rao Insurance Services',
}

export const renewalsDue = [
  { id: 'kh', initials: 'KH', tone: 'pink', name: 'Kavya Hegde', insurer: 'Star Health', plan: 'FamilySure · Health', due: 'Due in 38 days', urgent: true, renews: '03 Dec 2026', premium: '₹21,340' },
  { id: 'fk', initials: 'FK', tone: 'blue', name: 'Faizal Khan Sr', insurer: 'ICICI Lombard', plan: 'Car Package · Motor', due: 'Due in 111 days', renews: '14 Feb 2027', premium: '₹12,880' },
  { id: 'ak', initials: 'AK', tone: 'violet', name: 'Anitha Kulkarni', insurer: 'HDFC ERGO', plan: 'SecurePlus · Health', due: 'Due in 216 days', renews: '30 May 2027', premium: '₹16,240' },
]

export const quickActions = [
  { label: 'New lead', icon: 'user-plus', to: '/x/f1-new-lead' },
  { label: 'New customer', icon: 'users', to: '/x/f3-new-customer' },
  { label: 'Best fit', icon: 'target', to: '/best-fit' },
  { label: 'New quotation', icon: 'quote', to: '/x/q1-quotation-customer' },
  { label: 'Comparison', icon: 'compare', to: '/x/cq2-comparison-type' },
  { label: 'Record payment', icon: 'card', to: '/x/p1-payment-add-payment-link' },
  { label: 'Proposal', icon: 'send', to: '/proposals' },
  { label: 'Record policy', icon: 'shield', to: '/x/l1-record-issued-policy' },
  { label: 'Renewals', icon: 'refresh', to: '/renewals' },
  { label: 'Documents', icon: 'folder', to: '/documents' },
]
