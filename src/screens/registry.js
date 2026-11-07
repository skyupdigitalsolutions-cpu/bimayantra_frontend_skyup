// Central list of every Figma frame implemented as a route.
// Each section folder exports an array of { id, name, figma, path, Component }.
import Auth from './auth'
import Sales from './sales'
import Catalogue from './catalogue'
import Settings from './settings'
import Public from './public'
import Admin from './admin'
import FlowLead from './flow-lead'
import FlowQuotation from './flow-quotation'
import FlowComparison from './flow-comparison'
import FlowPayment from './flow-payment'
import FlowProposal from './flow-proposal'
import FlowPolicy from './flow-policy'
import CustomerTabs from './customer-tabs'
import FlowAddProduct from './flow-add-product'
import FeatureTable from './feature-table'
import FlowSkyup from './flow-skyup'
import FlowComparative from './flow-comparative'
import FlowFamilyDocs from './flow-family-docs'
import FlowConsent from './flow-consent'
import FlowTabActions from './flow-tab-actions'
import FlowRenewalQuotation from './flow-renewal-quotation'
import Tasks from './tasks'
import Responsive from './responsive'
import StatesAccount from './states-account'
import StatesLead from './states-lead'
import StatesQuotation from './states-quotation'
import StatesProposalPolicy from './states-proposal-policy'
import StatesRecords from './states-records'
import StatesSettings from './states-settings'
import StatesAdmin from './states-admin'
import StatesPublic from './states-public'
import Inventory from './inventory'
import Campaigns from './campaigns'

export const SECTIONS = [
  { title: "Auth and dashboard", screens: Auth },
  { title: "Sales pipeline", screens: Sales },
  { title: "Catalogue and after-sale", screens: Catalogue },
  { title: "Settings and team", screens: Settings },
  { title: "Public pages and referrer", screens: Public },
  { title: "SkyUp Admin", screens: Admin },
  { title: "Flow · Lead to customer", screens: FlowLead },
  { title: "Flow · New quotation", screens: FlowQuotation },
  { title: "Flow · Comparison", screens: FlowComparison },
  { title: "Flow · Record payment", screens: FlowPayment },
  { title: "Flow · Proposal", screens: FlowProposal },
  { title: "Flow · Policy and renewal", screens: FlowPolicy },
  { title: "Customer profile tabs", screens: CustomerTabs },
  { title: "Flow · Add my product", screens: FlowAddProduct },
  { title: "Products — Feature table", screens: FeatureTable },
  { title: "Flow · SkyUp product reaches advisors", screens: FlowSkyup },
  { title: "Flow · Comparative quotation", screens: FlowComparative },
  { title: "Flow · Family members and documents", screens: FlowFamilyDocs },
  { title: "Flow · Policy holder — consent", screens: FlowConsent },
  { title: "Flow · Policy holder — tab actions", screens: FlowTabActions },
  { title: "Flow · Renewal quotation", screens: FlowRenewalQuotation },
  { title: "Dashboard — tasks and reminders", screens: Tasks },
  { title: "Responsive — dashboard, tasks and leads", screens: Responsive },
  { title: "Missing · Login, account and subscription", screens: StatesAccount },
  { title: "Missing · Lead lifecycle", screens: StatesLead },
  { title: "Missing · Quotation and payment lifecycle", screens: StatesQuotation },
  { title: "Missing · Proposal, policy and renewal lifecycle", screens: StatesProposalPolicy },
  { title: "Missing · Records, tasks and messages", screens: StatesRecords },
  { title: "Missing · Settings states", screens: StatesSettings },
  { title: "Missing · SkyUp Admin", screens: StatesAdmin },
  { title: "Missing · Public links and system states", screens: StatesPublic },
  { title: "00 · Status and screen inventory", screens: Inventory },
  { title: "Campaigns · Meta Ads, Google Ads and website", screens: Campaigns },
]

export const ALL_SCREENS = SECTIONS.flatMap((s) => s.screens)
