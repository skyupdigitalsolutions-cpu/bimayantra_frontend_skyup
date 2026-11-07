// Figma 287:35898 · IN3 · My insurers — Inactive insurer
import { InsurersPage, Toast } from './_parts'

export default function IN3MyInsurersInactiveInsurer() {
  return <InsurersPage inactive overlay={<Toast>ICICI Lombard deactivated · 0 open quotations affected</Toast>} />
}
