// Figma 247:21041 · PV2 · Vehicle added
import { Toast } from '../flow-consent/_parts'
import { VehiclesPage } from './_parts'

export default function VehicleAdded() {
  return <VehiclesPage added overlay={<Toast>Vehicle KA 01 MX 4521 added</Toast>} />
}
