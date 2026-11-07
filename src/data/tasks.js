// Mock data for the dashboard, tasks, leads list and responsive frames (Figma 5:27, TK*, 02b/02c, F1b, LE1, R1–R5).

/* ───────── Dashboard ───────── */

export const greeting = {
  title: 'Good morning, Suresh',
  sub: 'Monday, 26 Oct 2026 · 4 tasks today · 1 overdue follow-up',
  subTablet: 'Monday, 26 Oct 2026',
  subMobile: 'Mon, 26 Oct · 1 overdue follow-up',
}

// Desktop quick actions (10 tiles)
export const quickActions = [
  { label: 'New lead', icon: 'user-plus', to: '/leads/new', active: true },
  { label: 'New policy holder', icon: 'users', to: '/customers/new' },
  { label: 'Best fit', icon: 'target', to: '/best-fit' },
  { label: 'New quotation', icon: 'quote', to: '/quotations/new' },
  { label: 'Comparison', icon: 'compare', to: '/comparisons' },
  { label: 'Record payment', icon: 'card', to: '/quotations' },
  { label: 'Proposal', icon: 'send', to: '/proposals' },
  { label: 'Record policy', icon: 'shield', to: '/policies' },
  { label: 'Renewals', icon: 'refresh', to: '/renewals' },
  { label: 'Documents', icon: 'folder', to: '/documents' },
]
// Tablet (R1) shows five tiles, mobile (R2) four
export const quickActionsTablet = [
  { label: 'New lead', icon: 'user-plus', to: '/leads/new', active: true },
  { label: 'New policy holder', icon: 'users', to: '/customers/new' },
  { label: 'New quotation', icon: 'quote', to: '/quotations/new' },
  { label: 'Best fit', icon: 'target', to: '/best-fit' },
  { label: 'Record payment', icon: 'card', to: '/quotations' },
]
export const quickActionsMobile = [
  { label: 'New lead', icon: 'user-plus', to: '/leads/new', active: true },
  { label: 'Quotation', icon: 'quote', to: '/quotations/new' },
  { label: 'Best fit', icon: 'target', to: '/best-fit' },
  { label: 'Payment', icon: 'card', to: '/quotations' },
]

export const leadStatuses = [
  { key: 'total', label: 'Total', value: 16, icon: 'grid', caption: 'All statuses', dark: true },
  { key: 'new', label: 'New', value: 5, icon: 'user-plus', bg: 'bg-[#d9eafd]' },
  { key: 'contacted', label: 'Contacted', value: 3, icon: 'phone', bg: 'bg-[#e9e3fc]' },
  { key: 'qualified', label: 'Qualified', value: 2, icon: 'check', bg: 'bg-[#d4f1e7]' },
  { key: 'followup', label: 'Follow-up', value: 2, icon: 'clock', bg: 'bg-[#fde8c9]' },
  { key: 'converted', label: 'Converted', value: 3, icon: 'users', bg: 'bg-[#e7f4ee]', caption: 'This month' },
  { key: 'lost', label: 'Lost', value: 1, icon: 'x', bg: 'bg-[#eef1f5]', hideMobile: true },
]

export const followAlerts = [
  { key: 'today', title: 'Follow-ups due today', titleTablet: 'Follow-ups due today', titleMobile: 'Follow-ups due today', sub: 'Anand Kulkarni · 11:00 AM', count: 1, icon: 'calendar', fg: 'text-[#8a5a12]', bg: 'bg-[#fff9ef]', border: 'border-[#f1d9a8]' },
  { key: 'overdue', title: 'Overdue follow-ups', titleTablet: 'Follow-ups overdue', titleMobile: 'Overdue follow-ups', sub: 'Ramesh Gowda · 2 days late', count: 1, icon: 'alert', fg: 'text-[#b4323c]', bg: 'bg-[#fff7f7]', border: 'border-[#f2c4c8]' },
]

export const taskTabs = [
  { key: 'today', label: 'Today', short: 'Today', count: 4 },
  { key: 'upcoming', label: 'Upcoming', short: 'Upcoming', count: 4 },
  { key: 'overdue', label: 'Overdue', short: 'Overdue', count: 2, red: true },
  { key: 'completed', label: 'Completed', short: 'Done', count: 6 },
]

