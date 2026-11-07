// Mock data for the Campaigns module (Figma CA*, CN*, CL1, CC*).

export const connections = {
  meta: { key: 'meta', name: 'Meta Ads', icon: 'chart', bg: '#1f5fd6' },
  google: { key: 'google', name: 'Google Ads', icon: 'search', bg: '#e8899c' },
  website: { key: 'website', name: 'Website', icon: 'grid', bg: '#5b3fb8' },
}

export const overviewKpis = [
  { label: 'Ad and website leads', icon: 'users', value: '37', sub: 'This month · 12 today', bg: '#d9eafd' },
  { label: 'Converted', icon: 'check', value: '6', sub: '16% of leads', bg: '#d4f1e7' },
  { label: 'Ad spend', icon: 'wallet', value: '₹48,200', sub: 'Reported by Meta', bg: '#fde8c9' },
  { label: 'Cost per lead', icon: 'chart', value: '₹1,302', sub: 'Meta average', bg: '#e9e3fc' },
]

// Tab counts are derived from campaignRows (filtered by the status tab) in _parts.jsx.
export const channelTabs = [
  { key: 'all', label: 'All' },
  { key: 'meta', label: 'Meta Ads' },
  { key: 'google', label: 'Google Ads' },
  { key: 'website', label: 'Website' },
]

export const statusTabs = [
  { key: 'active', label: 'Active' },
  { key: 'paused', label: 'Paused' },
  { key: 'ended', label: 'Ended' },
]

export const campaignRows = [
  { name: 'Diwali family floater', sub: 'Lead form · Health', channel: 'meta', status: 'Active', leads: '18', today: '6', todayHot: true, converted: '4', spend: '₹21,400', cpl: '₹1,189', last: '10 min ago' },
  { name: 'Senior parents cover', sub: 'Lead form · Health', channel: 'meta', status: 'Active', leads: '9', today: '3', todayHot: true, converted: '1', spend: '₹14,800', cpl: '₹1,644', last: '1 h ago' },
  { name: 'Car renewal reminder', sub: 'Lead form · Motor', channel: 'meta', status: 'Paused', leads: '4', today: '0', converted: '1', spend: '₹12,000', cpl: '₹3,000', last: '3 days ago' },
  { name: 'Website · Get a quote', sub: 'Contact form', channel: 'website', status: 'Active', leads: '5', today: '2', todayHot: true, converted: '0', spend: '—', cpl: '—', last: '2 h ago' },
  { name: 'Website · Term insurance page', sub: 'Contact form', channel: 'website', status: 'Active', leads: '1', today: '1', converted: '0', spend: '—', cpl: '—', last: 'Today' },
  // Ended campaigns (only visible under the "Ended" status tab)
  { name: 'Monsoon motor renewal', sub: 'Lead form · Motor', channel: 'meta', status: 'Ended', leads: '22', today: '0', converted: '5', spend: '₹26,500', cpl: '₹1,205', last: '12 Sep' },
  { name: 'Independence Day term offer', sub: 'Lead form · Life and Term', channel: 'meta', status: 'Ended', leads: '14', today: '0', converted: '2', spend: '₹18,900', cpl: '₹1,350', last: '20 Aug' },
  { name: 'Website · Travel insurance page', sub: 'Contact form', channel: 'website', status: 'Ended', leads: '3', today: '0', converted: '1', spend: '—', cpl: '—', last: '30 Aug' },
]

/** Status tab → row predicate. "Active" lists every running campaign (live or paused), as in Figma CA1. */
export const statusMatch = {
  active: (r) => r.status !== 'Ended',
  paused: (r) => r.status === 'Paused',
  ended: (r) => r.status === 'Ended',
}

/* ───────────── CA2 · Campaign detail ───────────── */

export const detailStats = [
  { label: 'Leads', value: '18', bg: '#d9eafd' },
  { label: 'New today', value: '6', bg: '#e9e3fc' },
  { label: 'Contacted', value: '7', bg: '#fde8c9' },
  { label: 'Converted', value: '4', bg: '#d4f1e7' },
  { label: 'Spend', value: '₹21,400', bg: '#fde8ec' },
  { label: 'Cost / lead', value: '₹1,189', bg: '#eef1f5' },
]

// bar heights in px (Figma), day label
export const leadsPerDay = [
  [36, '13'], [4, '14'], [72, '15'], [36, '16'], [108, '17'], [36, '18'], [4, '19'],
  [72, '20'], [36, '21'], [36, '22'], [72, '23'], [4, '24'], [36, '25'], [108, '26'],
]

export const detailAds = [
  { name: 'Family of 4 · video', leads: '11 leads' },
  { name: 'Parents 60+ · carousel', leads: '5 leads' },
  { name: 'No room-rent cap · image', leads: '2 leads' },
]

export const detailLeads = [
  { initials: 'NS', bg: '#d9eafd', name: 'Nikhil Shetty', phone: '98451 22018', ad: 'Family of 4 · video', when: '10 min ago', chip: 'New', tone: 'blue', note: 'Auto-created', to: '/x/cl1-lead-from-meta-ads-auto-created' },
  { initials: 'PH', bg: '#e9e3fc', name: 'Prakash Hegde', phone: '94800 12777', ad: 'Family of 4 · video', when: 'Today, 10:12', chip: 'Contacted', tone: 'violet', note: 'Auto-created', to: '/leads/1' },
  { initials: 'AK', bg: '#d4f1e7', name: 'Asha Kamath', phone: '99001 33421', ad: 'Parents 60+ · carousel', when: 'Yesterday', chip: 'Qualified', tone: 'green', note: 'Auto-created', to: '/leads/1' },
  { initials: 'RK', bg: '#fde8c9', name: 'Ravi Kumar', phone: '98450 77120', ad: 'Family of 4 · video', when: '24 Oct', chip: 'Linked to existing', tone: 'amber', note: 'Same mobile as Anitha Kulkarni', noteWarn: true, to: '/leads/1' },
]

