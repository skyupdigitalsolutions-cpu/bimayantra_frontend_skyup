// Mock data for Settings state frames (Figma KY/IN/PV/SA/EX/WL/RF/AS families).

export const settingsNav = [
  { key: 'profile', label: 'My profile', icon: 'user-plus', to: '/settings' },
  { key: 'kyc', label: 'KYC', icon: 'shield', to: '/x/s03-settings-kyc' },
  { key: 'insurers', label: 'My insurers', icon: 'box', to: '/x/s04-settings-my-insurers' },
  { key: 'plan', label: 'My plan and billing', icon: 'card', to: '/x/17-settings-plan-and-billing' },
  { key: 'wallet', label: 'WhatsApp wallet', icon: 'wallet', to: '/x/s05-settings-whatsapp-wallet' },
  { key: 'assistants', label: 'Assistants', icon: 'users', to: '/x/s06-settings-assistants' },
  { key: 'referrers', label: 'Referrers', icon: 'link', to: '/x/s07-settings-referrers' },
  { key: 'support', label: 'Support access', icon: 'eye', to: '/x/s08-settings-support-access' },
  { key: 'export', label: 'Export my data', icon: 'download', to: '/x/s09-settings-export-my-data' },
  { key: 'activity', label: 'Activity log', icon: 'list', to: '/x/s10-settings-activity-log' },
  { key: 'security', label: 'Security', icon: 'lock', to: '/x/s11-settings-security' },
]

export const insurers = [
  { initials: 'NB', name: 'Niva Bupa', meta: 'Agent code NB-77421 · valid until 31 Mar 2027', status: 'active' },
  { initials: 'SH', name: 'Star Health', meta: 'Agent code SH-30981 · valid until 30 Jun 2027', status: 'active' },
  { initials: 'HE', name: 'HDFC ERGO', meta: 'Agent code HE-55102 · valid until 31 Jan 2027', status: 'active' },
  { initials: 'IL', name: 'ICICI Lombard', meta: 'Agent code IL-88213 · valid until 31 Dec 2026', status: 'expiring', chip: 'Expires in 66 days' },
  { initials: 'CH', name: 'Care Health', meta: 'Agent code CH-11027 · valid until 30 Sep 2026', status: 'expired' },
]

export const priceVersions = [
  { code: 'PV-4', title: 'From 01 Dec 2026', sub: 'Starts automatically at 00:00 IST', status: 'scheduled' },
  { code: 'PV-3', title: '01 Jul 2026 to 30 Nov 2026', sub: 'Used for new quotations today', status: 'current' },
  { code: 'PV-2', title: '01 Jan to 30 Jun 2026', sub: 'Kept on quotations that used it', status: 'closed' },
  { code: 'PV-1', title: 'Created 10 Dec 2025', sub: 'Cancelled before it started', status: 'cancelled' },
]

export const supportRecords = [
  { label: 'Customer CU-000318 · Kavya Hegde', at: '26 Oct, 09:41' },
  { label: 'Quotation QT-202610-00012 R2', at: '26 Oct, 09:44' },
]

export const exportOptions = [
  { label: 'Customers and family', on: true },
  { label: 'Leads', on: true },
  { label: 'Quotations and comparisons', on: true },
  { label: 'Payments', on: true },
  { label: 'Policies and nominees', on: true },
  { label: 'Renewals', on: true },
  { label: 'Communications log', on: false },
  { label: 'Documents list', on: true },
]

export const rechargeAmounts = ['₹500', '₹1,000', '₹2,000', 'Custom']

export const walletTxns = [
  { icon: 'chat', title: 'Debit · Renewal reminder to Kavya Hegde', sub: '03 Oct, 09:00', amount: '− ₹1.00' },
  { icon: 'download', credit: true, title: 'Recharge · Payment gateway · pay_Q8x2', sub: '01 Oct, 18:22', amount: '+ ₹500.00' },
  { icon: 'download', credit: true, title: 'Credit · Manual credit by SkyUp · goodwill', sub: '28 Sep, 11:00', amount: '+ ₹20.00' },
]

export const referrerStats = [
  { value: '4', label: 'Referrals' },
  { value: '3', label: 'Became leads' },
  { value: '1', label: 'Became customers' },
  { value: '1', label: 'Policies taken' },
]

export const referrers = [
  { initials: 'MK', bg: '#fde8c9', name: 'Manjunath K', meta: '3 sent · 1 converted · link K7MX4QPA', status: 'active' },
  { initials: 'KA', bg: '#d9eafd', name: 'Kiran Auto Works', meta: '1 sent · link Q9TR2WZC', status: 'active' },
  { initials: 'SR', bg: '#fbd5dd', name: 'Shobha Rao', meta: 'Invite valid 7 days', status: 'invited' },
]

export const assistant = {
  initials: 'PK',
  name: 'Priya K',
  meta: '98765 00011 · last login today, 09:12',
  recent: 'Recent: uploaded Aadhaar v2 for Kavya · shared QT-202610-00012 R2',
}

export const assistantCan = ['Add and work leads', 'Add customers and documents', 'Prepare quotations and proposals', 'Log renewal contacts']
export const assistantCannot = ['Record payments or submit proposals', 'Mark leads lost or reopen them', 'See commission or full PAN and Aadhaar', 'Change plan, wallet or team']