export const PRIORITY = {
  High: 'bg-[#fbebec] text-[#b4323c]',
  Medium: 'bg-[#fbf1e1] text-[#8a5a12]',
  Low: 'bg-[#eef1f5] text-[#44526a]',
}

export const tasks = [
  { id: 't1', title: 'Call back about family floater', priority: 'High', icon: 'phone', iconBg: 'bg-[#d9eafd]', who: 'Ramesh Gowda', whoKind: 'Lead', initials: 'RG', avBg: 'bg-[#fde8c9]', to: '/leads/1', when: 'Today, 11:00 AM', time: '11:00 AM' },
  { id: 't2', title: 'Collect Aadhaar for Shanta', priority: 'Medium', icon: 'folder', iconBg: 'bg-[#fde8c9]', who: 'Kavya Hegde', whoKind: 'Policy holder', initials: 'KH', avBg: 'bg-[#fbd5dd]', to: '/customers/1', when: 'Today, 12:00 PM', time: '12:00 PM' },
  { id: 't3', title: 'Share renewal quotation', priority: 'High', icon: 'quote', iconBg: 'bg-[#e9e3fc]', who: 'Kavya Hegde', whoKind: 'Policy holder', initials: 'KH', avBg: 'bg-[#fbd5dd]', to: '/customers/1', when: 'Today, 4:00 PM', time: '4:00 PM' },
  { id: 't4', title: 'Send brochure for parents’ cover', priority: 'Low', icon: 'send', iconBg: 'bg-[#eef1f5]', who: 'Deepa Shetty', whoKind: 'Lead', initials: 'DS', avBg: 'bg-[#d9eafd]', to: '/leads/1', when: 'Today, 6:00 PM', time: '6:00 PM', hideMobile: true },
]

// Other "My Tasks" tabs (counts in taskTabs: Upcoming 4 · Overdue 2 · Completed 6)
export const upcomingTasks = [
  { id: 'u1', title: 'Meet to compare plans', priority: 'Medium', icon: 'users', iconBg: 'bg-[#d4f1e7]', who: 'Anand Kulkarni', whoKind: 'Lead', initials: 'AK', avBg: 'bg-[#d4f1e7]', to: '/leads/1', when: 'Tomorrow, 10:30 AM', time: 'Tomorrow' },
  { id: 'u2', title: 'Share CareFirst quotation', priority: 'High', icon: 'quote', iconBg: 'bg-[#e9e3fc]', who: 'Srinivas Naik', whoKind: 'Lead', initials: 'SN', avBg: 'bg-[#e9e3fc]', to: '/leads/1', when: '29 Oct, 10:00 AM', time: '29 Oct' },
  { id: 'u3', title: 'Collect RC copy for renewal', priority: 'Medium', icon: 'folder', iconBg: 'bg-[#fde8c9]', who: 'Faizal Khan Sr', whoKind: 'Policy holder', initials: 'FK', avBg: 'bg-[#d9eafd]', to: '/customers/1', when: '30 Oct, 11:00 AM', time: '30 Oct' },
  { id: 'u4', title: 'Renewal call · FamilySure', priority: 'Low', icon: 'phone', iconBg: 'bg-[#d9eafd]', who: 'Kavya Hegde', whoKind: 'Policy holder', initials: 'KH', avBg: 'bg-[#fbd5dd]', to: '/customers/1', when: '03 Nov, 10:00 AM', time: '03 Nov' },
]
export const overdueTasks = [
  { id: 'o1', title: 'Follow-up call', priority: 'High', icon: 'phone', iconBg: 'bg-[#fbebec]', who: 'Ramesh Gowda', whoKind: 'Lead', initials: 'RG', avBg: 'bg-[#fde8c9]', to: '/leads/1', when: '24 Oct, 11:00 AM', time: '24 Oct' },
  { id: 'o2', title: 'Send PAN upload link', priority: 'Medium', icon: 'send', iconBg: 'bg-[#fbebec]', who: 'Anitha Kulkarni', whoKind: 'Policy holder', initials: 'AK', avBg: 'bg-[#e9e3fc]', to: '/customers/1', when: '25 Oct, 4:00 PM', time: '25 Oct' },
]
export const completedTasks = [
  { id: 'c1', title: 'Log first contact', priority: 'Medium', icon: 'check', iconBg: 'bg-[#e7f4ee]', who: 'Sunita Reddy', whoKind: 'Lead', initials: 'SR', avBg: 'bg-[#fde8c9]', to: '/leads/1', when: 'Done 26 Oct, 10:05 AM', time: '26 Oct', done: true },
  { id: 'c2', title: 'Send WhatsApp brochure', priority: 'Low', icon: 'chat', iconBg: 'bg-[#e7f4ee]', who: 'Kavya Hegde', whoKind: 'Policy holder', initials: 'KH', avBg: 'bg-[#fbd5dd]', to: '/customers/1', when: 'Done 26 Oct, 9:30 AM', time: '26 Oct', done: true },
  { id: 'c3', title: 'Share quotation R2', priority: 'High', icon: 'quote', iconBg: 'bg-[#e7f4ee]', who: 'Kavya Hegde', whoKind: 'Policy holder', initials: 'KH', avBg: 'bg-[#fbd5dd]', to: '/customers/1', when: 'Done 25 Oct, 7:40 PM', time: '25 Oct', done: true },
  { id: 'c4', title: 'Submit proposal PR-202610-00005', priority: 'High', icon: 'send', iconBg: 'bg-[#e7f4ee]', who: 'Kavya Hegde', whoKind: 'Policy holder', initials: 'KH', avBg: 'bg-[#fbd5dd]', to: '/customers/1', when: 'Done 25 Oct, 11:30 AM', time: '25 Oct', done: true },
  { id: 'c5', title: 'Record issued policy', priority: 'Medium', icon: 'shield', iconBg: 'bg-[#e7f4ee]', who: 'Faizal Khan Sr', whoKind: 'Policy holder', initials: 'FK', avBg: 'bg-[#d9eafd]', to: '/customers/1', when: 'Done 24 Oct, 5:15 PM', time: '24 Oct', done: true },
  { id: 'c6', title: 'Verify Aadhaar copy', priority: 'Low', icon: 'folder', iconBg: 'bg-[#e7f4ee]', who: 'Anitha Kulkarni', whoKind: 'Policy holder', initials: 'AK', avBg: 'bg-[#e9e3fc]', to: '/customers/1', when: 'Done 23 Oct, 3:00 PM', time: '23 Oct', done: true },
]

