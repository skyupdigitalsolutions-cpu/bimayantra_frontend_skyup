// Which screens are connected to the API. Everything listed here is guarded (sign-in required) and replaces the
// prototype frame at the same path; prototype links that point at a connected flow are redirected to it.
import LiveLogin from '../screens/auth/LiveLogin'
import LiveDashboard from './Dashboard'
import LiveLeadDetail from './LeadDetail'
import { LiveLeadsBoard, LiveLeadsList, LiveLeadForm, LiveConvertLead } from './Leads'
import { LiveCustomers, LiveCustomerProfile } from './Customers'
import { LiveCustomerFamily, LiveCustomerConsent, LiveCustomerDocuments, LiveCustomerVehicles, LiveCustomerQuotations, LiveCustomerPolicies, LiveCustomerPayments, LiveCustomerRenewals, LiveCustomerActivities } from './CustomerTabs'
import LiveCustomerForm from './CustomerForm'
import { LiveAllTasks, LiveNotifications } from './Records'
import { LivePolicies, LivePolicyDetail, LiveRenewals, LiveCommunications } from './AfterSale'
import { LiveProducts, LiveProductDetail, LiveQuotations, LiveQuotationDetail, LiveProposals, LiveProposalDetail } from './Deals'
import { LiveProfile, LiveKyc, LiveInsurers, LiveBilling, LiveWallet, LiveAssistants, LiveReferrers, LiveSupportAccess, LiveExport, LiveActivityLog, LiveSecurity } from './Settings'
import { LiveCampaigns, LiveCampaignDetail } from './Campaigns'
import LiveBestFit from './BestFit'
import LiveQuotationWizard from './QuotationWizard'
import LiveProposalWizard from './ProposalWizard'
import { LiveRecordIssuedPolicy, LiveRecordExistingPolicy } from './PolicyRecords'
import LiveDocumentsLibrary from './DocumentsLibrary'
import LiveFeatureTable from './FeatureTable'
import { PublicQuotation, PublicReferral } from './PublicPages'
import LiveReferrerDashboard from './Referrer'
import { LiveAddProduct, LivePriceVersions, LiveCompareVariants } from './MyProducts'
import { LiveComparisons, LiveNewComparison, LiveComparison, PublicComparison } from './Comparisons'
import { LiveCampaignSetup } from './CampaignSetup'
import PublicWebsiteForm from './PublicForm'
import { AdminHome, AdminAccounts, AdminAccountDetail, AdminKyc, AdminApprovals, AdminCorrections, AdminTemplates, AdminUsers, AdminConfig, AdminAudit, AdminFlags, AdminSupport, AdminCatalogue, AdminProduct } from './Admin'
import { matchPath } from 'react-router-dom'

const ADVISOR = ['ADV', 'AST']

/** Public pages (no sign-in) */
export const PUBLIC_ROUTES = [
  { path: '/login', element: <LiveLogin mode="login" /> },
  { path: '/signup', element: <LiveLogin mode="signup" /> },
  { path: '/q/:token', element: <PublicQuotation /> },
  { path: '/c/:token', element: <PublicComparison /> },
  { path: '/forms/:key', element: <PublicWebsiteForm /> },
  { path: '/r/:code', element: <PublicReferral /> },
]

