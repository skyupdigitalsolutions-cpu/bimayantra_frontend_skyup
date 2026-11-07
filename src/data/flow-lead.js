// Mock data for the Lead → customer flow (Figma F1–F3).

export const newLead = {
  name: 'Sunil Shetty',
  pipeline: 'Health',
  mobile: '98450 77120',
  email: 'sunil.s@example.in',
  source: 'Referred by a referrer',
  referrer: { initials: 'MK', name: 'Manjunath K' },
  priority: 'Medium',
  interests: ['Health', 'Life and Term'],
  followUp: '28-10-2026',
  time: '11:00 AM',
}
export const pipelines = ['Health', 'Motor', 'Life and Term', 'Travel']
export const leadSources = ['Referred by a referrer', 'Walk-in', 'Phone call', 'Website form', 'Meta Ads', 'Google Ads', 'Existing customer']
export const referrers = ['Manjunath K', 'Anitha Kulkarni', 'Ravi Desai']
export const priorities = ['High', 'Medium', 'Low']
export const interestOptions = ['Health', 'Motor', 'Life and Term', 'Travel']
export const times = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM']
export const duplicate = {
  title: 'Anitha Kulkarni (CU-000320) already uses this mobile.',
  text: 'Families often share a phone. Save anyway if this is a different person.',
}
export const leadAfterSave = [
  ['Lead is created as New', 'LD-2610-00053'],
  ['Work it: contact, qualify', 'Follow-ups create tasks'],
  ['Convert to customer', 'Or mark lost with a reason'],
  ['Quote, sell and renew', 'Best fit → quotation → policy'],
]

export const convertLead = {
  name: 'Anand Kulkarni',
  initials: 'AK',
  id: 'LD-2610-00046',
  referredBy: 'Referred by Anitha Kulkarni',
  dob: '11-03-1980',
  gender: 'Male',
  mobile: '98450 77120',
  email: 'anand.k@example.in',
  preferred: 'WhatsApp',
  city: 'Hubballi',
  pin: '580020',
}
export const convertChoices = [
  { key: 'new', title: 'Create a new customer for Anand', text: 'His own record. Anitha stays as she is.' },
  { key: 'link', title: 'Link to Anitha Kulkarni', text: 'Use this if Anand is actually Anitha’s record.' },
]
export const convertOutcomes = [
  'Lead moves to Converted and closes',
  'Open follow-up tasks are cancelled',
  'Consent from the lead carries over',
  'You land on the new customer',
]

export const genders = ['Male', 'Female', 'Other']
export const contactPrefs = ['WhatsApp', 'Phone call', 'Email', 'SMS']
export const states = ['Karnataka', 'Kerala', 'Tamil Nadu', 'Maharashtra', 'Goa']

export const newCustomer = {
  name: 'Lakshmi Iyer',
  dob: '14-08-1988',
  gender: 'Female',
  mobile: '99001 12233',
  email: 'lakshmi.i@example.in',
  preferred: 'Phone call',
  occupation: 'Architect',
  address: '7, Temple Street, Malleshwaram',
  city: 'Bengaluru',
  state: 'Karnataka',
  pin: '560003',
}
export const customerAfterSave = [
  ['Customer created', 'CU-000323'],
  ['Record consent', 'Personal data and messages'],
  ['Add family and documents', 'Aadhaar, PAN, vehicles'],
  ['Run Best fit or quote', 'Then pay, propose, issue'],
]