// TK3 · the task that was just created
export const createdTask = { id: 't0', title: 'Call Rohan’s parents about cover', priority: 'High', icon: 'phone', iconBg: 'bg-[#d9eafd]', who: 'Kavya Hegde', whoKind: 'Policy holder', initials: 'KH', avBg: 'bg-[#fde8c9]', to: '/leads/1', when: 'Today, 5:30 PM', time: '5:30 PM', fresh: true }

export const rescheduleOptions = [
  { label: 'Later today', when: '6:00 PM' },
  { label: 'Tomorrow', when: '10:00 AM', on: true },
  { label: 'This Friday', when: '30 Oct, 10:00 AM' },
  { label: 'Next Monday', when: '02 Nov, 10:00 AM' },
]

const CHIP = {
  blue: 'bg-[#e8f0fd] text-[#1f5fd6]',
  green: 'bg-[#e7f4ee] text-[#127650]',
  violet: 'bg-[#f0ecfb] text-[#5b3fb8]',
}
export const activities = [
  { group: 'TODAY' },
  { title: 'New lead created', who: 'Prakash Hegde · Meta Ads', at: '· 10:12 AM', icon: 'user-plus', bg: 'bg-[#d9eafd]', chip: ['New', CHIP.blue] },
  { title: 'Lead status changed: New → Contacted', who: 'Sunita Reddy', at: '· 10:05 AM', icon: 'refresh', bg: 'bg-[#e9e3fc]' },
  { title: 'Follow-up scheduled for tomorrow, 11:00 AM', who: 'Anand Kulkarni', at: '· 9:40 AM', icon: 'calendar', bg: 'bg-[#fde8c9]' },
  { title: 'WhatsApp message sent', who: 'Kavya Hegde', at: '· 9:30 AM', icon: 'chat', bg: 'bg-[#d4f1e7]', chip: ['Sent', CHIP.green] },
  { group: 'YESTERDAY' },
  { title: 'Quotation shared · QT-202610-00012 R2', who: 'Kavya Hegde', at: '· 7:40 PM', icon: 'quote', bg: 'bg-[#fde8c9]', chip: ['Shared', CHIP.blue] },
  { title: 'Proposal submitted · PR-202610-00005', who: 'Kavya Hegde', at: '· 11:30 AM', icon: 'send', bg: 'bg-[#e9e3fc]', chip: ['Submitted', CHIP.violet] },
  { group: 'EARLIER' },
  { title: 'Policy issued · 3001/2026/88812', who: 'Faizal Khan Sr', at: '· 24 Oct', icon: 'shield', bg: 'bg-[#d4f1e7]', chip: ['Issued', CHIP.green] },
  { title: 'Task completed: Log first contact', who: 'Sunita Reddy', at: '· 24 Oct', icon: 'check', bg: 'bg-[#e7f4ee]' },
]
// Compact activity list (tablet R1 / mobile R2)
export const activitiesCompact = [
  { icon: 'user-plus', bg: 'bg-[#d9eafd]', t: 'New lead · Prakash Hegde', ts: '10:12 AM', m: 'New lead · Prakash Hegde', ms: 'Meta Ads · 10:12 AM' },
  { icon: 'refresh', bg: 'bg-[#e9e3fc]', t: 'New → Contacted · Sunita Reddy', ts: '10:05 AM', m: 'New → Contacted', ms: 'Sunita Reddy · 10:05 AM' },
  { icon: 'chat', bg: 'bg-[#d4f1e7]', t: 'WhatsApp sent · Kavya Hegde', ts: '9:30 AM', m: 'WhatsApp sent', ms: 'Kavya Hegde · 9:30 AM' },
  { icon: 'quote', bg: 'bg-[#fde8c9]', t: 'Quotation shared · Kavya Hegde', ts: 'Yesterday', hideMobile: true },
]