/** Connected pages (sign-in required; roles = who may open them) */
export const LIVE_ROUTES = [
  { path: '/', element: <LiveDashboard />, roles: ADVISOR },
  { path: '/leads', element: <LiveLeadsBoard />, roles: ADVISOR },
  { path: '/leads/list', element: <LiveLeadsList />, roles: ADVISOR },
  { path: '/leads/new', element: <LiveLeadForm mode="new" />, roles: ADVISOR },
  { path: '/leads/:id', element: <LiveLeadDetail />, roles: ADVISOR },
  { path: '/leads/:id/edit', element: <LiveLeadForm mode="edit" />, roles: ADVISOR },
  { path: '/leads/:id/convert', element: <LiveConvertLead />, roles: ADVISOR },
  { path: '/customers', element: <LiveCustomers />, roles: ADVISOR },
  { path: '/customers/new', element: <LiveCustomerForm mode="new" />, roles: ADVISOR },
  { path: '/customers/:id', element: <LiveCustomerProfile />, roles: ADVISOR },
  { path: '/customers/:id/edit', element: <LiveCustomerForm mode="edit" />, roles: ADVISOR },
  { path: '/customers/:id/family', element: <LiveCustomerFamily />, roles: ADVISOR },
  { path: '/customers/:id/consent', element: <LiveCustomerConsent />, roles: ADVISOR },
  { path: '/customers/:id/documents', element: <LiveCustomerDocuments />, roles: ADVISOR },
  { path: '/customers/:id/vehicles', element: <LiveCustomerVehicles />, roles: ADVISOR },
  { path: '/customers/:id/quotations', element: <LiveCustomerQuotations />, roles: ADVISOR },
  { path: '/customers/:id/policies', element: <LiveCustomerPolicies />, roles: ADVISOR },
  { path: '/customers/:id/payments', element: <LiveCustomerPayments />, roles: ADVISOR },
  { path: '/customers/:id/renewals', element: <LiveCustomerRenewals />, roles: ADVISOR },
  { path: '/customers/:id/activities', element: <LiveCustomerActivities />, roles: ADVISOR },
  { path: '/tasks', element: <LiveAllTasks />, roles: ADVISOR },
  { path: '/notifications', element: <LiveNotifications /> },
  { path: '/products', element: <LiveProducts />, roles: ADVISOR },
  { path: '/products/feature-table', element: <LiveFeatureTable />, roles: ADVISOR },
  { path: '/products/new', element: <LiveAddProduct />, roles: ['ADV'] },
  { path: '/products/:id/prices', element: <LivePriceVersions />, roles: ['ADV'] },
  { path: '/products/:id/variants', element: <LiveCompareVariants />, roles: ADVISOR },
  { path: '/products/:id', element: <LiveProductDetail />, roles: ADVISOR },
  { path: '/quotations', element: <LiveQuotations />, roles: ADVISOR },
  { path: '/quotations/new', element: <LiveQuotationWizard mode="new" />, roles: ADVISOR },
  { path: '/quotations/:id/edit', element: <LiveQuotationWizard mode="edit" />, roles: ADVISOR },
  { path: '/quotations/:id', element: <LiveQuotationDetail />, roles: ADVISOR },
  { path: '/comparisons', element: <LiveComparisons />, roles: ADVISOR },
  { path: '/comparisons/new', element: <LiveNewComparison />, roles: ADVISOR },
  { path: '/comparisons/:id', element: <LiveComparison />, roles: ADVISOR },
  { path: '/proposals', element: <LiveProposals />, roles: ADVISOR },
  { path: '/proposals/:id/edit', element: <LiveProposalWizard />, roles: ADVISOR },
  { path: '/proposals/:id', element: <LiveProposalDetail />, roles: ADVISOR },
  { path: '/policies', element: <LivePolicies />, roles: ADVISOR },
  { path: '/policies/:id', element: <LivePolicyDetail />, roles: ADVISOR },
  { path: '/policies/:id/issue', element: <LiveRecordIssuedPolicy />, roles: ADVISOR },
  { path: '/customers/:id/policies/new', element: <LiveRecordExistingPolicy />, roles: ADVISOR },
  { path: '/documents', element: <LiveDocumentsLibrary />, roles: ADVISOR },
  { path: '/renewals', element: <LiveRenewals />, roles: ADVISOR },
  { path: '/communications', element: <LiveCommunications />, roles: ADVISOR },
  { path: '/best-fit', element: <LiveBestFit />, roles: ADVISOR },
  { path: '/campaigns', element: <LiveCampaigns />, roles: ADVISOR },
  { path: '/campaigns/setup/:id', element: <LiveCampaignSetup />, roles: ['ADV'] },
  { path: '/campaigns/:id', element: <LiveCampaignDetail />, roles: ADVISOR },
  // Settings: advisor only (assistants have no settings access)
  // SkyUp Admin (22–24, AA1–AA13, AD1, ADa–ADc)
  { path: '/admin', element: <AdminHome />, roles: ['ADM', 'STF'] },
  { path: '/admin/accounts', element: <AdminAccounts />, roles: ['ADM', 'STF'] },
  { path: '/admin/accounts/:id', element: <AdminAccountDetail />, roles: ['ADM', 'STF'] },
  { path: '/admin/kyc', element: <AdminKyc />, roles: ['ADM', 'STF'] },
  { path: '/admin/kyc/:id', element: <AdminKyc />, roles: ['ADM', 'STF'] },
  { path: '/admin/approvals', element: <AdminApprovals />, roles: ['ADM', 'STF'] },
  { path: '/admin/corrections', element: <AdminCorrections />, roles: ['ADM', 'STF'] },
  { path: '/admin/templates', element: <AdminTemplates />, roles: ['ADM', 'STF'] },
  { path: '/admin/users', element: <AdminUsers />, roles: ['ADM', 'STF'] },
  { path: '/admin/config', element: <AdminConfig />, roles: ['ADM', 'STF'] },
  { path: '/admin/audit', element: <AdminAudit />, roles: ['ADM', 'STF'] },
  { path: '/admin/flags', element: <AdminFlags />, roles: ['ADM', 'STF'] },
  { path: '/admin/support', element: <AdminSupport />, roles: ['ADM', 'STF'] },
  { path: '/admin/catalogue', element: <AdminCatalogue />, roles: ['ADM', 'STF'] },
  { path: '/admin/catalogue/products/:id', element: <AdminProduct />, roles: ['ADM', 'STF'] },
  // Referrer portal (21)
  { path: '/referrer', element: <LiveReferrerDashboard />, roles: ['REF'] },
  { path: '/settings', element: <LiveProfile />, roles: ['ADV'] },
  { path: '/settings/kyc', element: <LiveKyc />, roles: ['ADV'] },
  { path: '/settings/insurers', element: <LiveInsurers />, roles: ['ADV'] },
  { path: '/settings/billing', element: <LiveBilling />, roles: ['ADV'] },
  { path: '/settings/wallet', element: <LiveWallet />, roles: ['ADV'] },
  { path: '/settings/assistants', element: <LiveAssistants />, roles: ['ADV'] },
  { path: '/settings/referrers', element: <LiveReferrers />, roles: ['ADV'] },
  { path: '/settings/support', element: <LiveSupportAccess />, roles: ['ADV'] },
  { path: '/settings/export', element: <LiveExport />, roles: ['ADV'] },
  { path: '/settings/activity', element: <LiveActivityLog />, roles: ['ADV'] },
  { path: '/settings/security', element: <LiveSecurity /> },
]