/* ───────────── CL1 · Lead from Meta Ads ───────────── */

export const cl1Origin = [
  ['Campaign', 'Diwali family floater'],
  ['Ad', 'Family of 4 · video'],
  ['Lead form', 'Family cover quote'],
  ['Platform', 'Instagram'],
  ['Received', '26 Oct 2026, 10:32 AM'],
  ['Meta lead ID', '1186·····4402'],
]

export const cl1Answers = [
  ['Full name', 'Nikhil Shetty'],
  ['Phone', '+91 98451 22018'],
  ['Email', 'nikhil.s@example.in'],
  ['City', 'Mangaluru'],
  ['Who do you want to cover?', 'Me, wife and 2 kids'],
  ['Contact me on WhatsApp', 'Yes'],
]

export const cl1Auto = [
  ['user-plus', 'Lead created in Health pipeline'],
  ['check', 'No duplicate: mobile not in your records'],
  ['lock', 'WhatsApp consent recorded from the form'],
  ['calendar', 'Follow-up task: call within 1 hour'],
  ['bell', 'You were notified'],
]

/* ───────────── CC1–CC3 · Per-source campaign leads ───────────── */

// Avatar tints used across the app
const TINTS = ['#d9eafd', '#e9e3fc', '#d4f1e7', '#fde8c9', '#fbd5dd', '#eef1f5']
const CHIP_TONE = { New: 'blue', Contacted: 'violet', Qualified: 'green', Converted: 'green', 'Linked to existing': 'amber', Lost: 'gray' }
/** Compact lead row: c = campaign tab index, days = days before "today" (26 Oct 2026). */
const lead = (c, name, phone, when, days, src, chip, i = 0) => ({
  c, days, name, phone, when, src, chip, tone: CHIP_TONE[chip],
  initials: name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
  bg: TINTS[i % TINTS.length],
  meta: `${phone} · ${when}`,
})

