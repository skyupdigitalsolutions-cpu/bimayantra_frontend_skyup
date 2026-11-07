// Figma 245:20186 · CS5 · Consent withdrawn
import { ConsentPage, Toast } from './_parts'

export default function ConsentWithdrawn() {
  return (
    <ConsentPage
      overrides={{ 'kavya.whatsapp': 'withdrawn' }}
      overlay={<Toast>WhatsApp consent withdrawn for Kavya · 2 messages cancelled</Toast>}
    />
  )
}
