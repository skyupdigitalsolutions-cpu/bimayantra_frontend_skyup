import A1LoginMobileNumber from './A1LoginMobileNumber'
import A2LoginWrongOrExpiredCode from './A2LoginWrongOrExpiredCode'
import A3LoginNumberLocked from './A3LoginNumberLocked'
import A4SignUpStartFreeTrial from './A4SignUpStartFreeTrial'
import A5AccountSuspended from './A5AccountSuspended'
import A6AccountClosed from './A6AccountClosed'
import A7SubscriptionTrialEnding from './A7SubscriptionTrialEnding'
import A8SubscriptionGracePeriod from './A8SubscriptionGracePeriod'
import A9SubscriptionExpiredReadOnly from './A9SubscriptionExpiredReadOnly'

// Screens for this section. Each entry: { id, name, figma, path, Component }
export default [
  { id: 'A1', name: 'A1 · Login — Mobile number', figma: '281:26934', path: '/x/a1-login-mobile-number', Component: A1LoginMobileNumber },
  { id: 'A2', name: 'A2 · Login — Wrong or expired code', figma: '281:27045', path: '/x/a2-login-wrong-or-expired-code', Component: A2LoginWrongOrExpiredCode },
  { id: 'A3', name: 'A3 · Login — Number locked', figma: '281:27172', path: '/x/a3-login-number-locked', Component: A3LoginNumberLocked },
  { id: 'A4', name: 'A4 · Sign up — Start free trial', figma: '281:27273', path: '/x/a4-sign-up-start-free-trial', Component: A4SignUpStartFreeTrial },
  { id: 'A5', name: 'A5 · Account suspended', figma: '281:27404', path: '/x/a5-account-suspended', Component: A5AccountSuspended },
  { id: 'A6', name: 'A6 · Account closed', figma: '281:27509', path: '/x/a6-account-closed', Component: A6AccountClosed },
  { id: 'A7', name: 'A7 · Subscription — Trial ending', figma: '281:27613', path: '/x/a7-subscription-trial-ending', Component: A7SubscriptionTrialEnding },
  { id: 'A8', name: 'A8 · Subscription — Grace period', figma: '281:28246', path: '/x/a8-subscription-grace-period', Component: A8SubscriptionGracePeriod },
  { id: 'A9', name: 'A9 · Subscription — Expired (read-only)', figma: '281:28879', path: '/x/a9-subscription-expired-read-only', Component: A9SubscriptionExpiredReadOnly },
]
