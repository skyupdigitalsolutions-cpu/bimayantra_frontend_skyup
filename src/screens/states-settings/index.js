import KY1KYCNotSubmitted from './KY1KYCNotSubmitted'
import KY2KYCVerified from './KY2KYCVerified'
import KY3KYCRejected from './KY3KYCRejected'
import IN1MyInsurersAddInsurer from './IN1MyInsurersAddInsurer'
import IN2MyInsurersDeactivate from './IN2MyInsurersDeactivate'
import IN3MyInsurersInactiveInsurer from './IN3MyInsurersInactiveInsurer'
import PV1ProductMyPriceVersions from './PV1ProductMyPriceVersions'
import PV2ProductAddPriceVersion from './PV2ProductAddPriceVersion'
import SA1SupportAccessGiveAccess from './SA1SupportAccessGiveAccess'
import EX1ExportReadyToDownload from './EX1ExportReadyToDownload'
import WL1WalletRechargePending from './WL1WalletRechargePending'
import WL2WalletRechargeFailed from './WL2WalletRechargeFailed'
import RF1ReferrerNewLink from './RF1ReferrerNewLink'
import RF2ReferrerDisable from './RF2ReferrerDisable'
import RF3ReferrerDisabled from './RF3ReferrerDisabled'
import AS1AssistantDisable from './AS1AssistantDisable'
import AS2AssistantDisabled from './AS2AssistantDisabled'

// Screens for this section. Each entry: { id, name, figma, path, Component }
export default [
  { id: 'KY1', name: 'KY1 · KYC — Not submitted', figma: '287:34616', path: '/x/ky1-kyc-not-submitted', Component: KY1KYCNotSubmitted },
  { id: 'KY2', name: 'KY2 · KYC — Verified', figma: '287:34905', path: '/x/ky2-kyc-verified', Component: KY2KYCVerified },
  { id: 'KY3', name: 'KY3 · KYC — Rejected', figma: '287:35164', path: '/x/ky3-kyc-rejected', Component: KY3KYCRejected },
  { id: 'IN1', name: 'IN1 · My insurers — Add insurer', figma: '287:35423', path: '/x/in1-my-insurers-add-insurer', Component: IN1MyInsurersAddInsurer },
  { id: 'IN2', name: 'IN2 · My insurers — Deactivate', figma: '287:35674', path: '/x/in2-my-insurers-deactivate', Component: IN2MyInsurersDeactivate },
  { id: 'IN3', name: 'IN3 · My insurers — Inactive insurer', figma: '287:35898', path: '/x/in3-my-insurers-inactive-insurer', Component: IN3MyInsurersInactiveInsurer },
  { id: 'PV1', name: 'PV1 · Product — My price versions', figma: '287:36177', path: '/x/pv1-product-my-price-versions', Component: PV1ProductMyPriceVersions },
  { id: 'PV2', name: 'PV2 · Product — Add price version', figma: '287:36354', path: '/x/pv2-product-add-price-version', Component: PV2ProductAddPriceVersion },
  { id: 'SA1', name: 'SA1 · Support access — Give access', figma: '287:36713', path: '/x/sa1-support-access-give-access', Component: SA1SupportAccessGiveAccess },
  { id: 'EX1', name: 'EX1 · Export — Ready to download', figma: '287:36946', path: '/x/ex1-export-ready-to-download', Component: EX1ExportReadyToDownload },
  { id: 'WL1', name: 'WL1 · Wallet — Recharge pending', figma: '287:37225', path: '/x/wl1-wallet-recharge-pending', Component: WL1WalletRechargePending },
  { id: 'WL2', name: 'WL2 · Wallet — Recharge failed', figma: '287:37475', path: '/x/wl2-wallet-recharge-failed', Component: WL2WalletRechargeFailed },
  { id: 'RF1', name: 'RF1 · Referrer — New link', figma: '287:37735', path: '/x/rf1-referrer-new-link', Component: RF1ReferrerNewLink },
  { id: 'RF2', name: 'RF2 · Referrer — Disable', figma: '287:37948', path: '/x/rf2-referrer-disable', Component: RF2ReferrerDisable },
  { id: 'RF3', name: 'RF3 · Referrer — Disabled', figma: '287:38161', path: '/x/rf3-referrer-disabled', Component: RF3ReferrerDisabled },
  { id: 'AS1', name: 'AS1 · Assistant — Disable', figma: '287:38431', path: '/x/as1-assistant-disable', Component: AS1AssistantDisable },
  { id: 'AS2', name: 'AS2 · Assistant — Disabled', figma: '287:38648', path: '/x/as2-assistant-disabled', Component: AS2AssistantDisabled },
]