export const sourcePages = {
  meta: {
    crumb: 'CAMPAIGNS  /  META ADS LEADS',
    title: 'Meta Ads leads',
    sub: 'Ad account Rao Insurance Services · page Rao Insurance · last sync 1 min ago',
    mappingTo: '/x/cn3-connect-meta-ads-map-fields',
    openLabel: 'Open in Meta',
    openFirst: false,
    filterLabel: 'Campaign',
    tabs: [['Diwali family floater', 18], ['Senior parents cover', 9], ['Car renewal reminder', 4]],
    summary: {
      bg: '#e8f0fd', icon: 'chart', iconColor: '#1f5fd6',
      title: 'Diwali family floater · Active',
      sub: 'Lead form “Family cover quote” · Health pipeline · since 12 Oct',
      stats: [['Leads', '18'], ['Today', '6'], ['Converted', '4'], ['Cost / lead', '₹1,189']],
    },
    shown: '5 shown · newest first',
    sourceColor: '#1f5fd6',
    leads: [
      { ...lead(0, 'Nikhil Shetty', '98451 22018', '10 min ago', 0, 'Ad: Family of 4 · video · Instagram', 'New'), bg: '#d9eafd' },
      { ...lead(0, 'Prakash Hegde', '94800 12777', 'Today, 10:12', 0, 'Ad: Family of 4 · video · Facebook', 'Contacted'), bg: '#e9e3fc' },
      { ...lead(0, 'Asha Kamath', '99001 33421', 'Yesterday', 1, 'Ad: Parents 60+ · carousel', 'Qualified'), bg: '#d4f1e7' },
      { ...lead(0, 'Ravi Kumar', '98450 77120', '24 Oct', 2, 'Ad: Family of 4 · video', 'Linked to existing'), bg: '#fde8c9' },
      { ...lead(0, 'Sneha Murthy', '97411 50022', '23 Oct', 3, 'Ad: No room-rent cap · image', 'Converted'), bg: '#fbd5dd' },
      lead(0, 'Girish Bhat', '98860 41207', '18 Oct', 8, 'Ad: Family of 4 · video · Instagram', 'Converted', 0),
      lead(0, 'Lakshmi Rao', '99452 30871', '17 Oct', 9, 'Ad: Parents 60+ · carousel', 'Contacted', 1),
      lead(0, 'Manjunath Gowda', '97319 66420', '17 Oct', 9, 'Ad: Family of 4 · video · Facebook', 'Qualified', 2),
      lead(0, 'Pooja Shenoy', '98440 18235', '16 Oct', 10, 'Ad: Family of 4 · video · Instagram', 'Converted', 3),
      lead(0, 'Arjun Pai', '96860 72214', '15 Oct', 11, 'Ad: No room-rent cap · image', 'Contacted', 4),
      lead(0, 'Deepa Nayak', '99800 25519', '15 Oct', 11, 'Ad: Family of 4 · video', 'Lost', 5),
      lead(0, 'Sandeep Kini', '98455 90031', '14 Oct', 12, 'Ad: Parents 60+ · carousel', 'Contacted', 0),
      lead(0, 'Kavya Acharya', '97412 38806', '14 Oct', 12, 'Ad: Family of 4 · video · Instagram', 'Converted', 1),
      lead(0, 'Rohit Shetty', '98863 11742', '13 Oct', 13, 'Ad: Family of 4 · video · Facebook', 'Qualified', 2),
      lead(0, 'Shwetha Kamath', '99019 47023', '13 Oct', 13, 'Ad: Parents 60+ · carousel', 'Contacted', 3),
      lead(0, 'Naveen Hegde', '96320 55187', '12 Oct', 14, 'Ad: Family of 4 · video', 'Lost', 4),
      lead(0, 'Ananya Prabhu', '98450 63390', '12 Oct', 14, 'Ad: Family of 4 · video · Instagram', 'Contacted', 5),
      lead(0, 'Vinay Kulkarni', '97390 20418', '12 Oct', 14, 'Ad: No room-rent cap · image', 'Contacted', 0),
      lead(1, 'Usha Rao', '98441 70263', '1 h ago', 0, 'Ad: Parents 60+ · carousel · Facebook', 'New', 1),
      lead(1, 'Ramesh Iyengar', '99860 21455', 'Today, 9:40', 0, 'Ad: Parents 60+ · carousel', 'New', 2),
      lead(1, 'Sudha Bhat', '97411 82390', 'Today, 8:15', 0, 'Ad: Cover for parents · video', 'Contacted', 3),
      lead(1, 'Venkatesh Murthy', '98450 11968', 'Yesterday', 1, 'Ad: Parents 60+ · carousel', 'Contacted', 4),
      lead(1, 'Geetha Nair', '96861 40027', '23 Oct', 3, 'Ad: Cover for parents · video', 'Qualified', 5),
      lead(1, 'Prasad Joshi', '99001 28734', '21 Oct', 5, 'Ad: Parents 60+ · carousel · Instagram', 'Converted', 0),
      lead(1, 'Kamala Devi', '98864 33017', '19 Oct', 7, 'Ad: Cover for parents · video', 'Contacted', 1),
      lead(1, 'Srinivas Rao', '97400 59211', '18 Oct', 8, 'Ad: Parents 60+ · carousel', 'Lost', 2),
      lead(1, 'Lalitha Shenoy', '98455 72608', '18 Oct', 8, 'Ad: Cover for parents · video', 'Contacted', 3),
      lead(2, 'Harish Gowda', '98450 66124', '23 Oct', 3, 'Ad: Renew before it lapses · image', 'Contacted', 4),
      lead(2, 'Nandini Pai', '99452 17730', '20 Oct', 6, 'Ad: Renew before it lapses · image', 'Converted', 5),
      lead(2, 'Kiran Shetty', '97319 80245', '16 Oct', 10, 'Ad: Zero-dep add-on · carousel', 'Qualified', 0),
      lead(2, 'Mohan Kamath', '98861 29473', '14 Oct', 12, 'Ad: Renew before it lapses · image', 'Lost', 1),
    ],
    summaries: [
      null, // index 0 uses `summary` above (Figma)
      { title: 'Senior parents cover · Active', sub: 'Lead form “Family cover quote” · Health pipeline · since 18 Oct', stats: [['Leads', '9'], ['Today', '3'], ['Converted', '1'], ['Cost / lead', '₹1,644']] },
      { title: 'Car renewal reminder · Paused', sub: 'Lead form “Car insurance renewal” · Motor pipeline · since 10 Oct', stats: [['Leads', '4'], ['Today', '0'], ['Converted', '1'], ['Cost / lead', '₹3,000']] },
    ],
    answerLabels: ['Full name', 'Phone number', 'Lead form'],
    defaultConsent: { ok: true, text: 'WhatsApp consent recorded from the form tick box.' },
    detail: {
      initials: 'NS', bg: '#d9eafd', name: 'Nikhil Shetty', chip: 'New', tone: 'blue',
      sub: 'Submitted 10 min ago · form “Family cover quote”',
      facts: [['Campaign', 'Diwali family floater'], ['Ad set', 'Bengaluru · 28–45'], ['Ad', 'Family of 4 · video'], ['Placement', 'Instagram feed'], ['Meta lead ID', '1186·····4402']],
      answers: [
        ['Full name', 'Nikhil Shetty'], ['Phone number', '+91 98451 22018'], ['Email', 'nikhil.s@example.in'], ['City', 'Mangaluru'],
        ['Who do you want to cover?', 'Me, wife and 2 kids'], ['Ages of the eldest member', '38'], ['Any existing health insurance?', 'Company group cover only'],
        ['Best time to call', 'After 6 pm'], ['Contact me on WhatsApp', 'Yes'],
      ],
      consent: { ok: true, text: 'WhatsApp consent recorded from the form (ticked by Nikhil, 26 Oct, 10:32 AM).' },
      openTo: '/x/cl1-lead-from-meta-ads-auto-created',
    },
  },
  google: {
    crumb: 'CAMPAIGNS  /  GOOGLE ADS LEADS',
    title: 'Google Ads leads',
    sub: 'Account Rao Insurance · 482-119-2201 · last sync 3 min ago',
    mappingTo: '/x/cn7-connect-google-ads-map-fields',
    openLabel: 'Open in Google Ads',
    filterLabel: 'Campaign',
    tabs: [['Term insurance · Search', 7], ['Health callback · YouTube', 3]],
    summary: {
      bg: '#fde8ec', icon: 'search', iconColor: '#b4325a',
      title: 'Term insurance · Search · Active',
      sub: 'Lead form asset “Term insurance quote” · Term pipeline · since 20 Oct',
      stats: [['Leads', '7'], ['Today', '2'], ['Converted', '1'], ['Cost / lead', '₹860']],
    },
    shown: '4 shown · newest first',
    sourceColor: '#b4325a',
    leads: [
      { ...lead(0, 'Vikram Rao', '99000 45121', '25 min ago', 0, 'Keyword: term insurance 1 crore', 'New'), bg: '#d9eafd' },
      { ...lead(0, 'Megha Desai', '98861 11234', 'Today, 9:05', 0, 'Keyword: best term plan', 'Contacted'), bg: '#e9e3fc' },
      { ...lead(0, 'Arun Joshi', '97400 22981', 'Yesterday', 1, 'Keyword: term insurance for smokers', 'New'), bg: '#fde8c9' },
      { ...lead(0, 'Kiran Patil', '98455 66710', '22 Oct', 4, 'Keyword: term plan with return', 'Converted'), bg: '#d4f1e7' },
      lead(0, 'Rahul Menon', '99645 20187', '18 Oct', 8, 'Keyword: term insurance calculator', 'Contacted', 4),
      lead(0, 'Shruti Kulkarni', '98451 73302', '15 Oct', 11, 'Keyword: 2 crore term plan', 'Qualified', 5),
      lead(0, 'Ajay Naik', '97391 08854', '12 Oct', 14, 'Keyword: term insurance for NRI', 'Lost', 0),
      lead(1, 'Priya Shetty', '98440 61129', 'Today, 11:20', 0, 'YouTube: Health plan explainer', 'New', 1),
      lead(1, 'Sunil Hegde', '99809 34416', '21 Oct', 5, 'YouTube: Cashless claims in 3 steps', 'Contacted', 2),
      lead(1, 'Anil Bhandary', '97412 55093', '13 Oct', 13, 'YouTube: Health plan explainer', 'Contacted', 3),
    ],
    summaries: [
      null,
      { title: 'Health callback · YouTube · Active', sub: 'Lead form asset “Health plan callback” · Health pipeline · since 08 Oct', stats: [['Leads', '3'], ['Today', '1'], ['Converted', '0'], ['Cost / lead', '₹1,120']] },
    ],
    answerLabels: ['FULL_NAME', 'PHONE_NUMBER', 'Lead form'],
    defaultConsent: { ok: false, text: 'No consent question on this form. WhatsApp, SMS and email consent stay “Not recorded” until you record it.' },
    detail: {
      initials: 'VR', bg: '#d9eafd', name: 'Vikram Rao', chip: 'New', tone: 'blue',
      sub: 'Submitted 25 min ago · lead form “Term insurance quote”',
      facts: [['Campaign', 'Term insurance · Search'], ['Ad group', 'Term 1 crore'], ['Keyword', 'term insurance 1 crore'], ['Network', 'Google Search'], ['GCLID', 'Cj0K·····BwE']],
      answers: [
        ['FULL_NAME', 'Vikram Rao'], ['PHONE_NUMBER', '+91 99000 45121'], ['EMAIL', 'vikram.rao@example.in'], ['Age', '34'],
        ['Annual income', '₹18 lakh'], ['Cover you’re looking for', '₹1 crore'], ['Do you smoke?', 'No'], ['Preferred callback time', 'Weekend morning'],
      ],
      consent: { ok: false, text: 'No consent question on this form. WhatsApp, SMS and email consent stay “Not recorded” until you record it.' },
      openTo: '/leads/1',
    },
  },
  website: {
    crumb: 'CAMPAIGNS  /  WEBSITE LEADS',
    title: 'Website leads',
    sub: 'raoinsurance.in · ready-made form · last enquiry 2 h ago',
    mappingTo: '/x/cn8-connect-website-choose-method',
    openLabel: 'Open website',
    filterLabel: 'Form',
    tabs: [['Get a quote', 5], ['Term insurance page', 1]],
    summary: {
      bg: '#f0ecfb', icon: 'grid', iconColor: '#5b3fb8',
      title: 'Get a quote · Active',
      sub: 'raoinsurance.in/get-quote · Health pipeline · since 01 Oct',
      stats: [['Enquiries', '5'], ['Today', '2'], ['Converted', '0'], ['Top page', '/health']],
    },
    shown: '3 shown · newest first',
    sourceColor: '#5b3fb8',
    leads: [
      { ...lead(0, 'Meera Iyer', '97400 88213', '2 h ago', 0, 'From: Google search → /health', 'Contacted'), bg: '#e9e3fc' },
      { ...lead(0, 'Suresh Kamath', '98450 31122', 'Today, 8:40', 0, 'From: Instagram bio link', 'New'), bg: '#d9eafd' },
      { ...lead(0, 'Divya Nair', '99001 77654', 'Yesterday', 1, 'From: direct visit', 'New'), bg: '#fde8c9' },
      lead(0, 'Rekha Shenoy', '98863 40915', '17 Oct', 9, 'From: Google search → /motor', 'Contacted', 2),
      lead(0, 'Ashok Pai', '97319 26647', '11 Oct', 15, 'From: WhatsApp share', 'Lost', 4),
      lead(1, 'Tejas Rao', '99456 81203', 'Today, 7:55', 0, 'From: Google search → /term', 'New', 0),
    ],
    summaries: [
      null,
      { title: 'Term insurance page · Active', sub: 'raoinsurance.in/term · Life and Term pipeline · since 20 Oct', stats: [['Enquiries', '1'], ['Today', '1'], ['Converted', '0'], ['Top page', '/term']] },
    ],
    answerLabels: ['Name', 'Mobile', 'Form'],
    defaultConsent: { ok: true, text: 'WhatsApp consent recorded from the website form tick box.' },
    detail: {
      initials: 'MI', bg: '#e9e3fc', name: 'Meera Iyer', chip: 'Contacted', tone: 'violet',
      sub: 'Submitted 2 h ago · raoinsurance.in/get-quote',
      facts: [['Page', '/get-quote'], ['Came from', 'google / organic'], ['UTM campaign', '—'], ['Device', 'Mobile · Chrome'], ['Submitted', '26 Oct, 9:12 AM']],
      answers: [
        ['Name', 'Meera Iyer'], ['Mobile', '+91 97400 88213'], ['Email', 'meera.iyer@example.in'], ['Insurance you need', 'Health'],
        ['People to cover', 'Self and husband'], ['Message', 'Looking for a plan with maternity cover.'], ['I agree to be contacted on WhatsApp', 'Yes'],
      ],
      consent: { ok: true, text: 'WhatsApp consent recorded from the website form tick box (26 Oct, 9:12 AM).' },
      openTo: '/leads/1',
    },
  },
}

