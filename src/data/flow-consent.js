// Mock data for the consent flow (CS1–CS7), transcribed from Figma.

export const holder = {
  name: 'Kavya Hegde',
  initials: 'KH',
  meta: 'CU-000318 · 34 years · Bengaluru',
  about: 'Software engineer · prefers calls after 6 pm',
}

// Default customer-tab counts (null = no badge)
export const tabCounts = { family: 3, documents: 3, quotations: 3, policies: 2, renewals: 1 }

export const heroStats = [
  ['Policies', '2'],
  ['Open quotes', '2'],
  ['Renewal in', '38 days'],
]

// status: given | withdrawn | none
export const consentRows = [
  { key: 'kavya', initials: 'KH', name: 'Kavya', rel: 'Self', av: '#fbd5dd', whatsapp: 'given', email: 'given', sms: 'none' },
  { key: 'arjun', initials: 'AH', name: 'Arjun', rel: 'Spouse', av: '#d9eafd', whatsapp: 'withdrawn', email: 'none', sms: 'none' },
  { key: 'anya', initials: 'AH', name: 'Anya', rel: 'Daughter', av: '#d4f1e7', whatsapp: 'none', email: 'none', sms: 'none' },
  { key: 'shanta', initials: 'SH', name: 'Shanta', rel: 'Mother', av: '#fde8c9', whatsapp: 'given', email: 'none', sms: 'none' },
]

export const consentHistory = [
  ['WhatsApp withdrawn · Arjun', '12 Oct · replied STOP'],
  ['WhatsApp given · Shanta', '05 Sep · by phone · Priya'],
  ['Email given · Kavya', '04 Sep · signed form'],
  ['Personal data consent', '02 Sep · signed form'],
]
