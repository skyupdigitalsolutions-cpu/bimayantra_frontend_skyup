// Figma 285:32846 · PO3 · Policy — Expired
import { PolicyBase, CHIPS, HeadButton } from './_parts'

export default function PolicyExpired() {
  return (
    <PolicyBase
      chip={CHIPS.expired}
      endLabel="Ended 03 Dec 2026"
      days="4"
      daysLabel="days since expiry"
      actions={<HeadButton variant="navy" icon="refresh">Record renewal</HeadButton>}
    />
  )
}
