import CampaignsOverview from './CampaignsOverview'
import CampaignDetail from './CampaignDetail'
import ConnectMetaSignIn from './ConnectMetaSignIn'
import ConnectMetaAccount from './ConnectMetaAccount'
import ConnectMetaMapFields from './ConnectMetaMapFields'
import ConnectMetaLeadSettings from './ConnectMetaLeadSettings'
import ConnectMetaConnected from './ConnectMetaConnected'
import ConnectGoogleAccount from './ConnectGoogleAccount'
import ConnectGoogleMapFields from './ConnectGoogleMapFields'
import ConnectWebsiteMethod from './ConnectWebsiteMethod'
import ConnectWebsiteTestLead from './ConnectWebsiteTestLead'
import LeadFromMetaAds from './LeadFromMetaAds'
import CampaignsMetaReconnect from './CampaignsMetaReconnect'
import MetaCampaignLeads from './MetaCampaignLeads'
import GoogleCampaignLeads from './GoogleCampaignLeads'
import WebsiteFormLeads from './WebsiteFormLeads'
import ConnectionGuide from './ConnectionGuide'

// Screens for this section. Each entry: { id, name, figma, path, Component }
export default [
  { id: 'CA1', name: 'CA1 · Campaigns — Overview', figma: '298:38324', path: '/campaigns', Component: CampaignsOverview },
  { id: 'CA2', name: 'CA2 · Campaign detail', figma: '298:40033', path: '/x/ca2-campaign-detail', Component: CampaignDetail },
  { id: 'CN1', name: 'CN1 · Connect Meta Ads — Sign in', figma: '299:39522', path: '/x/cn1-connect-meta-ads-sign-in', Component: ConnectMetaSignIn },
  { id: 'CN2', name: 'CN2 · Connect Meta Ads — Account and forms', figma: '299:39909', path: '/x/cn2-connect-meta-ads-account-and-forms', Component: ConnectMetaAccount },
  { id: 'CN3', name: 'CN3 · Connect Meta Ads — Map fields', figma: '299:40330', path: '/x/cn3-connect-meta-ads-map-fields', Component: ConnectMetaMapFields },
  { id: 'CN4', name: 'CN4 · Connect Meta Ads — Lead settings', figma: '299:40797', path: '/x/cn4-connect-meta-ads-lead-settings', Component: ConnectMetaLeadSettings },
  { id: 'CN5', name: 'CN5 · Connect Meta Ads — Connected', figma: '299:41223', path: '/x/cn5-connect-meta-ads-connected', Component: ConnectMetaConnected },
  { id: 'CN6', name: 'CN6 · Connect Google Ads — Sign in and account', figma: '299:41617', path: '/x/cn6-connect-google-ads-sign-in-and-account', Component: ConnectGoogleAccount },
  { id: 'CN7', name: 'CN7 · Connect Google Ads — Map fields', figma: '299:42028', path: '/x/cn7-connect-google-ads-map-fields', Component: ConnectGoogleMapFields },
  { id: 'CN8', name: 'CN8 · Connect website — Choose method', figma: '300:40763', path: '/x/cn8-connect-website-choose-method', Component: ConnectWebsiteMethod },
  { id: 'CN9', name: 'CN9 · Connect website — Test lead received', figma: '300:41170', path: '/x/cn9-connect-website-test-lead-received', Component: ConnectWebsiteTestLead },
  { id: 'CL1', name: 'CL1 · Lead from Meta Ads (auto-created)', figma: '300:41547', path: '/x/cl1-lead-from-meta-ads-auto-created', Component: LeadFromMetaAds },
  { id: 'CA1b', name: 'CA1b · Campaigns — Meta reconnect needed', figma: '300:41742', path: '/x/ca1b-campaigns-meta-reconnect-needed', Component: CampaignsMetaReconnect },
  { id: 'CC1', name: 'CC1 · Meta Ads — Campaign leads and answers', figma: '305:40638', path: '/x/cc1-meta-ads-campaign-leads-and-answers', Component: MetaCampaignLeads },
  { id: 'CC2', name: 'CC2 · Google Ads — Campaign leads and answers', figma: '305:40941', path: '/x/cc2-google-ads-campaign-leads-and-answers', Component: GoogleCampaignLeads },
  { id: 'CC3', name: 'CC3 · Website — Form leads and answers', figma: '305:41229', path: '/x/cc3-website-form-leads-and-answers', Component: WebsiteFormLeads },
  { id: 'CG1', name: 'Campaigns — Connection guide', figma: null, path: '/campaigns/guide', Component: ConnectionGuide },
]
