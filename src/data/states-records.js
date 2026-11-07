// Mock data for the records / tasks / messages state frames (policy holder, comms, tasks, notifications).

/* ───────── Communications ───────── */
export const commsStatusTabs = [
  { key: 'scheduled', label: 'Scheduled', count: 1, to: '/x/cm1-communications-scheduled' },
  { key: 'sent', label: 'Sent', count: 3, to: '/x/cm2-communications-sent' },
  { key: 'notsent', label: 'Not sent', count: 3, to: '/communications' },
  { key: 'greetings', label: 'Occasion greetings' },
]
export const commsChannelTabs = [
  { key: 'all', label: 'All' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'email', label: 'Email' },
  { key: 'sms', label: 'SMS' },
]

// kind: chat (WhatsApp, mint) | mail (email, violet)
export const notSentMessages = [
  { kind: 'mail', title: 'Anitha Kulkarni · Quotation QT-202609-00009', when: '22 Oct 2026, 11:10', note: 'Mailbox full (provider bounce)', noteTone: 'red', chip: 'Failed', chipTone: 'rose', resend: true },
  { kind: 'chat', title: 'Arjun Hegde · Birthday greeting', when: '21 Oct 2026, 09:00', note: 'WhatsApp consent withdrawn', noteTone: 'amber', chip: 'Skipped', chipTone: 'amber' },
  { kind: 'mail', title: 'Faizal Khan Sr · Quotation QT-202610-00010', when: '14 Oct 2026, 16:00', note: 'No delivery update within 48 hours', noteTone: 'amber', chip: 'Status unknown', chipTone: 'amber', resend: true },
]
export const scheduledMessages = [
  { kind: 'chat', title: 'Kavya Hegde · Renewal reminder (30 days)', when: 'Queued for 03 Nov, 10:00 AM', sub: 'Sends only if consent is still given', subClass: 'text-[#5b3fb8]', chip: 'Queued', chipTone: 'purple', cancel: true },
]
export const sentMessages = [
  { kind: 'chat', title: 'Kavya Hegde · Quotation QT-202610-00012 R2', when: '24 Oct, 7:40 PM · shared from your WhatsApp', sub: 'Delivery can’t be tracked for app shares', subClass: 'text-ink-2', chip: 'Shared manually', chipTone: 'neutral' },
  { kind: 'mail', title: 'Kavya Hegde · Quotation QT-202610-00012 R2', when: '24 Oct, 7:31 PM', chip: 'Delivered', chipTone: 'green' },
  { kind: 'chat', title: 'Faizal Khan Sr · Renewal reminder (60 days)', when: '16 Dec, 10:00 AM', chip: 'Read', chipTone: 'green' },
]
export const occasions = [
  { initials: 'AH', bg: 'bg-[#d9eafd]', name: 'Arjun Hegde', sub: 'Birthday · no WhatsApp consent', chip: 'Blocked', tone: 'amber' },
  { initials: 'KH', bg: 'bg-[#fbd5dd]', name: 'Kavya Hegde', sub: 'Anniversary · 25 Nov', chip: 'Eligible', tone: 'green' },
]
export const messageTimeline = [
  { done: true, title: 'Queued', sub: '24 Oct, 7:31:02 PM' },
  { done: true, title: 'Sent', sub: '7:31:05 PM · accepted by provider' },
  { done: true, title: 'Delivered', sub: '7:31:40 PM' },
  { done: false, title: 'Read', sub: 'Not tracked for email' },
]

