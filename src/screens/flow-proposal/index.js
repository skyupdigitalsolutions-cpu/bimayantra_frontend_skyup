// Screens for this section. Each entry: { id, name, figma, path, Component }
import Members from './Members'
import Declarations from './Declarations'
import Nominees from './Nominees'
import KycCheck from './KycCheck'
import Premium from './Premium'
import ReviewAndSubmit from './ReviewAndSubmit'
import Submitted from './Submitted'

export default [
  { id: 'R1', name: 'R1 · Proposal — Members', figma: '45:5821', path: '/x/r1-proposal-members', Component: Members },
  { id: 'R2', name: 'R2 · Proposal — Declarations', figma: '45:6025', path: '/x/r2-proposal-declarations', Component: Declarations },
  { id: 'R3', name: 'R3 · Proposal — Nominees', figma: '45:6259', path: '/x/r3-proposal-nominees', Component: Nominees },
  { id: 'R4', name: 'R4 · Proposal — KYC check', figma: '45:6474', path: '/x/r4-proposal-kyc-check', Component: KycCheck },
  { id: 'R5', name: 'R5 · Proposal — Premium', figma: '45:6674', path: '/x/r5-proposal-premium', Component: Premium },
  { id: 'R6', name: 'R6 · Proposal — Review and submit', figma: '45:6881', path: '/x/r6-proposal-review-and-submit', Component: ReviewAndSubmit },
  { id: 'R7', name: 'R7 · Proposal — Submitted', figma: '45:7141', path: '/x/r7-proposal-submitted', Component: Submitted },
]
