// Figma 287:38161 · RF3 · Referrer — Disabled
import { ReferrersPage, Toast } from './_parts'

export default function RF3ReferrerDisabled() {
  return <ReferrersPage disabled overlay={<Toast>Manjunath K disabled · link revoked</Toast>} />
}