/* ───────────── Wizard content ───────────── */

export const metaSteps = ['Sign in', 'Ad account and forms', 'Map fields', 'Lead settings']
export const googleSteps = ['Sign in', 'Account', 'Map fields']

export const metaForms = [
  { title: 'Family cover quote', sub: 'Used by 2 campaigns · 27 leads', chip: 'Health', tone: 'pink', on: true },
  { title: 'Car insurance renewal', sub: '1 campaign · 4 leads', chip: 'Motor', tone: 'blue', on: true },
  { title: 'Newsletter signup', sub: 'Not insurance leads', on: false },
]

export const googleForms = [
  { title: 'Term insurance quote', sub: 'Search campaign · Term', chip: 'Term', tone: 'blue', on: true },
  { title: 'Health plan callback', sub: 'YouTube campaign', chip: 'Health', tone: 'pink', on: true },
]

export const metaMapping = [
  ['full_name', 'Lead name'], ['phone_number', 'Primary mobile'], ['email', 'Email'], ['city', 'City'],
  ['Who do you want to cover?', 'Notes'], ['Contact me on WhatsApp (checkbox)', 'WhatsApp consent', true],
]

export const googleMapping = [
  ['FULL_NAME', 'Lead name'], ['PHONE_NUMBER', 'Primary mobile'], ['EMAIL', 'Email'],
  ['Annual income (question)', 'Notes'], ['Consent to contact', 'Consent: not on this form', true],
]

