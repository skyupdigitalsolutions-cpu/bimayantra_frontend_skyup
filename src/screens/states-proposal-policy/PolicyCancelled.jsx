// Figma 285:32611 · PO2 · Policy — Cancelled
import { PolicyBase, CHIPS, HeadButton, Toast } from './_parts'

export default function PolicyCancelled() {
  return (
    <PolicyBase
      chip={CHIPS.cancelled}
      endLabel="Cancelled 15 Nov 2026"
      daysLabel="renewal closed"
      actions={<HeadButton variant="white" icon="download">Policy PDF</HeadButton>}
      overlay={<Toast>Cancellation recorded · renewal cycle closed</Toast>}
    />
  )
}