// keys = lead-source filter keys the bar opens in the Leads list
export const leadSources = [
  { name: 'Meta Ads', sub: 'Facebook and Instagram', value: '5 · 31%', width: 380, color: 'bg-[#1f5fd6]', keys: 'meta' },
  { name: 'Referral', sub: 'Client 2 · Referrer 2', value: '4 · 25%', width: 304, color: 'bg-[#127650]', keys: 'ref-client,ref-referrer' },
  { name: 'Google Ads', value: '2 · 13%', width: 152, color: 'bg-[#e8899c]', keys: 'google' },
  { name: 'Website', value: '2 · 13%', width: 152, color: 'bg-[#5b3fb8]', keys: 'website' },
  { name: 'Walk-in or personal contact', value: '1 · 6%', width: 76, color: 'bg-[#8a5a12]', keys: 'walkin' },
  { name: 'Campaign · Other', value: '2 · 13%', width: 152, color: 'bg-[#9aa4b5]', keys: 'campaign,social,manual,other' },
]
// width = fraction of the track (tablet 278px track / mobile 180px track)
export const leadSourcesTablet = [
  { name: 'Meta Ads', n: 5, w: 260 / 278, color: 'bg-[#1f5fd6]', keys: 'meta' },
  { name: 'Referral', n: 4, w: 208 / 278, color: 'bg-[#127650]', keys: 'ref-client,ref-referrer' },
  { name: 'Google Ads', n: 2, w: 104 / 278, color: 'bg-[#e8899c]', keys: 'google' },
  { name: 'Website', n: 2, w: 104 / 278, color: 'bg-[#5b3fb8]', keys: 'website' },
  { name: 'Others', n: 3, w: 156 / 278, color: 'bg-[#9aa4b5]', keys: 'walkin,campaign,social,manual,other' },
]
export const leadSourcesMobile = [
  { name: 'Meta Ads', n: 5, w: 1, color: 'bg-[#1f5fd6]', keys: 'meta' },
  { name: 'Referral', n: 4, w: 0.8, color: 'bg-[#127650]', keys: 'ref-client,ref-referrer' },
  { name: 'Google Ads', n: 2, w: 0.4, color: 'bg-[#e8899c]', keys: 'google' },
  { name: 'Others', n: 5, w: 1, color: 'bg-[#9aa4b5]', keys: 'website,walkin,campaign,social,manual,other' },
]