export const leadFieldOptions = ['Lead name', 'Primary mobile', 'Email', 'City', 'Notes', 'WhatsApp consent', 'Consent: not on this form', 'Do not import']

export const metaLeadSettings = [
  { title: 'Create a follow-up task for today', sub: 'Due within 1 hour', on: true },
  { title: 'Notify me in the bell', on: true },
  { title: 'Bring in leads from the last 30 days too', sub: '27 earlier leads', on: false },
]

export const websiteMethods = [
  { title: 'Add our ready-made form', sub: 'Paste one line of code. Includes a consent tick box.' },
  { title: 'Send from your own form (webhook)', sub: 'For developers. Post form data to your private URL.' },
  { title: 'WordPress plugin', sub: 'Install “Bimayantra Leads” and paste your key.' },
]

export const embedCode = '<script src="https://forms.bimayantra.in/w.js" data-key="RIS-7KQ2M"></script>'

/* ───────────── Campaigns — Connection guide (/campaigns/guide) ─────────────
   Full write-up with sources: docs/INTEGRATIONS.md. Values here are what the UI shows. */

export const guideApiBase = 'https://api.bimayantra.in'
export const guideCheckedOn = '31 Oct 2026'

// tag: secret = server .env only · stored = per advisor, encrypted in DB · shown = visible in the app · public = safe to share
export const GUIDE_TAGS = {
  secret: { tone: 'pink', label: 'Secret · server .env', icon: 'lock' },
  stored: { tone: 'violet', label: 'Per advisor · encrypted', icon: 'lock' },
  shown: { tone: 'green', label: 'Shown in app', icon: 'eye' },
  public: { tone: 'gray', label: 'Public' },
}

