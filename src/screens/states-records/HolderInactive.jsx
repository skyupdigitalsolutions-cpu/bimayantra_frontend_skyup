// Figma 286:33411 · CU2 · Policy holder — Inactive
import { StatusChip, HeadButton, Toast } from '../catalogue/_parts'
import { HolderShell, HolderOverview } from './_parts'

export default function HolderInactive() {
  return (
    <HolderShell
      tab="overview"
      statusChip={<StatusChip tone="neutral" icon="x">Inactive</StatusChip>}
      actions={<HeadButton variant="navy" icon="refresh" to="/customers/1">Reactivate</HeadButton>}
      counts={{ family: 3, documents: 3, quotations: 2, policies: 1, renewals: 1 }}
      overlay={<Toast>Inactive since 26 Oct · no messages go out · records kept</Toast>}
    >
      <HolderOverview />
    </HolderShell>
  )
}