/* ───────── Policy holder (Kavya Hegde) ───────── */
export const holder = {
  name: 'Kavya Hegde',
  initials: 'KH',
  sub: 'CU-000318 · 34 years · Bengaluru',
  tagline: 'Software engineer · prefers calls after 6 pm',
  details: [
    ['Date of birth', '14 Mar 1992 (34)'],
    ['Primary mobile', '98861 23456'],
    ['Email', 'kavya.hegde@example.in'],
    ['Preferred contact', 'WhatsApp'],
    ['Wedding anniversary', '25 Nov 2018'],
    ['Occupation', 'Software engineer'],
  ],
  address: '42, 3rd Cross, HSR Layout, Sector 2, Bengaluru, Karnataka 560102',
  household: [
    { initials: 'AH', bg: 'bg-[#d9eafd]', name: 'Arjun Hegde', sub: 'Spouse · 37' },
    { initials: 'AH', bg: 'bg-[#d4f1e7]', name: 'Anya Hegde', sub: 'Daughter · 5' },
    { initials: 'SH', bg: 'bg-[#fde8c9]', name: 'Shanta Hegde', sub: 'Mother · add DOB', warn: true },
  ],
  ids: [
    { label: 'PAN', value: 'ABCXX1234X' },
    { label: 'Aadhaar', value: 'XXXX XXXX 1234' },
  ],
  openItems: [
    { icon: 'quote', bg: 'bg-[#e9e3fc]', title: 'QT-202610-00012 R2', sub: 'CareFirst Family · valid till 08 Nov', chip: 'Shared', tone: 'sky', to: '/quotations/1' },
    { icon: 'refresh', bg: 'bg-[#fde8c9]', title: 'Renewal · FamilySure', sub: 'Ends 03 Dec 2026', chip: 'Due', tone: 'amber', to: '/x/n1-renewal-detail' },
    { icon: 'calendar', bg: 'bg-[#d9eafd]', title: 'Collect Aadhaar for Shanta', sub: 'Today, 12:00', chip: 'Task', tone: 'neutral' },
  ],
}

// Customer tabs. counts differ between frames, so they are passed in per screen.
export const customerTabs = [
  { key: 'overview', label: 'Overview', to: '/customers/1' },
  { key: 'family', label: 'Family', to: '/x/05a-customer-family' },
  { key: 'consent', label: 'Consent', to: '/x/05b-customer-consent' },
  { key: 'documents', label: 'Documents', to: '/x/05c-customer-documents' },
  { key: 'vehicles', label: 'Vehicles', to: '/x/05d-customer-vehicles' },
  { key: 'quotations', label: 'Quotations', to: '/x/05e-customer-quotations' },
  { key: 'policies', label: 'Policies', to: '/x/05f-customer-policies' },
  { key: 'payments', label: 'Payments', to: '/x/05g-customer-payments' },
  { key: 'renewals', label: 'Renewals', to: '/x/05h-customer-renewals' },
  { key: 'activities', label: 'Activities', to: '/x/05i-customer-activities' },
]

export const familyMembers = [
  {
    initials: 'KH', bg: 'bg-[#fbd5dd]', name: 'Kavya Hegde', sub: 'Self · 34', dob: '14 Mar 1992', phone: '98861 23456',
    docs: [{ label: 'Aadhaar', tone: 'green', icon: 'check' }, { label: 'PAN', tone: 'green', icon: 'check' }],
  },
  {
    initials: 'AH', bg: 'bg-[#d9eafd]', name: 'Arjun Hegde', sub: 'Spouse · 37', dob: '02 Jul 1989', phone: '98861 23499',
    to: '/x/fd6-arjun-hegde-documents', addDocTo: '/x/fd4-add-document-which-document',
    docs: [{ label: 'Medical report', tone: 'neutral', icon: 'folder' }],
  },
  { initials: 'AH', bg: 'bg-[#d4f1e7]', name: 'Anya Hegde', sub: 'Daughter · 5', dob: '19 Jan 2021', phone: 'No mobile', docs: [] },
  {
    initials: 'SH', bg: 'bg-[#fde8c9]', name: 'Shanta Hegde', sub: 'Mother', dob: 'Add date of birth', dobWarn: true, phone: '98450 11223', inactive: true,
    docs: [{ label: 'Aadhaar missing', tone: 'rose', icon: 'alert' }, { label: 'PAN missing', tone: 'rose', icon: 'alert' }],
  },
]

export const holderDocuments = [
  { group: 'KAVYA HEGDE' },
  { bg: 'bg-[#fde8ec]', title: 'Aadhaar', sub: 'v2 · 24 Oct · Priya', chip: 'Unconfirmed', tone: 'amber', icon: 'alert', check: true },
  { bg: 'bg-[#e9e3fc]', title: 'PAN', sub: 'v1 · 04 Sep · You', chip: 'Confirmed', tone: 'green', icon: 'check' },
  { group: 'ARJUN HEGDE' },
  { bg: 'bg-[#d4f1e7]', title: 'Medical report · thyroid 2025', sub: 'v1 · 06 Sep', chip: 'Saved', tone: 'neutral' },
]