export const connectionGuide = {
  meta: {
    key: 'meta',
    label: 'Meta Ads',
    connectTo: '/x/cn1-connect-meta-ads-sign-in',
    connectLabel: 'Connect Meta Ads',
    banner: {
      bg: '#e8f0fd', icon: 'chart', iconColor: '#1f5fd6',
      title: 'Facebook and Instagram lead ads',
      sub: 'Meta pings our webhook with a lead ID → we fetch the answers with the Page token → lead is created in seconds.',
      stats: [['Lead delivery', 'Webhook · real time'], ['Ad spend', 'Insights API'], ['Graph API', 'v26.0']],
    },
    needs: [
      { name: 'App ID', where: 'developers.facebook.com → your Business app → Settings → Basic', tag: 'public', env: 'META_APP_ID' },
      { name: 'App Secret', where: 'Same page. Signs every webhook (X-Hub-Signature-256) and exchanges tokens', tag: 'secret', env: 'META_APP_SECRET' },
      { name: 'Webhook verify token', where: 'Any random string we create, pasted in App Dashboard → Webhooks', tag: 'secret', env: 'META_WEBHOOK_VERIFY_TOKEN' },
      { name: 'Permissions with Advanced Access', where: 'leads_retrieval, pages_manage_metadata, pages_show_list, pages_read_engagement, ads_management, ads_read (spend), pages_manage_ads, business_management', tag: 'public' },
      { name: 'Business verification + App Review', where: 'Business settings → Security centre; App Dashboard → App Review', tag: 'public' },
      { name: 'Long-lived Page access token', where: 'Created when the advisor clicks “Continue with Facebook” (no expiry date)', tag: 'stored' },
      { name: 'Long-lived user token', where: 'Same login, lasts about 60 days. Used to read ad spend', tag: 'stored' },
      { name: 'Page, ad account and lead forms', where: 'Picked by the advisor in the Connect wizard', tag: 'shown' },
    ],
    phases: [
      {
        title: 'One-time platform setup',
        who: 'Bimayantra admin',
        steps: [
          { title: 'Create a Meta Business app', body: 'On developers.facebook.com create an app of type Business, attach it to the Bimayantra business portfolio, and fill privacy policy, terms and data-deletion URLs.' },
          { title: 'Copy App ID and App Secret', body: 'Settings → Basic. Put both in the API’s .env. The App Secret never goes to the browser or the app UI.', code: 'META_APP_ID · META_APP_SECRET' },
          { title: 'Add Facebook Login for Business and Webhooks', body: 'In Webhooks choose the Page object, paste the callback URL and verify token below, click “Verify and save”, then subscribe to the leadgen field.', code: 'Page → leadgen' },
          { title: 'Request permissions with Advanced Access', body: 'Complete Business Verification, then submit App Review for leads_retrieval, pages_manage_metadata, pages_show_list, pages_read_engagement, ads_management and ads_read with a screencast of the connect flow.' },
          { title: 'Switch the app to Live', body: 'Webhooks for real advisors and the Lead Ads Testing Tool only work when the app is Live.' },
        ],
      },
      {
        title: 'Each advisor connects',
        who: 'Advisor · about 3 minutes',
        steps: [
          { title: 'Continue with Facebook', body: 'Sign in with the Facebook account that is admin or advertiser on the Page. We swap the short-lived token for a long-lived one on the server.' },
          { title: 'Pick the Page, ad account and lead forms', body: 'We subscribe the Page to our app (POST /{page-id}/subscribed_apps, field leadgen) and list its lead forms.' },
          { title: 'Give leads access if your business restricts it', body: 'Meta Business Suite → Settings → Integrations → Leads access → choose the Page → CRMs → Assign “Bimayantra”. Skip if you never customised leads access.' },
          { title: 'Map fields and choose a pipeline', body: 'full_name → Lead name, phone_number → Primary mobile, email, city. Other questions go to Notes.' },
          { title: 'Send a test lead', body: 'Use Meta’s Lead Ads Testing Tool. The lead should appear under Campaigns → Meta Ads leads within seconds.' },
        ],
      },
    ],
    fields: [
      { label: 'Callback URL', value: 'https://api.bimayantra.in/webhooks/meta', note: 'App Dashboard → Webhooks → Page' },
      { label: 'Verify token', value: 'bmy_meta_7c41e9a2d05f8b36', secret: true, note: 'Admin only · same value as META_WEBHOOK_VERIFY_TOKEN' },
      { label: 'Webhook field', value: 'leadgen', note: 'Subscribe the Page object to this field' },
      { label: 'Fetch lead', value: 'GET https://graph.facebook.com/v26.0/{leadgen_id}?fields=id,created_time,ad_id,form_id,field_data', note: 'Called by our server with the Page token' },
    ],
    mapping: [
      ['Name', 'full_name'], ['Mobile', 'phone_number'], ['Email', 'email'], ['City', 'city'],
      ['Insurance type', 'Pipeline chosen per form'], ['Source', 'Meta Ads · facebook / instagram'], ['Campaign', 'campaign_name (from the lead)'],
      ['WhatsApp consent', 'custom_disclaimer_responses'],
    ],
    tests: [
      ['Webhooks → Test', 'App Dashboard sends a sample leadgen event to the callback URL.'],
      ['Lead Ads Testing Tool', 'Pick Page and form → Create lead → Track status until “success”. One test lead per form; delete it to make another.'],
    ],
    errors: [
      ['“URL couldn’t be validated”', 'Verify token mismatch, challenge not echoed, or no valid HTTPS certificate.'],
      ['No webhooks arrive', 'Page not subscribed, app still in Development mode, or Meta disabled the subscription after 1 hour of failures.'],
      ['Permission error fetching lead', 'leads_retrieval not approved, user lacks the Advertise task, or Leads Access Manager doesn’t include Bimayantra.'],
      ['Error 190 · token expired', 'Password changed or app removed. Show “Reconnect needed”, then backfill missed leads.'],
    ],
    docs: [
      ['Leads webhooks', 'https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-leadgen/'],
      ['Retrieving leads', 'https://developers.facebook.com/documentation/ads-commerce/marketing-api/guides/lead-ads/retrieving'],
      ['Webhook verification and signatures', 'https://developers.facebook.com/documentation/business-messaging/messenger-platform/webhooks'],
      ['Long-lived tokens', 'https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived/'],
      ['Permissions reference', 'https://developers.facebook.com/documentation/development/permissions'],
      ['Testing and troubleshooting', 'https://developers.facebook.com/documentation/ads-commerce/marketing-api/guides/lead-ads/testing-troubleshooting'],
      ['Ads Insights API (spend)', 'https://developers.facebook.com/documentation/ads-commerce/marketing-api/insights'],
    ],
  },

  google: {
    key: 'google',
    label: 'Google Ads',
    connectTo: '/x/cn6-connect-google-ads-sign-in-and-account',
    connectLabel: 'Connect Google Ads',
    banner: {
      bg: '#fde8ec', icon: 'search', iconColor: '#b4325a',
      title: 'Lead form assets on Search, YouTube and Performance Max',
      sub: 'Google posts each form submission to your webhook URL with your key. Spend comes from the Google Ads API.',
      stats: [['Lead delivery', 'Webhook · real time'], ['Ad spend', 'Google Ads API'], ['API', 'v26']],
    },
    needs: [
      { name: 'Webhook URL', where: 'Generated by Bimayantra for you (below)', tag: 'shown' },
      { name: 'Webhook key (google_key)', where: 'Generated by Bimayantra, pasted into the lead form. We keep only a hash', tag: 'shown' },
      { name: 'Developer token', where: 'Bimayantra’s Google Ads manager account → Admin → API Center. Needs Explorer, Basic or Standard access for live accounts', tag: 'secret', env: 'GOOGLE_ADS_DEVELOPER_TOKEN' },
      { name: 'OAuth client ID', where: 'Google Cloud Console → APIs & Services → Credentials (Google Ads API enabled)', tag: 'public', env: 'GOOGLE_OAUTH_CLIENT_ID' },
      { name: 'OAuth client secret', where: 'Same credential. Consent screen must be “In production” or refresh tokens expire in 7 days', tag: 'secret', env: 'GOOGLE_OAUTH_CLIENT_SECRET' },
      { name: 'Refresh token', where: 'Created when the advisor clicks “Sign in with Google” (scope adwords)', tag: 'stored' },
      { name: 'Customer ID', where: 'Top right of Google Ads, e.g. 482-119-2201. Sent without hyphens', tag: 'shown' },
      { name: 'Login customer ID (MCC)', where: 'Only when the account is reached through a manager account: the manager’s 10-digit ID', tag: 'shown' },
    ],
    phases: [
      {
        title: 'Leads · each advisor',
        who: 'Advisor · about 2 minutes per form',
        steps: [
          { title: 'Open your lead form in Google Ads', body: 'Campaigns menu → Assets → choose “Lead form” above the table → hover the form → pencil icon. New forms: create a Leads campaign and add a lead form asset.' },
          { title: 'Open the webhook section', body: 'Expand “Export leads from Google Ads”, then “Other data integration options”, then “Webhook integration”.' },
          { title: 'Paste the webhook URL and key', body: 'Copy both from below. The key lets us confirm the lead came from your form.', code: 'Webhook URL · Key' },
          { title: 'Click “Send test data”, then Save', body: 'A green message means our server answered 200. The test lead appears here marked “Test”.' },
        ],
      },
      {
        title: 'Spend and cost per lead · optional',
        who: 'Bimayantra admin once, then advisor',
        steps: [
          { title: 'Get a developer token', body: 'Apply in the API Center of Bimayantra’s manager account. Test level only reaches test accounts; apply for Explorer, then Basic (15,000 operations a day).' },
          { title: 'Create the OAuth client', body: 'Enable Google Ads API in Google Cloud, set the consent screen to In production with scope …/auth/adwords, create a Web OAuth client.' },
          { title: 'Advisor signs in with Google', body: 'We store the refresh token (encrypted) and the chosen customer ID, and send login-customer-id when access is through a manager account.' },
        ],
      },
    ],
    fields: [
      { label: 'Webhook URL', value: 'https://api.bimayantra.in/webhooks/google-ads', note: 'Paste in the lead form → Webhook integration' },
      { label: 'Key', value: 'bmy_gk_4f9d2c81a7e3b605d1', secret: true, note: 'Unique to your account · regenerate any time' },
      { label: 'Expected response', value: 'HTTP 200 · {}', note: '4xx is not retried, 5xx is retried by Google' },
    ],
    mapping: [
      ['Name', 'FULL_NAME (or FIRST_NAME + LAST_NAME)'], ['Mobile', 'PHONE_NUMBER'], ['Email', 'EMAIL'], ['City', 'CITY or POSTAL_CODE'],
      ['Insurance type', 'Pipeline chosen per form'], ['Source', 'Google Ads'], ['Campaign', 'campaign_id → name from Google Ads API'],
      ['Test lead', 'is_test = true'],
    ],
    tests: [
      ['Send test data', 'Button under Webhook integration in the lead form. Payload has is_test: true.'],
      ['curl', 'POST a sample payload to the webhook URL with Content-Type: application/json.'],
    ],
    errors: [
      ['Send test data fails', 'Server did not answer 200, or the key was not saved in Bimayantra before testing.'],
      ['Same lead twice', 'Google delivers at least once. We de-duplicate on lead_id.'],
      ['DEVELOPER_TOKEN_NOT_APPROVED', 'Developer token is still at Test level. Apply for Explorer or Basic.'],
      ['USER_PERMISSION_DENIED', 'Missing or wrong login-customer-id for accounts under a manager account.'],
      ['invalid_grant after 7 days', 'OAuth consent screen still in Testing. Publish it and reconnect.'],
    ],
    docs: [
      ['Lead form webhook · implementation', 'https://developers.google.com/google-ads/webhook/docs/implementation'],
      ['Lead form webhook · testing', 'https://developers.google.com/google-ads/webhook/docs/testing'],
      ['Set up a webhook for a lead form', 'https://support.google.com/google-ads/answer/16729613'],
      ['Developer token access levels', 'https://developers.google.com/google-ads/api/docs/api-policy/access-levels'],
      ['REST auth headers', 'https://developers.google.com/google-ads/api/rest/auth'],
      ['OAuth refresh tokens', 'https://developers.google.com/identity/protocols/oauth2'],
    ],
  },

  website: {
    key: 'website',
    label: 'Website',
    connectTo: '/x/cn8-connect-website-choose-method',
    connectLabel: 'Connect website',
    banner: {
      bg: '#f0ecfb', icon: 'grid', iconColor: '#5b3fb8',
      title: 'Enquiry forms on your own website',
      sub: 'Paste our ready-made form, or let your developer post form data to a signed endpoint.',
      stats: [['Lead delivery', 'Direct POST'], ['Ready-made form', '1 line of code'], ['Consent', 'Tick box included']],
    },
    needs: [
      { name: 'Public form key', where: 'Settings → Integrations → Website. Goes in the embed snippet (data-key). Safe to publish', tag: 'shown' },
      { name: 'Allowed domains', where: 'Your site addresses, e.g. raoinsurance.in and www.raoinsurance.in', tag: 'shown' },
      { name: 'Secret API key', where: 'Only for the developer webhook. Shown once, used to sign requests. Never put it in browser code', tag: 'stored' },
      { name: 'Pipeline', where: 'Which pipeline new enquiries go to (Health, Motor, Life and Term, Travel)', tag: 'shown' },
    ],
    phases: [
      {
        title: 'Ready-made form',
        who: 'Anyone who can edit the site',
        steps: [
          { title: 'Copy the snippet', body: 'It contains your public form key. Paste it where the form should appear (or install the WordPress plugin and paste the key).' },
          { title: 'Add your domains', body: 'Only listed domains can send enquiries with your key. Add both www and non-www.' },
          { title: 'Send a test enquiry', body: 'Fill the form once. It shows up under Campaigns → Website leads with source Website.' },
        ],
      },
      {
        title: 'Your own form · developer webhook',
        who: 'Your developer',
        steps: [
          { title: 'Post JSON to the endpoint', body: 'Send name and mobile (required) plus email, city, insurance_type, message, consent_whatsapp, page_url and utm fields.' },
          { title: 'Sign every request', body: 'Headers X-Bimayantra-Key-Id, X-Bimayantra-Timestamp and X-Bimayantra-Signature = sha256 HMAC of “timestamp.body” with your secret key.', code: 'sha256=HMAC(secret, ts + "." + body)' },
          { title: 'Handle the response', body: '201 = lead created, 200 with duplicate: true = already received, 401 = bad signature, 429 = slow down.' },
        ],
      },
    ],
    fields: [
      { label: 'Endpoint', value: 'https://api.bimayantra.in/webhooks/website', note: 'POST · application/json' },
      { label: 'Embed snippet', value: '<script src="https://forms.bimayantra.in/w.js" data-key="RIS-7KQ2M" async></script>', note: 'Public form key · safe to publish', code: true },
      { label: 'Key ID', value: 'wk_live_7KQ2M', note: 'Header X-Bimayantra-Key-Id' },
      { label: 'Secret key', value: 'wsk_live_b81e0c6f2d9a47c3', secret: true, note: 'Developer webhook only · keep on your server' },
    ],
    mapping: [
      ['Name', 'name'], ['Mobile', 'mobile'], ['Email', 'email'], ['City', 'city'],
      ['Insurance type', 'insurance_type'], ['Source', 'Website (automatic)'], ['Campaign', 'utm_campaign or form name'],
      ['WhatsApp consent', 'consent_whatsapp'],
    ],
    tests: [
      ['Test lead', 'Connect website → “Send a test lead” shows it the moment it arrives.'],
      ['curl', 'POST a signed sample body to the endpoint and expect 201.'],
    ],
    errors: [
      ['403 Origin not allowed', 'The page’s domain is not in Allowed domains (check www vs non-www).'],
      ['401 Bad signature', 'Signed a re-formatted body or the server clock is off by more than 5 minutes.'],
      ['Secret key exposed', 'Regenerate it in Settings. The old key stops working immediately.'],
    ],
    docs: [
      ['Node.js crypto.createHmac (signing)', 'https://nodejs.org/api/crypto.html#cryptocreatehmacalgorithm-key-options'],
      ['MDN · Origin header', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Origin'],
    ],
  },
}
