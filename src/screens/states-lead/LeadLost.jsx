// Figma 282:29416 · LS4 · Lead — Lost
import { LeadDetailBase } from './_parts'

export default function LeadLost() {
  return <LeadDetailBase state="lost" links lostChip="closed" toast="Lead marked lost · 1 follow-up task cancelled" />
}