export const vehiclePhotos = ['RC', 'Front', 'Rear', 'Left', 'Right']
export const photoChecklist = [
  { icon: 'folder', label: 'RC' },
  { icon: 'eye', label: 'Front' },
  { icon: 'eye', label: 'Rear' },
  { icon: 'eye', label: 'Left' },
  { icon: 'eye', label: 'Right' },
  { icon: 'eye', label: 'Odometer' },
]

/* ───────── Tasks ───────── */
export const taskStatusTabs = [
  { key: 'open', label: 'Open', count: 10 },
  { key: 'today', label: 'Today', count: 4 },
  { key: 'overdue', label: 'Overdue', count: 2 },
  { key: 'upcoming', label: 'Upcoming', count: 4 },
  { key: 'done', label: 'Done', count: 6 },
  { key: 'cancelled', label: 'Cancelled', count: 1 },
]
export const taskTypeTabs = [
  { key: 'all', label: 'All types' },
  { key: 'call', label: 'Call' },
  { key: 'meeting', label: 'Meeting' },
  { key: 'documents', label: 'Documents' },
  { key: 'renewal', label: 'Renewal' },
]
// kind: call | meeting | documents | renewal | other · bucket: today | upcoming | overdue (open tasks)
// The first six rows are the ones drawn in the Figma frame (TSK 286:34658); the rest back the tab counts.
export const tasks = [
  { id: 1, title: 'Follow-up call', initials: 'RG', bg: 'bg-[#fde8c9]', related: 'Ramesh Gowda · Lead', due: '24 Oct, 11:00 AM', dueLate: true, priority: 'High', status: 'overdue', kind: 'call', bucket: 'overdue', figma: true },
  { id: 2, title: 'Call back about family floater', initials: 'RG', bg: 'bg-[#fde8c9]', related: 'Ramesh Gowda · Lead', due: 'Today, 11:00 AM', priority: 'High', status: 'open', kind: 'call', bucket: 'today', figma: true },
  { id: 3, title: 'Collect Aadhaar for Shanta', initials: 'KH', bg: 'bg-[#fbd5dd]', related: 'Kavya Hegde', due: 'Today, 12:00 PM', priority: 'Medium', status: 'open', kind: 'documents', bucket: 'today', figma: true },
  { id: 4, title: 'Meet to compare plans', initials: 'AK', bg: 'bg-[#d4f1e7]', related: 'Anand Kulkarni · Lead', due: 'Tomorrow, 10:30 AM', priority: 'Medium', status: 'open', kind: 'meeting', bucket: 'upcoming', figma: true },
  { id: 5, title: 'Log first contact', initials: 'SR', bg: 'bg-[#fde8c9]', related: 'Sunita Reddy · Lead', due: 'Done 26 Oct', priority: 'Medium', status: 'done', kind: 'call', figma: true },
  { id: 6, title: 'Visit for documents', initials: 'SP', bg: 'bg-[#eef1f5]', related: 'Suresh Patil', due: 'Cancelled 20 Oct', priority: 'Low', status: 'cancelled', kind: 'documents', figma: true },
  { id: 7, title: 'Send PAN upload link', initials: 'AK', bg: 'bg-[#e9e3fc]', related: 'Anitha Kulkarni', due: '25 Oct, 4:00 PM', dueLate: true, priority: 'Medium', status: 'overdue', kind: 'documents', bucket: 'overdue' },
  { id: 8, title: 'Share renewal quotation', initials: 'KH', bg: 'bg-[#fbd5dd]', related: 'Kavya Hegde', due: 'Today, 4:00 PM', priority: 'High', status: 'open', kind: 'renewal', bucket: 'today' },
  { id: 9, title: 'Send brochure for parents’ cover', initials: 'DS', bg: 'bg-[#d9eafd]', related: 'Deepa Shetty · Lead', due: 'Today, 6:00 PM', priority: 'Low', status: 'open', kind: 'other', bucket: 'today' },
  { id: 10, title: 'Share CareFirst quotation', initials: 'SN', bg: 'bg-[#e9e3fc]', related: 'Srinivas Naik · Lead', due: '29 Oct, 10:00 AM', priority: 'High', status: 'open', kind: 'other', bucket: 'upcoming' },
  { id: 11, title: 'Collect RC copy for renewal', initials: 'FK', bg: 'bg-[#d9eafd]', related: 'Faizal Khan Sr', due: '30 Oct, 11:00 AM', priority: 'Medium', status: 'open', kind: 'documents', bucket: 'upcoming' },
  { id: 12, title: 'Renewal call · FamilySure', initials: 'KH', bg: 'bg-[#fbd5dd]', related: 'Kavya Hegde', due: '03 Nov, 10:00 AM', priority: 'Low', status: 'open', kind: 'renewal', bucket: 'upcoming' },
  { id: 13, title: 'Send WhatsApp brochure', initials: 'KH', bg: 'bg-[#fbd5dd]', related: 'Kavya Hegde', due: 'Done 26 Oct', priority: 'Low', status: 'done', kind: 'other' },
  { id: 14, title: 'Share quotation R2', initials: 'KH', bg: 'bg-[#fbd5dd]', related: 'Kavya Hegde', due: 'Done 25 Oct', priority: 'High', status: 'done', kind: 'other' },
  { id: 15, title: 'Proposal meeting', initials: 'KH', bg: 'bg-[#fbd5dd]', related: 'Kavya Hegde', due: 'Done 25 Oct', priority: 'High', status: 'done', kind: 'meeting' },
  { id: 16, title: 'Record issued policy', initials: 'FK', bg: 'bg-[#d9eafd]', related: 'Faizal Khan Sr', due: 'Done 24 Oct', priority: 'Medium', status: 'done', kind: 'renewal' },
  { id: 17, title: 'Verify Aadhaar copy', initials: 'AK', bg: 'bg-[#e9e3fc]', related: 'Anitha Kulkarni', due: 'Done 23 Oct', priority: 'Low', status: 'done', kind: 'documents' },
]

