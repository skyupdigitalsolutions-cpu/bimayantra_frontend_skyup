// Figma 285:32087 · PRD2 · Proposal — Declined
import { Btn } from '../flow-policy/_kit'
import { SubmittedBase, CHIPS, Toast } from './_parts'

export default function ProposalDeclined() {
  return (
    <SubmittedBase
      chip={CHIPS.declined}
      heroTitle="Declined by Niva Bupa"
      actions={<>
        <Btn variant="white" icon="refresh">Reverse payment</Btn>
        <Btn icon="quote">New quotation</Btn>
      </>}
      overlay={<Toast>Declined · policy record PL-000071 cancelled</Toast>}
    />
  )
}