/** Prototype frame → connected page (query string is kept). Add ?proto=1 to see the frame itself. */
export const REDIRECTS = {
  '/x/a4-sign-up-start-free-trial': '/signup',
  '/x/02b-leads-list': '/leads/list',
  '/x/02c-leads-list-filtered-by-source': '/leads/list?source=meta',
  '/x/r4-leads-mobile-list': '/leads/list',
  '/x/f1-new-lead': '/leads/new',
  '/x/f1b-new-lead-lead-source-options': '/leads/new',
  '/x/r5-new-lead-mobile-form': '/leads/new',
  '/x/17-settings-plan-and-billing': '/settings/billing',
  '/x/s03-settings-kyc': '/settings/kyc',
  '/x/s04-settings-my-insurers': '/settings/insurers',
  '/x/s05-settings-whatsapp-wallet': '/settings/wallet',
  '/x/s06-settings-assistants': '/settings/assistants',
  '/x/s07-settings-referrers': '/settings/referrers',
  '/x/s08-settings-support-access': '/settings/support',
  '/x/s09-settings-export-my-data': '/settings/export',
  '/x/s10-settings-activity-log': '/settings/activity',
  '/x/s11-settings-security': '/settings/security',
  '/x/n1-renewal-detail': '/renewals',
  '/x/ca2-campaign-detail': '/campaigns',
  // State frames whose behaviour now lives inside a connected page (dialogs, chips, toasts)
  '/x/ls1-lead-change-status': '/leads', '/x/ls2-lead-log-contact': '/leads', '/x/ls3-lead-mark-as-lost': '/leads', '/x/ls4-lead-lost': '/leads', '/x/ls5-lead-reopen': '/leads', '/x/ls6-lead-converted': '/leads',
  '/x/le1-edit-lead': '/leads', '/x/f2-convert-lead-to-customer': '/leads',
  '/x/tk1-add-task-empty': '/tasks', '/x/tk2-add-task-validation-errors': '/tasks', '/x/tk3-task-created': '/tasks', '/x/tk4-edit-task': '/tasks', '/x/tk5-task-completed': '/tasks', '/x/tk6-reschedule-task': '/tasks',
  '/x/a1-login-mobile-number': '/login', '/x/a2-login-wrong-or-expired-code': '/login', '/x/a3-login-number-locked': '/login', '/x/a5-account-suspended': '/login', '/x/a6-account-closed': '/login',
  '/x/qs1-quotation-ready-not-shared': '/quotations', '/x/qs2-quotation-share': '/quotations', '/x/qs3-quotation-mark-rejected': '/quotations', '/x/qs4-quotation-rejected': '/quotations',
  '/x/qs5-quotation-expired': '/quotations', '/x/qs6-quotation-cancel': '/quotations', '/x/qs7-quotation-cancelled': '/quotations', '/x/qs8-quotation-revise': '/quotations', '/x/qs9-quotation-delete-draft': '/quotations',
  '/x/08a-quotation-detail-record-payment': '/quotations', '/x/08b-quotation-detail-payment-successful': '/quotations', '/x/08c-quotation-detail-accepted': '/quotations',
  '/x/p1-payment-add-payment-link': '/quotations', '/x/p2-payment-record-payment': '/quotations', '/x/p3-payment-recorded': '/quotations',
  '/x/prd-proposal-mark-declined': '/proposals', '/x/prd2-proposal-declined': '/proposals',
  '/x/po1-policy-record-cancellation': '/policies', '/x/po2-policy-cancelled': '/policies', '/x/po3-policy-expired': '/policies', '/x/po4-policy-renewed': '/policies', '/x/l2-policy-issued': '/policies',
  '/x/rs1-renewal-in-follow-up': '/renewals', '/x/rs2-renewal-not-renewing': '/renewals', '/x/rs3-renewal-reopen': '/renewals', '/x/rs4-renewal-lapsed': '/renewals', '/x/rs5-renewal-pause-reminders': '/renewals',
  '/x/n2-renewal-log-contact': '/renewals', '/x/n3-renewal-not-renewing': '/renewals', '/x/n4-renewal-renewed': '/renewals',
  '/x/cm1-communications-scheduled': '/communications', '/x/cm2-communications-sent': '/communications', '/x/cm4-cancel-scheduled-message': '/communications',
  '/x/ky1-kyc-not-submitted': '/settings/kyc', '/x/ky2-kyc-verified': '/settings/kyc', '/x/ky3-kyc-rejected': '/settings/kyc',
  '/x/in1-my-insurers-add-insurer': '/settings/insurers', '/x/in2-my-insurers-deactivate': '/settings/insurers', '/x/in3-my-insurers-inactive-insurer': '/settings/insurers',
  '/x/sa1-support-access-give-access': '/settings/support', '/x/ex1-export-ready-to-download': '/settings/export',
  '/x/wl1-wallet-recharge-pending': '/settings/wallet', '/x/wl2-wallet-recharge-failed': '/settings/wallet',
  '/x/rf1-referrer-new-link': '/settings/referrers', '/x/rf2-referrer-disable': '/settings/referrers', '/x/rf3-referrer-disabled': '/settings/referrers',
  '/x/as1-assistant-disable': '/settings/assistants', '/x/as2-assistant-disabled': '/settings/assistants',
  '/x/aa7-advisor-suggest-correction': '/products',
  // Batch 2 · customer profile tabs, new/edit customer, deactivate (old frame links open the connected pages)
  '/x/f3-new-customer': '/customers/new', '/x/pe1-edit-details': '/customers', '/x/cu1-policy-holder-deactivate-blocked': '/customers', '/x/cu2-policy-holder-inactive': '/customers',
  '/x/05a-customer-family': '/customers', '/x/05b-customer-consent': '/customers', '/x/05c-customer-documents': '/customers', '/x/05d-customer-vehicles': '/customers',
  '/x/05e-customer-quotations': '/customers', '/x/05f-customer-policies': '/customers', '/x/05g-customer-payments': '/customers', '/x/05h-customer-renewals': '/customers', '/x/05i-customer-activities': '/customers',
  // Batches 3, 3b, 4, 5, R · customer profile actions are dialogs on the connected tabs now
  '/x/fd1-add-family-member': '/customers', '/x/fd2-family-member-added': '/customers', '/x/fd3-add-document-whose-document': '/customers', '/x/fd4-add-document-which-document': '/customers', '/x/fd5-add-document-upload': '/customers', '/x/fd6-arjun-hegde-documents': '/customers', '/x/pf3-edit-family-member': '/customers', '/x/pd1-check-document-values': '/customers', '/x/pd2-document-versions': '/customers', '/x/fm1-family-member-inactive': '/customers', '/x/dl1-document-change-label': '/customers', '/x/pf1-change-default-nominee': '/customers', '/x/pf2-link-a-policy-holder': '/customers', '/x/cs1-record-consent': '/customers', '/x/cs2-consent-recorded': '/customers', '/x/cs3-consent-proof': '/customers', '/x/cs4-withdraw-consent': '/customers', '/x/cs5-consent-withdrawn': '/customers', '/x/cs6-withdraw-personal-data-consent': '/customers', '/x/cs7-personal-data-consent-withdrawn': '/customers', '/x/pv1-add-vehicle': '/customers', '/x/pv2-vehicle-added': '/customers', '/x/vh1-vehicle-mark-inactive': '/customers', '/x/pe2-pan-shown-30-seconds': '/customers', 
  // Batches 1 and 1b · the wizard is /quotations/new; payment states are dialogs on the quotation
  '/x/q1-quotation-customer': '/quotations/new', '/x/q2-quotation-type': '/quotations/new', '/x/q3-quotation-insurance': '/quotations/new', '/x/q4-quotation-insurer': '/quotations/new', '/x/q5-quotation-product': '/quotations/new', '/x/q6-quotation-details': '/quotations/new', '/x/q7-quotation-riders': '/quotations/new', '/x/q8-quotation-premium': '/quotations/new', '/x/q9-quotation-discount': '/quotations/new', '/x/q10-quotation-review': '/quotations/new', '/x/q11-quotation-generated': '/quotations/new', '/x/07-quotation-wizard-step-6': '/quotations/new',
  '/x/py1-payment-mark-failed': '/quotations', '/x/py2-payment-failed': '/quotations', '/x/py3-payment-link-expired': '/quotations', '/x/py4-payment-reverse-undo': '/quotations', '/x/py5-payment-reversed': '/quotations',
  // Batches 6 and 7b · the proposal wizard is /proposals/:id/edit; cancel is a dialog
  '/x/r1-proposal-members': '/proposals', '/x/r2-proposal-declarations': '/proposals', '/x/r3-proposal-nominees': '/proposals', '/x/r4-proposal-kyc-check': '/proposals', '/x/r5-proposal-premium': '/proposals', '/x/r6-proposal-review-and-submit': '/proposals', '/x/r7-proposal-submitted': '/proposals', '/x/09-proposal-nominees': '/proposals', '/x/prc-proposal-cancel': '/proposals',
  // Batch 8 · frames that already work in a connected page
  '/x/10d-feature-table-health-all': '/products/feature-table', '/x/10d-feature-table-health-verified': '/products/feature-table', '/x/10d-feature-table-health-my-products': '/products/feature-table',
  '/x/10d-feature-table-motor-all': '/products/feature-table', '/x/10d-feature-table-motor-my-products': '/products/feature-table', '/x/10d-feature-table-life-and-term-all': '/products/feature-table',
  '/x/10d-feature-table-life-and-term-my-products': '/products/feature-table', '/x/10d-feature-table-travel-all': '/products/feature-table', '/x/10d-feature-table-travel-my-products': '/products/feature-table',
  '/x/l1-record-issued-policy': '/policies', '/x/pp1-edit-policy-nominees': '/policies', '/x/pp2-record-existing-policy': '/customers',
  '/x/n1b-renewal-quotation': '/renewals', '/x/n1c-renewal-quotation-ready': '/renewals', '/x/rn0-renewal-how-to-renew': '/renewals',
  '/x/rnb1-renewal-new-quotation-product': '/renewals', '/x/rnb2-renewal-new-quotation-details-and-premium': '/renewals', '/x/rnb3-renewal-new-quotation-review': '/renewals', '/x/rnb4-renewal-new-quotation-ready': '/renewals',
  '/x/a7-subscription-trial-ending': '/settings/billing', '/x/a8-subscription-grace-period': '/settings/billing', '/x/a9-subscription-expired-read-only': '/settings/billing',
  '/x/qx1-public-quotation-link-expired-or-invalid': '/q/expired', '/x/rx1-referral-link-expired-or-revoked': '/r/expired',
  '/x/r1-dashboard-tablet-834': '/', '/x/r2-dashboard-mobile-390': '/', '/x/r3-add-task-mobile-bottom-sheet': '/tasks',
  '/x/cm3-message-detail': '/communications', '/x/pa1-activities-payments-filter': '/customers',
  // SkyUp Admin
  '/x/23-skyup-admin-approvals': '/admin/approvals', '/x/24-skyup-admin-advisor-kyc': '/admin/kyc',
  '/x/aa1-admin-advisor-accounts': '/admin/accounts', '/x/aa2-admin-account-detail': '/admin/accounts', '/x/aa3-admin-suspend-account': '/admin/accounts', '/x/aa4-admin-record-subscription-payment': '/admin/accounts',
  '/x/aa5-admin-reject-kyc': '/admin/kyc', '/x/aa6-admin-product-corrections': '/admin/corrections', '/x/aa8-admin-message-templates': '/admin/templates', '/x/aa9-admin-skyup-users': '/admin/users',
  '/x/aa10-admin-configuration': '/admin/config', '/x/aa11-admin-audit-log': '/admin/audit', '/x/aa12-admin-agent-code-flags': '/admin/flags', '/x/aa13-admin-support-access': '/admin/support',
  '/x/ad1-skyup-admin-catalogue-product-published': '/admin/catalogue', '/x/ada-skyup-admin-add-product-reading-brochure': '/admin/catalogue', '/x/adb-skyup-admin-review-extracted-values': '/admin/catalogue', '/x/adc-skyup-admin-review-and-send-for-approval': '/admin/catalogue',
  // Advisor side of a new SkyUp product: the dashboard catalogue card and the Products list show it
  '/x/01b-dashboard-new-product-from-skyup': '/', '/x/10e-products-new-from-skyup': '/products',
  // Batch 9 · add my product, price versions, compare variants
  '/x/ap1-add-product-category': '/products/new', '/x/ap2-add-product-company': '/products/new', '/x/ap2b-add-product-brochure-premium': '/products/new', '/x/ap2c-add-product-reading-brochure': '/products/new',
  '/x/ap2d-add-product-brochure-normal-plan': '/products/new', '/x/ap3-add-product-product': '/products/new', '/x/ap3b-add-product-fix-value-launch-date': '/products/new', '/x/ap4-add-product-variants': '/products/new',
  '/x/ap4b-add-product-fix-value-plus-sum-insured': '/products/new', '/x/ap5-add-product-features': '/products/new', '/x/ap5b-add-product-fix-value-opd': '/products/new', '/x/ap5c-add-product-features-ticked-fixed-adding': '/products/new',
  '/x/ap6-add-product-review-and-submit': '/products/new', '/x/ap7-products-published': '/products', '/x/oc1-add-product-brochure-reading-failed': '/products/new',
  '/x/pv1-product-my-price-versions': '/products', '/x/pv2-product-add-price-version': '/products', '/x/10b-products-compare-variants': '/products',
  // Batch 10 · comparisons
  '/x/cq2-comparison-type': '/comparisons', '/x/cq3-comparison-insurance': '/comparisons', '/x/cq4-comparison-options': '/comparisons', '/x/cq5-comparison-details': '/comparisons',
  '/x/cq6-comparison-premiums': '/comparisons', '/x/cq7-comparison-recommend': '/comparisons', '/x/cq8-comparison-review': '/comparisons', '/x/cq9-comparison-generated': '/comparisons',
  '/x/c2-comparison-shared': '/comparisons', '/x/c3-comparison-customer-chose': '/comparisons', '/x/cx1-comparison-expired': '/c/expired',
  // Batch 11 · campaign connect and answers
  '/x/cn1-connect-meta-ads-sign-in': '/campaigns', '/x/cn2-connect-meta-ads-account-and-forms': '/campaigns', '/x/cn3-connect-meta-ads-map-fields': '/campaigns', '/x/cn4-connect-meta-ads-lead-settings': '/campaigns',
  '/x/cn5-connect-meta-ads-connected': '/campaigns', '/x/cn6-connect-google-ads-sign-in-and-account': '/campaigns', '/x/cn7-connect-google-ads-map-fields': '/campaigns', '/x/cn8-connect-website-choose-method': '/campaigns',
  '/x/cn9-connect-website-test-lead-received': '/campaigns', '/x/ca1b-campaigns-meta-reconnect-needed': '/campaigns', '/x/cc1-meta-ads-campaign-leads-and-answers': '/campaigns', '/x/cc2-google-ads-campaign-leads-and-answers': '/campaigns',
  '/x/cc3-website-form-leads-and-answers': '/campaigns', '/x/cl1-lead-from-meta-ads-auto-created': '/leads',
}

/** Paths whose prototype frame is replaced; the frame moves to /proto/<frame id>. */
export const LIVE_PATHS = new Set([...LIVE_ROUTES, ...PUBLIC_ROUTES].map((r) => r.path))
/** True when a prototype frame's path (e.g. /policies/1) is served by a connected page. */
export const isLivePath = (path) => [...LIVE_ROUTES, ...PUBLIC_ROUTES].some((r) => matchPath({ path: r.path, end: true }, path))