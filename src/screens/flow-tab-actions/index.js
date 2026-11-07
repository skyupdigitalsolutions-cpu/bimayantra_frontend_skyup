import EditDetails from './EditDetails'
import PanShown from './PanShown'
import ChangeDefaultNominee from './ChangeDefaultNominee'
import LinkPolicyHolder from './LinkPolicyHolder'
import EditFamilyMember from './EditFamilyMember'
import CheckDocumentValues from './CheckDocumentValues'
import DocumentVersions from './DocumentVersions'
import AddVehicle from './AddVehicle'
import VehicleAdded from './VehicleAdded'
import EditPolicyNominees from './EditPolicyNominees'
import RecordExistingPolicy from './RecordExistingPolicy'
import ActivitiesPaymentsFilter from './ActivitiesPaymentsFilter'

// Screens for this section. Each entry: { id, name, figma, path, Component }
export default [
  { id: 'PE1', name: 'PE1 · Edit details', figma: '246:19670', path: '/x/pe1-edit-details', Component: EditDetails },
  { id: 'PE2', name: 'PE2 · PAN shown (30 seconds)', figma: '246:19933', path: '/x/pe2-pan-shown-30-seconds', Component: PanShown },
  { id: 'PF1', name: 'PF1 · Change default nominee', figma: '246:20161', path: '/x/pf1-change-default-nominee', Component: ChangeDefaultNominee },
  { id: 'PF2', name: 'PF2 · Link a policy holder', figma: '246:20502', path: '/x/pf2-link-a-policy-holder', Component: LinkPolicyHolder },
  { id: 'PF3', name: 'PF3 · Edit family member', figma: '246:20845', path: '/x/pf3-edit-family-member', Component: EditFamilyMember },
  { id: 'PD1', name: 'PD1 · Check document values', figma: '246:21202', path: '/x/pd1-check-document-values', Component: CheckDocumentValues },
  { id: 'PD2', name: 'PD2 · Document versions', figma: '246:21492', path: '/x/pd2-document-versions', Component: DocumentVersions },
  { id: 'PV1', name: 'PV1 · Add vehicle', figma: '247:20759', path: '/x/pv1-add-vehicle', Component: AddVehicle },
  { id: 'PV2', name: 'PV2 · Vehicle added', figma: '247:21041', path: '/x/pv2-vehicle-added', Component: VehicleAdded },
  { id: 'PP1', name: 'PP1 · Edit policy nominees', figma: '247:21303', path: '/x/pp1-edit-policy-nominees', Component: EditPolicyNominees },
  { id: 'PP2', name: 'PP2 · Record existing policy', figma: '247:21602', path: '/x/pp2-record-existing-policy', Component: RecordExistingPolicy },
  { id: 'PA1', name: 'PA1 · Activities — Payments filter', figma: '247:21783', path: '/x/pa1-activities-payments-filter', Component: ActivitiesPaymentsFilter },
]
