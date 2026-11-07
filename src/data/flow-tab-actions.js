// Mock data for policy-holder tab actions (PE/PF/PD/PV/PP/PA), transcribed from Figma.

export const overviewStats = [
  ['Policies', '1'],
  ['Open quotes', '1'],
  ['Renewal in', '38 days'],
]

export const overviewCounts = { quotations: 2, policies: 1 }

export const details = [
  ['Date of birth', '14 Mar 1992 (34)'],
  ['Primary mobile', '98861 23456'],
  ['Email', 'kavya.hegde@example.in'],
  ['Preferred contact', 'WhatsApp'],
  ['Wedding anniversary', '25 Nov 2018'],
  ['Occupation', 'Software engineer'],
]
export const address = '42, 3rd Cross, HSR Layout, Sector 2, Bengaluru, Karnataka 560102'

export const household = [
  { initials: 'AH', name: 'Arjun Hegde', sub: 'Spouse · 37', av: '#d9eafd' },
  { initials: 'AH', name: 'Anya Hegde', sub: 'Daughter · 5', av: '#d4f1e7' },
  { initials: 'SH', name: 'Shanta Hegde', sub: 'Mother · add DOB', av: '#fde8c9', warn: true },
]

export const openItems = [
  { icon: 'quote', bg: '#e9e3fc', title: 'QT-202610-00012 R2', sub: 'CareFirst Family · valid till 08 Nov', chip: 'Shared', chipCls: 'bg-[#e8f0fd] text-blue' },
  { icon: 'refresh', bg: '#fde8c9', title: 'Renewal · FamilySure', sub: 'Ends 03 Dec 2026', chip: 'Due', chipCls: 'bg-[#fbf1e1] text-[#8a5a12]' },
  { icon: 'calendar', bg: '#d9eafd', title: 'Collect Aadhaar for Shanta', sub: 'Today, 12:00', chip: 'Task', chipCls: 'bg-[#eef1f5] text-ink-2' },
]

export const familyMembers = [
  { key: 'kavya', initials: 'KH', name: 'Kavya Hegde', sub: 'Self · 34', av: '#fbd5dd', dob: '14 Mar 1992', mobile: '98861 23456', docs: [['check', 'Aadhaar'], ['check', 'PAN']] },
  { key: 'arjun', initials: 'AH', name: 'Arjun Hegde', sub: 'Spouse · 37', av: '#d9eafd', dob: '02 Jul 1989', mobile: '98861 23499', docs: [['folder', 'Medical report']], to: '/x/fd6-arjun-hegde-documents', addTo: '/x/fd4-add-document-which-document' },
  { key: 'anya', initials: 'AH', name: 'Anya Hegde', sub: 'Daughter · 5', av: '#d4f1e7', dob: '19 Jan 2021', mobile: 'No mobile', docs: [] },
  { key: 'shanta', initials: 'SH', name: 'Shanta Hegde', sub: 'Mother', av: '#fde8c9', dob: null, mobile: '98450 11223', docs: [['alert', 'Aadhaar missing'], ['alert', 'PAN missing']], edit: '/x/pf3-edit-family-member' },
]

export const documentGroups = [
  {
    owner: 'KAVYA HEGDE',
    docs: [
      { title: 'Aadhaar', sub: 'v2 · 24 Oct · Priya', bg: '#fde8ec', status: 'unconfirmed', check: '/x/pd1-check-document-values', versions: '/x/pd2-document-versions' },
      { title: 'PAN', sub: 'v1 · 04 Sep · You', bg: '#e9e3fc', status: 'confirmed' },
    ],
  },
  {
    owner: 'ARJUN HEGDE',
    docs: [{ title: 'Medical report · thyroid 2025', sub: 'v1 · 06 Sep', bg: '#d4f1e7', status: 'saved' }],
  },
]

export const aadhaarValues = [
  { label: 'Name', value: 'Kavya Hegde', conf: 'High' },
  { label: 'Aadhaar number', value: 'XXXX XXXX 1234', conf: 'High' },
  { label: 'Date of birth', value: '14-03-1992', conf: 'High' },
  { label: 'Address', value: '42, 3rd Cross, HSR Layout…', conf: 'Medium' },
]