/* ───────── Notifications ───────── */
export const notificationTabs = [
  { key: 'all', label: 'All', count: 7 },
  { key: 'unread', label: 'Unread', count: 3 },
  { key: 'renewals', label: 'Renewals' },
  { key: 'payments', label: 'Payments' },
  { key: 'catalogue', label: 'Catalogue' },
]
export const notifications = [
  { icon: 'star', bg: 'bg-[#e9e3fc]', title: 'New in catalogue: Activ One MAX', sub: 'Add your Aditya Birla agent code to quote it.', when: '2 min ago', unread: true, cat: 'catalogue' },
  { icon: 'clock', bg: 'bg-[#fbebec]', title: 'Follow-up overdue: Ramesh Gowda', sub: 'Was due 24 Oct, 11:00 AM', when: '2 days ago', unread: true, cat: 'tasks' },
  { icon: 'card', bg: 'bg-[#fde8c9]', title: 'Payment still awaited: QT-202610-00012 R2', sub: 'Shared 24 Oct · no payment recorded', when: 'Today, 9:00 AM', unread: true, cat: 'payments' },
  { icon: 'eye', bg: 'bg-[#d9eafd]', title: 'Kavya viewed QT-202610-00012 R2', when: 'Yesterday', cat: 'quotations' },
  { icon: 'shield', bg: 'bg-[#d4f1e7]', title: 'Policy awaiting issuance for 7 days: PL-000071', sub: 'Record it when Niva Bupa issues', when: 'Yesterday', cat: 'policies' },
  { icon: 'refresh', bg: 'bg-[#fde8c9]', title: 'Renewal due in 38 days: Kavya Hegde', sub: 'FamilySure · 03 Dec', when: '25 Oct', cat: 'renewals' },
  { icon: 'card', bg: 'bg-[#d4f1e7]', title: 'Payment recorded: ₹13,263 for QT-202610-00010', sub: 'Faizal Khan Sr · UPI', when: '24 Oct', cat: 'payments' },
]
