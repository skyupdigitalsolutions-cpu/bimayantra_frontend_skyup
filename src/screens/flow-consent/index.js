import RecordConsent from './RecordConsent'
import ConsentRecorded from './ConsentRecorded'
import ConsentProof from './ConsentProof'
import WithdrawConsent from './WithdrawConsent'
import ConsentWithdrawn from './ConsentWithdrawn'
import WithdrawPersonalDataConsent from './WithdrawPersonalDataConsent'
import PersonalDataConsentWithdrawn from './PersonalDataConsentWithdrawn'

// Screens for this section. Each entry: { id, name, figma, path, Component }
export default [
  { id: 'CS1', name: 'CS1 · Record consent', figma: '245:18821', path: '/x/cs1-record-consent', Component: RecordConsent },
  { id: 'CS2', name: 'CS2 · Consent recorded', figma: '245:19182', path: '/x/cs2-consent-recorded', Component: ConsentRecorded },
  { id: 'CS3', name: 'CS3 · Consent proof', figma: '245:19500', path: '/x/cs3-consent-proof', Component: ConsentProof },
  { id: 'CS4', name: 'CS4 · Withdraw consent', figma: '245:19854', path: '/x/cs4-withdraw-consent', Component: WithdrawConsent },
  { id: 'CS5', name: 'CS5 · Consent withdrawn', figma: '245:20186', path: '/x/cs5-consent-withdrawn', Component: ConsentWithdrawn },
  { id: 'CS6', name: 'CS6 · Withdraw personal-data consent', figma: '245:20499', path: '/x/cs6-withdraw-personal-data-consent', Component: WithdrawPersonalDataConsent },
  { id: 'CS7', name: 'CS7 · Personal-data consent withdrawn', figma: '245:20833', path: '/x/cs7-personal-data-consent-withdrawn', Component: PersonalDataConsentWithdrawn },
]
