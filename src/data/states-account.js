// Account and subscription state mock data (Figma A1–A9)
export const account = {
  name: 'Suresh Rao',
  mobile: '98450 12345',
  mobileFull: '+91 98450 12345',
  email: 'suresh.rao@example.in',
  agency: 'Rao Insurance Services',
}
export const wrongCode = ['4', '8', '2', '7', '1', '9']
export const banners = {
  trial: { tone: 'trial', icon: 'clock', text: 'Your free trial ends in 3 days (29 Oct). Choose a plan to keep full access.', cta: 'Choose a plan' },
  grace: { tone: 'grace', icon: 'alert', text: 'Your Premium plan ended on 24 Oct. Full access continues until 31 Oct (grace period). Renew to avoid read-only mode.', cta: 'Renew plan' },
  expired: { tone: 'expired', icon: 'lock', text: 'Your subscription has ended. You can view and export records, but you can’t create, edit or send anything until you renew.', cta: 'Renew plan' },
}
