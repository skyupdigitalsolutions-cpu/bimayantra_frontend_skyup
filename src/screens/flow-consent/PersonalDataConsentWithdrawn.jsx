// Figma 245:20833 · CS7 · Personal-data consent withdrawn
import { ConsentPage, Toast } from './_parts'

export default function PersonalDataConsentWithdrawn() {
  return <ConsentPage personalWithdrawn overlay={<Toast>Personal-data consent withdrawn</Toast>} />
}