export const renewals = [
  { initials: 'KH', avBg: 'bg-[#fbd5dd]', name: 'Kavya Hegde', insurer: 'Star Health', plan: 'FamilySure · Health', due: 'Due in 38 days', urgent: true, renews: '03 Dec 2026', premium: '₹21,340', days: '38 days' },
  { initials: 'FK', avBg: 'bg-[#d9eafd]', name: 'Faizal Khan Sr', insurer: 'ICICI Lombard', plan: 'Car Package · Motor', due: 'Due in 111 days', renews: '14 Feb 2027', premium: '₹12,880', days: '111 days' },
  { initials: 'AK', avBg: 'bg-[#e9e3fc]', name: 'Anitha Kulkarni', insurer: 'HDFC ERGO', plan: 'SecurePlus · Health', due: 'Due in 216 days', renews: '30 May 2027', premium: '₹16,240', days: '216 days' },
]

export const catalogueTypes = [
  { label: 'Health', sub: '5 products', icon: 'heart', bg: 'bg-[#fde8c9]' },
  { label: 'Motor', sub: '1 product', icon: 'car', bg: 'bg-[#d9eafd]' },
  { label: 'Life', sub: '2 products', icon: 'users', bg: 'bg-[#e9e3fc]' },
  { label: 'Term', sub: '2 products', icon: 'umbrella', bg: 'bg-[#fde8ec]' },
  { label: 'Travel', sub: 'Coming soon', icon: 'plane', bg: 'bg-[#d4f1e7]' },
]

/* ───────── Task form ───────── */

export const taskTypes = ['Call', 'Meeting', 'Follow-up', 'Collect documents', 'Renewal', 'Other']

/* ───────── Leads list ───────── */

export const SOURCE_STYLE = {
  meta: { icon: 'chart', cls: 'bg-[#e8f0fd] text-[#1f5fd6]' },
  google: { icon: 'search', cls: 'bg-[#fde8ec] text-[#b4325a]' },
  website: { icon: 'grid', cls: 'bg-[#f0ecfb] text-[#5b3fb8]' },
  social: { icon: 'chat', cls: 'bg-[#eef1f5] text-[#44526a]' },
  referral: { icon: 'link', cls: 'bg-[#e7f4ee] text-[#127650]' },
  walkin: { icon: 'user-plus', cls: 'bg-[#fbf1e1] text-[#8a5a12]' },
  campaign: { icon: 'send', cls: 'bg-[#eef1f5] text-[#44526a]' },
}

export const STATUS_CHIP = {
  New: 'bg-[#e8f0fd] text-[#1f5fd6]',
  Contacted: 'bg-[#f0ecfb] text-[#5b3fb8]',
  Qualified: 'bg-[#e7f4ee] text-[#127650]',
  'Follow-up': 'bg-[#fbf1e1] text-[#8a5a12]',
  Converted: 'bg-[#d4f1e7] text-[#0f5f41]',
  Lost: 'bg-[#eef1f5] text-[#44526a]',
}

// status tab key → lead status label
export const LEAD_STATUS = { new: 'New', contacted: 'Contacted', qualified: 'Qualified', followup: 'Follow-up', converted: 'Converted', lost: 'Lost' }
export const leadPipelines = ['Health', 'Motor', 'Life', 'Term']

export const leadTabs = [
  { key: 'all', label: 'All', count: 16 },
  { key: 'new', label: 'New', count: 5 },
  { key: 'contacted', label: 'Contacted', count: 3 },
  { key: 'qualified', label: 'Qualified', count: 2 },
  { key: 'followup', label: 'Follow-up', count: 2 },
  { key: 'converted', label: 'Converted', count: 3 },
  { key: 'lost', label: 'Lost', count: 1 },
]

export const leadRows = [
  { id: 'ph', initials: 'PH', avBg: 'bg-[#e9e3fc]', name: 'Prakash Hegde', mobile: '94800 12777', pipeline: 'Health', status: 'New', source: 'meta', srcKey: 'meta', sourceLabel: 'Meta Ads', campaign: 'Diwali family floater', next: '—', priority: 'Medium', meta: true, mobileOrder: 1 },
  { id: 'ds', initials: 'DS', avBg: 'bg-[#d9eafd]', name: 'Deepa Shetty', mobile: '90080 33441', pipeline: 'Health', status: 'New', source: 'referral', srcKey: 'ref-client', sourceLabel: 'Referral · client', next: '—', priority: 'Medium' },
  { id: 'vr', initials: 'VR', avBg: 'bg-[#d9eafd]', name: 'Vikram Rao', mobile: '99000 45121', pipeline: 'Motor', status: 'New', source: 'google', srcKey: 'google', sourceLabel: 'Google Ads', next: '—', priority: 'Low', mobileOrder: 3 },
  { id: 'sr', initials: 'SR', avBg: 'bg-[#fde8c9]', name: 'Sunita Reddy', mobile: '96200 44512', pipeline: 'Health', status: 'Contacted', source: 'social', srcKey: 'social', sourceLabel: 'Social media', next: '—', priority: 'High', mobileOrder: 4 },
  { id: 'rs', initials: 'RS', avBg: 'bg-[#fbd5dd]', name: 'Rahul Sharma', mobile: '98450 66120', pipeline: 'Term', status: 'Contacted', source: 'meta', srcKey: 'meta', sourceLabel: 'Meta Ads', campaign: 'Diwali family floater', next: '—', priority: 'Medium', meta: true },
  { id: 'ak', initials: 'AK', avBg: 'bg-[#d4f1e7]', name: 'Anand Kulkarni', mobile: '98450 77120', pipeline: 'Health', status: 'Qualified', source: 'referral', srcKey: 'ref-client', sourceLabel: 'Referral · client', next: 'Tomorrow, 11:00 AM', priority: 'Low' },
  { id: 'rg', initials: 'RG', avBg: 'bg-[#fde8c9]', name: 'Ramesh Gowda', mobile: '98860 12345', pipeline: 'Health', status: 'Follow-up', source: 'referral', srcKey: 'ref-referrer', sourceLabel: 'Referral · Manjunath K', next: '24 Oct · overdue', overdue: true, priority: 'High', mobileOrder: 2 },
  { id: 'mi', initials: 'MI', avBg: 'bg-[#e9e3fc]', name: 'Meera Iyer', mobile: '97400 88213', pipeline: 'Life', status: 'Contacted', source: 'website', srcKey: 'website', sourceLabel: 'Website', next: '—', priority: 'Medium', mobileOrder: 5 },
  // rows 9–16 (below the fold in 02b: "8 of 16 leads · scroll for more")
  { id: 'pb', initials: 'PB', avBg: 'bg-[#fbd5dd]', name: 'Pooja Bhat', mobile: '97311 40872', pipeline: 'Health', status: 'New', source: 'campaign', srcKey: 'campaign', sourceLabel: 'Campaign · Diwali camp', next: 'Tomorrow, 4:00 PM', priority: 'Medium' },
  { id: 'nk', initials: 'NK', avBg: 'bg-[#d4f1e7]', name: 'Naveen Kumar', mobile: '99860 21455', pipeline: 'Motor', status: 'New', source: 'walkin', srcKey: 'walkin', sourceLabel: 'Walk-in', next: '—', priority: 'Low' },
  { id: 'sn', initials: 'SN', avBg: 'bg-[#e9e3fc]', name: 'Srinivas Naik', mobile: '98455 63021', pipeline: 'Term', status: 'Qualified', source: 'google', srcKey: 'google', sourceLabel: 'Google Ads', next: '29 Oct, 10:00 AM', priority: 'High' },
  { id: 'lm', initials: 'LM', avBg: 'bg-[#fde8c9]', name: 'Lakshmi Menon', mobile: '94482 17390', pipeline: 'Health', status: 'Follow-up', source: 'website', srcKey: 'website', sourceLabel: 'Website', next: 'Today, 5:00 PM', priority: 'Medium' },
  { id: 'hs', initials: 'HS', avBg: 'bg-[#d9eafd]', name: 'Harish Shenoy', mobile: '98440 55218', pipeline: 'Motor', status: 'Converted', source: 'referral', srcKey: 'ref-client', sourceLabel: 'Referral · client', next: '—', priority: 'Medium' },
  { id: 'dr', initials: 'DR', avBg: 'bg-[#fbd5dd]', name: 'Divya Rao', mobile: '96325 80114', pipeline: 'Health', status: 'Converted', source: 'social', srcKey: 'social', sourceLabel: 'Social media', next: '—', priority: 'High' },
  { id: 'is', initials: 'IS', avBg: 'bg-[#e9e3fc]', name: 'Imran Sheikh', mobile: '90084 66713', pipeline: 'Life', status: 'Converted', source: 'campaign', srcKey: 'campaign', sourceLabel: 'Campaign · Office camp', next: '—', priority: 'Medium' },
  { id: 'gp', initials: 'GP', avBg: 'bg-[#eef1f5]', name: 'Ganesh Pai', mobile: '98861 30927', pipeline: 'Health', status: 'Lost', source: 'referral', srcKey: 'ref-referrer', sourceLabel: 'Referral · Manjunath K', next: '—', priority: 'Low' },
]

export const sourceGroups = [
  { group: 'ADS', options: [
    { key: 'meta', label: 'Meta Ads', sub: 'Facebook and Instagram ads', icon: 'chart', cls: 'bg-[#e8f0fd] text-[#1f5fd6]' },
    { key: 'google', label: 'Google Ads', sub: 'Search and display ads', icon: 'search', cls: 'bg-[#fde8ec] text-[#b4325a]' },
  ] },
  { group: 'ONLINE', options: [
    { key: 'website', label: 'Website', sub: 'Your website or landing page', icon: 'grid', cls: 'bg-[#f0ecfb] text-[#5b3fb8]' },
    { key: 'social', label: 'Social media', sub: 'Organic posts, not ads', icon: 'chat', cls: 'bg-[#eef1f5] text-[#44526a]' },
  ] },
  { group: 'REFERRAL', options: [
    { key: 'ref-client', label: 'Referred by a client', sub: 'Pick the client', icon: 'link', cls: 'bg-[#e7f4ee] text-[#127650]' },
    { key: 'ref-referrer', label: 'Referred by a referrer', sub: 'Pick the referrer', icon: 'link', cls: 'bg-[#e7f4ee] text-[#127650]' },
  ] },
  { group: 'OFFLINE AND OTHER', options: [
    { key: 'walkin', label: 'Walk-in or personal contact', icon: 'user-plus', cls: 'bg-[#fbf1e1] text-[#8a5a12]' },
    { key: 'campaign', label: 'Campaign', sub: 'Campaign name required', icon: 'send', cls: 'bg-[#eef1f5] text-[#44526a]' },
    { key: 'manual', label: 'Manual entry', sub: 'Added by you, no source', icon: 'edit', cls: 'bg-[#eef1f5] text-[#44526a]' },
    { key: 'other', label: 'Other', icon: 'more', cls: 'bg-[#eef1f5] text-[#44526a]' },
  ] },
]

/* ───────── New lead ───────── */

export const afterSave = [
  { n: 1, t: 'Lead is created as New', s: 'LD-2610-00053', on: true },
  { n: 2, t: 'Work it: contact, qualify', s: 'Follow-ups create tasks' },
  { n: 3, t: 'Convert to customer', s: 'Or mark lost with a reason' },
  { n: 4, t: 'Quote, sell and renew', s: 'Best fit → quotation → policy' },
]

/* ───────── Lead detail (LE1 background) ───────── */

export const leadDetail = {
  kv: [
    ['Primary mobile', '98860 12345'], ['Alternate mobile', '—'], ['Email', 'ramesh.g@example.in'],
    ['Source', 'Referred by a referrer'], ['Referrer', 'Manjunath K'], ['Insurance interest', 'Health'],
  ],
  events: [
    { icon: 'chat', bg: 'bg-[#fde8c9]', t: 'Contact logged: Asked to call back', s: '20 Oct 2026, 12:05 · You', note: 'Call after Diwali.' },
    { icon: 'refresh', bg: 'bg-[#e9e3fc]', t: 'Moved to Follow-up', s: '20 Oct 2026, 12:05 · You' },
    { icon: 'phone', bg: 'bg-[#d9eafd]', t: 'Contact logged: Spoke to customer', s: '13 Oct 2026, 17:40 · You' },
    { icon: 'user-plus', bg: 'bg-[#d4f1e7]', t: 'Lead created', s: '12 Oct 2026, 09:10 · You' },
  ],
  stages: [
    { chip: 'Follow-up', cls: 'bg-[#fbf1e1] text-[#8a5a12]', dot: 'bg-[#b7791f]', s: '20 Oct, 12:05 · You' },
    { chip: 'Contacted', cls: 'bg-[#e8f0fd] text-[#1f5fd6]', dot: 'bg-[#c3ccd8]', s: '13 Oct, 17:40 · You' },
    { chip: 'New', cls: 'bg-[#e8f0fd] text-[#1f5fd6]', dot: 'bg-[#c3ccd8]', s: '12 Oct, 09:10 · You' },
  ],
}